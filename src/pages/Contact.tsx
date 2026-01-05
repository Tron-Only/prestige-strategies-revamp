import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.message.trim())
      newErrors.message = "Please include a short message";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      // Simulate request - replace with real API call later
      await new Promise((resolve) => setTimeout(resolve, 700));
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
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center">Contact Us</h1>
          <p className="mt-3 text-center text-muted-foreground">
            Have a question or want to discuss a project? Fill out the form
            below or use the contact details provided.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-4 bg-card p-6 rounded-lg border"
            aria-label="Contact form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Full name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Jane Doe"
                />
                {errors.name && (
                  <span className="text-sm text-red-600 mt-1">
                    {errors.name}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">
                  Company (optional)
                </span>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="Company name"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <span className="text-sm text-red-600 mt-1">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="+254 7XX XXX XXX"
                />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">
                Service of interest
              </span>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select a service (optional)</option>
                <option value="recruitment">Recruitment</option>
                <option value="payroll">Payroll Outsourcing</option>
                <option value="training">Corporate Training</option>
                <option value="outsourcing">HR Function Outsourcing</option>
                <option value="other">Other / Consultancy</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="border rounded-md px-3 py-2 resize-none"
                placeholder="Tell us briefly how we can help (goals, timeline, budget)..."
              />
              {errors.message && (
                <span className="text-sm text-red-600 mt-1">
                  {errors.message}
                </span>
              )}
            </label>

            <div className="flex items-center gap-4 justify-between mt-2">
              <div className="text-sm text-muted-foreground">
                {status === "success" && (
                  <span className="text-green-600">
                    Thanks — we'll get back to you shortly.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-600">
                    Something went wrong. Please try again.
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-4 rounded-md border">
              <h3 className="font-semibold">Office</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Nairobi, Kenya
              </p>
            </div>
            <div className="bg-card p-4 rounded-md border">
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground mt-1">
                info@prestigestrategies.co.ke
              </p>
            </div>
            <div className="bg-card p-4 rounded-md border">
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-muted-foreground mt-1">
                +254 700 000 000
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t bg-muted">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Prestige Strategies. All rights
            reserved.
          </div>
          <nav className="mt-4 md:mt-0 flex gap-4">
            <a href="/about" className="text-sm text-primary hover:underline">
              About
            </a>
            <a
              href="/services"
              className="text-sm text-primary hover:underline"
            >
              Services
            </a>
            <a
              href="/resources"
              className="text-sm text-primary hover:underline"
            >
              Resources
            </a>
            <a href="/contact" className="text-sm text-primary hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
