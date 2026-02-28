import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Clock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  youtube_video_id: string;
  module_order: number;
  duration_minutes: number;
  completed?: boolean;
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useStudentAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    console.log('CoursePlayer: user state:', user ? 'Authenticated' : 'Not authenticated');
    
    if (!user) {
      console.log('CoursePlayer: No user, redirecting to course page');
      navigate('/courses/' + id);
      return;
    }
    
    if (id) {
      loadCourseData();
    }
  }, [id, user]);

  const loadCourseData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('student_token');

      // Check enrollment
      const enrollResponse = await fetch(`/api/enrollments/check.php?course_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const enrollData = await enrollResponse.json();

      if (!enrollData.enrolled) {
        setIsEnrolled(false);
        navigate('/courses/' + id);
        return;
      }

      setIsEnrolled(true);

      // Load course
      const courseResponse = await fetch(`/api/courses/get.php?id=${id}`);
      const courseData = await courseResponse.json();
      setCourse(courseData.data);

      // Load modules
      const modulesResponse = await fetch(`/api/modules/list.php?course_id=${id}`);
      const modulesData = await modulesResponse.json();
      
      // Load progress
      const progressResponse = await fetch(`/api/progress/get.php?course_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const progressData = await progressResponse.json();
      const completedModuleIds = progressData.completed_modules || [];
      
      // Mark completed modules
      const modulesWithProgress = modulesData.data.map((module: Module) => ({
        ...module,
        completed: completedModuleIds.includes(module.id)
      }));
      
      setModules(modulesWithProgress);
      console.log('Loaded modules with progress:', modulesWithProgress);

    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async () => {
    const currentModule = modules[currentModuleIndex];
    if (!currentModule || currentModule.completed) return;

    try {
      const token = localStorage.getItem('student_token');
      
      const response = await fetch('/api/progress/mark_complete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          module_id: currentModule.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Module marked complete!', data);
        
        // Update local state
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].completed = true;
        setModules(updatedModules);

        // Move to next module
        if (currentModuleIndex < modules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1);
        }
      } else {
        console.error('Failed to mark complete:', data.error);
        alert('Failed to mark module as complete. Please try again.');
      }
    } catch (err) {
      console.error('Failed to mark module complete:', err);
      alert('Failed to mark module as complete. Please try again.');
    }
  };

  const currentModule = modules[currentModuleIndex];
  const progress = modules.length > 0 
    ? Math.round((modules.filter(m => m.completed).length / modules.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="text-center">
          <div className="text-lg" style={{ color: '#6B7280' }}>Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course || !isEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="text-center max-w-md bg-white p-8 rounded shadow">
          <p className="mb-4" style={{ color: '#00CED1' }}>{error || 'Unable to load course'}</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium"
            style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div 
        className={`${
          showSidebar ? 'w-80' : 'w-0'
        } border-r overflow-y-auto transition-all duration-300`}
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}
      >
        {showSidebar && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium hover:underline"
                style={{ color: '#00CED1' }}
              >
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
              </Link>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden"
                style={{ color: '#6B7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-lg font-bold mb-2" style={{ color: '#00CED1' }}>{course.title}</h2>
            
            {/* Progress */}
            <div className="mb-6 p-4 bg-white border rounded">
              <div className="flex items-center justify-between text-sm mb-2" style={{ color: '#6B7280' }}>
                <span>Course Progress</span>
                <span className="font-semibold" style={{ color: '#00CED1' }}>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${progress}%`, backgroundColor: '#D4AF37' }}
                />
              </div>
            </div>

            {/* Module List */}
            <div className="space-y-2">
              {modules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => setCurrentModuleIndex(index)}
                  className={`w-full text-left p-3 rounded transition border ${
                    index === currentModuleIndex
                      ? 'border-2'
                      : 'border'
                  }`}
                  style={{
                    backgroundColor: index === currentModuleIndex ? '#F8F6F0' : '#FFFFFF',
                    borderColor: index === currentModuleIndex ? '#00CED1' : '#E5E5E5',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {module.completed ? (
                        <CheckCircle size={20} style={{ color: '#D4AF37' }} />
                      ) : (
                        <Circle size={20} style={{ color: '#6B7280' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1" style={{ color: '#00CED1' }}>{module.title}</p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                        <Clock size={12} />
                        <span>{module.duration_minutes}m</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute top-4 left-4 z-10 p-2 bg-white rounded shadow"
              style={{ color: '#00CED1' }}
            >
              <Menu size={24} />
            </button>
          )}

          {currentModule ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentModule.youtube_video_id}?autoplay=0&rel=0`}
              title={currentModule.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-white text-center">
              <p className="mb-4">No modules available</p>
              <Link to="/dashboard" className="underline">
                Return to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Module Info & Controls */}
        {currentModule && (
          <div className="bg-white p-6 border-t" style={{ borderColor: '#E5E5E5' }}>
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#00CED1' }}>{currentModule.title}</h1>
              <p className="mb-4" style={{ color: '#6B7280' }}>{currentModule.description}</p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                  <span>Module {currentModuleIndex + 1} of {modules.length}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {currentModule.duration_minutes} minutes
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!currentModule.completed && (
                    <button
                      onClick={handleModuleComplete}
                      className="px-4 py-2 rounded font-medium flex items-center gap-2"
                      style={{ backgroundColor: '#D4AF37', color: '#FFFFFF' }}
                    >
                      <CheckCircle size={18} />
                      Mark Complete
                    </button>
                  )}
                  
                  {currentModuleIndex < modules.length - 1 && (
                    <button
                      onClick={() => setCurrentModuleIndex(currentModuleIndex + 1)}
                      className="px-4 py-2 rounded font-medium flex items-center gap-2"
                      style={{ backgroundColor: '#00CED1', color: '#FFFFFF' }}
                    >
                      Next Module
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
