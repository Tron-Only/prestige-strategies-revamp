import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  status: 'draft' | 'published' | 'archived';
}

export default function CourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    currency: 'KES',
    thumbnail: '',
    category: '',
    level: 'beginner',
    duration_hours: 0,
    status: 'draft',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCourse, setLoadingCourse] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      loadCourse(id);
    }
  }, [id, isEdit]);

  const loadCourse = async (courseId: string) => {
    try {
      setLoadingCourse(true);
      const response = await api.get(`/api/courses/get.php?id=${courseId}`);
      setFormData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoadingCourse(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/api/courses/update.php?id=${id}`, formData);
      } else {
        await api.post('/api/courses/create.php', formData);
      }
      navigate('/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit ? 'Update course details' : 'Add a new course to the catalog'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Course Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Course Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Complete Web Development Bootcamp"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Course Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what students will learn in this course..."
          />
        </div>

        {/* Category and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Web Development, Data Science"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level *
            </label>
            <select
              id="level"
              name="level"
              required
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5000"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency *
            </label>
            <select
              id="currency"
              name="currency"
              required
              value={formData.currency}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700">
              Duration (hours) *
            </label>
            <input
              type="number"
              id="duration_hours"
              name="duration_hours"
              required
              min="0"
              step="0.5"
              value={formData.duration_hours}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: URL to course thumbnail image (recommended 16:9 ratio)
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Only published courses will be visible to students
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>

      {isEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Next step:</strong> After saving, add video modules to this course from the Courses list.
          </p>
        </div>
      )}
    </div>
  );
}
