import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Sun, Moon, Atom,
  Sparkles, Briefcase, GraduationCap, Image, Handshake
} from 'lucide-react';
import { useTheme } from '../hooks';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const exploreLinks = [
    { name: 'Blog & Materials', path: '/blog', icon: Atom, desc: 'Technical explainers & Material of the Month' },
    { name: 'Opportunities Board', path: '/opportunities', icon: Briefcase, desc: 'Internships, scholarships & jobs' },
    { name: 'Research & FYPs', path: '/projects', icon: Sparkles, desc: 'Undergrad thesis & competition showcase' },
    { name: 'Alumni Network', path: '/alumni', icon: GraduationCap, desc: 'Directory of DMME graduates globally' },
    { name: 'Photo Gallery', path: '/gallery', icon: Image, desc: 'Events, lab visits & symposium archive' },
    { name: 'Sponsors & Partners', path: '/sponsors', icon: Handshake, desc: 'Industrial collaborators & sponsorship' },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-[#0B0F17]/80 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg overflow-hidden p-0.5 bg-gradient-to-tr from-orange-500 to-amber-400 group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/pms-logo.jpeg"
                  alt="PMS Logo"
                  className="w-full h-full rounded-[7px] object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-wider text-white group-hover:text-orange-400 transition-colors">
                  PMS
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  DMME
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                PIEAS Materials Society
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/team', label: 'Council' },
              { path: '/events', label: 'Events' },
              { path: '/resources', label: 'Resources' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-orange-400 font-semibold bg-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  exploreLinks.some((l) => isActive(l.path))
                    ? 'text-cyan-400 font-semibold bg-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Explore</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-orange-400' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F172A]/98 border border-white/10 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/5 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Portfolios & Links
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      PMS
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {exploreLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-start gap-3 p-2 rounded-xl transition-all duration-150 ${
                            isActive(item.path)
                              ? 'bg-orange-500/15 text-orange-400 font-semibold'
                              : 'hover:bg-white/5 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-white/5 text-orange-400 shrink-0 border border-white/5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold leading-tight">{item.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-white/10 hover:border-orange-500/30 bg-white/5 text-slate-300 hover:text-white transition-all duration-150"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            <Link
              to="/join"
              className="px-4 py-2 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm active:scale-95"
            >
              Join PMS
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
              aria-label="Open navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0B0F17]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/5">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About DMME' },
              { path: '/team', label: 'Council' },
              { path: '/events', label: 'Events' },
              { path: '/resources', label: 'Resources Hub' },
              { path: '/blog', label: 'Blog & Materials' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-orange-400 bg-orange-500/10 font-bold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 font-bold">
              Explore Portfolios
            </span>
            <div className="grid grid-cols-1 gap-1">
              {exploreLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/join"
              className="w-full text-center py-3 rounded-xl font-heading font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25"
            >
              Join PMS Council & Society
            </Link>
            <Link
              to="/admin"
              className="w-full text-center py-2 text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Council Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
