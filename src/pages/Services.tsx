import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building,
  Calculator,
  CheckCircle,
  ClipboardList,
  FileCheck,
  Lightbulb,
  UserCheck,
  Users,
} from "lucide-react";

const services = [
  {
    title: "HR Audit",
    icon: <FileCheck className="w-12 h-12 text-primary" />,
    points: [
      "Ensuring legal compliance with ever-changing rules and regulations.",
      "Helping maintain or improve a competitive advantage.",
      "Establishing efficient documentation and technology practices.",
      "Identifying strengths and weaknesses in training, communications and other employment practices.",
    ],
  },
  {
    title: "Strategic Plans",
    icon: <Lightbulb className="w-12 h-12 text-primary" />,
    points: [
      "Formulating and developing a monitoring and evaluation framework.",
      "Conducting customer and employee satisfaction surveys.",
      "Developing study methodology for field data collection and identification of satisfaction indices.",
      "Reviewing company strategic documents to analyze company capacity and establish business partnerships.",
    ],
  },
  {
    title: "Payroll Outsourcing",
    icon: <Calculator className="w-12 h-12 text-primary" />,
    points: [
      "Managing personnel data administration, compensation and benefits administration, and payroll.",
      "Services include payroll setup and payroll tax filing.",
      "Allows employers to concentrate on their core business and strategic tasks.",
    ],
  },
  {
    title: "HR Function Outsourcing",
    icon: <ClipboardList className="w-12 h-12 text-primary" />,
    points: [
      "Managing time-tracking and benefit deductions.",
      "Providing employee lifecycle management and administering disciplinary procedures.",
      "Preparation of HR policies and handbook.",
      "Ensuring all HR activities are in compliance with labor laws and managing leave.",
    ],
  },
  {
    title: "Manpower Outsourcing",
    icon: <Briefcase className="w-12 h-12 text-primary" />,
    points: [
      "Contracting out professionals, skilled, technical and unskilled personnel.",
      "Improving efficiency, cutting costs, and speeding up product development.",
      "Offering customized services for hiring temporary and permanent manpower.",
      "Strategic alignment of workforce management with business goals.",
    ],
  },
  {
    title: "Recruitment",
    icon: <Users className="w-12 h-12 text-primary" />,
    points: [
      "Sourcing and identifying potential candidates based on client requirements.",
      "Focusing on talent management to implement cost savings and improve customer service.",
      "Utilizing technology to work more strategically.",
      "Maintaining a large internal database of screened candidates.",
    ],
  },
  {
    title: "Employee Coaching",
    icon: <UserCheck className="w-12 h-12 text-primary" />,
    points: [
      "Time-proven processes for employee coaching to get the best suited manpower.",
      "Managed by a team of experienced professionals.",
      "Focus on Self-awareness profiles for young adults and adults.",
      "Personal Mastery Program for young professionals and managers.",
    ],
  },
  {
    title: "Corporate Training",
    icon: <Building className="w-12 h-12 text-primary" />,
    points: [
      "Undertaking a training needs analysis to identify training gaps.",
      "Reviewing current human resources policies, procedures, and systems.",
      "Identifying needs for improvement and enhancement of the HR function.",
      "Assessing compliance with ever-changing rules and regulations.",
    ],
  },
];

export function ServicesPage() {
  return (
    <div>
      <section className="text-center py-12 md:py-20 bg-gradient-to-b from-white to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4">
            Comprehensive solutions to empower your business
          </p>
        </div>
      </section>

      {services.map((service, index) => (
        <section
          key={service.title}
          className={index % 2 === 0 ? "bg-white" : "bg-muted"}
        >
          <div className="container mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center md:col-span-1">
                {service.icon}
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold">{service.title}</h2>
                <ul className="mt-4 space-y-2">
                  {service.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
