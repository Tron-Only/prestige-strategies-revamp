import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, FileText, BadgePercent } from "lucide-react";

type BenefitsProps = {
  className?: string;
};

const benefits = [
  {
    title: "Stronger Networks",
    description:
      "Connect with leaders and peers across sectors to share insights, opportunities, and best practices.",
    icon: <Users className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Events & Workshops",
    description:
      "Access exclusive events, learning sessions, and practical workshops designed to accelerate growth.",
    icon: <CalendarDays className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Exclusive Resources",
    description:
      "Get curated guides, toolkits, and templates that help streamline your HR and people operations.",
    icon: <FileText className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Member Discounts",
    description:
      "Enjoy preferential pricing on trainings, services, and partner offerings that add measurable value.",
    icon: <BadgePercent className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
];

type CounterProps = {
  to: number;
  duration?: number;
  suffix?: string;
  formatter?: (n: number) => string;
  className?: string;
};

function Counter({
  to,
  duration = 1400,
  suffix = "",
  formatter = (n) => new Intl.NumberFormat().format(n),
  className = "",
}: CounterProps) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${formatter(to)}${suffix}`}
    >
      {formatter(value)}
      {suffix}
    </span>
  );
}

export function Benefits({ className = "" }: BenefitsProps) {
  return (
    <section
      aria-labelledby="benefits-heading"
      className={`py-16 sm:py-24 ${className}`}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="benefits-heading"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: "#0D3B66" }}
          >
            Our Benefits
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
            Why organisations choose Prestige Strategies
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Card className="text-center border-0 shadow-sm">
                <CardHeader>
                  <div 
                    className="flex justify-center items-center h-16 w-16 mx-auto rounded"
                    style={{ backgroundColor: "#F4E4C1" }}
                  >
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle 
                    className="text-xl font-semibold"
                    style={{ color: "#0D3B66" }}
                  >
                    {item.title}
                  </CardTitle>
                  <p className="mt-2" style={{ color: "#6B7280" }}>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="p-6 border rounded text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold" style={{ color: "#0D3B66" }}>
              <Counter to={1000} suffix="+" />
            </div>
            <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              Professionals Supported
            </div>
          </motion.div>
          <motion.div
            className="p-6 border rounded text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold" style={{ color: "#0D3B66" }}>
              <Counter to={50} suffix="+" />
            </div>
            <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              Trainings Yearly
            </div>
          </motion.div>
          <motion.div
            className="p-6 border rounded text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold" style={{ color: "#0D3B66" }}>
              <Counter to={10} suffix="+" />
            </div>
            <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              Years Experience
            </div>
          </motion.div>
          <motion.div
            className="p-6 border rounded text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold" style={{ color: "#0D3B66" }}>
              <Counter to={98} suffix="%" />
            </div>
            <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              Client Satisfaction
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" style={{ backgroundColor: "#0D3B66" }}>
            <Link to="/contact">Talk to our team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Benefits;
