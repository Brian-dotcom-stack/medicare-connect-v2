import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updatePassword } from "@/lib/auth";

export const Route = createFileRoute("/_auth/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set new password — Medicare Connect" },
      { name: "description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  // Supabase sends users to /reset-password with a recovery token embedded in
  // the URL hash (#access_token=...). We must let supabase-js parse & persist
  // that session BEFORE calling updateUser, otherwise updateUser fails with
  // "Auth session missing".
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session?.user) {
          if (mounted) setValid(true);
        } else {
          // A recovery flow may still be mid-parse; give it one explicit
          // chance to restore the session from the hash.
          const { data: hashSession, error: hashErr } = await supabase.auth.getSession();
          if (hashErr) throw hashErr;
          if (mounted) setValid(!!hashSession.session?.user);
        }
      } catch (e) {
        if (mounted) {
          toast.error(e instanceof Error ? e.message : "Invalid or expired reset link");
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated");
      // Sign out so the user logs in again with the new password.
      await supabase.auth.signOut();
      navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Verifying your reset link…
      </p>
    );
  }

  if (!valid) {
    return (
      <>
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This password reset link is invalid or has expired. Please request a new
          one.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-6 w-full"
        >
          <a href="/forgot-password">Request a new link</a>
        </Button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your new password below.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </Button>
      </form>
    </>
  );
}
