import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Globe,
  ShieldCheck,
  MapPin,
  Zap,
  Calendar,
  Mail,
} from "lucide-react";
import React from "react";

/**
 * AboutPage
 *
 * Revamped About page with:
 * - Clear mission + quick facts
 * - Values (why we do what we do)
 * - Our process (how we work)
 * - Sectors we serve
 * - Team with short bios and CTAs
 *
 * Uses existing theme tokens and utility classes from the project.
 */

export function AboutPage() {
  const quickFacts = [
    { label: "Years of experience", value: "10+" },
    { label: "Clients supported", value: "200+" },
    { label: "Average time-to-fill", value: "21 days" },
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Compliance-first",
      text: "We build compliant HR processes that protect your people and business under local and regional regulation.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Local expertise",
      text: "Deep knowledge of Kenyan labour practices and practical experience across sectors in East Africa.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Practical outcomes",
      text: "We focus on measurable improvements — faster hiring, lower HR operating cost and better employee experience.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Partner mindset",
      text: "We act as an extension of your team: collaborative, responsive, and focused on your priorities.",
    },
  ];

  const sectors = [
    "Financial Services",
    "Healthcare",
    "Hospitality",
    "Manufacturing",
    "Tech & Startups",
    "NGOs & Development",
  ];

  const team = [
    {
      name: "Alice Mwangi",
      role: "Managing Director",
      bio: "People leader with 12 years' experience designing HR strategy and running transformation programmes for enterprises and SMEs.",
    },
    {
      name: "Daniel Otieno",
      role: "Head of Talent & Recruitment",
      bio: "Specialist in talent sourcing and high-volume hiring. Focused on candidate experience and employer brand.",
    },
    {
      name: "Grace Kimani",
      role: "Payroll & Compliance Lead",
      bio: "Payroll practitioner with deep statutory knowledge of Kenyan filings and benefits management.",
    },
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                We help organisations build better people systems — and make
                them work
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                Prestige Strategies partners with businesses across Kenya to
                deliver HR, payroll and talent solutions that reduce risk,
                improve operational efficiency and unlock growth.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="hero-cta">
                  <Link to="/services">Our services</Link>
                </Button>
                <Button asChild variant="default">
                  <Link to="/contact">Request a consultation</Link>
                </Button>
                <Button asChild variant="ghost">
                  <a href="#team">Meet the team</a>
                </Button>
              </div>

              <div className="mt-6 flex gap-6 flex-wrap text-sm text-muted-foreground">
                {quickFacts.map((f) => (
                  <div key={f.label} className="flex items-baseline gap-2">
                    <div className="text-2xl font-semibold text-foreground">
                      {f.value}
                    </div>
                    <div className="text-xs">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h4 className="text-lg font-semibold">
                  Contact our Nairobi office
                </h4>
                <p className="text-muted-foreground mt-2">
                  <MapPin className="inline-block mr-2 w-4 h-4 text-muted-foreground" />
                  123 Business Avenue, Nairobi
                </p>
                <p className="text-muted-foreground mt-2">
                  <Calendar className="inline-block mr-2 w-4 h-4 text-muted-foreground" />
                  Mon — Fri, 8:00 — 17:00
                </p>
                <p className="text-muted-foreground mt-2">
                  <Mail className="inline-block mr-2 w-4 h-4 text-muted-foreground" />
                  <a
                    href="mailto:info@prestigestrategies.co.ke"
                    className="text-primary"
                  >
                    info@prestigestrategies.co.ke
                  </a>
                </p>

                <div className="mt-4">
                  <Button asChild className="btn-primary">
                    <Link to="/contact">Get in touch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">Our values</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            How we work and what guides our decisions.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-5">
                <div className="flex items-start gap-4">
                  <div>{v.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {v.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">How we work</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            A straightforward process, built to reduce friction and deliver
            outcomes.
          </p>

          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-5 text-center">
              <div className="mx-auto bg-white rounded-full w-12 h-12 flex items-center justify-center shadow">
                <span className="font-semibold text-primary">1</span>
              </div>
              <h4 className="mt-4 font-semibold">Discovery</h4>
              <p className="text-muted-foreground mt-2 text-sm">
                Short workshop to agree goals, risks and measures of success.
              </p>
            </div>

            <div className="card p-5 text-center">
              <div className="mx-auto bg-white rounded-full w-12 h-12 flex items-center justify-center shadow">
                <span className="font-semibold text-primary">2</span>
              </div>
              <h4 className="mt-4 font-semibold">Design</h4>
              <p className="text-muted-foreground mt-2 text-sm">
                Practical design of processes, policies and roadmaps with clear
                deliverables.
              </p>
            </div>

            <div className="card p-5 text-center">
              <div className="mx-auto bg-white rounded-full w-12 h-12 flex items-center justify-center shadow">
                <span className="font-semibold text-primary">3</span>
              </div>
              <h4 className="mt-4 font-semibold">Deliver & Improve</h4>
              <p className="text-muted-foreground mt-2 text-sm">
                Implementation support, training and handover with continuous
                improvement cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">Sectors we serve</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            We have experience serving organisations in the following sectors.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {sectors.map((s) => (
              <span
                key={s}
                className="px-4 py-2 bg-card border rounded-full text-muted-foreground text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center">Meet the team</h2>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Small, experienced team — big impact.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-40 h-40 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-3xl font-semibold text-muted-foreground">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
                  {member.bio}
                </p>
                <div className="mt-4">
                  <Button asChild variant="default" size="sm">
                    <a
                      href={`mailto:${member.name.replace(/\s+/g, ".").toLowerCase()}@prestigestrategies.co.ke`}
                    >
                      Connect
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold">Ready to partner with us?</h3>
          <p className="text-muted-foreground mt-2">
            Book a short discovery call and we'll propose the best engagement
            model for your needs.
          </p>
          <div className="mt-6">
            <Button asChild className="hero-cta">
              <Link to="/contact">Book discovery call</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
