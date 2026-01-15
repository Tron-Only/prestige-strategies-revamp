import React, { useState, useEffect } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  companyemail: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

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

    const lastUpload = localStorage.getItem(`lastUpload_${job.id}`);
    if (lastUpload && Date.now() - parseInt(lastUpload) < 3600000) {
      setMessage("You have already applied for this job in the last hour.");
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
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Openings</h1>
      {message && <p className="mb-4">{message}</p>}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 border rounded-lg">
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="mt-2">{job.description}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Apply for this position</h3>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="p-2 border rounded"
                />
                <button
                  onClick={() => handleSubmit(job)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Upload CV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
