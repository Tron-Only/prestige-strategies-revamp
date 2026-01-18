import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Briefcase,
  CircleDollarSign,
  Contact,
  ShieldCheck,
  Users,
} from "lucide-react";

const services = [
  {
    title: "HR Audit",
    description:
      "Systematically reviewing all aspects of human resources to ensure legal compliance and identify areas for improvement.",
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
  },
  {
    title: "Strategic Plans",
    description:
      "Formulating and developing a monitoring and evaluation framework to align business strategy and execution of strategic plans.",
    icon: <AreaChart className="w-10 h-10 text-primary" />,
  },
  {
    title: "Payroll Outsourcing",
    description:
      "Managing your organization's personnel data administration, compensation and benefits, and payroll.",
    icon: <CircleDollarSign className="w-10 h-10 text-primary" />,
  },
  {
    title: "Recruitment",
    description:
      "Sourcing and identifying potential candidates based on the requirements of the clients, with a focus on talent management.",
    icon: <Users className="w-10 h-10 text-primary" />,
  },
  {
    title: "Corporate Training",
    description:
      "Undertaking a training needs analysis to identify needs for improvement and enhancement of the HR function.",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
  },
  {
    title: "Manpower Outsourcing",
    description:
      "Contracting out and managing professionals, skilled, technical and unskilled personnel at all levels.",
    icon: <Contact className="w-10 h-10 text-primary" />,
  },
];

export function Services() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Our Comprehensive Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We offer a wide range of services to meet your HR needs.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded-full">
                  {service.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-semibold">
                  {service.title}
                </CardTitle>
                <p className="mt-2 text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
