import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";
import "./index.css";

export function App() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Outlet />
    </main>
  );
}

export default App;
