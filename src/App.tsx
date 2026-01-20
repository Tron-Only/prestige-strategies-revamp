import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import "./index.css";
import { BackToTop } from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";

export function App() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <ScrollToTop />
      <main className="grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="min-h-[60vh]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
