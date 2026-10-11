interface LogoProps {
  light?: boolean;
}

export function Logo({ light = false }: LogoProps) {
  const textColor = light ? '#ffffff' : 'var(--navy)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: '0.5px',
        color: textColor,
        lineHeight: 1,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <path d="M16 3l10 5.7v11.6L16 26 6 20.3V8.7L16 3z" fill={light ? 'rgba(255,255,255,0.35)' : '#93b4f5'} />
        <path d="M16 3l10 5.7-10 5.6-10-5.6L16 3z" fill={light ? 'rgba(255,255,255,0.6)' : '#3b82f6'} />
        <path d="M16 14.3l10-5.6v11.6L16 26V14.3z" fill={light ? '#ffffff' : '#1e3a8a'} />
        <path d="M16 14.3L6 8.7v11.6L16 26V14.3z" fill={light ? '#dbe7ff' : '#1d4ed8'} />
        <path d="M13 8.5l6 3.4v3l-6-3.4v-3z" fill={light ? '#1d4ed8' : '#dbeafe'} opacity={light ? 0.9 : 0.9} />
      </svg>
      ФСП
    </span>
  );
}
