import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";

export function App() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Outlet />
    </main>
  );
}

export default App;
