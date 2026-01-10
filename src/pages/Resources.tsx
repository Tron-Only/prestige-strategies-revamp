import { useEffect, useMemo, useState } from "react";

type Resource = {
  id: string;
  title: string;
  description?: string;
  // public URL (optional). If not provided we'll try to resolve using `fileName`
  url?: string;
  // filename located in `public` (optional)
  fileName?: string;
  category?: string;
  tags?: string[];
  // ISO date string (optional) - used for sorting
  date?: string;
  // human readable size (optional)
  size?: string;
};

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "az">("newest");

  // Fetch resources.json from public folder
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/resources.json", { cache: "no-cache" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load resources.json (${res.status})`);
        }
        const data = (await res.json()) as Resource[];
        if (!mounted) return;
        // normalize: ensure each item has an id
        const normalized = data.map((r, i) => ({
          id: r.id ?? `r-${i}`,
          ...r,
        }));
        setResources(normalized);
        setError(null);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(
          typeof err === "string" ? err : (err?.message ?? "Unknown error"),
        );
        setResources([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // derive categories
  const categories = useMemo(() => {
    if (!resources) return ["All"];
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [resources]);

  // filtered + sorted results
  const filtered = useMemo(() => {
    if (!resources) return [];
    const q = query.trim().toLowerCase();
    let list = resources.filter((r) => {
      if (selectedCategory !== "All" && r.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const inTitle = r.title?.toLowerCase().includes(q);
      const inDesc = r.description?.toLowerCase().includes(q);
      const inTags = r.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      return inTitle || inDesc || inTags;
    });

    if (sortBy === "newest") {
      list = list.sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0;
        const db = b.date ? Date.parse(b.date) : 0;
        return db - da;
      });
    } else {
      list = list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [resources, query, selectedCategory, sortBy]);

  // helper to resolve public url
  const resolveUrl = (r: Resource) => {
    if (r.url) return r.url;
    if (r.fileName) {
      // if user provides a fileName, assume it's placed in public/files or directly in public root.
      // common pattern: keep resources in `public/resources/<filename>`
      // but we'll try a few sensible fallbacks (resources/ then files/ then root)
      return `/resources/${r.fileName}`;
    }
    // fallback: try to base on title
    const safe = r.title
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `/resources/${safe}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Downloadable documents and helpful assets. Place your files in the
            public folder and list them inside{" "}
            <code>/public/resources.json</code>.
          </p>
        </header>

        <section className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
            <div className="flex-1">
              <label className="sr-only" htmlFor="search">
                Search resources
              </label>
              <div className="relative text-muted-foreground">
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none"
                  placeholder="Search by title, description or tags"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="sr-only" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-40">
              <label className="sr-only" htmlFor="sort">
                Sort
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value === "az" ? "az" : "newest")
                }
                className="block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <>Loading resources…</>
              ) : error ? (
                <>Error loading resources</>
              ) : (
                <>
                  Showing <span className="font-medium">{filtered.length}</span>{" "}
                  of{" "}
                  <span className="font-medium">{resources?.length ?? 0}</span>{" "}
                  resources
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Tip: add files to <code>/public/resources/</code> and update{" "}
              <code>/public/resources.json</code>
            </div>
          </div>

          {loading ? (
            <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
              Loading…
            </div>
          ) : error ? (
            <div className="rounded-md border p-4 text-muted-foreground">
              {error}. Make sure <code>/public/resources.json</code> exists and
              is valid JSON.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
              No resources found. Try a different search or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((r) => {
                const href = resolveUrl(r);
                return (
                  <article
                    key={r.id}
                    className="card flex flex-col justify-between p-4 hover:shadow transition-shadow"
                    aria-labelledby={`res-${r.id}-title`}
                  >
                    <div>
                      <h3
                        id={`res-${r.id}-title`}
                        className="text-lg font-semibold text-foreground"
                      >
                        {r.title}
                      </h3>
                      {r.category && (
                        <div
                          className="mt-1 text-sm font-medium"
                          style={{ color: "var(--primary)" }}
                        >
                          {r.category}
                        </div>
                      )}
                      {r.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {r.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.tags?.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {r.date ? (
                          <time dateTime={r.date}>
                            {new Date(r.date).toLocaleDateString()}
                          </time>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                        {r.size ? <span> • {r.size}</span> : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm text-foreground hover:bg-muted focus:outline-none"
                          title="Open"
                        >
                          <svg
                            className="h-4 w-4 mr-2 text-muted-foreground"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h6m0 0v6m0-6L10 16"
                            />
                          </svg>
                          View
                        </a>

                        <a
                          href={href}
                          download={r.fileName ?? undefined}
                          className="inline-flex items-center px-3 py-1.5 btn-primary text-sm rounded-md focus:outline-none"
                          title="Download"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResourcesPage;
