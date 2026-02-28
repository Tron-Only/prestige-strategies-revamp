import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Globe, ShieldCheck, Zap } from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="w-8 h-8" style={{ color: "#D4AF37" }} />,
      title: "Compliance-first",
      text: "We build compliant HR processes that protect your people and business under local and regional regulation.",
    },
    {
      icon: <Globe className="w-8 h-8" style={{ color: "#D4AF37" }} />,
      title: "Local expertise",
      text: "Deep knowledge of Kenyan labour practices and practical experience across sectors in East Africa.",
    },
    {
      icon: <Zap className="w-8 h-8" style={{ color: "#D4AF37" }} />,
      title: "Practical outcomes",
      text: "We focus on measurable improvements — faster hiring, lower HR operating cost and better employee experience.",
    },
    {
      icon: <Users className="w-8 h-8" style={{ color: "#D4AF37" }} />,
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

  return (
    <>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A" }}>
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight" style={{ color: "#00CED1" }}>
            We're Prestige Strategies
          </h1>
          <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
            Your dedicated partner in building exceptional teams and fostering a
            thriving workplace.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#00CED1" }}>
              Our Mission
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto" style={{ color: "#6B7280" }}>
              To empower organizations to achieve their full potential by
              providing strategic HR solutions that are tailored to their unique
              needs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: "#F8F6F0" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#00CED1" }}>
              Our Values
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
              Our values are the foundation of our company and guide everything
              we do.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div 
                  className="flex justify-center items-center h-16 w-16 mx-auto rounded-full"
                  style={{ backgroundColor: "#F4E4C1" }}
                >
                  {value.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold" style={{ color: "#00CED1" }}>{value.title}</h3>
                <p className="mt-2" style={{ color: "#6B7280" }}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors We Serve Section */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: "#F8F6F0" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#00CED1" }}>
              Sectors We Serve
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
              We have experience across a wide range of industries.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5" }}
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
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#00CED1" }}>
            Ready to Take the Next Step?
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
            Contact us today to learn more about how we can help you achieve
            your goals.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" style={{ backgroundColor: "#00CED1" }}>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
