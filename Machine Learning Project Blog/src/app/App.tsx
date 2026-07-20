import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
