interface AvatarProps {
  name: string;
  size?: number;
  team?: boolean;
}

function initials(name: string, team: boolean) {
  const words = team ? name.replace(/^Команда\s+/i, '').split(/\s+/) : name.split(/\s+/);
  return words
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, size = 40, team = false }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold leading-none ring-1 ${
        team
          ? 'bg-gradient-to-br from-violet-500/30 to-indigo-600/30 text-violet-200 ring-violet-400/30'
          : 'bg-gradient-to-br from-indigo-500/30 to-purple-600/30 text-indigo-200 ring-indigo-400/30'
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden
    >
      {initials(name, team)}
    </span>
  );
}
