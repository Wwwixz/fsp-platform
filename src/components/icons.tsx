import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  };
}

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

export const ClipboardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="4.5" width="14" height="17" rx="2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M9 10h6M9 14h6M9 18h3.5" />
  </svg>
);

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4v16h16" />
    <path d="M8 16v-5M12.5 16V8M17 16v-3" />
  </svg>
);

export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7" />
    <path d="M15.5 5.7a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.5 15.2c1.7.6 2.7 2 3 4.3" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19 12c0-.6.4-1.2 1-1.6-.3-1.2-.8-2.3-1.6-3.2-.5.3-1.2.3-1.7 0a1.8 1.8 0 0 1-.9-1.5c-1.2-.3-2.4-.3-3.6 0 0 .6-.3 1.2-.9 1.5-.5.3-1.2.3-1.7 0-.8.9-1.3 2-1.6 3.2.6.4 1 1 1 1.6s-.4 1.2-1 1.6c.3 1.2.8 2.3 1.6 3.2.5-.3 1.2-.3 1.7 0 .6.3.9.9.9 1.5 1.2.3 2.4.3 3.6 0 0-.6.4-1.2.9-1.5.5-.3 1.2-.3 1.7 0 .8-.9 1.3-2 1.6-3.2-.6-.4-1-1-1-1.6Z" />
  </svg>
);

export const AwardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="5" />
    <path d="M9 13.5 7.5 21l4.5-2.5L16.5 21 15 13.5" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2" />
  </svg>
);

export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 9.5a6 6 0 1 0-12 0c0 4.5-1.8 5.5-1.8 5.5h15.6S18 14 18 9.5" />
    <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const EyeOffIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4.5 20 19.5" />
    <path d="M9.9 6.1A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-3.2 3.9M14.5 17.9a9.4 9.4 0 0 1-2.5.6C6 18.5 2.5 12 2.5 12a17.7 17.7 0 0 1 3.8-4.3" />
    <path d="M10.1 10.3a2.8 2.8 0 0 0 3.8 3.9" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const DotsIcon = (p: IconProps) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <circle cx="5.5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="18.5" cy="12" r="1.6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.6, ...p })}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.2, ...p })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);

export const ZapIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
  </svg>
);

export const CodeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m8.5 8-4.5 4 4.5 4" />
    <path d="m15.5 8 4.5 4-4.5 4" />
    <path d="m13.5 5-3 14" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l7 2.8v5.4c0 4.5-3 7.9-7 9.3-4-1.4-7-4.8-7-9.3V5.8L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base({ strokeWidth: 2.2, ...p })}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 1.8" />
  </svg>
);

export const BuildingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20.5h16" />
    <path d="M6 20.5V4.5h8v16" />
    <path d="M14 9.5h4v11" />
    <path d="M9 8.5h2M9 12h2M9 15.5h2" />
    <path d="M16 13h.01M16 16.5h.01" />
  </svg>
);

export const LogoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 4.5H6.5v15H14" />
    <path d="M10.5 12H21m0 0-3-3m3 3-3 3" />
  </svg>
);

export const GitHubIcon = (p: IconProps) => (
  <svg width={p.size ?? 28} height={p.size ?? 28} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const TrophyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4.5A1.5 1.5 0 0 0 3 7.5C3 10 5 12 7 12M17 6h2.5A1.5 1.5 0 0 1 21 7.5C21 10 19 12 17 12" />
  </svg>
);
