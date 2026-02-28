import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { Search, MapPin, Clock, Building2, X, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
  companyemail: string;
  postedDate?: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs/list.php?status=active")
      .then((response) => response.json())
      .then((apiResponse) => {
        // API returns {success: true, data: [...]}
        const data = apiResponse.data || [];
        // Add posted dates for demo purposes based on created_at
        const jobsWithDates = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          location: job.location,
          type: job.type,
          description: job.description,
          companyemail: job.application_url || '', // Use application_url as email fallback
          postedDate: calculatePostedDate(job.created_at),
        }));
        setJobs(jobsWithDates);
        setLoading(false);
      })
      .catch(() => {
        setJobs([]);
        setLoading(false);
      });
  }, []);

  const calculatePostedDate = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Extract unique values for filters
  const jobTypes = useMemo(() => {
    const types = new Set(jobs.map((job) => job.type));
    return Array.from(types).sort();
  }, [jobs]);

  const locations = useMemo(() => {
    const locs = new Set(jobs.map((job) => job.location));
    return Array.from(locs).sort();
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || job.type === selectedType;
      const matchesLocation = !selectedLocation || job.location === selectedLocation;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [jobs, searchQuery, selectedType, selectedLocation]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType(null);
    setSelectedLocation(null);
  };

  const hasActiveFilters = searchQuery || selectedType || selectedLocation;

  return (
    <>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#00CED1", color: "#FFFFFF" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Available Opportunities
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.9)" }}>
              Find your next career opportunity with one of our partners.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section style={{ backgroundColor: "#F8F6F0", borderBottom: "1px solid #E5E5E5" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" 
              style={{ color: "#6B7280" }}
            />
            <Input
              type="text"
              placeholder="Search by job title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-2"
              style={{ borderColor: "#E5E5E5", backgroundColor: "#FFFFFF" }}
            />
          </div>

          {/* Filter Pills */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {/* Job Type Filters */}
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedType === type ? "#00CED1" : "#FFFFFF",
                    color: selectedType === type ? "#FFFFFF" : "#00CED1",
                    border: "1px solid #E5E5E5",
                  }}
                >
                  {type}
                </button>
              ))}

              {/* Location Filters */}
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedLocation === location ? "#D4AF37" : "#FFFFFF",
                    color: selectedLocation === location ? "#1A1A1A" : "#00CED1",
                    border: "1px solid #E5E5E5",
                  }}
                >
                  <MapPin className="inline-block w-3 h-3 mr-1" />
                  {location}
                </button>
              ))}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1"
                  style={{ backgroundColor: "#F4E4C1", color: "#1A1A1A" }}
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mt-4">
            <span style={{ color: "#6B7280" }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"} available
            </span>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          // Loading Skeleton
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-4" style={{ color: "#D4AF37" }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#00CED1" }}>
              No jobs found
            </h3>
            <p style={{ color: "#6B7280" }}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-4" style={{ backgroundColor: "#00CED1" }}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="border-0 shadow-sm flex flex-col"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {/* New Badge for first job */}
                      {index === 0 && (
                        <Badge 
                          className="mb-2"
                          style={{ backgroundColor: "#D4AF37", color: "#1A1A1A" }}
                        >
                          New
                        </Badge>
                      )}
                      <CardTitle className="text-xl font-bold" style={{ color: "#00CED1" }}>
                        {job.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: "#6B7280" }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" style={{ color: "#D4AF37" }} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" style={{ color: "#D4AF37" }} />
                      {job.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div 
                    className="mb-4 text-sm flex-1"
                    style={{ color: "#6B7280" }}
                  >
                    {job.description.length > 150 
                      ? `${job.description.substring(0, 150)}...` 
                      : job.description}
                  </div>
                  
                  {job.postedDate && (
                    <div className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
                      Posted {job.postedDate}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    {job.description.length > 150 && (
                      <Button 
                        onClick={() => setSelectedJobForDetails(job)} 
                        variant="outline"
                        className="flex-1"
                      >
                        Read More
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      onClick={() => setSelectedJobForApply(job)} 
                      className={job.description.length > 150 ? "flex-1" : "w-full"}
                      style={{ backgroundColor: "#00CED1" }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Job Details Modal */}
      {selectedJobForDetails && (
        <AlertDialog open onOpenChange={() => setSelectedJobForDetails(null)}>
          <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <AlertDialogTitle 
                    className="text-2xl font-bold"
                    style={{ color: "#00CED1" }}
                  >
                    {selectedJobForDetails.title}
                  </AlertDialogTitle>
                  <div className="flex items-center gap-4 mt-3 text-sm" style={{ color: "#6B7280" }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" style={{ color: "#D4AF37" }} />
                      {selectedJobForDetails.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" style={{ color: "#D4AF37" }} />
                      {selectedJobForDetails.type}
                    </span>
                  </div>
                  {selectedJobForDetails.postedDate && (
                    <div className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                      Posted {selectedJobForDetails.postedDate}
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogHeader>
            
            <AlertDialogDescription asChild>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#00CED1" }}>
                  Job Description
                </h3>
                <div 
                  className="text-base leading-relaxed whitespace-pre-line"
                  style={{ color: "#1A1A1A" }}
                >
                  {selectedJobForDetails.description}
                </div>
              </div>
            </AlertDialogDescription>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setSelectedJobForDetails(null)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setSelectedJobForApply(selectedJobForDetails);
                  setSelectedJobForDetails(null);
                }}
                className="flex-1"
                style={{ backgroundColor: "#00CED1" }}
              >
                Apply for this position
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal job={selectedJobForApply} onClose={() => setSelectedJobForApply(null)} />
      )}
    </>
  );
};

export default Jobs;
