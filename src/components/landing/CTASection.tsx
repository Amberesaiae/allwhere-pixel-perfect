import { Link } from "@tanstack/react-router";

export default function CTASection() {
  return (
    <section className="py-24 bg-primary">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight mb-4">
          Ready to start buying and selling with confidence?
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
          Join thousands of Ghanaians already using BlueKiosk to find verified vendors and transact securely.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-background text-foreground font-semibold px-8 py-4 rounded-full text-base hover:bg-background/90 transition-colors"
          >
            Create Free Account
          </Link>
          <Link
            to="/discover"
            className="border-2 border-primary-foreground text-primary-foreground font-semibold px-8 py-4 rounded-full text-base hover:bg-primary-foreground/10 transition-colors"
          >
            Browse Kiosks
          </Link>
        </div>
      </div>
    </section>
  );
}
