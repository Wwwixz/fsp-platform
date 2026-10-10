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
      className={`avatar${team ? ' avatar-team' : ''}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden
    >
      {initials(name, team)}
    </span>
  );
}
