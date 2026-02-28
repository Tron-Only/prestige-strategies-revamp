import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import MpesaModal from '@/components/payment/MpesaModal';
import { 
  GraduationCap, 
  Clock, 
  BarChart3, 
  Tag, 
  CheckCircle, 
  PlayCircle,
  ArrowLeft 
} from 'lucide-react';

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
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  module_order: number;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useStudentAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseDetails();
    }
  }, [id]);

  // Check enrollment status when user logs in
  useEffect(() => {
    if (isAuthenticated && user && id && !checkingEnrollment) {
      checkEnrollmentStatus();
    }
  }, [isAuthenticated, user, id]);

  const checkEnrollmentStatus = async () => {
    if (!id || checkingEnrollment) return;
    
    try {
      setCheckingEnrollment(true);
      const token = localStorage.getItem('student_token');
      
      const response = await fetch(`/api/enrollments/check.php?course_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.enrolled) {
        console.log('User is already enrolled! Redirecting to course player...');
        navigate(`/learn/${id}`);
      }
    } catch (err) {
      console.error('Failed to check enrollment:', err);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const loadCourseDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const courseResponse = await api.get(`/api/courses/get.php?id=${id}`);
      setCourse(courseResponse.data);

      // Load modules
      const modulesResponse = await api.get(`/api/modules/list.php?course_id=${id}`);
      setModules(modulesResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      // Show Google Sign-In modal
      setShowEnrollModal(true);
    } else {
      // User is already logged in, check if they're enrolled
      try {
        const token = localStorage.getItem('student_token');
        const response = await fetch(`/api/enrollments/check.php?course_id=${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.enrolled) {
          // Already enrolled, go to player
          console.log('User already enrolled! Redirecting to player...');
          navigate(`/learn/${id}`);
        } else {
          // Not enrolled, show payment modal
          setShowPaymentModal(true);
        }
      } catch (err) {
        console.error('Failed to check enrollment:', err);
        // On error, just show payment modal
        setShowPaymentModal(true);
      }
    }
  };

  const handleSignInSuccess = async () => {
    console.log('Sign-in success! Checking enrollment status...');
    
    // Close sign-in modal first
    setShowEnrollModal(false);
    
    // Check if user is already enrolled in THIS course
    try {
      const token = localStorage.getItem('student_token');
      const response = await fetch(`/api/enrollments/check.php?course_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.enrolled) {
        // Already enrolled! Redirect to course player
        console.log('User already enrolled in this course! Redirecting to player...');
        navigate(`/learn/${id}`);
      } else {
        // Not enrolled, show payment modal
        console.log('User not enrolled yet, showing payment modal...');
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error('Failed to check enrollment:', err);
      // On error, just show payment modal as fallback
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to course player
    window.location.href = `/learn/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F6F0' }}>
        <div style={{ color: '#6B7280' }}>Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 px-4 py-3 rounded" style={{ color: '#DC2626' }}>
            {error || 'Course not found'}
          </div>
          <Link to="/courses" className="inline-flex items-center gap-2 mt-4 hover:underline" style={{ color: '#00CED1' }}>
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F0' }}>
      {/* Hero Section */}
      <div className="bg-white border-b" style={{ borderColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/courses" className="inline-flex items-center gap-2 mb-8 hover:underline font-medium" style={{ color: '#00CED1' }}>
            <ArrowLeft size={20} />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                  <Tag size={16} />
                  {course.category}
                </span>
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded capitalize"
                  style={getLevelColor(course.level)}
                >
                  <BarChart3 size={16} />
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: '#00CED1' }}>{course.title}</h1>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: '#6B7280' }}>{course.description}</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                  <Clock size={20} />
                  <span className="font-medium">{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                  <PlayCircle size={20} />
                  <span className="font-medium">{modules.length} modules</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow-sm p-6 border" style={{ borderColor: '#E5E5E5' }}>
                {/* Thumbnail */}
                <div className="mb-6 rounded overflow-hidden h-48 flex items-center justify-center" style={{ backgroundColor: '#F4E4C1' }}>
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

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-extrabold mb-1" style={{ color: '#00CED1' }}>
                    {course.currency} {course.price.toLocaleString()}
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#6B7280' }}>One-time payment • Lifetime access</p>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnrollClick}
                  disabled={checkingEnrollment}
                  className="w-full py-3 px-6 rounded font-bold text-white hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#00CED1' }}
                >
                  {checkingEnrollment ? 'Checking...' : 'Enroll Now'}
                </button>

                <p className="text-xs text-center flex items-center justify-center gap-1.5" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                  Pay via M-Pesa and get instant access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You'll Learn */}
            <div className="bg-white rounded shadow-sm p-6 border" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#00CED1' }}>
                What You'll Learn
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} style={{ color: '#10B981' }} />
                  <p style={{ color: '#6B7280' }}>Master the fundamentals and advanced concepts</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} style={{ color: '#10B981' }} />
                  <p style={{ color: '#6B7280' }}>Build real-world projects from scratch</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={20} style={{ color: '#10B981' }} />
                  <p style={{ color: '#6B7280' }}>Get hands-on experience with industry tools</p>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded shadow-sm p-6 border" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#00CED1' }}>
                Course Curriculum
              </h2>
              
              {modules.length === 0 ? (
                <p className="text-center py-8" style={{ color: '#6B7280' }}>
                  Course modules will be available after enrollment
                </p>
              ) : (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-start gap-3 p-4 border rounded hover:shadow-sm transition-shadow"
                      style={{ borderColor: '#E5E5E5' }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1" style={{ color: '#00CED1' }}>{module.title}</h3>
                        <p className="text-sm" style={{ color: '#6B7280' }}>{module.description}</p>
                      </div>
                      <div className="text-sm flex items-center gap-1 font-medium" style={{ color: '#6B7280' }}>
                        <Clock size={16} />
                        {module.duration_minutes}m
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow-sm p-6 sticky top-6 border" style={{ borderColor: '#E5E5E5' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#00CED1' }}>
                <CheckCircle size={20} />
                Course Includes
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={18} style={{ color: '#10B981' }} />
                  <span style={{ color: '#6B7280' }}>{course.duration_hours} hours of video content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={18} style={{ color: '#10B981' }} />
                  <span style={{ color: '#6B7280' }}>Full lifetime access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={18} style={{ color: '#10B981' }} />
                  <span style={{ color: '#6B7280' }}>Access on mobile and desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={18} style={{ color: '#10B981' }} />
                  <span style={{ color: '#6B7280' }}>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Google Sign-In Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-8 max-w-md w-full shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#F4E4C1' }}>
                <GraduationCap className="h-8 w-8" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#00CED1' }}>Sign In to Enroll</h3>
              <p style={{ color: '#6B7280' }}>
                Create an account or sign in with Google to enroll in this course.
              </p>
            </div>
            <GoogleSignIn 
              onSuccess={handleSignInSuccess}
              onError={(error) => console.error('Sign-in error:', error)}
            />
            <button
              onClick={() => setShowEnrollModal(false)}
              className="w-full mt-4 px-6 py-3 border rounded font-semibold transition-colors"
              style={{ borderColor: '#E5E5E5', color: '#6B7280' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* M-Pesa Payment Modal */}
      {course && showPaymentModal && (
        <MpesaModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          courseId={course.id}
          courseTitle={course.title}
          amount={course.price}
          currency={course.currency}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
