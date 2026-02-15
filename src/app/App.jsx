import { HashRouter as Router, Route, Routes } from "react-router-dom";
import SmoothScroller from "../components/SmoothScroller/SmoothScroller";
import Home from "../pages/Home/Home";
import Gallery from "../pages/Gallery/Gallery";
import PictureDetails from "../pages/PictureDetails/PictureDetails";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";
import Navbar from "../components/Navbar/Navbar";
import useUnsplashPics from "../hooks/useUnsplashPics";
import AnimatedRoutes from "../components/AnimatedRoutes/AnimatedRoutes";

function App() {
  const { initialize, pictures, loadNextPage, canDownloadMore, getDetails } = useUnsplashPics();

  const routes = [
    {
      path: "/",
      label: "Home",
      showInNavbar: true,
      element: <Home />,
    },
    {
      path: "/gallery",
      label: "Gallery",
      showInNavbar: true,
      element: (
        <Gallery initialize={initialize} pictures={pictures} loadNextPage={loadNextPage} canDownloadMore={canDownloadMore} />
      ),
    },
    {
      path: "/gallery/:id",
      label: "Details",
      showInNavbar: false,
      element: (
        <PictureDetails getDetails={getDetails} pictures={pictures} loadNextPage={loadNextPage} />
      ),
    },
    {
      path: "/about",
      label: "About",
      showInNavbar: true,
      element: <About />,
    },
    {
      path: "*",
      label: "404",
      showInNavbar: false,
      element: <NotFound />,
    },
  ];

  return (
    <SmoothScroller>
      <Router>
        <Navbar routes={routes} />
        <main>
          <AnimatedRoutes exclude={["/gallery/:id"]}>
            {routes.map((route, i) => {
              return <Route key={"route_" + i} path={route.path} element={route.element} />;
            })}
          </AnimatedRoutes>
        </main>
      </Router>
    </SmoothScroller>
  );
}

export default App;
