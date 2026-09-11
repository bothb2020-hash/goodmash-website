import { NextRequest, NextResponse } from "next/server";
import {
  getPayFastConfig,
  timingSafeEqualHex,
} from "@/lib/payfast";
import { patchUserSubscription } from "@/lib/firebaseAdminRest";
import crypto from "node:crypto";

export const runtime = "nodejs";

const VALID_HOSTS = new Set([
  "www.payfast.co.za",
  "sandbox.payfast.co.za",
  "w1w.payfast.co.za",
  "w2w.payfast.co.za",
]);

/**
 * PayFast ITN signature.
 *
 * IMPORTANT:
 * PayFast ITN is different from the normal custom
 * checkout signature.
 *
 * For ITN:
 * - Preserve the exact POST field order.
 * - Include ALL fields before "signature".
 * - DO NOT remove blank fields.
 * - URL encode every value.
 * - Use + for spaces.
 * - Add passphrase at the end.
 */
function generatePayFastITNSignature(
  data: Record<string, string>,
  passphrase: string
): string {
  const encode = (value: string): string =>
    encodeURIComponent(value)
      .replace(/!/g, "%21")
      .replace(/'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A")
      .replace(/%20/g, "+");

  const pairs: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "signature") {
      break;
    }

    /*
     * IMPORTANT:
     * Do NOT skip blank values here.
     *
     * PayFast ITN includes blank fields in the
     * signature calculation.
     */
    pairs.push(
      `${key}=${encode(value)}`
    );
  }

  if (passphrase.trim() !== "") {
    pairs.push(
      `passphrase=${encode(
        passphrase.trim()
      )}`
    );
  }

  const parameterString =
    pairs.join("&");

  console.log(
    "[PayFast ITN] Signature parameter string:",
    parameterString
  );

  return crypto
    .createHash("md5")
    .update(
      parameterString,
      "utf8"
    )
    .digest("hex");
}

async function validateWithPayFast(
  raw: string,
  config: ReturnType<typeof getPayFastConfig>
): Promise<boolean> {
  const response = await fetch(
    `${config.host}/eng/query/validate`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: raw,
    }
  );

  if (!response.ok) {
    console.error(
      "[PayFast ITN] PayFast validation HTTP error:",
      response.status
    );

    return false;
  }

  const result =
    await response.text();

  console.log(
    "[PayFast ITN] PayFast validation response:",
    result
  );

  return result.trim() === "VALID";
}

export async function POST(
  request: NextRequest
) {
  try {
    console.log(
      "========== PAYFAST ITN START =========="
    );

    const config =
      getPayFastConfig();

    /*
     * -----------------------------------------------
     * 1. Read the exact ITN body
     * -----------------------------------------------
     */

    const body =
      await request.text();

    console.log(
      "[PayFast ITN] Body received:",
      body
    );

    /*
     * -----------------------------------------------
     * 2. Parse the ITN fields
     * -----------------------------------------------
     */

    const params =
      new URLSearchParams(body);

    const data: Record<
      string,
      string
    > = {};

    for (
      const [key, value]
      of params.entries()
    ) {
      data[key] = value;
    }

    console.log(
      "[PayFast ITN] Fields received:",
      Object.keys(data)
    );

    /*
     * -----------------------------------------------
     * 3. Verify signature
     * -----------------------------------------------
     */

    const receivedSignature =
      data.signature || "";

    const expectedSignature =
      generatePayFastITNSignature(
        data,
        config.passphrase
      );

    console.log(
      "[PayFast ITN] Signature received:",
      receivedSignature
    );

    console.log(
      "[PayFast ITN] Signature expected:",
      expectedSignature
    );

    if (
      !receivedSignature ||
      !timingSafeEqualHex(
        receivedSignature,
        expectedSignature
      )
    ) {
      console.error(
        "[PayFast ITN] FAILED: Invalid signature"
      );

      return new NextResponse(
        "Invalid signature",
        { status: 400 }
      );
    }

    console.log(
      "[PayFast ITN] Signature verified"
    );

    /*
     * -----------------------------------------------
     * 4. Verify PayFast source
     * -----------------------------------------------
     */

    const referer =
      request.headers.get(
        "referer"
      );

    if (referer) {
      try {
        const refHost =
          new URL(
            referer
          ).hostname;

        if (
          !VALID_HOSTS.has(
            refHost
          )
        ) {
          console.error(
            "[PayFast ITN] Invalid source:",
            refHost
          );

          return new NextResponse(
            "Invalid PayFast source",
            { status: 400 }
          );
        }
      } catch {
        return new NextResponse(
          "Invalid PayFast source",
          { status: 400 }
        );
      }
    }

    /*
     * -----------------------------------------------
     * 5. Verify merchant
     * -----------------------------------------------
     */

    if (
      data.merchant_id !==
      config.merchantId
    ) {
      console.error(
        "[PayFast ITN] Invalid merchant"
      );

      return new NextResponse(
        "Invalid merchant",
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------------
     * 6. Verify payment status
     * -----------------------------------------------
     */

    if (
      data.payment_status !==
      "COMPLETE"
    ) {
      console.log(
        "[PayFast ITN] Payment not complete:",
        data.payment_status
      );

      return new NextResponse(
        "Ignored non-complete payment",
        { status: 200 }
      );
    }

    /*
     * -----------------------------------------------
     * 7. Read payment information
     * -----------------------------------------------
     */

    const paymentId =
      data.m_payment_id || "";

    const uid =
      data.custom_str1 || "";

    const tier =
      data.custom_str2 === "vip"
        ? "vip"
        : data.custom_str2 === "vvip"
          ? "vvip"
          : "standard";

    const parsedGroups =
      Number(
        data.custom_int1 || "0"
      );

    const extraGroups =
      Number.isFinite(
        parsedGroups
      )
        ? Math.max(
            0,
            Math.min(
              10,
              Math.floor(
                parsedGroups
              )
            )
          )
        : 0;

    const amountGross =
      Number(
        data.amount_gross ||
          "NaN"
      );

    /*
     * -----------------------------------------------
     * 8. Calculate expected amount
     * -----------------------------------------------
     */

    const expectedAmount =
      tier === "vip"
        ? 10 + 5 * extraGroups
        : tier === "vvip"
          ? 10 + 10 * extraGroups
          : 10;

    console.log(
      "[PayFast ITN] Amount received:",
      amountGross
    );

    console.log(
      "[PayFast ITN] Amount expected:",
      expectedAmount
    );

    if (
      !uid ||
      !paymentId ||
      !Number.isFinite(
        amountGross
      ) ||
      amountGross !==
        expectedAmount
    ) {
      console.error(
        "[PayFast ITN] FAILED: Invalid amount/payment"
      );

      return new NextResponse(
        "Invalid amount or payment",
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------------
     * 9. Confirm transaction with PayFast
     * -----------------------------------------------
     */

    const valid =
      await validateWithPayFast(
        body,
        config
      );

    if (!valid) {
      console.error(
        "[PayFast ITN] FAILED: PayFast validation failed"
      );

      return new NextResponse(
        "PayFast validation failed",
        { status: 400 }
      );
    }

    /*
     * -----------------------------------------------
     * 10. Activate GoodMash subscription
     * -----------------------------------------------
     */

    const now =
      new Date();

    const end =
      new Date(
        now.getTime() +
          30 *
            24 *
            60 *
            60 *
            1000
      );

    await patchUserSubscription(
      uid,
      {
        status: "active",

        currentPeriodStart:
          now.toISOString(),

        currentPeriodEnd:
          end.toISOString(),

        lastPaymentDate:
          now.toISOString(),

        nextPaymentDate:
          end.toISOString(),

        totalPaid:
          amountGross,

        membershipTier:
          tier,

        lastPaymentProvider:
          "payfast",

        lastPaymentId:
          paymentId,
      }
    );

    console.log(
      "[PayFast ITN] SUCCESS: Subscription activated"
    );

    console.log(
      "========== PAYFAST ITN END =========="
    );

    return new NextResponse(
      "OK",
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "[PayFast ITN] ERROR:",
      error
    );

    return new NextResponse(
      "ITN processing failed",
      { status: 500 }
    );
  }
}