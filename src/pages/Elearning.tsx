import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, BookOpen, GraduationCap, Clock } from "lucide-react";
import { api } from "@/services/api";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  category: string;
  level: string;
  duration_hours: number;
}

export function ElearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Load only published courses
      const response = await api.get("/api/courses/list.php?status=published");
      setCourses(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-secondary/50 rounded-lg p-12 text-center">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No courses available yet</p>
            <p className="text-muted-foreground/70 mt-2">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col transform hover:scale-105 transition-transform duration-300"
              >
                <CardHeader className="p-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="rounded-t-lg h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="rounded-t-lg h-48 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="h-20 w-20 text-white opacity-50" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="grow p-6">
                  <CardTitle className="mb-2">{course.title}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> {course.duration_hours}h
                    </div>
                    <div className="flex items-center capitalize">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {course.level}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {course.currency} {course.price.toLocaleString()}
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.id}`}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      View Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
