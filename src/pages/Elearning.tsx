import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, BookOpen, Star } from "lucide-react";

const courses = [
  {
    title: "Leadership for the Modern Workplace",
    description:
      "Master the skills needed to lead teams effectively in a hybrid environment.",
    duration: "4 weeks",
    rating: 4.8,
    reviews: 120,
    image: "https://picsum.photos/seed/leadership/600/400",
  },
  {
    title: "HR Analytics: Data-Driven Decision Making",
    description:
      "Learn how to use data to make smarter HR decisions and drive business outcomes.",
    duration: "6 weeks",
    rating: 4.9,
    reviews: 250,
    image: "https://picsum.photos/seed/hr-analytics/600/400",
  },
  {
    title: "Payroll & Compliance Masterclass",
    description:
      "A deep dive into Kenyan payroll regulations and compliance best practices.",
    duration: "3 weeks",
    rating: 4.7,
    reviews: 95,
    image: "https://picsum.photos/seed/payroll/600/400",
  },
];

export function ElearningPage() {
  return (
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              E-Learning
            </h1>
            <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
              Upskill your team with our expert-led online courses.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse our catalog of courses designed for HR professionals and
            business leaders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="flex flex-col transform hover:scale-105 transition-transform duration-300"
            >
              <CardHeader className="p-0">
                <img
                  src={course.image}
                  alt={course.title}
                  className="rounded-t-lg h-48 w-full object-cover"
                />
              </CardHeader>
              <CardContent className="grow p-6">
                <CardTitle className="mb-2">{course.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" /> {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    {course.rating} ({course.reviews} reviews)
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to="#">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Learning
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 bg-secondary p-8 rounded-lg">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Custom Training Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Need something more specific? We can create custom e-learning
            content for your organization's unique needs.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">Contact Us for Custom Training</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default ElearningPage;
