import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/charts";
import AppRouter from "./Router";

createRoot(document.getElementById("root")).render(<AppRouter />);
