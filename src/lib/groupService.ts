import crypto from "node:crypto";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "goodmash-io";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type GroupType =
  | "family"
  | "students"
  | "friends"
  | "community"
  | "custom";

export type GoodMashGroup = {
  id: string;
  name: string;
  type: GroupType;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupMember = {
  uid: string;
  displayName: string;
  email: string;
  role: "owner" | "member";
  status: "active" | "blocked";
  joinedAt: string;
};

export type GroupPaymentDraft = {
  paymentId: string;
  groupId: string;
  sponsorUid: string;
  memberIds: string[];
  tier: "standard" | "vip" | "vvip";
  amount: number;
  status: "pending";
  createdAt: string;
};

function firestoreValue(
  value: unknown
): Record<string, unknown> {
  if (value === null) {
    return { nullValue: null };
  }

  if (value instanceof Date) {
    return {
      timestampValue: value.toISOString(),
    };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(firestoreValue),
      },
    };
  }

  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(
            value as Record<string, unknown>
          ).map(([key, item]) => [
            key,
            firestoreValue(item),
          ])
        ),
      },
    };
  }

  return {
    stringValue: String(value),
  };
}

function firestoreFields(
  data: Record<string, unknown>
) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      firestoreValue(value),
    ])
  );
}

function decodeFirestoreValue(value: any): any {
  if (!value) return null;

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

  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(
      decodeFirestoreValue
    );
  }

  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(
        value.mapValue.fields || {}
      ).map(([key, item]) => [
        key,
        decodeFirestoreValue(item),
      ])
    );
  }

  return null;
}

function decodeDocument(data: any) {
  return Object.fromEntries(
    Object.entries(data.fields || {}).map(
      ([key, value]) => [
        key,
        decodeFirestoreValue(value),
      ]
    )
  );
}

function newGroupId() {
  return (
    "GM-" +
    crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 10)
      .toUpperCase()
  );
}

function newPaymentId() {
  return (
    "GMP-" +
    crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 16)
      .toUpperCase()
  );
}

/**
 * SERVER-SIDE FIRESTORE ACCESS
 *
 * This service deliberately uses the Firebase Admin
 * service account rather than trusting browser-supplied
 * payment information.
 */
async function getAdminAccessToken() {
  const {
    FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY,
  } = process.env;

  if (
    !FIREBASE_ADMIN_CLIENT_EMAIL ||
    !FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    throw new Error(
      "Firebase server credentials are not configured."
    );
  }

  const tokenUrl =
    "https://oauth2.googleapis.com/token";

  const now = Math.floor(
    Date.now() / 1000
  );

  const base64Url = (input: string | Buffer) =>
    Buffer.from(input).toString("base64url");

  const header = base64Url(
    JSON.stringify({
      alg: "RS256",
      typ: "JWT",
    })
  );

  const claim = base64Url(
    JSON.stringify({
      iss: FIREBASE_ADMIN_CLIENT_EMAIL,
      scope:
        "https://www.googleapis.com/auth/datastore",
      aud: tokenUrl,
      iat: now,
      exp: now + 3600,
    })
  );

  const unsigned =
    `${header}.${claim}`;

  const signer =
    crypto.createSign("RSA-SHA256");

  signer.update(unsigned);
  signer.end();

  const privateKey =
    FIREBASE_ADMIN_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    );

  const assertion =
    `${unsigned}.${base64Url(
      signer.sign(privateKey)
    )}`;

  const response = await fetch(
    tokenUrl,
    {
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
    }
  );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.access_token
  ) {
    throw new Error(
      "Could not obtain Firebase server access token."
    );
  }

  return data.access_token as string;
}

async function firestoreRequest(
  path: string,
  options: RequestInit = {}
) {
  const token =
    await getAdminAccessToken();

  const response = await fetch(
    `${FIRESTORE_BASE}/${path}`,
    {
      ...options,
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type":
          "application/json",
        ...(options.headers || {}),
      },
    }
  );

  return response;
}

/**
 * Create a GoodMash group.
 */
export async function createGroup(
  ownerId: string,
  name: string,
  type: GroupType
) {
  if (!ownerId) {
    throw new Error(
      "Group owner is required."
    );
  }

  if (!name.trim()) {
    throw new Error(
      "Group name is required."
    );
  }

  const now =
    new Date().toISOString();

  const groupId =
    newGroupId();

  const group: GoodMashGroup = {
    id: groupId,
    name: name.trim(),
    type,
    ownerId,
    createdAt: now,
    updatedAt: now,
  };

  const response =
    await firestoreRequest(
      `groups/${encodeURIComponent(
        groupId
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields:
            firestoreFields(group),
        }),
      }
    );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      `Could not create group: ${error.slice(
        0,
        500
      )}`
    );
  }

  return group;
}

/**
 * Add a member to a group.
 *
 * Authorization must be checked by the API
 * before calling this function.
 */
export async function addGroupMember(
  groupId: string,
  member: GroupMember
) {
  const response =
    await firestoreRequest(
      `groups/${encodeURIComponent(
        groupId
      )}/members/${encodeURIComponent(
        member.uid
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields:
            firestoreFields(member),
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Could not add group member."
    );
  }
}

/**
 * Get a group.
 */
export async function getGroup(
  groupId: string
) {
  const response =
    await firestoreRequest(
      `groups/${encodeURIComponent(
        groupId
      )}`,
      {
        method: "GET",
      }
    );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Could not load group."
    );
  }

  const data =
    await response.json();

  return decodeDocument(
    data
  ) as GoodMashGroup;
}

/**
 * Get one group member.
 */
export async function getGroupMember(
  groupId: string,
  uid: string
) {
  const response =
    await firestoreRequest(
      `groups/${encodeURIComponent(
        groupId
      )}/members/${encodeURIComponent(
        uid
      )}`,
      {
        method: "GET",
      }
    );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Could not load group member."
    );
  }

  const data =
    await response.json();

  return decodeDocument(
    data
  ) as GroupMember;
}

/**
 * Create a payment draft.
 *
 * IMPORTANT:
 * The amount is calculated here on the server.
 * The browser cannot choose the final amount.
 */
export async function createGroupPaymentDraft(
  groupId: string,
  sponsorUid: string,
  memberIds: string[],
  tier: "standard" | "vip" | "vvip",
  extraGroups = 0
) {
  if (!groupId) {
    throw new Error(
      "Group ID is required."
    );
  }

  if (!sponsorUid) {
    throw new Error(
      "Sponsor account is required."
    );
  }

  const uniqueMemberIds =
    [...new Set<string>(memberIds)].filter(
      Boolean
    );

  if (
    uniqueMemberIds.length === 0
  ) {
    throw new Error(
      "Select at least one member."
    );
  }

  if (
    uniqueMemberIds.length > 100
  ) {
    throw new Error(
      "A maximum of 100 members can be paid at once."
    );
  }

  const group =
    await getGroup(groupId);

  if (!group) {
    throw new Error(
      "Group does not exist."
    );
  }

  if (
    group.ownerId !== sponsorUid
  ) {
    throw new Error(
      "Only the group owner can create a group payment."
    );
  }

  /*
   * Verify every selected member actually
   * belongs to this group.
   */
  for (const uid of uniqueMemberIds) {
    const member =
      await getGroupMember(
        groupId,
        uid
      );

    if (
      !member ||
      member.status !== "active"
    ) {
      throw new Error(
        `Member ${uid} is not an active member of this group.`
      );
    }
  }

  const safeExtraGroups =
    Math.max(
      0,
      Math.min(
        10,
        Math.floor(
          Number(extraGroups) || 0
        )
      )
    );

  /*
   * GoodMash pricing:
   *
   * Standard = R10
   * VIP      = R10 + R5 per extra VIP group
   * VVIP     = R10 + R10 per extra VVIP group
   *
   * For sponsored members, the base maintenance
   * is calculated per member.
   */
  const base =
    uniqueMemberIds.length * 10;

  const groupExtra =
    tier === "vip"
      ? 5 * safeExtraGroups
      : tier === "vvip"
        ? 10 * safeExtraGroups
        : 0;

  const amount =
    base + groupExtra;

  const paymentId =
    newPaymentId();

  const now =
    new Date().toISOString();

  const payload:
    GroupPaymentDraft = {
    paymentId,
    groupId,
    sponsorUid,
    memberIds:
      uniqueMemberIds,
    tier,
    amount,
    status: "pending",
    createdAt: now,
  };

  const response =
    await firestoreRequest(
      `groupPayments/${encodeURIComponent(
        paymentId
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields:
            firestoreFields({
              ...payload,
              extraGroups:
                safeExtraGroups,
            }),
        }),
      }
    );

  if (!response.ok) {
    const error =
      await response.text();

    throw new Error(
      `Could not create group payment: ${error.slice(
        0,
        500
      )}`
    );
  }

  return payload;
}