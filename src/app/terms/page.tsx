import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the GoodMash.io website and platform.",
};

export default function Terms() {
  return (
    <LegalLayout title="Terms & Conditions" updated="12 August 2026">
      <LegalP>
        These Terms &amp; Conditions govern your use of the GoodMash.io website
        and platform. By using GoodMash, you agree to these terms.
      </LegalP>

      <LegalH2>1. What GoodMash is</LegalH2>
      <LegalP>
        GoodMash.io is a connectivity platform designed to help people create
        private networks and connect authorized members through participating
        users&apos; existing Internet connectivity.
      </LegalP>
      <LegalList
        items={[
          "GoodMash is NOT a mobile network operator.",
          "GoodMash does NOT sell mobile data bundles.",
          "GoodMash is not affiliated with MTN, Vodacom, Telkom, Cell C, Rain or any telecommunications company.",
        ]}
      />

      <LegalH2>2. Authorization and consent</LegalH2>
      <LegalP>
        GoodMash groups are built on authorization. Group and connection owners
        control who participates. You may only use connections for which you
        have authorization, and only according to the permissions and
        capabilities of your devices, networks and GoodMash account.
      </LegalP>

      <LegalH2>3. Accounts and groups</LegalH2>
      <LegalP>
        A GoodMash account is separate from a GoodMash group. You are
        responsible for maintaining your account and acting within the rules of
        each group you join. Memberships are controlled by group owners.
      </LegalP>

      <LegalH2>4. Maintenance</LegalH2>
      <LegalP>
        Every new account receives 30 days free. After the introductory period,
        a monthly app maintenance fee of R10 applies. This is an app/platform
        maintenance fee, not the price of mobile data. VIP and VVIP are
        optional enhanced multi-group capabilities with their own published
        fees.
      </LegalP>

      <LegalH2>5. Payments</LegalH2>
      <LegalP>
        Payments are processed through supported payment providers such as Ozow.
        The final amount is always calculated by the secure GoodMash backend.
        Payment terms are available separately.
      </LegalP>

      <LegalH2>6. Acceptable use</LegalH2>
      <LegalP>
        You agree to use GoodMash lawfully and in accordance with the
        Acceptable Use Policy. GoodMash may remove members, revoke access, or
        suspend accounts that violate these terms.
      </LegalP>

      <LegalH2>7. Features and availability</LegalH2>
      <LegalP>
        Actual features can vary according to operating-system and device
        capabilities. Features are only advertised once technically verified.
        GoodMash may update, change, or retire features over time.
      </LegalP>

      <LegalH2>8. Intellectual property</LegalH2>
      <LegalP>
        GoodMash brand, design and public content belong to GoodMash.io. The
        proprietary technology and its implementation remain private. You may
        not reverse-engineer or attempt to access private systems.
      </LegalP>

      <LegalH2>9. Liability</LegalH2>
      <LegalP>
        GoodMash provides the platform &quot;as available&quot; and is not
        liable for losses arising from misuse, unauthorized use, or reliance on
        device/network capabilities beyond GoodMash&apos;s control.
      </LegalP>

      <LegalH2>10. Contact</LegalH2>
      <LegalP>
        Questions about these terms: teenage2023bt@gmail.com or +27 69 331
        3143.
      </LegalP>
    </LegalLayout>
  );
}
