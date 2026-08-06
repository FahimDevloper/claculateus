import { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a3 3 0 0 1 0-6h12" />
      <circle cx="16.5" cy="14" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7.5-4.6-10-9.3C.5 7 2.3 3.5 6 3.5c2 0 3.5 1.1 6 3.6 2.5-2.5 4-3.6 6-3.6 3.7 0 5.5 3.5 4 7.2C19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function SigmaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 5H6l6 7-6 7h12" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function ArrowsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4v13M7 17l-3-3M7 17l3-3" />
      <path d="M17 20V7M17 7l3 3M17 7l-3 3" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-1-1.5L11 21l-2.5-1.5L6 21V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function CategoryIcon({ icon, ...props }: IconProps & { icon: string }) {
  switch (icon) {
    case "wallet":
      return <WalletIcon {...props} />;
    case "receipt":
      return <ReceiptIcon {...props} />;
    case "heart":
      return <HeartIcon {...props} />;
    case "sigma":
      return <SigmaIcon {...props} />;
    case "sparkles":
      return <SparklesIcon {...props} />;
    case "arrows":
      return <ArrowsIcon {...props} />;
    default:
      return <SparklesIcon {...props} />;
  }
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" />
    </svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v13M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c1 3-2 4.5-2 7.5a3.5 3.5 0 0 0 7 0c0-1-.3-2-1-3 1.5.5 3 2.5 3 5.5a7 7 0 1 1-14 0c0-4 2-6 3.5-7.5C9.5 4.5 10.5 3.8 12 3Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2a5 5 0 0 0-5 5c0 3 2 4.5 2 7H8l1 6 1-4h4l1 4 1-6h-1c0-2.5 2-4 2-7a5 5 0 0 0-5-5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v3M9 21h6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m3 0-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7h14Z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" strokeLinejoin="round" />
      <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

export function BoldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4h6a3.5 3.5 0 0 1 0 7H6zM6 11h7a3.5 3.5 0 0 1 0 7H6z" strokeLinejoin="round" />
    </svg>
  );
}

export function ItalicIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 4h7M6 20h7M13.5 4 9.5 20" />
    </svg>
  );
}

export function LinkIcon2(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" />
      <path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" />
    </svg>
  );
}

export function TableIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 16h18M9 4v16" />
    </svg>
  );
}

export function HeadingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4v16M15 4v16M5 12h10" />
      <path d="M19 20v-6.5a1.5 1.5 0 0 1 3 0V15" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.02-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4.02 3.1C6.23 6.86 8.88 4.75 12 4.75Z" />
    </svg>
  );
}

export function LogoMark(props: IconProps) {
  return (
    <svg width={28} height={28} viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path d="M11 12h10M11 16h6M11 20h10" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="23" cy="20" r="2" fill="var(--accent)" stroke="none" />
    </svg>
  );
}
