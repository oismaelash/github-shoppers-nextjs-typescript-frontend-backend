"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function SignInPage({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-white font-black text-2xl">Sign in</div>
          <div className="text-slate-400">
            Use your GitHub or Google account to continue.
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full"
            leftIcon={<Icon name="code" className="text-[18px]" />}
            onClick={() => signIn("github", { callbackUrl })}
          >
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            leftIcon={<Icon name="account_circle" className="text-[18px]" />}
            onClick={() => signIn("google", { callbackUrl })}
          >
            Continue with Google
          </Button>
        </div>

        <div className="text-xs text-slate-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

