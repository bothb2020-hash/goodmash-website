import { NextRequest, NextResponse } from "next/server";
import {
  getPayFastConfig,
  generatePayFastSignature,
  amountString,
  expectedAmount,
  makePaymentId,
} from "@/lib/payfast";

export const runtime = "nodejs";

async function verifyFirebaseIdToken(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Firebase web API key is not configured."
    );
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    }
  );

  const data = await response.json();

  if (
    !response.ok ||
    !data.users?.[0]?.localId
  ) {
    throw new Error(
      "Your GoodMash session could not be verified."
    );
  }

  return data.users[0] as {
    localId: string;
    email?: string;
  };
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ------------------------------------------------------
     * 1. Verify GoodMash user session
     * ------------------------------------------------------
     */

    const authorization =
      request.headers.get("authorization") || "";

    const idToken = authorization.startsWith(
      "Bearer "
    )
      ? authorization.slice(7)
      : "";

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Sign in before starting maintenance payment.",
        },
        { status: 401 }
      );
    }

    const user =
      await verifyFirebaseIdToken(idToken);

    /*
     * ------------------------------------------------------
     * 2. Read and validate checkout request
     * ------------------------------------------------------
     */

    const body = await request.json();

    const tier =
      body?.tier === "vip" ||
      body?.tier === "vvip"
        ? body.tier
        : "standard";

    const parsedGroups = Number(
      body?.extraGroups
    );

    const extraGroups = Number.isFinite(
      parsedGroups
    )
      ? Math.max(
          0,
          Math.min(
            10,
            Math.floor(parsedGroups)
          )
        )
      : 0;

    /*
     * ------------------------------------------------------
     * 3. Calculate amount on the SERVER
     * ------------------------------------------------------
     */

    const amount = expectedAmount(
      tier,
      extraGroups
    );

    const paymentId = makePaymentId(
      user.localId
    );

    /*
     * ------------------------------------------------------
     * 4. Determine website base URL
     * ------------------------------------------------------
     */

    const origin =
      process.env.PUBLIC_BASE_URL ||
      new URL(request.url).origin;

    /*
     * ------------------------------------------------------
     * 5. Load PayFast configuration
     * ------------------------------------------------------
     */

    const config = getPayFastConfig();

    /*
     * ------------------------------------------------------
     * 6. Build PayFast fields
     *
     * IMPORTANT:
     *
     * This order follows PayFast's custom integration
     * attribute order.
     *
     * DO NOT alphabetize these fields.
     * ------------------------------------------------------
     */

    const fields: Record<string, string> = {
      /*
       * Merchant details
       */
      merchant_id: config.merchantId,
      merchant_key: config.merchantKey,

      return_url:
        `${origin}/payment/success?payment_id=${encodeURIComponent(
          paymentId
        )}`,

      cancel_url:
        `${origin}/payment/cancel?payment_id=${encodeURIComponent(
          paymentId
        )}`,

      notify_url:
        `${origin}/api/payfast/notify`,

      /*
       * Customer details
       *
       * Email is optional, so an empty email is
       * deliberately excluded from the signature.
       */
      email_address:
        user.email || "",

      /*
       * Transaction details
       *
       * PayFast's documented order places custom_int
       * fields BEFORE custom_str fields.
       */
      m_payment_id: paymentId,

      amount: amountString(amount),

      item_name:
        `GoodMash ${tier} maintenance`,

      item_description:
        `GoodMash.io ${tier} monthly maintenance`,

      custom_int1:
        String(extraGroups),

      custom_str1:
        user.localId,

      custom_str2:
        tier,
    };

    /*
     * ------------------------------------------------------
     * 7. Generate signature BEFORE adding signature field
     * ------------------------------------------------------
     */

    const signature =
      generatePayFastSignature(
        fields,
        config.passphrase
      );

    /*
     * ------------------------------------------------------
     * 8. Add signature as the final submitted field
     * ------------------------------------------------------
     */

    fields.signature = signature;

    /*
     * ------------------------------------------------------
     * 9. Return hosted PayFast checkout information
     * ------------------------------------------------------
     */

    return NextResponse.json({
      action:
        `${config.host}/eng/process`,

      fields,

      mode: config.mode,

      paymentId,

      amount,
    });
  } catch (error) {
    console.error(
      "PayFast create error",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start PayFast checkout.",
      },
      { status: 500 }
    );
  }
}