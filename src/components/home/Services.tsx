import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
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
    icon: <ShieldCheck className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Strategic Plans",
    description:
      "Formulating and developing a monitoring and evaluation framework to align business strategy and execution of strategic plans.",
    icon: <AreaChart className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Payroll Outsourcing",
    description:
      "Managing your organization's personnel data administration, compensation and benefits, and payroll.",
    icon: <CircleDollarSign className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Recruitment",
    description:
      "Sourcing and identifying potential candidates based on the requirements of the clients, with a focus on talent management.",
    icon: <Users className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Corporate Training",
    description:
      "Undertaking a training needs analysis to identify needs for improvement and enhancement of the HR function.",
    icon: <Briefcase className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
  {
    title: "Manpower Outsourcing",
    description:
      "Contracting out and managing professionals, skilled, technical and unskilled personnel at all levels.",
    icon: <Contact className="w-8 h-8" style={{ color: "#D4AF37" }} />,
  },
];

export function Services() {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "#F8F6F0" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            What We Offer
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
            Discover the services we provide to help your organisation thrive.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.38 }}
            >
              <Card className="text-center border-0 shadow-sm">
                <CardHeader>
                  <div 
                    className="flex justify-center items-center h-16 w-16 mx-auto rounded-full"
                    style={{ backgroundColor: "#F4E4C1" }}
                  >
                    {service.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold" style={{ color: "#0D3B66" }}>
                    {service.title}
                  </CardTitle>
                  <p className="mt-2" style={{ color: "#6B7280" }}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
