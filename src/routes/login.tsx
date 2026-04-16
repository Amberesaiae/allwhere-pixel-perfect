import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In | BlueKiosk" },
      { name: "description", content: "Log in to your BlueKiosk account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Welcome back</h1>
            <p className="text-bk-muted mt-1">Log in to your BlueKiosk account</p>
          </div>
          <div className="bg-bk-beige rounded-2xl p-8 text-center">
            <p className="text-[14px] text-bk-muted">
              Authentication will be enabled with Lovable Cloud in the next batch.
            </p>
          </div>
          <p className="text-center text-[14px] text-bk-muted mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-bk-dark font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
