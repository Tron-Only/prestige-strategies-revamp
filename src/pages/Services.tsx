import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "HR Audit",
    description:
      "HR audits accomplish variety of objectives, involves systematically reviewing all aspects of human resources in your esteemed company such as ensuring legal compliance; helping maintain or improve a competitive advantage; establishing efficient documentation and technology practices; and identifying strengths and weaknesses in training, communications and other employment practices with the aim of to assess compliance with ever-changing rules and regulations.",
  },
  {
    title: "Strategic Plans",
    description:
      "Formulating and developing a monitoring and evaluation framework by conducting monitoring and evaluation programs to align business strategy and execution of strategic plans. We identify customer and employee satisfaction survey and workplace survey for various organizations. We develop study methodology by conducting field data collection, identification of satisfaction indices. We review of company strategic documents by evaluating the company mission, vision, key objectives and organizational structure to give analysis of company capacity and establish business partnerships for growth.",
  },
  {
    title: "Payroll Outsourcing",
    description:
      "Outsourcing payroll allows Prestige Strategies to manage your organization personnel data administration, compensation and benefits administration, payroll and statutory payment administration. Payroll administration services include payroll setup and payroll tax filing. This allows employers to concentrate on their core business and frees up the business owner, human resources or accounting personnel to work more on strategic tasks that could ultimately affect your bottom line.",
  },
  {
    title: "HR Function Outsourcing",
    description:
      "Outsourcing of HR functions support teams that manages all of the moving parts including time-tracking and benefit deductions. We provide provisions on employee lifecycle management, administering disciplinary procedures, preparation of HR policies and handbook, ensure all HR activities are in compliance with labor laws and leave management.",
  },
  {
    title: "Manpower Outsourcing",
    description:
      "We contract out and manage professionals, skilled, technical and unskilled personnel at all levels on a short to long-term basis. This improves efficiency, cuts cost, speeds up product development, and allows companies to focus on their core competencies, we will provide a great choice from our robust database of skilled manpower. We offer customized services to help reduce the time, effort and cost associated with hiring temporary and permanent manpower. Strategic alignment of workforce management with business goals, talent acquisition and management and performance management.",
  },
  {
    title: "Recruitment",
    description:
      "Our recruiters will source and identify potential candidates based on the requirements of the clients. We focus on talent management, this allows organization to implement cost savings measures, improve on customer service and the ability to take advantage of technology to work more strategically and less transactional. We maintain a large internal database of screened candidates.",
  },
  {
    title: "Employee Coaching",
    description:
      "Coaching and cost associated with personal development is high. Our time-proven processes for employee coaching ensure that our clients get the manpower best suited for their positions. Prestige Strategies employee coaching division is managed by a team of experienced professionals to provide the best possible service. The team takes care of the interests of our customers as well as the welfare of our employees. We focus on Self-awareness profiles for young adults and adults, Personal Mastery Program for young professionals and managers.",
  },
  {
    title: "Corporate Training",
    description:
      "Prestige strategies comprehends corporate training by undertaking a training needs analysis. This involves systematically reviewing all aspects of training gaps from board level, senior management to all carders of employee resource capital in your esteemed company. We review current human resources policies, procedures, documentation and systems to identify needs for improvement and enhancement of the HR function as well as to assess compliance with ever-changing rules and regulations.",
  },
];

export function ServicesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <Card key={service.title}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
