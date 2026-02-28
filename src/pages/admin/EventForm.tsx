import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  description: string;
  registration_url: string;
  status: 'active' | 'inactive';
}

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    event_type: 'Workshop',
    description: '',
    registration_url: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      loadEvent(id);
    }
  }, [id, isEdit]);

  const loadEvent = async (eventId: string) => {
    try {
      setLoadingEvent(true);
      const response = await api.get(`/api/events/get.php?id=${eventId}`);
      setFormData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/api/events/update.php?id=${id}`, formData);
      } else {
        await api.post('/api/events/create.php', formData);
      }
      navigate('/admin/events');
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loadingEvent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading event...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit ? 'Update event details' : 'Add a new event or workshop'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., Career Development Workshop"
          />
        </div>

        {/* Date, Time, and Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
              Event Type *
            </label>
            <select
              id="event_type"
              name="event_type"
              required
              value={formData.event_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Webinar">Webinar</option>
              <option value="Conference">Conference</option>
              <option value="Training">Training</option>
              <option value="Networking">Networking</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., Nairobi Convention Center or Online (Zoom)"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Event Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Describe the event, agenda, speakers, and what attendees will learn..."
          />
        </div>

        {/* Registration URL */}
        <div>
          <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700">
            Registration URL *
          </label>
          <input
            type="url"
            id="registration_url"
            name="registration_url"
            required
            value={formData.registration_url}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="https://example.com/register"
          />
          <p className="mt-1 text-sm text-gray-500">
            URL where users can register for this event
          </p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Active events will be visible on the public Events page
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
