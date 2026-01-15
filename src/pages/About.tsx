import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Globe, ShieldCheck, Zap } from "lucide-react";

export function AboutPage() {
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
      avatar: "https://picsum.photos/seed/alice/200/200",
    },
    {
      name: "Daniel Otieno",
      role: "Head of Talent & Recruitment",
      bio: "Specialist in talent sourcing and high-volume hiring. Focused on candidate experience and employer brand.",
      avatar: "https://picsum.photos/seed/daniel/200/200",
    },
    {
      name: "Grace Kimani",
      role: "Payroll & Compliance Lead",
      bio: "Payroll practitioner with deep statutory knowledge of Kenyan filings and benefits management.",
      avatar: "https://picsum.photos/seed/grace/200/200",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://picsum.photos/seed/team/1600/900)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            We're Prestige Strategies
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Your dedicated partner in building exceptional teams and fostering a
            thriving workplace.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              To empower organizations to achieve their full potential by
              providing strategic HR solutions that are tailored to their unique
              needs. We believe that a company's greatest asset is its people,
              and we're committed to helping you build a team that will drive
              your business forward.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our values are the foundation of our company and guide everything
              we do.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded-full">
                  {value.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-muted-foreground">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our team of experts is dedicated to helping you achieve your
              goals.
            </p>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-40 h-40 rounded-full mx-auto shadow-lg"
                />
                <h3 className="mt-6 text-xl font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
                <p className="mt-2 text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors We Serve Section */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sectors We Serve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We have experience across a wide range of industries.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="px-4 py-2 bg-background border rounded-full text-sm font-medium"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Take the Next Step?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contact us today to learn more about how we can help you achieve
            your goals.
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

export default AboutPage;
