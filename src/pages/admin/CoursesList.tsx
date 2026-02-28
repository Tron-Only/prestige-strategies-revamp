import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  duration_hours: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, [filter]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' 
        ? '/api/courses/list.php' 
        : `/api/courses/list.php?status=${filter}`;
      const response = await api.get(endpoint);
      setCourses(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/courses/delete.php?id=${id}`);
      await loadCourses(); // Reload the list
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'draft':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'archived':
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#00CED1' }}>Courses Management</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>Manage courses and modules</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="px-4 py-2 text-white rounded font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#00CED1' }}
        >
          Create New Course
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
              placeholder="Search courses by title, category, or level..."
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
              onClick={() => setFilter('published')}
              className="px-4 py-2 rounded font-medium transition-opacity"
              style={
                filter === 'published'
                  ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className="px-4 py-2 rounded font-medium transition-opacity"
              style={
                filter === 'draft'
                  ? { backgroundColor: '#F59E0B', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Draft
            </button>
            <button
              onClick={() => setFilter('archived')}
              className="px-4 py-2 rounded font-medium transition-opacity"
              style={
                filter === 'archived'
                  ? { backgroundColor: '#6B7280', color: '#FFFFFF' }
                  : { backgroundColor: '#F8F6F0', color: '#6B7280' }
              }
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div style={{ color: '#6B7280' }}>Loading courses...</div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <p style={{ color: '#6B7280' }}>No courses found</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="min-w-full divide-y" style={{ borderColor: '#E5E5E5' }}>
            <thead style={{ backgroundColor: '#F8F6F0' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Duration
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
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium" style={{ color: '#00CED1' }}>{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#00CED1' }}>{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm capitalize" style={{ color: '#6B7280' }}>{course.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#00CED1' }}>
                      {course.currency} {course.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#6B7280' }}>{course.duration_hours}h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={getStatusColor(course.status)}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="mr-4 hover:underline"
                      style={{ color: '#D4AF37' }}
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/courses/${course.id}/modules`}
                      className="mr-4 hover:underline"
                      style={{ color: '#00CED1' }}
                    >
                      Modules
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
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
