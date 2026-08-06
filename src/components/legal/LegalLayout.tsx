import { ReactNode } from "react";

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <div className="prose-legal mt-8 flex flex-col gap-5 text-[15px] leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_p]:text-muted [&_li]:text-muted [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}
