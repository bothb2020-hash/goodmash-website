import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "GoodMash.io refund and cancellation policy for maintenance and membership fees.",
};

export default function Refunds() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="12 August 2026">
      <LegalP>
        This policy explains how refunds and cancellations work for GoodMash
        maintenance and membership fees.
      </LegalP>

      <LegalH2>1. Monthly maintenance</LegalH2>
      <LegalP>
        GoodMash charges an App Monthly Maintenance Fee of R10 per month after
        the 30-day free introductory period. Maintenance is billed on a
        recurring monthly basis.
      </LegalP>

      <LegalH2>2. Cancellation</LegalH2>
      <LegalP>
        You may cancel your GoodMash maintenance at any time. Cancellation stops
        future monthly charges. You can cancel through the GoodMash app, by
        contacting support, or via the contact details below.
      </LegalP>

      <LegalH2>3. Refunds</LegalH2>
      <LegalP>
        Refunds are considered in the following situations:
      </LegalP>
      <LegalList
        items={[
          "Duplicate or incorrect charges caused by a system error",
          "Charges made after cancellation without authorization",
          "Services not provided as described due to a GoodMash fault",
        ]}
      />

      <LegalH2>4. No refunds for completed periods</LegalH2>
      <LegalP>
        Maintenance fees for a billing period that has already been served are
        generally not refundable, because the maintenance service was already
        provided. Partial-month refunds may be considered on a case-by-case
        basis.
      </LegalP>

      <LegalH2>5. VIP and VVIP</LegalH2>
      <LegalP>
        VIP and VVIP fees follow the same monthly billing and cancellation
        rules as Standard maintenance. Removing additional groups stops the
        related additional fees from the next billing cycle.
      </LegalP>

      <LegalH2>6. Fraud prevention</LegalH2>
      <LegalP>
        Refund requests are verified through the secure GoodMash backend.
        Fraudulent refund requests may result in account suspension.
      </LegalP>

      <LegalH2>7. How to request a refund</LegalH2>
      <LegalP>
        Contact GoodMash support at teenage2023bt@gmail.com or +27 69 331 3143
        with your account details and the reason for the request. Support
        tickets contain only the information needed to help you.
      </LegalP>
    </LegalLayout>
  );
}
