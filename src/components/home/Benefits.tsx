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
    icon: <Users className="w-10 h-10 text-primary" />,
  },
  {
    title: "Events & Workshops",
    description:
      "Access exclusive events, learning sessions, and practical workshops designed to accelerate growth.",
    icon: <CalendarDays className="w-10 h-10 text-primary" />,
  },
  {
    title: "Exclusive Resources",
    description:
      "Get curated guides, toolkits, and templates that help streamline your HR and people operations.",
    icon: <FileText className="w-10 h-10 text-primary" />,
  },
  {
    title: "Member Discounts",
    description:
      "Enjoy preferential pricing on trainings, services, and partner offerings that add measurable value.",
    icon: <BadgePercent className="w-10 h-10 text-primary" />,
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
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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
      className={`py-16 sm:py-24 bg-background ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2
            id="benefits-heading"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Our Benefits
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
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
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold">
                    {item.title}
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground">
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
            className="p-6 bg-card border rounded text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold">
              <Counter to={1000} suffix="+" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Professionals Supported
            </div>
          </motion.div>
          <motion.div
            className="p-6 bg-card border rounded text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold">
              <Counter to={50} suffix="+" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Trainings Yearly
            </div>
          </motion.div>
          <motion.div
            className="p-6 bg-card border rounded text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold">
              <Counter to={10} suffix="+" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Years Experience
            </div>
          </motion.div>
          <motion.div
            className="p-6 bg-card border rounded text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="text-3xl font-extrabold">
              <Counter to={98} suffix="%" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Client Satisfaction
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/contact">Talk to our team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Benefits;
