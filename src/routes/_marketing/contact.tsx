import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/_marketing/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Medicare Connect" },
      { name: "description", content: "Get in touch with the Medicare Connect team." },
      { property: "og:title", content: "Contact — Medicare Connect" },
      { property: "og:description", content: "Get in touch with the team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Message too short").max(1000),
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Message sent");
    }, 500);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Let's talk</h1>
        <p className="mt-3 text-muted-foreground">
          Whether you're exploring Medicare Connect or already using it, we're always happy to help. Drop us a message and we'll get back to you as soon as possible.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> medicareconnect26@outlook.com</li>
        </ul>
        <p className="mt-6 text-muted-foreground">
          We love hearing from care providers — your feedback helps shape the future of the platform.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        {sent ? (
          <div className="py-8 text-center">
            <h2 className="text-lg font-semibold">Thanks — we'll be in touch.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your message has been received.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={5} required /></div>
            <Button type="submit" className="w-full" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
