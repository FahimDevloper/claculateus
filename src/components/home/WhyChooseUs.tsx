import Reveal from "@/components/motion/Reveal";
import { allCalculators } from "@/lib/calculators/registry";
import { ShieldIcon, SigmaIcon, BoltIcon, DownloadIcon, MoonIcon, CheckCircleIcon } from "@/components/icons";
import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

const POINTS: { title: string; body: string; icon: ComponentType<IconProps> }[] = [
  { title: "Always free, no sign-up", body: "Every calculator works instantly with no account required. Sign in only if you want your favorites synced across devices.", icon: ShieldIcon },
  { title: "Built on real formulas", body: "Standard amortization math, IRS tax brackets, published medical formulas — not guesses. Every calculator page shows its formula and assumptions.", icon: SigmaIcon },
  { title: "Fast by design", body: "Static pages, no bloated ad scripts blocking the calculator, results update instantly as you type.", icon: BoltIcon },
  { title: "Export & share anything", body: "Copy, share, download as CSV, print to PDF, or generate a shareable link that pre-fills your exact inputs.", icon: DownloadIcon },
  { title: "Works in the dark (or light)", body: "A real dark mode, not an inverted filter — designed for both from the ground up.", icon: MoonIcon },
  { title: "Honest about limitations", body: "When a calculator is a simplified estimate, we say so on the page instead of implying false precision.", icon: CheckCircleIcon },
];

const [featured, ...rest] = POINTS;

export default function WhyChooseUs() {
  return (
    <section className="container-wide py-14">
      <Reveal className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Why Calculateus</h2>
        <p className="mt-1 max-w-lg text-muted">{allCalculators.length}+ calculators, built the way a calculator site should feel.</p>
      </Reveal>

      <Reveal>
        <div className="card-lg flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary">
            <featured.icon width={26} height={26} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{featured.title}</h3>
            <p className="mt-1 text-sm text-muted">{featured.body}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.title} delay={Math.min(i * 0.05, 0.2)}>
            <div className="card flex h-full gap-3 p-5">
              <p.icon width={18} height={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{p.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
