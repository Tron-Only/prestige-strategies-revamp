import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import "./index.css";

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
