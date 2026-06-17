export const dynamic = "force-dynamic";

import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="card-cinema p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">
            Get 3 free generations per day, plus post history
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
