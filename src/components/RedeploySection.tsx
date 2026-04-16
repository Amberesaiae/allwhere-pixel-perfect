export default function RedeploySection() {
  const items = [
    {
      icon: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67e1a7fe78cd06d5c6a90730_Running%20Box.webp",
      title: "Redeploy",
      description: "Redeploy recovered hardware to new employees",
    },
    {
      icon: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65805d86847be1cad45ee3d6_ui__teams_facilities.webp",
      title: "Diagnose",
      description: "Remotely diagnose, clean, and repair devices",
    },
    {
      icon: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d991cab54149975c7f1f4f_Frame%2080.png",
      title: "Recycle",
      description: "Resell or recycle securely with compliance documentation",
    },
    {
      icon: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9ec5cb7a8520_sticker%20%3D%20Paper.png",
      title: "Reports",
      description: "Generate detailed end-of-life reports for audits",
    },
  ];

  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="text-center mb-10">
          <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-3">
            <strong>Redeploy or Retire</strong>
          </h3>
          <p className="text-[18px] text-aw-muted max-w-[620px] mx-auto">
            Maximize every device's value and stay compliant at end-of-life
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <img
                src={item.icon}
                alt={item.title}
                className="h-[50px] w-auto mb-5"
                loading="lazy"
              />
              <p className="text-[16px] text-aw-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
