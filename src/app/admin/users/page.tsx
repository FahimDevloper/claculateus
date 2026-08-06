"use client";

import { useEffect, useState } from "react";
import { NewsletterSubscriber, getNewsletterSubscribers } from "@/lib/newsletter";

export default function UsersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);

  useEffect(() => {
    getNewsletterSubscribers().then(setSubscribers).catch(() => setSubscribers([]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Users</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Signed-in accounts (email/password and Google) are managed entirely by Firebase Authentication. Listing,
          searching, or disabling individual accounts requires the Firebase Admin SDK with a service account key,
          which isn't configured in this environment — that's a deliberate boundary, not an oversight, since a
          service account key grants full read/write access to your project and shouldn't live in application
          code without a proper secrets setup. For account management today, use the{" "}
          <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Firebase Console → Authentication
          </a>{" "}
          tab.
        </p>
      </div>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Newsletter subscribers</h3>
          <span className="text-xs text-muted">{subscribers === null ? "—" : subscribers.length} total</span>
        </div>
        {subscribers === null ? (
          <div className="mt-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : subscribers.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No subscribers yet.</p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-border">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-foreground">{s.email}</span>
                <span className="text-xs text-muted">{s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
