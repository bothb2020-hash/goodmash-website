import { NextRequest, NextResponse } from "next/server";
import { getAgentReply } from "@/lib/agentEngine";

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message : "";
  } catch {
    message = "";
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return NextResponse.json(
      { reply: "Please type a message and I'll do my best to help." },
      { status: 400 }
    );
  }

  const result = getAgentReply(trimmed);
  return NextResponse.json(result);
}
