import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { HomePage } from "./pages/Home.tsx";
import { AboutPage } from "./pages/About.tsx";
import { ServicesPage } from "./pages/Services.tsx";
import { ResourcesPage } from "./pages/Resources.tsx";
import { EventsPage } from "./pages/Events.tsx";
import { ElearningPage } from "./pages/Elearning.tsx";
import { UploadCvPage } from "./pages/UploadCv.tsx";
import { TestimonialsPage } from "./pages/Testimonials.tsx";
import { ContactPage } from "./pages/Contact.tsx";
import Jobs from "./pages/Jobs.tsx";
import Courses from "./pages/Courses.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";

// Admin imports
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { StudentAuthProvider } from "./contexts/StudentAuthContext.tsx";
import { ProtectedRoute } from "./components/admin/ProtectedRoute.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import JobsList from "./pages/admin/JobsList.tsx";
import JobForm from "./pages/admin/JobForm.tsx";
import EventsList from "./pages/admin/EventsList.tsx";
import EventForm from "./pages/admin/EventForm.tsx";
import CoursesList from "./pages/admin/CoursesList.tsx";
import CourseForm from "./pages/admin/CourseForm.tsx";
import ModuleManager from "./pages/admin/ModuleManager.tsx";

// Student imports
import StudentDashboard from "./pages/StudentDashboard.tsx";
import CoursePlayer from "./pages/CoursePlayer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "resources",
        element: <ResourcesPage />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "courses/:id",
        element: <CourseDetail />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "e-learning",
        element: <ElearningPage />,
      },
      {
        path: "upload-cv",
        element: <UploadCvPage />,
      },
      {
        path: "testimonials",
        element: <TestimonialsPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "learn/:id",
        element: <CoursePlayer />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "jobs",
        element: <JobsList />,
      },
      {
        path: "jobs/new",
        element: <JobForm />,
      },
      {
        path: "jobs/edit/:id",
        element: <JobForm />,
      },
      {
        path: "events",
        element: <EventsList />,
      },
      {
        path: "events/new",
        element: <EventForm />,
      },
      {
        path: "events/edit/:id",
        element: <EventForm />,
      },
      {
        path: "courses",
        element: <CoursesList />,
      },
      {
        path: "courses/new",
        element: <CourseForm />,
      },
      {
        path: "courses/edit/:id",
        element: <CourseForm />,
      },
      {
        path: "courses/:id/modules",
        element: <ModuleManager />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <StudentAuthProvider>
        <RouterProvider router={router} />
      </StudentAuthProvider>
    </AuthProvider>
  </StrictMode>,
);
