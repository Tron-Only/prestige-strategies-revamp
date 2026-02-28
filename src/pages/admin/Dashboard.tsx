import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalEvents: number;
  upcomingEvents: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    totalEvents: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all jobs and events
      const [allJobs, activeJobs, allEvents] = await Promise.all([
        api.get('/api/jobs/list.php'),
        api.get('/api/jobs/list.php?status=active'),
        api.get('/api/events/list.php'),
      ]);

      // Calculate upcoming events (events with date >= today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = allEvents.data.filter((event: any) => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      });

      setStats({
        totalJobs: allJobs.data.length,
        activeJobs: activeJobs.data.length,
        totalEvents: allEvents.data.length,
        upcomingEvents: upcoming.length,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#00CED1' }}>Dashboard</h1>
        <p className="mt-2" style={{ color: '#6B7280' }}>Overview of your Prestige Strategies platform</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded" style={{ color: '#DC2626' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div style={{ color: '#6B7280' }}>Loading statistics...</div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs"
              value={stats.totalJobs}
              subtitle="All job postings"
              link="/admin/jobs"
              linkText="Manage Jobs"
            />
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              subtitle="Currently published"
              link="/admin/jobs"
              linkText="View Active"
            />
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              subtitle="All events"
              link="/admin/events"
              linkText="Manage Events"
            />
            <StatCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              subtitle="Scheduled events"
              link="/admin/events"
              linkText="View Upcoming"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded shadow-sm p-6 border" style={{ borderColor: '#E5E5E5' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#00CED1' }}>Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/jobs/new"
                className="flex items-center justify-center px-4 py-3 border-0 rounded shadow-sm text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00CED1' }}
              >
                Create New Job
              </Link>
              <Link
                to="/admin/events/new"
                className="flex items-center justify-center px-4 py-3 border rounded shadow-sm text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#D4AF37', color: '#FFFFFF', border: 'none' }}
              >
                Create New Event
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  link: string;
  linkText: string;
}

function StatCard({ title, value, subtitle, link, linkText }: StatCardProps) {
  return (
    <div className="border rounded p-6 bg-white shadow-sm" style={{ borderColor: '#E5E5E5' }}>
      <h3 className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</h3>
      <p className="mt-2 text-4xl font-bold" style={{ color: '#00CED1' }}>{value}</p>
      <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>{subtitle}</p>
      <Link
        to={link}
        className="mt-4 inline-block text-sm font-medium hover:underline"
        style={{ color: '#D4AF37' }}
      >
        {linkText} &rarr;
      </Link>
    </div>
  );
}
