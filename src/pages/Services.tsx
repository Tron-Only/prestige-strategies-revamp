import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileCheck,
  Lightbulb,
  Calculator,
  Users,
  Building,
  Briefcase,
 } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const SERVICES = [
  {
    key: "hr-audit",
    title: "HR Audit & Compliance",
    icon: <FileCheck className="w-10 h-10 text-primary" />,
    blurb:
      "Comprehensive reviews of HR processes, policies and records to identify compliance gaps and opportunities for efficiency.",
  },
  {
    key: "strategic-planning",
    title: "Strategic HR & Workforce Planning",
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    blurb:
      "Align people strategy to business goals with workforce planning, succession planning and measurable KPIs.",
  },
  {
    key: "payroll",
    title: "Payroll Outsourcing & Benefits",
    icon: <Calculator className="w-10 h-10 text-primary" />,
    blurb:
      "End-to-end payroll processing, statutory filings and benefits administration so you can reduce risk and operational overhead.",
  },
  {
    key: "recruitment",
    title: "Recruitment & Talent Acquisition",
    icon: <Users className="w-10 h-10 text-primary" />,
    blurb:
      "Targeted recruitment for permanent and contract roles with screening, interviewing and shortlisting managed for you.",
  },
  {
    key: "training",
    title: "Corporate Training & Capacity Building",
    icon: <Building className="w-10 h-10 text-primary" />,
    blurb:
      "Custom learning programs to uplift your managers and teams — from leadership to technical HR skills.",
  },
  {
    key: "manpower",
    title: "Manpower Outsourcing",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    blurb:
      "Flexible staffing solutions for scaling projects — temporary, contract or long-term placements.",
  },
];

const FAQS = [
  {
    question: "What is the typical timeline for a recruitment process?",
    answer:
      "Our standard recruitment process takes between 2 to 4 weeks, from initial consultation to the candidate's first day. We can expedite this for urgent roles.",
  },
  {
    question: "How do you ensure compliance with Kenyan labor laws?",
    answer:
      "Our team of experts stays up-to-date with the latest labor laws and regulations. We conduct regular audits and provide guidance to ensure your organization is fully compliant.",
  },
  {
    question: "What is the cost of your services?",
    answer:
      "Our pricing is tailored to the specific needs of each client. We offer a range of engagement models, from project-based fees to monthly retainers. Contact us for a custom quote.",
  },
  {
    question: "Do you offer training for remote teams?",
    answer:
      "Yes, we offer a variety of virtual training programs designed to engage and upskill remote employees. We can also create custom programs to meet the specific needs of your team.",
  },
];

export function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/services/1600/900)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Our Services
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            We provide a comprehensive range of HR services to help you achieve
            your business goals.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              How We Can Help
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our services to find the right solution for your business.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card key={service.key} className="text-center">
                <CardHeader>
                  <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded-full">
                    {service.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold">
                    {service.title}
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground">{service.blurb}</p>
                  <Button asChild size="sm" className="mt-4">
                    <Link to="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about our services.
            </p>
          </div>
          <div className="mt-12 max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-base font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Let's Work Together
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contact us today to learn more about how we can help your business
            succeed.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
