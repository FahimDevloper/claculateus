import Script from "next/script";

const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("calculateus-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

// beforeInteractive (not a raw <script>) so Next places it in <head> through its own managed channel, avoiding a hydration mismatch with Next's out-of-band head mutation.
export default function ThemeInit() {
  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {THEME_SCRIPT}
    </Script>
  );
}
