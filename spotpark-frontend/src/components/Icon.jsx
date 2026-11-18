// Minimal line icon set (24×24, stroke-based) so we don't depend on an icon library.
const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  card: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19M6.5 15h4" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></>,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  wallet: <><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v4" /><rect x="4" y="7.5" width="16.5" height="12" rx="2.5" /><circle cx="16" cy="13.5" r="1.2" /></>,
  map: <><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" /><path d="M9 4v14M15 6v14" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  document: <><path d="M6.5 3.5h7l4 4v13h-11z" /><path d="M13.5 3.5v4h4M9 12h6M9 15.5h6" /></>,
  car: <><path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5" /><path d="M3.5 12h17v4.5h-17zM7 16.5V19M17 16.5V19" /><circle cx="7.5" cy="14.2" r=".6" /><circle cx="16.5" cy="14.2" r=".6" /></>,
  bolt: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z" />,
  leaf: <><path d="M5 19c0-8 5-13.5 15-14-.5 10-6 15-14 15" /><path d="M5 19c3-4 6-6.5 9.5-8.5" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>,
  heart: <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10Z" />,
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  parking: <><circle cx="12" cy="12" r="8.5" /><path d="M10 16.5v-9h2.8a2.6 2.6 0 0 1 0 5.2H10" /></>,
  camera: <><path d="M4 8.5A2 2 0 0 1 6 6.5h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5Z" /><circle cx="12" cy="13" r="3.5" /></>,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowDown: <path d="M12 5v14m-6-6 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className = '', filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
