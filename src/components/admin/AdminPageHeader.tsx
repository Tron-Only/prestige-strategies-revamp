import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  badge = 'Management',
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: '#E5E5E5' }}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: '#D4AF37' }}>
            {badge}
          </p>
          <h1 className="text-3xl font-bold mt-1" style={{ color: '#00CED1' }}>{title}</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
