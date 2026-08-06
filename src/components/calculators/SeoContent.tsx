import { SeoContent as SeoContentType } from "@/lib/calculators/content/types";
import Reveal from "@/components/motion/Reveal";

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className="text-muted leading-relaxed">
          {p}
        </p>
      ))}
    </>
  );
}

export default function SeoContent({ content, title }: { content: SeoContentType; title: string }) {
  return (
    <Reveal className="mt-16">
      <article className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-foreground">About the {title}</h2>
          <Paragraphs text={content.intro} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-foreground">How It Works</h2>
          <Paragraphs text={content.howItWorks} />
          {content.formula && (
            <div className="scrollbar-thin overflow-x-auto rounded-xl border border-border bg-surface-2 px-4 py-3 font-mono text-sm text-foreground">
              {content.formula}
            </div>
          )}
        </section>

        {content.examples.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">Examples</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.examples.map((ex, i) => (
                <div key={i} className="card p-4">
                  <h3 className="text-sm font-semibold text-foreground">{ex.title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{ex.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 sm:grid-cols-2">
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-foreground">Advantages</h3>
            <ul className="flex flex-col gap-2">
              {content.advantages.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-foreground">Common Mistakes</h3>
            <ul className="flex flex-col gap-2">
              {content.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                  {m}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-foreground">Common Use Cases</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {content.useCases.map((u, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {u}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Reveal>
  );
}

export function SeoConclusion({ text }: { text: string }) {
  return (
    <Reveal className="mt-16 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground">Conclusion</h2>
      <div className="mt-3">
        <Paragraphs text={text} />
      </div>
    </Reveal>
  );
}
