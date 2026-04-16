import { createFileRoute } from '@tanstack/react-router'
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Privacy | allwhere" },
      { name: "description", content: "allwhere Terms and Conditions and Privacy Policy." },
      { property: "og:title", content: "Terms & Privacy | allwhere" },
      { property: "og:description", content: "allwhere Terms and Conditions and Privacy Policy." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6">
        <h1 className="text-[42px] md:text-[52px] font-bold text-aw-dark tracking-tight mb-12">
          Terms & Privacy
        </h1>

        {/* Terms */}
        <section className="mb-16">
          <h2 className="text-[28px] font-bold text-aw-dark mb-8">Terms and Conditions</h2>
          <div className="prose prose-sm max-w-none text-[15px] text-aw-dark leading-relaxed space-y-4">
            <p className="uppercase font-semibold">TERMS AND CONDITIONS</p>
            <p>
              The following Terms and Conditions (the "Agreement") apply to Company's use of the Services (as defined below)
              made available by allwhere, Inc. ("Supplier"). For purposes of this Agreement, "Company" means the entity
              identified as the "Company" during the registration and check-out process. The Services will be made available
              to Company commencing upon the date that Company has accepted this Agreement ("Effective Date").
            </p>

            <h3 className="text-[20px] font-bold mt-8">I. DEFINED TERMS</h3>
            <p>
              <strong>1. "Affiliate"</strong> means any entity which directly or indirectly controls, is controlled by, or is under common control by either party.
            </p>
            <p>
              <strong>2. "Authorized Parties"</strong> means Company's and its Affiliates' designated employees and third party contractors or providers.
            </p>
            <p>
              <strong>3. "Checkout Page"</strong> means the landing page on which Company elects the Core Services it is purchasing.
            </p>
            <p>
              <strong>4. "Company Assets"</strong> means any assets of the Company that are shipped by Company or provided to Supplier for storage or shipment services.
            </p>
            <p>
              <strong>5. "Company Data"</strong> means data, information submitted by or on behalf of Company or Authorized Parties in connection with the Services.
            </p>
            <p>
              <strong>6. "Core Services"</strong> means Supplier's services of assisting Company with equipment and device procurement, logistics, support, and services.
            </p>
            <p>
              <strong>7. "Documentation"</strong> means Supplier's user guides or other documentation for the Services.
            </p>
            <p>
              <strong>8. "Intellectual Property Rights"</strong> means any and all intellectual property rights and proprietary rights throughout the world.
            </p>
            <p>
              <strong>9. "Law"</strong> means any local, state, national and/or foreign law, treaties, rules, and/or regulations.
            </p>
            <p>
              <strong>10. "Platform Services"</strong> means Supplier's proprietary platform and/or the Documentation relating thereto.
            </p>
            <p>
              <strong>11. "Quotation"</strong> means a written quotation, pursuant to which Supplier agrees to provide Services to Company.
            </p>
            <p>
              <strong>12. "Services"</strong> means the Core Services and the Platform Services.
            </p>
            <p>
              <strong>13. "Term"</strong> has the meaning set forth in Section IX.1.
            </p>
            <p>
              <strong>14. "Third-Party Goods"</strong> means any third party products, goods or services that Supplier may procure for Company.
            </p>

            <h3 className="text-[20px] font-bold mt-8">II. SERVICES</h3>
            <p>
              <strong>1. Provision of Platform Services.</strong> Supplier will make the Platform Services available in accordance with the Documentation to Company and its Authorized Parties during the Term. Company will be responsible for the accuracy and quality of Company Data it provides hereunder.
            </p>
            <p>
              <strong>2. Provision of Core Services & Sale of Third-Party Goods.</strong> Supplier shall use commercially reasonable efforts to perform the Core Services, as elected by Company on the Checkout Page or as set forth in a Quotation.
            </p>
            <p>
              <strong>3. Feedback.</strong> Company hereby grants to Supplier a non-exclusive, royalty-free, worldwide, transferable, sublicensable, irrevocable, perpetual license to use and otherwise exploit any suggestions, enhancement requests, recommendations or other feedback.
            </p>

            <h3 className="text-[20px] font-bold mt-8">III. FEES</h3>
            <p>Company shall pay Supplier the fees for the Services set forth in the applicable Checkout Page or Quotation.</p>

            <h3 className="text-[20px] font-bold mt-8">IV. PROPRIETARY RIGHTS</h3>
            <p>No rights or licenses are granted by a party under this Agreement other than as expressly set forth in this Agreement.</p>

            <h3 className="text-[20px] font-bold mt-8">V. CONFIDENTIALITY</h3>
            <p>Each party acknowledges that the other party's Confidential Information constitutes valuable trade secrets of such party.</p>

            <h3 className="text-[20px] font-bold mt-8">VI. WARRANTIES</h3>
            <p>
              <strong>Disclaimer.</strong> COMPANY EXPRESSLY UNDERSTANDS AND AGREES THAT THE SERVICES, AND ANY THIRD PARTY GOODS, ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
            </p>

            <h3 className="text-[20px] font-bold mt-8">VII. INDEMNIFICATION</h3>
            <p>The indemnified party will cooperate with the indemnifying party to facilitate the settlement or defense of any claim or suit.</p>

            <h3 className="text-[20px] font-bold mt-8">VIII. LIMITATION OF LIABILITY</h3>
            <p>IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY EXCEED THE AMOUNTS PAID BY COMPANY TO SUPPLIER IN THE TWELVE (12) MONTH PERIOD PRECEDING THE CLAIM.</p>

            <h3 className="text-[20px] font-bold mt-8">IX. TERM AND TERMINATION</h3>
            <p>Upon any termination or expiration of this Agreement, Company will immediately cease accessing and otherwise utilizing the applicable Services.</p>

            <h3 className="text-[20px] font-bold mt-8">X. GENERAL</h3>
            <p>This Agreement will bind and inure to the benefit of the parties, their respective successors and permitted assigns.</p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section>
          <h2 className="text-[28px] font-bold text-aw-dark mb-8">Privacy Policy</h2>
          <div className="prose prose-sm max-w-none text-[15px] text-aw-dark leading-relaxed space-y-4">
            <p>
              allwhere may provide additional or supplemental privacy policies to individuals for specific products or services that we offer at the time we collect personal information.
            </p>

            <h3 className="text-[20px] font-bold mt-8">Personal Information We Collect</h3>
            <p>We collect personal information from various sources including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information you provide directly</li>
              <li>Public sources, such as government agencies, public records, social media platforms, and other publicly available sources</li>
              <li>Private sources, such as data providers, social media platforms, and data licensors</li>
              <li>Marketing partners, such as joint marketing partners and event co-sponsors</li>
              <li>Vendor partners, such as our vendors used to source items</li>
            </ul>

            <h3 className="text-[20px] font-bold mt-8">Cookies and Similar Technologies</h3>
            <p>We use cookies, local storage technologies, web beacons, and similar tools for analytics and functionality.</p>

            <h3 className="text-[20px] font-bold mt-8">How We Use Your Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Service delivery and improvement</li>
              <li>Direct marketing (you may opt-out)</li>
              <li>Technical operation of the Service</li>
              <li>Functionality enhancement</li>
              <li>Analytics and research</li>
            </ul>

            <h3 className="text-[20px] font-bold mt-8">Sharing Your Information</h3>
            <p>We may disclose personal information in the context of actual or prospective business transactions.</p>

            <h3 className="text-[20px] font-bold mt-8">Your Choices</h3>
            <p>You can opt out of interest-based advertising through industry tools:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google: https://adssettings.google.com/</li>
              <li>LinkedIn: https://www.linkedin.com/psettings/guest-controls</li>
              <li>Microsoft: https://about.ads.microsoft.com</li>
              <li>Facebook: https://www.facebook.com/about/ads</li>
              <li>Network Advertising Initiative: http://www.networkadvertising.org/managing/opt_out.asp</li>
            </ul>

            <h3 className="text-[20px] font-bold mt-8">Security</h3>
            <p>We employ a number of organizational, technical, and physical safeguards designed to protect the personal information we collect.</p>

            <h3 className="text-[20px] font-bold mt-8">Contact Us</h3>
            <p>Email: hello@allwhere.co</p>
          </div>
        </section>
      </div>
    </main>
  );
}
