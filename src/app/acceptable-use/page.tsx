import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "GoodMash.io acceptable use policy — lawful, reasonable and authorized use of the platform.",
};

export default function AcceptableUse() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="12 August 2026">
      <LegalP>
        This Acceptable Use Policy (AUP) sets out what is and is not allowed
        when using GoodMash.io. It applies to all users of the website and
        platform.
      </LegalP>

      <LegalH2>1. Authorized use only</LegalH2>
      <LegalP>
        You may use GoodMash only for lawful purposes and only for connections
        and memberships for which you have been authorized. You must respect the
        permissions and capabilities of your devices, networks and GoodMash
        account.
      </LegalP>

      <LegalH2>2. Prohibited activities</LegalH2>
      <LegalP>
        You may not use GoodMash to:
      </LegalP>
      <LegalList
        items={[
          "Access connections without authorization",
          "Attempt to bypass, probe, or tamper with security systems",
          "Interfere with other users' accounts, groups, or connections",
          "Share or expose private credentials, passwords, or keys",
          "Harass, abuse, or mislead other users",
          "Conduct illegal activity",
          "Misrepresent the GoodMash brand or claim affiliation with any telecommunications company",
        ]}
      />

      <LegalH2>3. Group rules</LegalH2>
      <LegalP>
        Group and connection owners set the rules for their private groups,
        including who may join, who may share connections, and who may be
        removed. Members must follow those rules.
      </LegalP>

      <LegalH2>4. Payments</LegalH2>
      <LegalP>
        Users must not attempt to interfere with the payment system, request
        refunds fraudulently, or expose payment credentials. The final amount is
        always calculated by the backend.
      </LegalP>

      <LegalH2>5. AI agent</LegalH2>
      <LegalP>
        The GoodMash AI Agent is provided to help with support. Users must not
        attempt to use the agent to extract private technical information.
        Automated actions performed by the agent are safe, limited and logged.
      </LegalP>

      <LegalH2>6. Enforcement</LegalH2>
      <LegalP>
        Violations may result in removal from groups, revocation of access, or
        suspension of accounts, at GoodMash&apos;s discretion.
      </LegalP>
    </LegalLayout>
  );
}
