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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
