import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SmoothScroller from "./components/SmoothScroller/SmoothScroller";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import PictureDetails from "./pages/PictureDetails/PictureDetails";
import About from "./pages/About/About";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <SmoothScroller>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<PictureDetails />} />
          <Route path="/about" element={<About />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SmoothScroller>
  );
}

export default App;
