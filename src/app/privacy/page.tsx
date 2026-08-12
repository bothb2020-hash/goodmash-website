import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GoodMash.io privacy policy — a data-minimization approach with no unnecessary collection or exposure of personal information.",
};

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="12 August 2026">
      <LegalP>
        GoodMash.io (&quot;GoodMash&quot;, &quot;we&quot;, &quot;us&quot;)
        follows a data-minimization approach. We aim to avoid unnecessary
        collection or exposure of personal information. This policy explains how
        we approach privacy on our public website and platform.
      </LegalP>

      <LegalH2>1. What we collect</LegalH2>
      <LegalP>
        We collect only the information necessary to operate the platform,
        such as:
      </LegalP>
      <LegalList
        items={[
          "Account details needed to create and secure your GoodMash account",
          "Information needed to manage groups and authorized connections",
          "Payment verification information handled securely through supported payment providers",
          "Basic usage and support information needed to help you",
        ]}
      />

      <LegalH2>2. What we never collect or expose publicly</LegalH2>
      <LegalP>
        GoodMash does not publicly expose:
      </LegalP>
      <LegalList
        items={[
          "Banking information",
          "Payment credentials",
          "Private connection credentials",
          "Private network credentials",
          "Unnecessary personal information",
        ]}
      />

      <LegalH2>3. Data minimization</LegalH2>
      <LegalP>
        We aim to collect the least amount of personal information needed for
        the platform to function. Where information is not needed, we avoid
        collecting it.
      </LegalP>

      <LegalH2>4. Payments</LegalH2>
      <LegalP>
        Payments are processed through supported payment providers (initially
        Ozow). Payment credentials are handled by the payment provider and the
        secure GoodMash backend. We do not store or expose your payment
        credentials on the public website.
      </LegalP>

      <LegalH2>5. AI support agent</LegalH2>
      <LegalP>
        The GoodMash AI Agent helps with support questions. Support tickets
        contain only the information necessary for support. The agent clearly
        identifies itself as an AI agent and never asks for passwords or payment
        credentials.
      </LegalP>

      <LegalH2>6. Security</LegalH2>
      <LegalP>
        GoodMash is designed around secure authentication, authorization,
        encrypted communications, controlled membership, session management,
        access revocation and security monitoring. Technical security
        implementation details are not published publicly.
      </LegalP>

      <LegalH2>7. Your choices</LegalH2>
      <LegalP>
        You can contact us at any time to ask about the information we hold,
        request correction, or raise a privacy concern.
      </LegalP>
    </LegalLayout>
  );
}
