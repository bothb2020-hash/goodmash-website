import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Payment Terms",
  description:
    "GoodMash.io payment terms — R10 monthly app maintenance, VIP/VVIP fees, Ozow processing and backend-verified amounts.",
};

export default function PaymentTerms() {
  return (
    <LegalLayout title="Payment Terms" updated="12 August 2026">
      <LegalP>
        These Payment Terms govern the payment of GoodMash maintenance and
        membership fees.
      </LegalP>

      <LegalH2>1. App maintenance fee</LegalH2>
      <LegalP>
        Every new GoodMash account receives 30 days free. After the
        introductory period, an App Monthly Maintenance Fee of{" "}
        <strong>R10</strong> per month applies. This is an app/platform
        maintenance fee. It is <strong>not</strong> the price of mobile data.
      </LegalP>

      <LegalH2>2. Membership fees</LegalH2>
      <LegalList
        items={[
          "Standard: R10 base monthly maintenance",
          "VIP: R10 base plus R5 for each additional VIP group",
          "VVIP: R10 base plus R10 per VVIP group",
          "VVIP does not override group-owner authorization",
        ]}
      />

      <LegalH2>3. Payment processing</LegalH2>
      <LegalP>
        The initial payment provider is Ozow. Payments are securely processed
        through supported payment providers. Payment verification always
        happens through the secure GoodMash backend. No payment credentials are
        ever exposed on the website frontend, in the mobile application, in
        public JavaScript, or in documentation.
      </LegalP>

      <LegalH2>4. Amount calculation</LegalH2>
      <LegalP>
        The final amount is always calculated by the GoodMash backend to ensure
        accuracy across all maintenance and membership combinations.
      </LegalP>

      <LegalH2>5. Maintenance flexibility</LegalH2>
      <LegalP>
        Users can maintain themselves, their family group, selected members,
        sponsor another member, or use rotating responsibility — where the
        payment and account relationship allows it.
      </LegalP>

      <LegalH2>6. Future payment providers</LegalH2>
      <LegalP>
        Ozow is the initial payment provider. Additional South African payment
        channels (such as PayFast or Flash) may be integrated in the future.
        Future providers are only advertised once actually integrated.
      </LegalP>

      <LegalH2>7. Refunds and cancellation</LegalH2>
      <LegalP>
        Refunds and cancellations are covered by the separate Refund &
        Cancellation Policy.
      </LegalP>
    </LegalLayout>
  );
}
