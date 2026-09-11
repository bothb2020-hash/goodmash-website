import { NextRequest, NextResponse } from "next/server";
import {
  getPayFastConfig,
  generatePayFastSignature,
  amountString,
} from "@/lib/payfast";
import {
  createGroupPaymentDraft,
} from "@/lib/groupService";

export const runtime = "nodejs";

/**
 * Verify the Firebase ID token supplied by the
 * signed-in GoodMash user.
 */
async function verifyFirebaseIdToken(
  idToken: string
) {
  const apiKey =
    process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY;

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
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    }
  );

  const data =
    await response.json();

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
     * --------------------------------------------------
     * 1. Verify signed-in GoodMash account
     * --------------------------------------------------
     */

    const authorization =
      request.headers.get(
        "authorization"
      ) || "";

    const idToken =
      authorization.startsWith(
        "Bearer "
      )
        ? authorization.slice(7)
        : "";

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Sign in before creating a group payment.",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      await verifyFirebaseIdToken(
        idToken
      );

    /*
     * --------------------------------------------------
     * 2. Read request
     * --------------------------------------------------
     */

    const body =
      await request.json();

    const groupId =
      typeof body?.groupId === "string"
        ? body.groupId.trim()
        : "";

    const memberIds =
      Array.isArray(body?.memberIds)
        ? body.memberIds.filter(
            (id: unknown): id is string =>
              typeof id === "string" &&
              id.trim().length > 0
          )
        : [];

    const tier =
      body?.tier === "vip" ||
      body?.tier === "vvip"
        ? body.tier
        : "standard";

    const parsedExtraGroups =
      Number(body?.extraGroups);

    const extraGroups =
      Number.isFinite(
        parsedExtraGroups
      )
        ? Math.max(
            0,
            Math.min(
              10,
              Math.floor(
                parsedExtraGroups
              )
            )
          )
        : 0;

    if (!groupId) {
      return NextResponse.json(
        {
          error:
            "Group ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      memberIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Select at least one group member.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * --------------------------------------------------
     * 3. Remove duplicate member IDs
     * --------------------------------------------------
     */

    const uniqueMemberIds =
      [...new Set<string>(memberIds)];

    /*
     * --------------------------------------------------
     * 4. Create server-authorized payment draft
     * --------------------------------------------------
     *
     * groupService performs:
     *
     * - group existence check
     * - group owner check
     * - member verification
     * - amount calculation
     * - payment ID creation
     *
     * The browser does NOT control the final amount.
     */

    const draft =
      await createGroupPaymentDraft(
        groupId,
        user.localId,
        uniqueMemberIds,
        tier,
        extraGroups
      );

    /*
     * --------------------------------------------------
     * 5. Load PayFast configuration
     * --------------------------------------------------
     */

    const config =
      getPayFastConfig();

    /*
     * --------------------------------------------------
     * 6. Determine website origin
     * --------------------------------------------------
     */

    const origin =
      process.env.PUBLIC_BASE_URL ||
      new URL(
        request.url
      ).origin;

    /*
     * --------------------------------------------------
     * 7. Build PayFast fields
     * --------------------------------------------------
     *
     * custom_str1 = sponsor UID
     * custom_str2 = group payment marker
     * custom_str3 = group ID
     *
     * The group payment ID is the PayFast
     * m_payment_id.
     */

    const fields:
      Record<string, string> = {
      merchant_id:
        config.merchantId,

      merchant_key:
        config.merchantKey,

      return_url:
        `${origin}/payment/success?payment_id=${encodeURIComponent(
          draft.paymentId
        )}`,

      cancel_url:
        `${origin}/payment/cancel?payment_id=${encodeURIComponent(
          draft.paymentId
        )}`,

      notify_url:
        `${origin}/api/payfast/notify`,

      email_address:
        user.email || "",

      m_payment_id:
        draft.paymentId,

      amount:
        amountString(
          draft.amount
        ),

      item_name:
        `GoodMash Group ${draft.tier} maintenance`,

      item_description:
        `GoodMash.io group payment for ${draft.memberIds.length} member(s)`,

      custom_int1:
        String(
          draft.memberIds.length
        ),

      custom_str1:
        draft.sponsorUid,

      custom_str2:
        "group",

      custom_str3:
        draft.groupId,
    };

    /*
     * --------------------------------------------------
     * 8. Generate PayFast signature
     * --------------------------------------------------
     */

    const signature =
      generatePayFastSignature(
        fields,
        config.passphrase
      );

    fields.signature =
      signature;

    /*
     * --------------------------------------------------
     * 9. Return hosted PayFast checkout
     * --------------------------------------------------
     */

    return NextResponse.json({
      action:
        `${config.host}/eng/process`,

      fields,

      mode:
        config.mode,

      paymentId:
        draft.paymentId,

      groupId:
        draft.groupId,

      amount:
        draft.amount,

      memberCount:
        draft.memberIds.length,

      tier:
        draft.tier,
    });
  } catch (error) {
    console.error(
      "PayFast group create error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start group payment.",
      },
      {
        status: 500,
      }
    );
  }
}
