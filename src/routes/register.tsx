import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Sign Up | BlueKiosk" },
      { name: "description", content: "Create your BlueKiosk account and start discovering verified vendors in Ghana." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Create your account</h1>
            <p className="text-bk-muted mt-1">Join BlueKiosk as a buyer or vendor</p>
          </div>
          <div className="bg-bk-beige rounded-2xl p-8 text-center">
            <p className="text-[14px] text-bk-muted">
              Registration will be enabled with Lovable Cloud in the next batch.
            </p>
          </div>
          <p className="text-center text-[14px] text-bk-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-bk-dark font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
