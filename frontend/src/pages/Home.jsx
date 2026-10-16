import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Calendar, Award, Building,
  CheckCircle2, ChevronRight, BookOpen,
  Atom, Shield, Microscope, Cpu, ArrowUpRight, Clock, MapPin
} from 'lucide-react';
import { api } from '../api';
import { useCountUp, useSections } from '../hooks';
import CrystalVisualizer from '../components/CrystalVisualizer';
import RegistrationModal from '../components/RegistrationModal';

function StatCounter({ target, suffix = '+', label, sublabel, colorClass = 'text-white' }) {
  const { count, ref } = useCountUp(target || 0, 1600);
  return (
    <div ref={ref} className="space-y-1.5 p-2">
      <span className={`text-3xl sm:text-4xl font-heading font-extrabold ${colorClass}`}>
        {count}{suffix}
      </span>
      <p className="text-xs sm:text-sm font-medium text-slate-200">{label}</p>
      <span className="text-[11px] font-mono text-slate-400 block">{sublabel}</span>
    </div>
  );
}

const DEFAULT_ACTIVITIES = [
  {
    title: 'Technical Seminars',
    icon: Atom,
    color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400',
    description: 'Technical lectures by researchers and engineers on advanced materials, characterization, and metallurgical processing.',
  },
  {
    title: 'Hands-On Workshops',
    icon: Cpu,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    description: 'Practical training on metallurgical tools including Thermo-Calc, optical metallography, hardness testing, and computational modeling.',
  },
  {
    title: 'Competitions & Olympiads',
    icon: Award,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    description: 'Materials design competitions, metallography contests, technical poster sessions, and engineering quizzes.',
  },
  {
    title: 'Industrial & Lab Visits',
    icon: Building,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    description: 'Organized educational visits to metallurgical manufacturing units, testing laboratories, and research facilities.',
  },
];

const ICON_MAP = {
  Atom,
  Cpu,
  Award,
  Building,
  Microscope,
  Shield,
  BookOpen,
};

export default function Home() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { getSection } = useSections();

  const heroSec = getSection('home_hero', {
    badge: 'DMME • PIEAS Islamabad',
    title: 'Advancing Materials Science & Metallurgy at PIEAS',
    subtitle: 'The official academic society of the Department of Metallurgy & Materials Engineering (DMME), PIEAS. Connecting students with research, practical engineering, and career development.',
  });

  const activitiesSec = getSection('home_activities', {
    badge: 'Society Portfolios',
    title: 'Bridging Theory and Materials Engineering',
    subtitle: 'PMS organizes initiatives designed to support metallurgy students in academic research and industrial engineering.',
  });

  useEffect(() => {
    Promise.all([
      api.getStats().catch(() => null),
      api.getEvents('is_past=false').catch(() => []),
      api.getPosts('category=Material of the Month').catch(() => []),
    ]).then(([statsData, eventsData, postsData]) => {
      if (statsData) setStats(statsData);
      if (Array.isArray(eventsData)) setEvents(eventsData.slice(0, 3));
      if (Array.isArray(postsData) && postsData.length > 0) {
        setFeaturedPost(postsData[0]);
      }
    });
  }, []);

  const renderedActivities = Array.isArray(activitiesSec.extra) && activitiesSec.extra.length > 0
    ? activitiesSec.extra.map((act, idx) => {
        const fallback = DEFAULT_ACTIVITIES[idx % DEFAULT_ACTIVITIES.length];
        return {
          title: act.title,
          icon: ICON_MAP[act.icon] || fallback.icon,
          color: fallback.color,
          description: act.desc || act.description || fallback.description,
        };
      })
    : DEFAULT_ACTIVITIES;

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-24">
      <section className="relative pt-8 sm:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-mono text-orange-300 font-semibold uppercase tracking-wider">
                  {heroSec.badge || 'DMME • PIEAS Islamabad'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-[1.15]">
                {heroSec.title || 'Advancing Materials Science & Metallurgy at PIEAS'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {heroSec.subtitle || heroSec.content || 'The official academic society of the Department of Metallurgy & Materials Engineering (DMME), PIEAS.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/join"
                  className="px-6 py-3 rounded-xl font-heading font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center gap-2 group active:scale-95"
                >
                  <span>Join PMS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/resources"
                  className="px-6 py-3 rounded-xl font-heading font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Student Resources</span>
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>DMME PIEAS Student Chapter</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CrystalVisualizer />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-xl">
            <StatCounter
              target={stats?.active_members || 85}
              suffix="+"
              label="Active Members"
              sublabel="Undergraduate & Graduate"
              colorClass="text-orange-400"
            />
            <StatCounter
              target={stats?.events_held || 42}
              suffix="+"
              label="Events & Sessions"
              sublabel="Seminars and workshops"
              colorClass="text-cyan-400"
            />
            <StatCounter
              target={stats?.years_active || 6}
              suffix="+"
              label="Years Active"
              sublabel="Established at DMME"
              colorClass="text-purple-400"
            />
            <StatCounter
              target={stats?.industrial_partners || 12}
              suffix="+"
              label="Industry Partners"
              sublabel="Collaborative linkages"
              colorClass="text-emerald-400"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
            {activitiesSec.badge || 'Society Portfolios'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-1">
            {activitiesSec.title || 'Bridging Theory and Materials Engineering'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {activitiesSec.subtitle || activitiesSec.content || 'PMS organizes initiatives designed to support metallurgy students in academic research and industrial engineering.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderedActivities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl glass-card border border-white/10 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl p-3 bg-gradient-to-br ${act.color} border mb-5`}>
                  <Icon className="w-full h-full" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {act.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Calendar & Registration
            </span>
            <h2 className="text-3xl font-heading font-bold text-white mt-1">
              Upcoming Events & Symposia
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 group"
          >
            <span>View Full Events Calendar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {ev.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {ev.time_range || 'TBA'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {ev.short_description}
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span>{new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{ev.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 truncate max-w-[65%] font-mono" title={ev.speaker_or_organizer || 'PMS Technical Council'}>
                    {ev.speaker_or_organizer || 'PMS Technical Council'}
                  </span>
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors shrink-0"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-card border border-white/10 text-center text-slate-400">
            <p>New event schedule will be posted shortly. Check our announcements banner!</p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 rounded-2xl glass-card border border-orange-500/30 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20 shadow-2xl relative overflow-hidden flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Material of the Month
                </span>
                <span className="text-xs font-mono text-slate-400">DMME Series</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                {featuredPost?.title || 'Zircaloy-4 & Inconel 718: Superalloys in Nuclear Cladding'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-amber-300">
                  Formula: {featuredPost?.material_formula || 'Zr-1.5Sn-0.2Fe-0.1Cr'}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-cyan-300">
                  Lattice: {featuredPost?.crystal_structure || 'HCP (α-phase) + BCC (β)'}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {featuredPost?.excerpt ||
                  'Zirconium alloys possess a low thermal neutron capture cross-section paired with high corrosion resistance in pressurized water reactors, serving as essential cladding materials in nuclear engineering.'}
              </p>
            </div>

            <div className="pt-4 pb-1 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono truncate max-w-[50%]">
                By {featuredPost?.author_name || 'PMS Technical Council'}
              </span>
              <Link
                to={featuredPost ? `/blog?post=${featuredPost.slug}` : '/blog'}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 shrink-0"
              >
                <span>Read Technical Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl glass-card border border-white/10 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Microscope className="w-full h-full" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Undergraduate Materials Toolkit
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Access curated guides for Thermo-Calc, JMatPro, OriginPro, ImageJ quantitative metallography, and Callister study resources.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ASTM standards summaries for tensile and hardness testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chemical etching and metallographic preparation guidelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Crystallographic databases and phase diagram references</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <Link
                to="/resources"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Browse Student Resources</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-12">
        <p className="text-center text-xs font-mono uppercase text-slate-400 tracking-wider mb-6">
          Collaborations & Linkages
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          <span className="text-sm sm:text-base font-heading font-bold text-slate-300">
            DMME • PIEAS
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-slate-300">
            PAEC
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-slate-300">
            NESCOM
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-slate-300">
            Heavy Mechanical Complex (HMC)
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-slate-300">
            Pakistan Engineering Council (PEC)
          </span>
        </div>
      </section>

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
