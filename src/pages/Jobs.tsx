import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [applyingTo, setApplyingTo] = useState<number | null>(null);

  useEffect(() => {
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (job: Job) => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setApplyingTo(job.id);
    setMessage("");

    const lastUpload = localStorage.getItem(`lastUpload_${job.id}`);
    if (lastUpload && Date.now() - parseInt(lastUpload) < 3600000) {
      setMessage("You have already applied for this job in the last hour.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("cv", selectedFile);
    formData.append("jobTitle", job.title);
    formData.append("companyemail", job.companyemail);

    try {
      const response = await fetch("/jobs.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      setMessage(result);

      if (response.ok) {
        localStorage.setItem(`lastUpload_${job.id}`, Date.now().toString());
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(
        "There was an error uploading your CV. Please try again later.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://picsum.photos/seed/careers/1600/900)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Find your next career opportunity with Prestige Strategies.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span>{job.location}</span>
                  <span>&bull;</span>
                  <span>{job.type}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{job.description}</p>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Apply for this position
                  </h3>
                  {message && applyingTo === job.id && (
                    <p className="mb-4 text-sm text-center p-2 bg-yellow-100 text-yellow-800 rounded">
                      {message}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-auto flex-grow">
                      <label
                        htmlFor={`file-upload-${job.id}`}
                        className="sr-only"
                      >
                        Choose file
                      </label>
                      <Input
                        id={`file-upload-${job.id}`}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                    <Button
                      onClick={() => handleSubmit(job)}
                      disabled={uploading || !selectedFile}
                      className="w-full sm:w-auto"
                    >
                      {uploading && applyingTo === job.id ? (
                        "Uploading..."
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-4 w-4" /> Upload CV
                        </>
                      )}
                    </Button>
                  </div>
                  {selectedFile && applyingTo === job.id && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Jobs;
