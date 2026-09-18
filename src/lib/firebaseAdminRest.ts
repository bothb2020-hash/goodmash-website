import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE =
  "https://www.googleapis.com/auth/datastore";

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function serviceAccountAccessToken() {
  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  const privateKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    );

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Firebase server credentials are not configured."
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const header = base64Url(
    JSON.stringify({
      alg: "RS256",
      typ: "JWT",
    })
  );

  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: FIRESTORE_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );

  const unsigned = `${header}.${claim}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();

  const assertion =
    `${unsigned}.${base64Url(signer.sign(privateKey))}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(
      "Could not obtain Firebase server access token."
    );
  }

  return data.access_token as string;
}

function firestoreValue(
  value: unknown
): Record<string, unknown> {
  if (value === null) {
    return {
      nullValue: null,
    };
  }

  if (typeof value === "boolean") {
    return {
      booleanValue: value,
    };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? {
          integerValue: String(value),
        }
      : {
          doubleValue: value,
        };
  }

  if (typeof value === "string") {
    return {
      stringValue: value,
    };
  }

  if (value instanceof Date) {
    return {
      timestampValue: value.toISOString(),
    };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(firestoreValue),
      },
    };
  }

  return {
    mapValue: {
      fields: Object.fromEntries(
        Object.entries(
          value as Record<string, unknown>
        ).map(([key, nestedValue]) => [
          key,
          firestoreValue(nestedValue),
        ])
      ),
    },
  };
}

export async function patchUserSubscription(
  uid: string,
  subscription: Record<string, unknown>
) {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "goodmash-io";

  const token =
    await serviceAccountAccessToken();

  const url =
    `https://firestore.googleapis.com/v1/projects/` +
    `${encodeURIComponent(projectId)}/databases/(default)/documents/` +
    `users/${encodeURIComponent(uid)}` +
    `?updateMask.fieldPaths=subscription`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        subscription:
          firestoreValue(subscription),
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Firestore update failed: ${text.slice(0, 500)}`
    );
  }
}

function readFirestoreValue(
  value: any
): unknown {
  if (!value || typeof value !== "object") {
    return null;
  }

  if ("stringValue" in value) {
    return value.stringValue;
  }

  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return value.doubleValue;
  }

  if ("booleanValue" in value) {
    return value.booleanValue;
  }

  if ("timestampValue" in value) {
    return value.timestampValue;
  }

  if ("nullValue" in value) {
    return null;
  }

  if ("mapValue" in value) {
    const fields =
      value.mapValue?.fields || {};

    return Object.fromEntries(
      Object.entries(fields).map(
        ([key, nestedValue]) => [
          key,
          readFirestoreValue(nestedValue),
        ]
      )
    );
  }

  if ("arrayValue" in value) {
    const values =
      value.arrayValue?.values || [];

    return values.map((item: unknown) =>
      readFirestoreValue(item)
    );
  }

  return null;
}

export async function getUserSubscription(
  uid: string
): Promise<Record<string, unknown> | null> {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "goodmash-io";

  const token =
    await serviceAccountAccessToken();

  const url =
    `https://firestore.googleapis.com/v1/projects/` +
    `${encodeURIComponent(projectId)}/databases/(default)/documents/` +
    `users/${encodeURIComponent(uid)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Firestore read failed: ${text.slice(0, 500)}`
    );
  }

  const document = await response.json();

  const subscriptionFields =
    document?.fields?.subscription?.mapValue?.fields;

  if (!subscriptionFields) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(subscriptionFields).map(
      ([key, value]) => [
        key,
        readFirestoreValue(value),
      ]
    )
  );
}