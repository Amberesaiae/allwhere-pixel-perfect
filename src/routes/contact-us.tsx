import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us | allwhere" },
      { name: "description", content: "Get in touch with allwhere for support and questions." },
      { property: "og:title", content: "Contact Us | allwhere" },
      { property: "og:description", content: "Get in touch with allwhere for support." },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  return (
    <main className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[900px] px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left form */}
          <div className="flex-1 max-w-[480px]">
            <form className="bg-aw-beige rounded-[24px] p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-aw-dark mb-1 block">First Name*</label>
                  <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-aw-dark mb-1 block">Last Name*</label>
                  <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-aw-dark mb-1 block">Company Name*</label>
                <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-aw-dark mb-1 block">Number of Employees*</label>
                <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-aw-dark mb-1 block">Work Email*</label>
                <input type="email" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[13px] text-aw-muted">1/2</span>
                <button type="submit" className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-6 py-2.5 rounded-full hover:bg-aw-yellow-hover transition">
                  Next
                </button>
              </div>
            </form>
          </div>

          {/* Right info */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-[24px] font-bold text-aw-dark mb-3">Administrators</h2>
              <p className="text-[15px] text-aw-muted leading-relaxed">
                If you're an allwhere administrator for your company, you can find answers to your questions in our{" "}
                <a href="#" className="underline text-aw-dark hover:opacity-70">Help Center</a>.
              </p>
            </div>
            <div>
              <h2 className="text-[24px] font-bold text-aw-dark mb-3">Employees</h2>
              <p className="text-[15px] text-aw-muted leading-relaxed">
                If you're an employee looking for help with your order or retrieval, please contact your company's allwhere administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
