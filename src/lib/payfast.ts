import crypto from "node:crypto";

export type PayFastMode = "sandbox" | "live";

export const PAYFAST_HOSTS = {
  sandbox: "https://sandbox.payfast.co.za",
  live: "https://www.payfast.co.za",
} as const;

const REQUIRED_ENV = [
  "PAYFAST_MERCHANT_ID",
  "PAYFAST_MERCHANT_KEY",
  "PAYFAST_PASSPHRASE",
] as const;

/**
 * PayFast uses PHP-style urlencode().
 *
 * JavaScript encodeURIComponent() is slightly different from
 * PHP urlencode(), so we reproduce the PHP behaviour here.
 */
export function encode(value: unknown): string {
  return encodeURIComponent(String(value).trim())
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/%20/g, "+");
}

export function getPayFastConfig() {
  const mode: PayFastMode =
    process.env.PAYFAST_MODE === "live"
      ? "live"
      : "sandbox";

  const missing = REQUIRED_ENV.filter(
    (key) => !process.env[key]?.trim()
  );

  if (missing.length > 0) {
    throw new Error(
      `PayFast server configuration is missing: ${missing.join(", ")}`
    );
  }

  return {
    mode,
    merchantId: process.env.PAYFAST_MERCHANT_ID!.trim(),
    merchantKey: process.env.PAYFAST_MERCHANT_KEY!.trim(),
    passphrase: process.env.PAYFAST_PASSPHRASE!.trim(),
    host: PAYFAST_HOSTS[mode],
  };
}

/**
 * Generate PayFast custom-integration signature.
 *
 * IMPORTANT:
 * - Keep the supplied object order.
 * - Ignore blank values.
 * - Trim values before encoding.
 * - Use PHP-compatible urlencode().
 * - Add passphrase at the end.
 *
 * PayFast custom integration does NOT use alphabetical ordering.
 */
export function generatePayFastSignature(
  data: Record<string, string>,
  passphrase: string
): string {
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === "") {
      continue;
    }

    pairs.push(
      `${key}=${encode(value)}`
    );
  }

  if (passphrase.trim() !== "") {
    pairs.push(
      `passphrase=${encode(passphrase)}`
    );
  }

  const parameterString = pairs.join("&");

  return crypto
    .createHash("md5")
    .update(parameterString, "utf8")
    .digest("hex");
}

export function amountString(
  amount: number
): string {
  return amount.toFixed(2);
}

export function expectedAmount(
  tier: "standard" | "vip" | "vvip",
  extraGroups: number
): number {
  const base = 10;

  const perGroup =
    tier === "standard"
      ? 0
      : tier === "vip"
        ? 5
        : 10;

  const safeGroups = Math.max(
    0,
    Math.min(
      10,
      Math.floor(extraGroups)
    )
  );

  return base + perGroup * safeGroups;
}

export function makePaymentId(
  uid: string
): string {
  const stamp = Date.now().toString(36);

  const nonce = crypto
    .randomBytes(8)
    .toString("hex");

  const paymentSecret =
    process.env.PAYFAST_PAYMENT_SECRET || "";

  const digest = crypto
    .createHash("sha256")
    .update(
      `${uid}:${stamp}:${nonce}:${paymentSecret}`
    )
    .digest("hex")
    .slice(0, 16);

  return `GM-${stamp}-${digest}`;
}

/**
 * Timing-safe comparison for PayFast signatures.
 */
export function timingSafeEqualHex(
  a: string,
  b: string
): boolean {
  const aa = Buffer.from(
    a.trim().toLowerCase(),
    "utf8"
  );

  const bb = Buffer.from(
    b.trim().toLowerCase(),
    "utf8"
  );

  return (
    aa.length === bb.length &&
    crypto.timingSafeEqual(aa, bb)
  );
}