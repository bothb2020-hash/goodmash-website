import { NextRequest, NextResponse } from "next/server";
import { getPayFastConfig } from "@/lib/payfast";
import { getUserSubscription } from "@/lib/firebaseAdminRest";

export const runtime = "nodejs";

async function verifyFirebaseIdToken(idToken: string) {
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

export async function GET(
  request: NextRequest
) {
  try {
    const authorization =
      request.headers.get("authorization") || "";

    const idToken =
      authorization.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : "";

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Sign in before checking payment status.",
        },
        { status: 401 }
      );
    }

    const user =
      await verifyFirebaseIdToken(idToken);

    const paymentId =
      request.nextUrl.searchParams
        .get("payment_id")
        ?.trim() || "";

    if (!paymentId) {
      return NextResponse.json(
        {
          error: "Missing payment_id",
        },
        { status: 400 }
      );
    }

    const subscription =
      await getUserSubscription(user.localId);

    if (!subscription) {
      return NextResponse.json({
        paymentId,
        provider: "payfast",
        mode: getPayFastConfig().mode,
        verified: false,
        status: "pending",
        message:
          "Payment is awaiting server-side PayFast verification.",
      });
    }

    const lastPaymentId =
      String(
        subscription.lastPaymentId || ""
      ).trim();

    const subscriptionStatus =
      String(
        subscription.status || ""
      ).trim()
      .toLowerCase();

    const paymentMatches =
      lastPaymentId === paymentId;

    const subscriptionIsActive =
      subscriptionStatus === "active";

    const verified =
      paymentMatches &&
      subscriptionIsActive;

    if (!verified) {
      return NextResponse.json({
        paymentId,
        provider: "payfast",
        mode: getPayFastConfig().mode,
        verified: false,
        status:
          paymentMatches
            ? subscriptionStatus || "pending"
            : "pending",
        message:
          paymentMatches
            ? "Payment has been recorded but the subscription is not active."
            : "This payment has not yet been verified for the signed-in GoodMash account.",
      });
    }

    return NextResponse.json({
      paymentId,
      provider: "payfast",
      mode: getPayFastConfig().mode,
      verified: true,
      status: "active",
      membershipTier:
        subscription.membershipTier || "standard",
      currentPeriodStart:
        subscription.currentPeriodStart || null,
      currentPeriodEnd:
        subscription.currentPeriodEnd || null,
      lastPaymentDate:
        subscription.lastPaymentDate || null,
      nextPaymentDate:
        subscription.nextPaymentDate || null,
      totalPaid:
        subscription.totalPaid ?? null,
      lastPaymentProvider:
        subscription.lastPaymentProvider || "payfast",
      lastPaymentId,
      message:
        "PayFast payment verified and GoodMash maintenance is active.",
    });
  } catch (error) {
    console.error(
      "PayFast status error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to check PayFast payment status.",
      },
      { status: 500 }
    );
  }
}