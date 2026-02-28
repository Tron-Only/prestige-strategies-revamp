import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { GraduationCap, Clock, BarChart3, Tag } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  category: string;
  level: string;
  duration_hours: number;
  status: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses/list.php?status=published');
      setCourses(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(courses.map(c => c.category)));
  const levels = ['beginner', 'intermediate', 'advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'intermediate':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'advanced':
        return { backgroundColor: '#F3E8FF', color: '#6B21A8' };
      default:
        return { backgroundColor: '#F8F6F0', color: '#6B7280' };
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F0' }}>
      {/* Hero Section */}
      <div className="bg-white border-b py-16" style={{ borderColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="mx-auto h-16 w-16 mb-4" style={{ color: '#D4AF37' }} />
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#00CED1' }}>Online Courses</h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Learn new skills and advance your career with our expert-led courses
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 rounded mb-6" style={{ color: '#DC2626' }}>
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:outline-none"
                style={{ borderColor: '#E5E5E5' }}
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level} className="capitalize">{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p style={{ color: '#6B7280' }}>
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div style={{ color: '#6B7280' }}>Loading courses...</div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded shadow-sm p-12 text-center">
            <GraduationCap className="mx-auto h-16 w-16 mb-4" style={{ color: '#D4AF37' }} />
            <p className="text-lg" style={{ color: '#00CED1' }}>No courses found</p>
            <p className="mt-2" style={{ color: '#6B7280' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#F4E4C1' }}>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-20 w-20" style={{ color: '#D4AF37' }} />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                      <Tag size={12} />
                      {course.category}
                    </span>
                    <span 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded capitalize"
                      style={getLevelColor(course.level)}
                    >
                      <BarChart3 size={12} />
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#00CED1' }}>
                    {course.title}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-3" style={{ color: '#6B7280' }}>
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
                      <Clock size={16} />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: '#00CED1' }}>
                        {course.currency} {course.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length > 0 && (
          <div className="mt-12 bg-white border rounded p-6 text-center" style={{ borderColor: '#E5E5E5' }}>
            <p style={{ color: '#00CED1' }}>
              <strong>Ready to start learning?</strong> Click on any course to view details and enroll with M-Pesa payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
