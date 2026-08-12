"use client";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY || "";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "goodmash-io";
const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export type GoodMashSession = {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  displayName?: string;
};

function requireConfig() {
  if (!FIREBASE_API_KEY) {
    throw new Error("GoodMash web authentication is not configured yet. Add NEXT_PUBLIC_FIREBASE_WEB_API_KEY.");
  }
}

async function firebaseAuth(path: string, body: Record<string, unknown>) {
  requireConfig();
  const response = await fetch(`${AUTH_BASE}/${path}?key=${encodeURIComponent(FIREBASE_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || "Authentication request failed.";
    throw new Error(message.replaceAll("_", " "));
  }
  return data;
}

function setSession(session: GoodMashSession) {
  localStorage.setItem("goodmash_session", JSON.stringify(session));
}

export function getSession(): GoodMashSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("goodmash_session");
    return raw ? (JSON.parse(raw) as GoodMashSession) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window !== "undefined") localStorage.removeItem("goodmash_session");
}

export async function signIn(email: string, password: string) {
  const data = await firebaseAuth("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
  const session: GoodMashSession = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId,
    email: data.email,
    displayName: data.displayName,
  };
  setSession(session);
  return session;
}

export async function signUp(email: string, password: string, displayName: string) {
  const data = await firebaseAuth("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });
  const session: GoodMashSession = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId,
    email: data.email,
    displayName,
  };
  setSession(session);

  const now = new Date().toISOString();
  const trialEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await writeUserDocument(session, {
    uid: session.localId,
    email: session.email,
    displayName: displayName || "GoodMash member",
    createdAt: now,
    updatedAt: now,
    subscription: {
      status: "trial",
      trialStartDate: now,
      trialEndDate: trialEnd,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
      lastPaymentDate: null,
      nextPaymentDate: null,
      totalPaid: 0,
      membershipTier: "standard",
      vipGroupIds: [],
      vvipGroupIds: [],
    },
    security: {
      loginAttempts: 0,
      lockoutUntil: null,
      lastLoginAt: now,
      devices: [],
    },
    ownedNetworkIds: [],
    joinedNetworkIds: [],
  });
  return session;
}

const TIMESTAMP_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "trialStartDate",
  "trialEndDate",
  "currentPeriodStart",
  "currentPeriodEnd",
  "lastPaymentDate",
  "nextPaymentDate",
  "lockoutUntil",
  "lastLoginAt",
]);

function toFirestoreValue(value: unknown, key?: string): Record<string, unknown> {
  if (value === null) return { nullValue: null };
  if (typeof value === "string" && key && TIMESTAMP_FIELDS.has(key)) return { timestampValue: value };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map((v) => toFirestoreValue(v)) } };
  if (typeof value === "object") {
    return { mapValue: { fields: Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, toFirestoreValue(v, k)])) } };
  }
  return { stringValue: String(value) };
}

function fromFirestoreValue(value: any): any {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([k, v]) => [k, fromFirestoreValue(v)]));
  return null;
}

async function writeUserDocument(session: GoodMashSession, data: Record<string, unknown>) {
  const response = await fetch(`${FIRESTORE_BASE}/users/${encodeURIComponent(session.localId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.idToken}`,
    },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])) }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message || "Could not create your GoodMash profile.");
  }
}

export async function getCurrentUserProfile() {
  const session = getSession();
  if (!session) return null;
  const response = await fetch(`${FIRESTORE_BASE}/users/${encodeURIComponent(session.localId)}`, {
    headers: { Authorization: `Bearer ${session.idToken}` },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load your GoodMash profile.");
  const data = await response.json();
  return Object.fromEntries(Object.entries(data.fields || {}).map(([k, v]) => [k, fromFirestoreValue(v)]));
}
