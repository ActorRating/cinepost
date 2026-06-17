export const dynamic = "force-dynamic";

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="card-cinema p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your CinePost account</p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
