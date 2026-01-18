import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ExternalLink } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  fileName?: string;
  category?: string;
  tags?: string[];
  date?: string;
  size?: string;
};

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "az">("newest");

  useEffect(() => {
    let mounted = true;
    fetch("/resources.json", { cache: "no-cache" })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to load resources.json (${res.status})`);
        const data = (await res.json()) as Resource[];
        if (!mounted) return;
        const normalized = data.map((r, i) => ({ ...r, id: r.id ?? `r-${i}` }));
        setResources(normalized);
        setError(null);
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setError(err?.message ?? "Unknown error");
        setResources([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    if (!resources) return ["All"];
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [resources]);

  const filtered = useMemo(() => {
    if (!resources) return [];
    const q = query.trim().toLowerCase();
    const list = resources.filter((r) => {
      if (selectedCategory !== "All" && r.category !== selectedCategory)
        return false;
      if (!q) return true;
      const inTitle = r.title?.toLowerCase().includes(q);
      const inDesc = r.description?.toLowerCase().includes(q);
      const inTags = r.tags?.some((t) => t.toLowerCase().includes(q));
      return inTitle || inDesc || inTags;
    });

    if (sortBy === "newest") {
      list.sort(
        (a, b) => Date.parse(b.date ?? "0") - Date.parse(a.date ?? "0"),
      );
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [resources, query, selectedCategory, sortBy]);

  const resolveUrl = (r: Resource) => {
    if (r.url) return r.url;
    if (r.fileName) return `/resources/${r.fileName}`;
    const safe = r.title
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `/resources/${safe}.pdf`;
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Resources
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Valuable insights, tools, and documents to help you succeed.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "newest" | "az")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading resources...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No resources found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((r) => (
              <Card key={r.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{r.title}</CardTitle>
                  {r.category && (
                    <p className="text-sm text-primary font-medium">
                      {r.category}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="grow">
                  <p className="text-muted-foreground text-sm mb-4">
                    {r.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {r.date ? new Date(r.date).toLocaleDateString() : ""}
                    {r.size ? ` • ${r.size}` : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <a
                        href={resolveUrl(r)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={resolveUrl(r)} download={r.fileName}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ResourcesPage;
