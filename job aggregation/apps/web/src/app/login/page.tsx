"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to SkillMatch</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 bg-black text-white rounded-lg font-medium mb-4"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
