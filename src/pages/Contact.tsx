import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin } from "lucide-react";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // This is a mock API call.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real application, you would make a fetch request to your API endpoint.
      // For example:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // });
      // if (!response.ok) throw new Error('Network response was not ok.');
      setStatus("success");
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
            We'd love to hear from you. Let us know how we can help.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-8">
              You can reach us via email, phone, or by visiting our office.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-6 w-6 mr-4 text-primary" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-4 text-primary" />
                <span>contact@prestigestrategies.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 mr-4 text-primary" />
                <span>123 Prestige Plaza, Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Company Name (Optional)"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  <Select
                    value={form.service}
                    onValueChange={(value) => handleChange("service", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Service of Interest (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recruitment">Recruitment</SelectItem>
                      <SelectItem value="payroll">
                        Payroll Outsourcing
                      </SelectItem>
                      <SelectItem value="training">
                        Corporate Training
                      </SelectItem>
                      <SelectItem value="outsourcing">
                        HR Function Outsourcing
                      </SelectItem>
                      <SelectItem value="other">Other / Consultancy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </Button>
                  {status === "success" && (
                    <p className="text-sm text-center text-green-600">
                      Message sent successfully!
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-center text-red-600">
                      Failed to send message. Please try again.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactPage;
