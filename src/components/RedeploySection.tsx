import { RefreshCw, Search, Recycle, BarChart3 } from "lucide-react";

const items = [
  {
    icon: RefreshCw,
    title: "Redeploy",
    description: "Reassign retrieved devices to new employees instantly.",
  },
  {
    icon: Search,
    title: "Diagnose",
    description: "Full diagnostic checks to assess device health and performance.",
  },
  {
    icon: Recycle,
    title: "Recycle",
    description: "Environmentally responsible disposal with certified e-waste partners.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Detailed reporting on your fleet's lifecycle, costs, and utilization.",
  },
];

export default function RedeploySection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="bg-aw-beige rounded-[24px] p-8 md:p-12 lg:p-16">
          <div className="text-center mb-12">
            <h3 className="text-[32px] md:text-[38px] font-bold text-aw-dark tracking-tight mb-3">
              Redeploy or retire
            </h3>
            <p className="text-[17px] text-aw-muted max-w-[560px] mx-auto">
              Once devices are retrieved, decide their next chapter — redeploy, diagnose, recycle, or report.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-aw-cream flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-aw-dark" strokeWidth={1.5} />
                </div>
                <h4 className="text-[18px] font-bold text-aw-dark mb-2">{item.title}</h4>
                <p className="text-[14px] text-aw-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
