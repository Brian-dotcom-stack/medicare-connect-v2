import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify email — Medicare Connect" }, { name: "description", content: "Verify your email address." }] }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <div className="text-center">
      <MailCheck className="mx-auto h-12 w-12 text-primary" />
      <h1 className="mt-4 text-2xl font-bold">Verify your email</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We've sent a verification link to your inbox. Click it to activate your workspace.
      </p>
      <Button asChild variant="outline" className="mt-6"><Link to="/login">Back to sign in</Link></Button>
    </div>
  );
}
