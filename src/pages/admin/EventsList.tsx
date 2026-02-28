import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#00CED1' }}>Events Management</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>Manage events and workshops</p>
        </div>
        <Link
          to="/admin/events/new"
          className="px-4 py-2 text-white rounded font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#D4AF37' }}
        >
          Create New Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded" style={{ color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded shadow-sm p-6" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events by title, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:outline-none"
              style={{ borderColor: '#E5E5E5' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded font-medium transition-opacity"
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
              className="px-4 py-2 rounded font-medium transition-opacity"
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
              className="px-4 py-2 rounded font-medium transition-opacity"
              style={
                filter === 'inactive'
                  ? { backgroundColor: '#6B7280', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

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
        <div className="bg-white rounded shadow-sm overflow-hidden">
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
                    <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={
                        event.status === 'active'
                          ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                          : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                      }
                    >
                      {event.status}
                    </span>
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
