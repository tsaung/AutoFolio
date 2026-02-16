"use client";

import { useActionState } from "react";
import { resetPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(resetPassword, null);

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            className="bg-background"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="text-sm text-center">
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>

        {state?.error && (
          <p className="text-sm font-medium text-destructive mt-2 text-center">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="text-sm font-medium text-green-600 mt-2 text-center">
            {state.success}
          </p>
        )}
      </form>
    </div>
  );
}
