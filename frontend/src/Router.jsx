import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DatasetProvider from "./components/DatasetProvider";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Insights from "./pages/Insights";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const AppRouter = () => {
  return (
    <DatasetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DatasetProvider>
  );
};

export default AppRouter;
