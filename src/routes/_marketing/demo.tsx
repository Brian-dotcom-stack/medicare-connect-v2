import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_marketing/demo")({
  head: () => ({
    meta: [
      { title: "Book a demo — Medicare Connect" },
      { name: "description", content: "See Medicare Connect running with your team's workflow." },
      { property: "og:title", content: "Book a demo — Medicare Connect" },
      { property: "og:description", content: "20-minute personalised walkthrough." },
    ],
  }),
  component: DemoPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  organisation: z.string().trim().min(1).max(120),
  size: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});

function DemoPage() {
  const [size, setSize] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), size };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitted(true);
    toast.success("Demo request received");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-3xl font-bold">Thanks — you're booked in.</h1>
        <p className="mt-3 text-muted-foreground">A member of the team will be in touch within one business day to confirm your slot.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Book a demo</h1>
      <p className="mt-3 text-muted-foreground">A 20-minute walkthrough tailored to your service.</p>
      <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label htmlFor="name">Your name</Label><Input id="name" name="name" required /></div>
          <div><Label htmlFor="email">Work email</Label><Input id="email" name="email" type="email" required /></div>
        </div>
        <div><Label htmlFor="organisation">Organisation</Label><Input id="organisation" name="organisation" required /></div>
        <div>
          <Label>Service size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1–10 staff</SelectItem>
              <SelectItem value="11-50">11–50 staff</SelectItem>
              <SelectItem value="51-200">51–200 staff</SelectItem>
              <SelectItem value="200+">200+ staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label htmlFor="message">Anything specific you'd like to see?</Label><Textarea id="message" name="message" rows={4} /></div>
        <Button type="submit" className="w-full" size="lg">Request demo</Button>
      </form>
    </div>
  );
}
