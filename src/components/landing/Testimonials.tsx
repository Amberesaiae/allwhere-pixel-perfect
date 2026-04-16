const testimonials = [
  {
    name: "Abena Mensah",
    role: "Buyer, Accra",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    text: "I was tired of getting scammed on social media. BlueKiosk's escrow payment gave me the confidence to buy a laptop from a vendor I'd never met. Got exactly what was promised!",
    rating: 5,
  },
  {
    name: "Kofi Asante",
    role: "Vendor, Kumasi",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    text: "Since joining BlueKiosk, my sales have tripled. The verification badge builds trust instantly and the in-app chat means no more lost customers from missed calls.",
    rating: 5,
  },
  {
    name: "Fatima Ibrahim",
    role: "Buyer, Tamale",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    text: "The category search is amazing — I found a shea butter vendor in my region within minutes. Mobile Money payment made it seamless. This is how shopping in Ghana should be.",
    rating: 5,
  },
  {
    name: "Daniel Osei",
    role: "Vendor, Cape Coast",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "BlueKiosk helped me reach customers beyond my local market. The platform handles payments and disputes so I can focus on growing my business.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-bk-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-[18px] text-bk-muted max-w-[600px] mx-auto">
            Hear from real buyers and vendors across Ghana
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-bk-beige">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-bk-yellow text-[18px]">★</span>
                ))}
              </div>
              <p className="text-[16px] text-bk-dark leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-[15px] font-bold text-bk-dark">{t.name}</p>
                  <p className="text-[13px] text-bk-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
