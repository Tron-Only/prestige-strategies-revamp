import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

interface ApplyModalProps {
  job: {
    id: number;
    title: string;
    companyemail: string;
  };
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
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
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply for {job.title}</AlertDialogTitle>
          <AlertDialogDescription>
            Please upload your CV to apply for this position.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
          {selectedFile && (
            <p className="text-xs text-muted-foreground mt-2">
              Selected file: {selectedFile.name}
            </p>
          )}
          {message && (
            <p className="mt-4 text-sm text-center p-2 bg-yellow-100 text-yellow-800 rounded">
              {message}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={uploading || !selectedFile}>
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload CV
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
