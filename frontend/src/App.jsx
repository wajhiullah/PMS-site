import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementsBanner from './components/AnnouncementsBanner';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Opportunities from './pages/Opportunities';
import Alumni from './pages/Alumni';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Join from './pages/Join';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto text-2xl font-mono font-bold">
        404
      </div>
      <h1 className="text-3xl font-heading font-bold text-white">Page Not Found</h1>
      <p className="text-sm text-slate-300">
        The page or link you requested does not exist on the PMS platform.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col transition-colors duration-300 page-root">
        <AnnouncementsBanner />
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/join" element={<Join />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
