import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3 } from "lucide-react";
import ListingContextPanel from "./ListingContextPanel";

interface Props {
  listingId: string | null;
  kioskId: string;
  kioskName: string;
  kioskSlug: string;
}

export default function PriceComparisonSheet(props: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="md:hidden inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-bk-dark bg-bk-page hover:bg-bk-beige rounded-full px-3 py-1.5 transition"
          aria-label="Compare prices"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Compare
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b border-bk-beige flex-shrink-0">
          <SheetTitle className="text-[15px] font-bold text-bk-dark text-left">Listing & comparison</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ListingContextPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
