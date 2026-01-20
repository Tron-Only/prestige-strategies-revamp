import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplyModal } from "@/components/jobs/ApplyModal";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
  companyemail: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Available Opportunities
            </h1>
            <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
              Find your next career opportunity with one of our partners.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span>{job.location}</span>
                  <span>&bull;</span>
                  <span>{job.type}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                  {job.description.split(/\n\s*\n/).map((para, idx) => (
                    <p
                      key={idx}
                      className="mb-3 last:mb-0 leading-relaxed whitespace-pre-line wrap-break-word"
                    >
                      {para}
                    </p>
                  ))}
                </div>
                <Button onClick={() => setSelectedJob(job)} className="w-full">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
};

export default Jobs;
