import { NextRequest, NextResponse } from "next/server";
import { getPayFastConfig } from "@/lib/payfast";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("payment_id");
  if (!paymentId) return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
  // The authoritative maintenance state lives in Firestore after ITN verification.
  // This endpoint deliberately does not mark a payment successful based on a browser return alone.
  return NextResponse.json({ paymentId, provider: "payfast", mode: getPayFastConfig().mode, verified: false, message: "Awaiting server-side PayFast verification." });
}
