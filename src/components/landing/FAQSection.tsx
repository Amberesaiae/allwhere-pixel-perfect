import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does BlueKiosk protect my payment?",
    a: "BlueKiosk uses BluPay escrow — when you pay, your funds are held securely by a licensed payment partner. The vendor only receives payment after you confirm receipt and satisfaction with your order. If there's a dispute, our team mediates to ensure fairness.",
  },
  {
    q: "How are vendors verified?",
    a: "Every vendor goes through a multi-step verification process: government-issued ID check, business registration validation, physical address confirmation, and a probation period with monitored transactions. Verified vendors display a blue checkmark on their kiosk.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo Money), Visa/Mastercard debit and credit cards, and bank transfers — all processed securely through Paystack. Choose whichever is most convenient for you.",
  },
  {
    q: "Can I sell on BlueKiosk?",
    a: "Absolutely! Sign up for a free vendor account, complete verification, and set up your kiosk in minutes. List products with photos and prices, and start receiving orders from buyers across Ghana. No listing fees — we only take a small commission on completed sales.",
  },
  {
    q: "What if I'm not satisfied with my purchase?",
    a: "Since payment is held in escrow, you can raise a dispute before confirming delivery. Our resolution team reviews evidence from both parties and makes a fair decision within 48 hours. If the vendor is at fault, you receive a full refund.",
  },
  {
    q: "Is BlueKiosk available in all 16 regions of Ghana?",
    a: "Yes! BlueKiosk operates nationwide. Whether you're in Accra, Kumasi, Tamale, Takoradi, or any community in between, you can buy and sell on the platform. We're actively onboarding vendors across all regions.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-bk-beige py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[18px] text-bk-muted">
            Everything you need to know about buying and selling on BlueKiosk
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-bk-cream rounded-xl border border-bk-beige px-6"
            >
              <AccordionTrigger className="text-[16px] font-semibold text-bk-dark text-left py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-bk-muted leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
