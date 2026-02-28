import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { GraduationCap, PlayCircle, Clock, BookOpen, LogOut } from 'lucide-react';

interface EnrolledCourse {
  id: number;
  course_id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
  duration_hours: number;
  enrolled_at: string;
  progress: number;
}

export default function StudentDashboard() {
  const { user, logout } = useStudentAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');
      
      const response = await fetch('/api/enrollments/my_courses.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        setError(data.error || 'Failed to load courses');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F0' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b" style={{ borderColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" style={{ color: '#00CED1' }}>
                <GraduationCap size={32} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#00CED1' }}>My Learning Dashboard</h1>
                <p style={{ color: '#6B7280' }}>Welcome back, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded font-medium border"
              style={{ color: '#DC2626', borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 rounded mb-6" style={{ color: '#DC2626' }}>
            {error}
          </div>
        )}

        {/* Browse More Courses CTA */}
        <div className="bg-white rounded shadow-sm p-6 mb-8 border" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#00CED1' }}>Explore More Courses</h2>
              <p style={{ color: '#6B7280' }}>
                Discover new skills and expand your knowledge
              </p>
            </div>
            <Link
              to="/courses"
              className="px-6 py-3 rounded font-semibold"
              style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
            >
              Browse Courses
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ color: '#00CED1' }}>My Enrolled Courses</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div style={{ color: '#6B7280' }}>Loading your courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded shadow-sm p-12 text-center">
            <GraduationCap className="mx-auto h-16 w-16 mb-4" style={{ color: '#D4AF37' }} />
            <p className="text-lg font-medium mb-2" style={{ color: '#00CED1' }}>No enrolled courses yet</p>
            <p className="mb-6" style={{ color: '#6B7280' }}>Start learning by enrolling in a course</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
              style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
            >
              <BookOpen size={18} />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/learn/${course.course_id}`}
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-48 flex items-center justify-center" style={{ backgroundColor: '#F4E4C1' }}>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-20 w-20" style={{ color: '#D4AF37' }} />
                  )}
                  
                  {/* Progress overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 px-4 py-2 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <div className="flex items-center justify-between text-sm mb-1" style={{ color: '#00CED1' }}>
                      <span className="font-medium">{Math.round(course.progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%`, backgroundColor: '#D4AF37' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                      {course.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded font-medium capitalize" style={{ backgroundColor: '#F8F6F0', color: '#6B7280' }}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#00CED1' }}>
                    {course.title}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                      <Clock size={16} />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium" style={{ color: '#00CED1' }}>
                      <PlayCircle size={16} />
                      <span>Continue Learning</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
