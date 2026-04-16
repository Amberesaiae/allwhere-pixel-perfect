import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useCartSync } from "@/hooks/useCartSync";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bk-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-bk-dark">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-bk-dark">Page not found</h2>
        <p className="mt-2 text-sm text-bk-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-bk-yellow px-6 py-3 text-sm font-semibold text-bk-dark transition hover:bg-bk-yellow-hover"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BlueKiosk — Ghana's Trusted Marketplace" },
      { name: "description", content: "BlueKiosk connects buyers with verified local vendors in Ghana through secure escrow payments and real-time chat." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useCartSync();
  return (
    <div className="min-h-screen bg-bk-cream">
      <Outlet />
    </div>
  );
}
