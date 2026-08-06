"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { trackEvent } from "@/lib/analytics";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeToNewsletter(email);
      trackEvent("newsletter_signup");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="container-wide py-16">
      <div className="glass mx-auto max-w-2xl rounded-3xl p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Get new calculators in your inbox</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Occasional emails when we add useful new tools or write something worth reading. No spam, unsubscribe anytime.
        </p>
        {status === "done" ? (
          <p className="mt-6 text-sm font-medium text-accent">You&apos;re in — thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="field-input flex-1"
            />
            <button type="submit" disabled={status === "loading"} className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-xs text-danger">Something went wrong — please try again.</p>}
      </div>
    </section>
  );
}
