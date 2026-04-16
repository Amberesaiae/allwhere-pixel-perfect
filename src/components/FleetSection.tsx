export default function FleetSection() {
  const cards = [
    {
      sticker: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/666c7e9099d4743593a8fbed_Laptop%20Sticker.webp",
      title: "Instant visibility into every asset and who's using it",
    },
    {
      sticker: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e24587a855a_Small%20Sticker__Broken%20Monitor.webp",
      title: "At-a-glance device health and lifecycle stage",
    },
    {
      sticker: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e94907a8531_Small%20Sticker__Calendar.svg",
      title: "Automatic alerts for upcoming actions",
    },
  ];

  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="text-center mb-14">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-4">
            <strong>Your Fleet at a Glance</strong>
          </h2>
          <p className="text-[18px] text-aw-muted max-w-[680px] mx-auto leading-relaxed">
            Track every device in real time with one simple view. Bring together the data you need to make fast, confident decisions in one place without digging through spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-aw-beige rounded-[20px] p-8 flex flex-col items-start"
            >
              <img
                src={card.sticker}
                alt=""
                className="h-[80px] w-auto mb-6"
                loading="lazy"
              />
              <h3 className="text-[18px] font-bold text-aw-dark leading-snug">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
