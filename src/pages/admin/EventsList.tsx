import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminListToolbar from '@/components/admin/AdminListToolbar';
import AdminStatusPill from '@/components/admin/AdminStatusPill';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  event_type: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' 
        ? '/api/events/list.php' 
        : `/api/events/list.php?status=${filter}`;
      const response = await api.get(endpoint);
      setEvents(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/events/delete.php?id=${id}`);
      await loadEvents(); // Reload the list
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events Management"
        description="Manage events and workshops"
        actions={
          <Link
            to="/admin/events/new"
            className="px-4 py-2.5 text-white rounded-lg font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Create New Event
          </Link>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded" style={{ color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <AdminListToolbar
        searchPlaceholder="Search events by title, location, or type..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2.5 rounded-lg font-medium transition-opacity"
              style={
                filter === 'all'
                  ? { backgroundColor: '#00CED1', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className="px-4 py-2.5 rounded-lg font-medium transition-opacity"
              style={
                filter === 'active'
                  ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className="px-4 py-2.5 rounded-lg font-medium transition-opacity"
              style={
                filter === 'inactive'
                  ? { backgroundColor: '#6B7280', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Inactive
            </button>
          </>
        }
      />

      {/* Events Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div style={{ color: '#6B7280' }}>Loading events...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <p style={{ color: '#6B7280' }}>No events found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border" style={{ borderColor: '#E5E5E5' }}>
          <table className="min-w-full divide-y" style={{ borderColor: '#E5E5E5' }}>
            <thead style={{ backgroundColor: '#F8F6F0' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Event Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y" style={{ borderColor: '#E5E5E5' }}>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: '#00CED1' }}>{event.title}</div>
                    {isUpcoming(event.date) && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                        Upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#00CED1' }}>{formatDate(event.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#6B7280' }}>{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#6B7280' }}>{event.event_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdminStatusPill label={event.status} tone={event.status === 'active' ? 'green' : 'gray'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="mr-4 hover:underline"
                      style={{ color: '#D4AF37' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="hover:underline"
                      style={{ color: '#DC2626' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
