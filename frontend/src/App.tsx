import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingView from "./views/LandingView";
import RoadmapView from "./views/RoadmapView";
import ToolboxView from "./views/ToolboxView";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/journey" element={<RoadmapView />} />
            <Route path="/toolkit" element={<ToolboxView />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
          Built with 💜 By Mohamed El aassal
        </footer>
      </div>
    </Router>
  );
}

export default App;
