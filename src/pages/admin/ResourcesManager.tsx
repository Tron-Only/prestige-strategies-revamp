import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';

interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  fileName?: string;
  category?: string;
  tags?: string[];
  size?: string;
  url?: string;
  date?: string;
}

const emptyResource = (): ResourceItem => ({
  id: String(Date.now()),
  title: '',
  description: '',
  fileName: '',
  category: '',
  tags: [],
  size: '',
  url: '',
  date: '',
});

export default function ResourcesManager() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [initialResources, setInitialResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newResource, setNewResource] = useState<ResourceItem>(emptyResource());

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/resources/list.php');
      const data = Array.isArray(response.data) ? response.data : [];
      setResources(data);
      setInitialResources(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((resource) => {
      const tags = resource.tags?.join(' ').toLowerCase() || '';
      return (
        resource.title.toLowerCase().includes(q) ||
        (resource.category || '').toLowerCase().includes(q) ||
        (resource.fileName || '').toLowerCase().includes(q) ||
        tags.includes(q)
      );
    });
  }, [resources, searchTerm]);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(resources) !== JSON.stringify(initialResources),
    [resources, initialResources],
  );

  const totalCategories = useMemo(() => {
    const categories = new Set(
      resources
        .map((resource) => (resource.category || '').trim())
        .filter((category) => category.length > 0),
    );
    return categories.size;
  }, [resources]);

  const handleChange = (
    index: number,
    field: keyof ResourceItem,
    value: string | string[],
  ) => {
    setResources((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSuccess('');
  };

  const handleAddResource = () => {
    const entry: ResourceItem = {
      ...newResource,
      id: (newResource.id || String(Date.now())).trim(),
      title: (newResource.title || '').trim(),
      description: (newResource.description || '').trim(),
      fileName: (newResource.fileName || '').trim(),
      category: (newResource.category || '').trim(),
      size: (newResource.size || '').trim(),
      url: (newResource.url || '').trim(),
      date: (newResource.date || '').trim(),
      tags: (newResource.tags || []).map((tag) => tag.trim()).filter(Boolean),
    };

    if (!entry.title) {
      setError('New resource title is required.');
      return;
    }

    setResources((prev) => [...prev, entry]);
    setNewResource(emptyResource());
    setError('');
    setSuccess('');
  };

  const handleDeleteResource = (index: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    setResources((prev) => prev.filter((_, i) => i !== index));
    setSuccess('');
  };

  const handleReset = () => {
    setResources(initialResources);
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const cleaned = resources.map((resource, index) => {
        const tags = (resource.tags || [])
          .map((tag) => tag.trim())
          .filter(Boolean);
        return {
          ...resource,
          id: (resource.id || String(index + 1)).trim(),
          title: (resource.title || '').trim(),
          description: (resource.description || '').trim(),
          fileName: (resource.fileName || '').trim(),
          category: (resource.category || '').trim(),
          size: (resource.size || '').trim(),
          url: (resource.url || '').trim(),
          date: (resource.date || '').trim(),
          tags,
        };
      });

      await api.put('/api/resources/update.php', { resources: cleaned });
      setResources(cleaned);
      setInitialResources(cleaned);
      setSuccess('Resources saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to save resources');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div style={{ color: '#6B7280' }}>Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border p-6" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-semibold" style={{ color: '#D4AF37' }}>
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold mt-1" style={{ color: '#00CED1' }}>
              Resources Management
            </h1>
            <p className="mt-2" style={{ color: '#6B7280' }}>
              Manage entries in `public/resources.json` with controlled, consistent updates.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-0">
            <SummaryCard label="Total Resources" value={String(resources.length)} />
            <SummaryCard label="Categories" value={String(totalCategories)} />
            <SummaryCard label="Visible" value={String(filteredResources.length)} />
            <SummaryCard
              label="Status"
              value={hasUnsavedChanges ? 'Draft' : 'Synced'}
              accent={hasUnsavedChanges ? '#D4AF37' : '#00CED1'}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border p-4" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: '#6B7280' }}>
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, category, filename, or tags..."
              className="w-full px-4 py-2.5 border focus:ring-2 focus:outline-none"
              style={{ borderColor: '#E5E5E5' }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadResources}
              className="px-4 py-2.5 font-medium border"
              style={{ borderColor: '#E5E5E5', color: '#6B7280', backgroundColor: '#FFFFFF' }}
            >
              Reload
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2.5 font-medium border disabled:opacity-50"
              style={{ borderColor: '#E5E5E5', color: '#6B7280', backgroundColor: '#FFFFFF' }}
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="px-4 py-2.5 text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#00CED1' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border p-6" style={{ borderColor: '#E5E5E5' }}>
        <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: '#D4AF37' }}>
          Quick Add
        </p>
        <h2 className="text-lg font-semibold mt-1" style={{ color: '#00CED1' }}>
          Add New Resource
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="ID">
            <input
              type="text"
              value={newResource.id}
              onChange={(e) => setNewResource((prev) => ({ ...prev, id: e.target.value }))}
              className="w-full px-3 py-2.5 border"
              style={{ borderColor: '#E5E5E5' }}
            />
          </FormField>
          <FormField label="Title">
            <input
              type="text"
              value={newResource.title}
              onChange={(e) => setNewResource((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2.5 border"
              style={{ borderColor: '#E5E5E5' }}
            />
          </FormField>
          <FormField label="File Name">
            <input
              type="text"
              value={newResource.fileName || ''}
              onChange={(e) => setNewResource((prev) => ({ ...prev, fileName: e.target.value }))}
              className="w-full px-3 py-2.5 border"
              style={{ borderColor: '#E5E5E5' }}
            />
          </FormField>
          <FormField label="Category">
            <input
              type="text"
              value={newResource.category || ''}
              onChange={(e) => setNewResource((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2.5 border"
              style={{ borderColor: '#E5E5E5' }}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Tags (comma separated)">
              <input
                type="text"
                value={(newResource.tags || []).join(', ')}
                onChange={(e) =>
                  setNewResource((prev) => ({
                    ...prev,
                    tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                  }))
                }
                className="w-full px-3 py-2.5 border"
                style={{ borderColor: '#E5E5E5' }}
              />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Description">
              <textarea
                rows={2}
                value={newResource.description || ''}
                onChange={(e) => setNewResource((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2.5 border"
                style={{ borderColor: '#E5E5E5' }}
              />
            </FormField>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddResource}
            className="px-4 py-2.5 font-medium"
            style={{ backgroundColor: '#F4E4C1', color: '#1F2937', border: '1px solid #E5E5E5' }}
          >
            Add Resource
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3" style={{ color: '#DC2626' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 px-4 py-3" style={{ color: '#047857' }}>
          {success}
        </div>
      )}

      {filteredResources.length === 0 ? (
        <div className="bg-white p-12 text-center border" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-lg font-semibold" style={{ color: '#00CED1' }}>No resources found</p>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Adjust your search or add a new resource.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const originalIndex = resources.findIndex((item) => item === resource);
            return (
              <div
                key={`${resource.id}-${originalIndex}`}
                className="bg-white border overflow-hidden"
                style={{ borderColor: '#E5E5E5' }}
              >
                <div
                  className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: '#D4AF37' }}>
                      Resource #{originalIndex + 1}
                    </p>
                    <h2 className="text-lg font-semibold truncate" style={{ color: '#00CED1' }}>
                      {resource.title || 'Untitled Resource'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(originalIndex)}
                    className="px-3 py-2 font-medium"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  >
                    Delete
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="ID">
                    <input
                      type="text"
                      value={resource.id || ''}
                      onChange={(e) => handleChange(originalIndex, 'id', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                    />
                  </FormField>

                  <FormField label="Title">
                    <input
                      type="text"
                      value={resource.title || ''}
                      onChange={(e) => handleChange(originalIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                    />
                  </FormField>

                  <FormField label="File Name">
                    <input
                      type="text"
                      value={resource.fileName || ''}
                      onChange={(e) => handleChange(originalIndex, 'fileName', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                    />
                  </FormField>

                  <FormField label="Category">
                    <input
                      type="text"
                      value={resource.category || ''}
                      onChange={(e) => handleChange(originalIndex, 'category', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                    />
                  </FormField>

                  <FormField label="Size">
                    <input
                      type="text"
                      value={resource.size || ''}
                      onChange={(e) => handleChange(originalIndex, 'size', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                    />
                  </FormField>

                  <FormField label="Date">
                    <input
                      type="text"
                      value={resource.date || ''}
                      onChange={(e) => handleChange(originalIndex, 'date', e.target.value)}
                      className="w-full px-3 py-2.5 border"
                      style={{ borderColor: '#E5E5E5' }}
                      placeholder="YYYY-MM-DD"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="URL (optional)">
                      <input
                        type="text"
                        value={resource.url || ''}
                        onChange={(e) => handleChange(originalIndex, 'url', e.target.value)}
                        className="w-full px-3 py-2.5 border"
                        style={{ borderColor: '#E5E5E5' }}
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Description">
                      <textarea
                        rows={2}
                        value={resource.description || ''}
                        onChange={(e) => handleChange(originalIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2.5 border"
                        style={{ borderColor: '#E5E5E5' }}
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Tags (comma separated)">
                      <input
                        type="text"
                        value={(resource.tags || []).join(', ')}
                        onChange={(e) =>
                          handleChange(
                            originalIndex,
                            'tags',
                            e.target.value
                              .split(',')
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          )
                        }
                        className="w-full px-3 py-2.5 border"
                        style={{ borderColor: '#E5E5E5' }}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent = '#00CED1',
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="border p-3" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
      <p className="text-xs uppercase tracking-[0.12em] font-semibold" style={{ color: '#6B7280' }}>
        {label}
      </p>
      <p className="text-xl font-bold mt-1" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1" style={{ color: '#6B7280' }}>
        {label}
      </span>
      {children}
    </label>
  );
}
