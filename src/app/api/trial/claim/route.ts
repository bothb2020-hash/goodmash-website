import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const FIRESTORE_BASE =
  "https://firestore.googleapis.com/v1/projects";

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

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "goodmash-io";

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
      scope:
        "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
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

  const assertion =
    `${unsigned}.${base64Url(
      signer.sign(privateKey)
    )}`;

  const response = await fetch(
    "https://oauth2.googleapis.com/token",
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

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(
      "Could not obtain Firebase server access token."
    );
  }

  return {
    projectId,
    token: data.access_token as string,
  };
}

function hashIdentity(
  prefix: string,
  value: string
) {
  return crypto
    .createHash("sha256")
    .update(`${prefix}:${value}`)
    .digest("hex");
}

function firestoreString(value: string) {
  return {
    stringValue: value,
  };
}

function firestoreInteger(value: number) {
  return {
    integerValue: String(value),
  };
}

function firestoreTimestamp(date: Date) {
  return {
    timestampValue: date.toISOString(),
  };
}

function firestoreMap(
  fields: Record<string, unknown>
) {
  return {
    mapValue: {
      fields,
    },
  };
}

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
    displayName?: string;
  };
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ------------------------------------------------------
     * 1. Verify signed-in GoodMash account
     * ------------------------------------------------------
     */

    const authorization =
      request.headers.get("authorization") ||
      "";

    const idToken =
      authorization.startsWith("Bearer ")
        ? authorization
            .slice(7)
            .trim()
        : "";

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Sign in before creating your GoodMash account.",
        },
        { status: 401 }
      );
    }

    const user =
      await verifyFirebaseIdToken(
        idToken
      );

    /*
     * ------------------------------------------------------
     * 2. Validate installation/device information
     * ------------------------------------------------------
     */

    const body =
      await request.json();

    const installationId =
      typeof body?.installationId ===
      "string"
        ? body.installationId.trim()
        : "";

    const deviceId =
      typeof body?.deviceId ===
      "string"
        ? body.deviceId.trim()
        : "";

    const deviceType =
      typeof body?.deviceType ===
      "string"
        ? body.deviceType.trim()
        : "";

    const displayName =
      typeof body?.displayName ===
      "string"
        ? body.displayName.trim()
        : "GoodMash member";

    if (
      installationId.length < 10 ||
      installationId.length > 500
    ) {
      return NextResponse.json(
        {
          error:
            "GoodMash installation identity is invalid.",
        },
        { status: 400 }
      );
    }

    if (
      deviceId.length < 2 ||
      deviceId.length > 500
    ) {
      return NextResponse.json(
        {
          error:
            "GoodMash device identity is invalid.",
        },
        { status: 400 }
      );
    }

    if (
      deviceType !== "android" &&
      deviceType !== "ios"
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported GoodMash device type.",
        },
        { status: 400 }
      );
    }

    /*
     * ------------------------------------------------------
     * 3. Hash installation/device identifiers
     * ------------------------------------------------------
     */

    const installationHash =
      hashIdentity(
        "goodmash-installation",
        installationId
      );

    const deviceHash =
      hashIdentity(
        "goodmash-device",
        deviceId
      );

    /*
     * ------------------------------------------------------
     * 4. Firebase server credentials
     * ------------------------------------------------------
     */

    const {
      projectId,
      token,
    } =
      await serviceAccountAccessToken();

    const databasePath = `projects/${projectId}/databases/(default)/documents`;

    /*
     * ------------------------------------------------------
     * 5. Start Firestore transaction
     * ------------------------------------------------------
     */

    const transactionResponse =
      await fetch(
        `${databasePath}:beginTransaction`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            options: {
              readWrite: {},
            },
          }),
        }
      );

    if (!transactionResponse.ok) {
      const text =
        await transactionResponse.text();

      throw new Error(
        `Could not start trial transaction: ${text.slice(
          0,
          500
        )}`
      );
    }

    const transactionData =
      await transactionResponse.json();

    const transaction =
      transactionData.transaction;

    if (!transaction) {
      throw new Error(
        "Firebase did not return a transaction."
      );
    }

    /*
     * ------------------------------------------------------
     * 6. Read trial records and user document
     * ------------------------------------------------------
     */

    const installationDocument =
      `${databasePath}/trialInstallations/${installationHash}`;

    const deviceDocument =
      `${databasePath}/trialDevices/${deviceHash}`;

    const userDocument =
      `${databasePath}/users/${encodeURIComponent(
        user.localId
      )}`;

    const batchGetResponse =
      await fetch(
        `${databasePath}:batchGet`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            documents: [
              installationDocument,
              deviceDocument,
              userDocument,
            ],
            transaction,
          }),
        }
      );

    if (!batchGetResponse.ok) {
      const text =
        await batchGetResponse.text();

      throw new Error(
        `Could not check GoodMash trial records: ${text.slice(
          0,
          500
        )}`
      );
    }

    const batchResults =
      await batchGetResponse.json();

    let installationExists =
      false;

    let deviceExists =
      false;

    let userExists =
      false;

    for (const result of batchResults) {
      const name =
        result?.found?.name || "";

      if (
        name ===
        installationDocument
      ) {
        installationExists = true;
      }

      if (
        name === deviceDocument
      ) {
        deviceExists = true;
      }

      if (
        name === userDocument
      ) {
        userExists = true;
      }
    }

    const now =
      new Date();

    const trialEnd =
      new Date(
        now.getTime() +
          30 *
            24 *
            60 *
            60 *
            1000
      );

    /*
     * ------------------------------------------------------
     * 7. Existing installation/device
     * ------------------------------------------------------
     */

    if (
      installationExists ||
      deviceExists
    ) {
      const writes:
        Record<string, unknown>[] = [];

      if (userExists) {
        writes.push({
          update: {
            name: userDocument,
            fields: {
              updatedAt:
                firestoreTimestamp(now),
              subscription:
                firestoreMap({
                  status:
                    firestoreString(
                      "payment_required"
                    ),
                }),
            },
          },
          updateMask: {
            fieldPaths: [
              "updatedAt",
              "subscription",
            ],
          },
        });
      } else {
        writes.push({
          update: {
            name: userDocument,
            fields: {
              uid:
                firestoreString(
                  user.localId
                ),
              email:
                firestoreString(
                  user.email || ""
                ),
              displayName:
                firestoreString(
                  displayName ||
                    user.displayName ||
                    "GoodMash member"
                ),
              createdAt:
                firestoreTimestamp(now),
              updatedAt:
                firestoreTimestamp(now),
              subscription:
                firestoreMap({
                  status:
                    firestoreString(
                      "payment_required"
                    ),
                  membershipTier:
                    firestoreString(
                      "standard"
                    ),
                  totalPaid:
                    firestoreInteger(0),
                }),
            },
          },
        });
      }

      const commitResponse =
        await fetch(
          `${databasePath}:commit`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              transaction,
              writes,
            }),
          }
        );

      if (!commitResponse.ok) {
        const text =
          await commitResponse.text();

        throw new Error(
          `Could not save GoodMash registration: ${text.slice(
            0,
            500
          )}`
        );
      }

      return NextResponse.json({
        trialGranted: false,
        status:
          "payment_required",
        message:
          "Your GoodMash account is ready. Maintenance is required to continue.",
      });
    }

    /*
     * ------------------------------------------------------
     * 8. First eligible installation/device
     * ------------------------------------------------------
     */

    const installationFields = {
      installationHash:
        firestoreString(
          installationHash
        ),
      deviceHash:
        firestoreString(
          deviceHash
        ),
      uid:
        firestoreString(
          user.localId
        ),
      deviceType:
        firestoreString(
          deviceType
        ),
      trialStart:
        firestoreTimestamp(now),
      trialEnd:
        firestoreTimestamp(
          trialEnd
        ),
      createdAt:
        firestoreTimestamp(now),
    };

    const deviceFields = {
      deviceHash:
        firestoreString(
          deviceHash
        ),
      installationHash:
        firestoreString(
          installationHash
        ),
      uid:
        firestoreString(
          user.localId
        ),
      deviceType:
        firestoreString(
          deviceType
        ),
      trialStart:
        firestoreTimestamp(now),
      trialEnd:
        firestoreTimestamp(
          trialEnd
        ),
      createdAt:
        firestoreTimestamp(now),
    };

    const userFields = {
      uid:
        firestoreString(
          user.localId
        ),
      email:
        firestoreString(
          user.email || ""
        ),
      displayName:
        firestoreString(
          displayName ||
            user.displayName ||
            "GoodMash member"
        ),
      createdAt:
        firestoreTimestamp(now),
      updatedAt:
        firestoreTimestamp(now),
      subscription:
        firestoreMap({
          status:
            firestoreString(
              "trial"
            ),
          trialStartDate:
            firestoreTimestamp(
              now
            ),
          trialEndDate:
            firestoreTimestamp(
              trialEnd
            ),
          currentPeriodStart:
            firestoreTimestamp(
              now
            ),
          currentPeriodEnd:
            firestoreTimestamp(
              trialEnd
            ),
          lastPaymentDate: {
            nullValue: null,
          },
          nextPaymentDate: {
            nullValue: null,
          },
          totalPaid:
            firestoreInteger(0),
          membershipTier:
            firestoreString(
              "standard"
            ),
          vipGroups: {
            arrayValue: {
              values: [],
            },
          },
          vvipGroups: {
            arrayValue: {
              values: [],
            },
          },
        }),
      security:
        firestoreMap({
          loginAttempts:
            firestoreInteger(0),
          lockoutUntil: {
            nullValue: null,
          },
          lastLoginAt:
            firestoreTimestamp(
              now
            ),
          devices: {
            arrayValue: {
              values: [],
            },
          },
        }),
      ownedNetworkIds: {
        arrayValue: {
          values: [],
        },
      },
      joinedNetworkIds: {
        arrayValue: {
          values: [],
        },
      },
    };

    const writes = [
      {
        update: {
          name:
            `${databasePath}/trialInstallations/${installationHash}`,
          fields:
            installationFields,
        },
      },
      {
        update: {
          name:
            `${databasePath}/trialDevices/${deviceHash}`,
          fields:
            deviceFields,
        },
      },
      {
        update: {
          name: userDocument,
          fields: userFields,
        },
      },
    ];

    /*
     * ------------------------------------------------------
     * 9. Commit transaction
     * ------------------------------------------------------
     */

    const commitResponse =
      await fetch(
        `${databasePath}:commit`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            transaction,
            writes,
          }),
        }
      );

    if (!commitResponse.ok) {
      const text =
        await commitResponse.text();

      throw new Error(
        `Could not save GoodMash trial: ${text.slice(
          0,
          500
        )}`
      );
    }

    /*
     * ------------------------------------------------------
     * 10. Success
     * ------------------------------------------------------
     */

    return NextResponse.json({
      trialGranted: true,
      status: "trial",
      trialStart:
        now.toISOString(),
      trialEnd:
        trialEnd.toISOString(),
      message:
        "Your 30-day GoodMash trial has started.",
    });
  } catch (error) {
    console.error(
      "GoodMash trial claim error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not complete GoodMash registration.",
      },
      { status: 500 }
    );
  }
}
