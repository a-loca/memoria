import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SmoothScroller from "../components/SmoothScroller/SmoothScroller";
import Home from "../pages/Home/Home";
import Gallery from "../pages/Gallery/Gallery";
import PictureDetails from "../pages/PictureDetails/PictureDetails";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";
import Navbar from "../components/Navbar/Navbar";
import useUnsplashPics from "../hooks/useUnsplashPics";

function App() {
  const { pictures, loadNext, canDownloadMore, getDetails } = useUnsplashPics();
  return (
    <SmoothScroller>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery pictures={pictures} loadNext={loadNext} canDownloadMore={canDownloadMore} />} />
            <Route path="/gallery/:id" element={<PictureDetails getDetails={getDetails} pictures={pictures} />} />
            <Route path="/about" element={<About />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </SmoothScroller>
  );
}

export default App;
