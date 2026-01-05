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
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/**
 * ServicesPage
 *
 * Revamped services landing page:
 * - Hero with concise value proposition and CTA
 * - Services grid with short descriptions and contact CTA
 * - Engagement models section explaining how we work
 * - Integrations overview (Workday, HR systems, payroll providers)
 * - FAQ section with common questions
 *
 * The markup is semantic and accessible (headings, lists, and <details> for FAQs).
 * Visual styling relies on existing Tailwind / theme tokens defined in `index.css`.
 */

const SERVICES = [
  {
    key: "hr-audit",
    title: "HR Audit & Compliance",
    icon: <FileCheck className="w-10 h-10 text-primary" />,
    blurb:
      "Comprehensive reviews of HR processes, policies and records to identify compliance gaps and opportunities for efficiency.",
    highlights: [
      "Labour law compliance checks",
      "HR file & policy review",
      "Risk mitigation recommendations",
    ],
  },
  {
    key: "strategic-planning",
    title: "Strategic HR & Workforce Planning",
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    blurb:
      "Align people strategy to business goals with workforce planning, succession planning and measurable KPIs.",
    highlights: [
      "Workforce gap analysis",
      "Succession & career path frameworks",
      "Performance metric design",
    ],
  },
  {
    key: "payroll",
    title: "Payroll Outsourcing & Benefits",
    icon: <Calculator className="w-10 h-10 text-primary" />,
    blurb:
      "End-to-end payroll processing, statutory filings and benefits administration so you can reduce risk and operational overhead.",
    highlights: [
      "Monthly payroll processing & payslips",
      "Statutory contributions & filings",
      "Benefits administration",
    ],
  },
  {
    key: "recruitment",
    title: "Recruitment & Talent Acquisition",
    icon: <Users className="w-10 h-10 text-primary" />,
    blurb:
      "Targeted recruitment for permanent and contract roles with screening, interviewing and shortlisting managed for you.",
    highlights: [
      "Sourcing & screening",
      "Video interview coordination",
      "Offer & onboarding support",
    ],
  },
  {
    key: "training",
    title: "Corporate Training & Capacity Building",
    icon: <Building className="w-10 h-10 text-primary" />,
    blurb:
      "Custom learning programs to uplift your managers and teams — from leadership to technical HR skills.",
    highlights: [
      "Needs analysis & tailored curricula",
      "Blended delivery (virtual & onsite)",
      "Post-training evaluation",
    ],
  },
  {
    key: "manpower",
    title: "Manpower Outsourcing",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    blurb:
      "Flexible staffing solutions for scaling projects — temporary, contract or long-term placements.",
    highlights: [
      "Rapid deployment of vetted workers",
      "Payroll & statutory handling for temp staff",
      "Scalable workforce models",
    ],
  },
];

const ENGAGEMENTS = [
  {
    title: "Retainer (Ongoing HR Partner)",
    description:
      "Dedicated HR support tailored to your business. Ideal for organisations that need continuous advisory, policy maintenance and operational HR support.",
    bullets: [
      "Monthly SLA-based support",
      "Quarterly strategy review",
      "Priority access to consultants",
    ],
  },
  {
    title: "Project-based (Fixed Scope)",
    description:
      "Short-term engagements for discrete projects — audits, payroll migrations, handbook creation, or a recruitment drive.",
    bullets: [
      "Clear scope & timeline",
      "Fixed fee or milestone billing",
      "Delivered with project governance",
    ],
  },
  {
    title: "Per-hire / Contingency",
    description:
      "Pay only for successful hires. We source, screen and present shortlisted candidates for your approval.",
    bullets: [
      "No hire, no fee (terms apply)",
      "Dedicated recruitment consultant",
    ],
  },
  {
    title: "Managed Services (MSP / RPO)",
    description:
      "End-to-end recruitment or staffing delivery for high-volume or enterprise needs, including compliance, payroll and onboarding.",
    bullets: ["Scalable delivery", "Reporting & SLA-driven outcomes"],
  },
];

const FAQS = [
  {
    question: "How long does a typical engagement take?",
    answer: (
      <>
        Timelines vary by service. A focused audit is typically 2–4 weeks;
        payroll onboarding is 4–8 weeks depending on data complexity. We provide
        a clear project plan before work begins.
      </>
    ),
  },
  {
    question: "Do you provide local Kenyan compliance advice?",
    answer: (
      <>
        Yes — our team is experienced with Kenyan labour law, statutory filings
        and common employer obligations. We combine local know-how with
        international best practice.
      </>
    ),
  },
  {
    question: "Can you work with our existing HR systems?",
    answer: (
      <>
        Absolutely. We prioritise integrations and data safety. If your system
        offers APIs we will integrate or create a secure file exchange as
        required.
      </>
    ),
  },
  {
    question: "What are your pricing models?",
    answer: (
      <>
        We offer retainer, project-based, per-hire and managed services. After a
        short discovery call we will propose a transparent fee structure and
        value-based outcome metrics.
      </>
    ),
  },
];

export function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Services that make HR simple and strategic
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We combine local expertise and global best practices to deliver HR,
            payroll, recruitment and training solutions that reduce risk and
            accelerate growth.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="hero-cta">
              <Link to="/contact">Request a Consultation</Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/resources">Download capability deck</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">Our core services</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Practical, measurable HR services that support organisations at
            every stage of growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {SERVICES.map((s) => (
              <Card key={s.key} className="p-4">
                <CardHeader className="flex items-center gap-4">
                  <div className="flex-none">{s.icon}</div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{s.blurb}</p>
                  <ul className="mb-4 space-y-2 text-sm">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-primary mt-1">
                          <CheckMark />
                        </span>
                        <span className="text-muted-foreground">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="hero-cta">
                      <Link to="/contact">Get started</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-sm"
                    >
                      <a
                        href={`mailto:info@prestigestrategies.co.ke?subject=Inquiry: ${encodeURIComponent(
                          s.title,
                        )}`}
                      >
                        Email us
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">How we engage</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Flexible engagement models to match your needs and budget.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {ENGAGEMENTS.map((e) => (
              <article
                key={e.title}
                className="bg-card flex flex-col h-full p-6 rounded-lg border shadow-sm"
                aria-labelledby={slugify(e.title)}
              >
                <div className="flex-1 flex flex-col">
                  <h3 id={slugify(e.title)} className="text-lg font-semibold">
                    {e.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{e.description}</p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-primary mt-1">
                          <CheckMark />
                        </span>
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Answers to common questions about our services, pricing and
            delivery.
          </p>

          {/* FAQ Accordion - full width, single column, accessible */}
          <div className="mt-8 max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-8 text-center">
            <Button asChild className="hero-cta">
              <Link to="/contact">Still have a question? Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Small inline icon used for list bullets (keeps file self-contained) */
function CheckMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Utility: simple slugify for aria ids */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default ServicesPage;
