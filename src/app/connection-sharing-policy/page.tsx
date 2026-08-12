import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Connection Sharing Policy",
  description:
    "GoodMash.io connection sharing policy — sharing is always authorized and controlled by the connection owner.",
};

export default function ConnectionSharingPolicy() {
  return (
    <LegalLayout
      title="Connection Sharing Policy"
      updated="12 August 2026"
    >
      <LegalP>
        GoodMash facilitates authorized connections between participating
        users. This policy explains how connection sharing works on the
        platform.
      </LegalP>

      <LegalH2>1. Sharing is always authorized</LegalH2>
      <LegalP>
        Connections are shared only between authorized members. A connection
        owner must approve a member before that member can use the available
        connection.
      </LegalP>

      <LegalH2>2. Owner control</LegalH2>
      <LegalP>
        The connection owner controls authorized access and can, at any time:
      </LegalP>
      <LegalList
        items={[
          "Approve members",
          "Reject requests",
          "Pause sharing",
          "Stop sharing",
          "Remove members",
          "Block members",
          "Manage availability",
        ]}
      />

      <LegalH2>3. Permissions and capabilities</LegalH2>
      <LegalP>
        Members may use an authorized connection according to their permissions
        and the capabilities of their devices, networks and GoodMash account.
        Actual features can vary according to operating-system and device
        capabilities.
      </LegalP>

      <LegalH2>4. Smart connection management</LegalH2>
      <LegalP>
        Where technically supported, GoodMash can show connection states
        (Excellent, Good, Fair, Unavailable), help users choose an available
        authorized connection, and support automatic failover to another
        authorized connection when the current one becomes unavailable.
      </LegalP>

      <LegalH2>5. No unrestricted remote control</LegalH2>
      <LegalP>
        GoodMash never provides unrestricted remote control of any device.
        Automated actions are explicitly defined, permission-controlled, logged,
        limited, safe and auditable.
      </LegalP>

      <LegalH2>6. Fair use</LegalH2>
      <LegalP>
        Users must use authorized connections lawfully and reasonably. Abuse of
        an authorized connection may result in removal, revocation, or
        suspension of access.
      </LegalP>
    </LegalLayout>
  );
}
