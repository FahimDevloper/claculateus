const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("calculateus-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
