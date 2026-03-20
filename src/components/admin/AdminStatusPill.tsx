interface AdminStatusPillProps {
  label: string;
  active?: boolean;
  tone?: 'green' | 'gray' | 'amber';
}

export default function AdminStatusPill({
  label,
  active = false,
  tone = 'gray',
}: AdminStatusPillProps) {
  const color = active
    ? { backgroundColor: '#00CED1', color: '#FFFFFF' }
    : tone === 'green'
      ? { backgroundColor: '#D1FAE5', color: '#065F46' }
      : tone === 'amber'
        ? { backgroundColor: '#FEF3C7', color: '#92400E' }
        : { backgroundColor: '#F3F4F6', color: '#6B7280' };

  return (
    <span
      className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
      style={color}
    >
      {label}
    </span>
  );
}
