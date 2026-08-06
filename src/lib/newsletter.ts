import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export async function subscribeToNewsletter(email: string): Promise<void> {
  await withTimeout(
    addDoc(collection(db, "newsletter_subscribers"), {
      email: email.trim().toLowerCase(),
      subscribedAt: serverTimestamp(),
    })
  );
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: number | null;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, "newsletter_subscribers"), orderBy("subscribedAt", "desc"))),
    6000
  );
  return snap.docs.map((d) => {
    const data = d.data() as { email: string; subscribedAt?: Timestamp };
    return { id: d.id, email: data.email, subscribedAt: data.subscribedAt?.toMillis() ?? null };
  });
}
