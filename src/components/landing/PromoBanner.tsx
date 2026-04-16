import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="rounded-2xl bg-bk-teal p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-bk-dark" />
            </div>
            <div>
              <h3 className="text-[20px] md:text-[26px] font-bold text-bk-dark leading-tight">Verified vendors across Ghana</h3>
              <p className="text-[14px] md:text-[15px] text-bk-dark/70 mt-1">Shop with confidence from trusted local kiosks</p>
            </div>
          </div>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-[14px] font-bold bg-bk-dark text-white px-6 py-3 rounded-full hover:bg-bk-dark/90 transition shrink-0"
          >
            Browse all listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
