import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' 
        ? '/api/jobs/list.php' 
        : `/api/jobs/list.php?status=${filter}`;
      const response = await api.get(endpoint);
      setJobs(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/jobs/delete.php?id=${id}`);
      await loadJobs(); // Reload the list
    } catch (err: any) {
      alert(err.message || 'Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#00CED1' }}>Jobs Management</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>Manage job postings</p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="px-4 py-2 text-white rounded font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#00CED1' }}
        >
          Create New Job
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
              placeholder="Search jobs by title, company, or location..."
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

      {/* Jobs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div style={{ color: '#6B7280' }}>Loading jobs...</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <p style={{ color: '#6B7280' }}>No jobs found</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="min-w-full divide-y" style={{ borderColor: '#E5E5E5' }}>
            <thead style={{ backgroundColor: '#F8F6F0' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                  Company
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: '#00CED1' }}>{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#00CED1' }}>{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#6B7280' }}>{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: '#6B7280' }}>{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={
                        job.status === 'active'
                          ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                          : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                      }
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/jobs/edit/${job.id}`}
                      className="mr-4 hover:underline"
                      style={{ color: '#D4AF37' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
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
