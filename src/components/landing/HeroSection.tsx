import { Link } from "@tanstack/react-router";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-20 pb-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Now live in Ghana
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
          Find Trusted Vendors{" "}
          <span className="text-primary">Near You</span>{" "}
          in Ghana
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          BlueKiosk connects buyers with verified local vendors through secure escrow payments, real-time chat, and a discovery feed built for trust.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/discover"
            className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Browse Kiosks
          </Link>
          <Link
            to="/register"
            className="border-2 border-foreground text-foreground font-semibold px-8 py-4 rounded-full text-base hover:bg-foreground hover:text-background transition-colors"
          >
            Sign Up Free
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-foreground">500+</p>
            <p className="text-sm text-muted-foreground mt-1">Verified Vendors</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-foreground">10k+</p>
            <p className="text-sm text-muted-foreground mt-1">Happy Buyers</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-foreground">16</p>
            <p className="text-sm text-muted-foreground mt-1">Ghana Regions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
