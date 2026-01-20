import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";

export function UploadCvPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("cv", selectedFile);
    // You can add more form fields to the FormData object here
    // For example:
    // formData.append("name", "John Doe");
    // formData.append("email", "john.doe@example.com");

    try {
      // Replace with your actual API endpoint for CV submission
      const response = await fetch("/jobs.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      setMessage(result);
      if (response.ok) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(
        "There was an error uploading your CV. Please try again later.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Submit Your CV
          </h1>
          <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
            Don't see a suitable role? Submit your CV and we'll contact you when
            a matching opportunity arises.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName">First Name</label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName">Last Name</label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone Number</label>
                <Input id="phone" type="tel" placeholder="+254 700 000 000" />
              </div>
              <div className="space-y-2">
                <label htmlFor="cover-letter">Cover Letter (Optional)</label>
                <Textarea
                  id="cover-letter"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cv-upload">Upload your CV</label>
                <Input
                  id="cv-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>

              {message && (
                <p className="text-sm text-center p-2 bg-yellow-100 text-yellow-800 rounded">
                  {message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  "Submitting..."
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" /> Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UploadCvPage;
