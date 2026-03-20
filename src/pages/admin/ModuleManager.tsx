import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Plus, Trash2, Video } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface Module {
  id: number;
  title: string;
  description: string;
  youtube_video_id: string;
  module_order: number;
  duration_minutes: number;
}

interface Course {
  id: number;
  title: string;
}

export default function ModuleManager() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    youtube_video_id: '',
    duration_minutes: 0,
  });

  useEffect(() => {
    if (id) {
      loadCourseAndModules();
    }
  }, [id]);

  const loadCourseAndModules = async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Load course details
      const courseResponse = await api.get(`/api/courses/get.php?id=${id}`);
      setCourse(courseResponse.data);

      // Load modules
      const modulesResponse = await api.get(`/api/modules/list.php?course_id=${id}`);
      setModules(modulesResponse.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const moduleData = {
        course_id: parseInt(id),
        ...newModule,
        module_order: modules.length + 1,
      };

      await api.post('/api/modules/create.php', moduleData);
      
      // Reset form
      setNewModule({
        title: '',
        description: '',
        youtube_video_id: '',
        duration_minutes: 0,
      });
      setShowAddForm(false);
      
      // Reload modules
      await loadCourseAndModules();
    } catch (err: any) {
      alert(err.message || 'Failed to add module');
    }
  };

  const handleDeleteModule = async (moduleId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/modules/delete.php?id=${moduleId}`);
      await loadCourseAndModules();
    } catch (err: any) {
      alert(err.message || 'Failed to delete module');
    }
  };

  const extractYouTubeId = (url: string): string => {
    // Extract YouTube video ID from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return url; // Return as-is if no pattern matches
  };

  const handleYouTubeUrlChange = (value: string) => {
    const videoId = extractYouTubeId(value);
    setNewModule(prev => ({ ...prev, youtube_video_id: videoId }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading course modules...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Course not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Manage Course Modules"
        description={course.title}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2.5 rounded-lg border font-medium"
              style={{ borderColor: '#E5E5E5', color: '#6B7280', backgroundColor: '#FFFFFF' }}
            >
              Back to Courses
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium"
              style={{ backgroundColor: '#00CED1' }}
            >
              <Plus size={18} />
              Add Module
            </button>
          </div>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add Module Form */}
      {showAddForm && (
        <form onSubmit={handleAddModule} className="bg-white rounded-xl border shadow-sm p-6 space-y-4" style={{ borderColor: '#E5E5E5' }}>
          <h3 className="text-lg font-semibold" style={{ color: '#00CED1' }}>Add New Module</h3>

          <div>
            <label htmlFor="module-title" className="block text-sm font-medium text-gray-700">
              Module Title *
            </label>
            <input
              type="text"
              id="module-title"
              required
              value={newModule.title}
              onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
               className="mt-1 block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
               style={{ borderColor: '#E5E5E5' }}
              placeholder="e.g., Introduction to React Hooks"
            />
          </div>

          <div>
            <label htmlFor="module-description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="module-description"
              required
              rows={3}
              value={newModule.description}
              onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
               className="mt-1 block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
               style={{ borderColor: '#E5E5E5' }}
              placeholder="Brief description of what this module covers..."
            />
          </div>

          <div>
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700">
              YouTube Video URL or ID *
            </label>
            <input
              type="text"
              id="youtube-url"
              required
              value={newModule.youtube_video_id}
              onChange={(e) => handleYouTubeUrlChange(e.target.value)}
               className="mt-1 block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
               style={{ borderColor: '#E5E5E5' }}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
            />
            <p className="mt-1 text-sm text-gray-500">
              Paste the full YouTube URL or just the video ID
            </p>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              required
              min="1"
              value={newModule.duration_minutes}
              onChange={(e) => setNewModule(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
               className="mt-1 block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:outline-none"
               style={{ borderColor: '#E5E5E5' }}
              placeholder="e.g., 15"
            />
          </div>

          {/* Preview */}
          {newModule.youtube_video_id && newModule.youtube_video_id.length === 11 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${newModule.youtube_video_id}`}
                  title="YouTube video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

           <div className="flex items-center justify-end space-x-4 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewModule({ title: '', description: '', youtube_video_id: '', duration_minutes: 0 });
              }}
               className="px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
               style={{ borderColor: '#E5E5E5' }}
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2.5 text-white rounded-lg font-medium"
               style={{ backgroundColor: '#00CED1' }}
             >
               Add Module
             </button>
          </div>
        </form>
      )}

      {/* Modules List */}
      {modules.length === 0 ? (
         <div className="bg-white rounded-xl border shadow-sm p-12 text-center" style={{ borderColor: '#E5E5E5' }}>
          <Video size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No modules yet</p>
          <p className="text-gray-400 mt-2">Add video modules to build your course content</p>
        </div>
      ) : (
         <div className="bg-white rounded-xl border shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Course Modules ({modules.length})
            </h3>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                   className="flex items-start gap-4 p-4 border rounded-lg transition"
                   style={{ borderColor: '#E5E5E5' }}
                 >
                  {/* Order number */}
                   <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: '#F4E4C1', color: '#00CED1' }}>
                     {index + 1}
                   </div>

                  {/* Module info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900">{module.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Video ID: {module.youtube_video_id}</span>
                      <span>Duration: {module.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                     <button
                       onClick={() => handleDeleteModule(module.id, module.title)}
                       className="p-2 rounded-md transition"
                       style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}
                       title="Delete module"
                     >
                       <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-xl p-4 border" style={{ backgroundColor: '#F4E4C1', borderColor: '#E5E5E5', color: '#1F2937' }}>
        <p className="text-sm">
          <strong>Tip:</strong> Modules will be displayed in the order they are added. Students will watch them sequentially.
        </p>
      </div>
    </div>
  );
}
