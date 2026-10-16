import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Atom, Mail, MapPin, Send, CheckCircle2,
  ExternalLink, Lock, ShieldCheck, Heart, Sparkles
} from 'lucide-react';
import { api } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubStatus('success');
      setEmail('');
    } catch (err) {
      setSubStatus('error');
    } finally {
      setSubLoading(false);
      setTimeout(() => setSubStatus(null), 5000);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/pms-logo.jpeg"
                alt="PMS Logo"
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
              <div>
                <span className="font-heading font-bold text-lg text-white">
                  PIEAS Materials Society
                </span>
                <p className="text-xs text-orange-400 font-mono">
                  DMME • PIEAS Islamabad
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              The official academic society at the Department of Metallurgy & Materials Engineering (DMME), Pakistan Institute of Engineering and Applied Sciences.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                Nilore, Islamabad, Pakistan
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Core Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About Society
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-orange-400 transition-colors">
                  Council & Advisors
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-orange-400 transition-colors">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-orange-400 transition-colors">
                  Student Resources
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-orange-400 transition-colors">
                  Join Society
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Academic & Outreach
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/blog" className="hover:text-orange-400 transition-colors">
                  Material of the Month
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-orange-400 transition-colors">
                  Opportunities Board
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-orange-400 transition-colors">
                  Research & FYPs
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="hover:text-orange-400 transition-colors">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-orange-400 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-orange-400 transition-colors">
                  Partners & Linkages
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay updated on upcoming technical workshops, guest lectures, and opportunities.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@pieas.edu.pk"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-all pr-10"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subStatus === 'success' && (
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
              {subStatus === 'error' && (
                <p className="text-xs text-rose-400 font-mono">
                  Unable to subscribe right now.
                </p>
              )}
            </form>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 block">
                Official Correspondence:
              </span>
              <a
                href="mailto:pms@pieas.edu.pk"
                className="text-xs font-mono text-orange-400 hover:underline"
              >
                pms@pieas.edu.pk
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 flex items-center gap-1">
            © {new Date().getFullYear()} PIEAS Materials Society (PMS). Department of Metallurgy & Materials Engineering.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/swagger-ui"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              API Docs <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              to="/admin"
              className="text-slate-400 hover:text-orange-400 inline-flex items-center gap-1 font-mono transition-colors"
            >
              <Lock className="w-3 h-3" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
