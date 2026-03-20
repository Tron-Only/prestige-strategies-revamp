import type { ReactNode } from 'react';

interface AdminListToolbarProps {
  searchPlaceholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
}

export default function AdminListToolbar({
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  filters,
}: AdminListToolbarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border" style={{ borderColor: '#E5E5E5' }}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none"
            style={{ borderColor: '#E5E5E5' }}
          />
        </div>
        {filters ? <div className="flex gap-2">{filters}</div> : null}
      </div>
    </div>
  );
}
