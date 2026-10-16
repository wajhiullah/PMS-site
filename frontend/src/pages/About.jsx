import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Compass, BookOpen, Download,
  ChevronDown, ChevronUp, Mail
} from 'lucide-react';
import { Linkedin } from '../components/Icons';
import { api } from '../api';
import { useSections } from '../hooks';

export default function About() {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  const { getSection } = useSections();

  const missionSec = getSection('about_mission', {
    title: 'Our Mission',
    content: 'To bridge academic metallurgical theory with practical industry applications. PMS equips students with hands-on exposure to phase diagrams, materials characterization, failure analysis, and professional engineering standards.',
  });

  const visionSec = getSection('about_vision', {
    title: 'Our Vision',
    content: 'To cultivate a collaborative community of materials engineers and researchers at PIEAS who contribute meaningfully to academia, strategic industries, and advanced manufacturing.',
  });

  const storySec = getSection('about_story', {
    badge: 'Department & Society',
    title: 'About PMS and DMME',
    content: 'The Department of Metallurgy & Materials Engineering (DMME) at PIEAS is dedicated to education and research in metallurgy, materials characterization, and advanced manufacturing. PMS was founded by students and faculty to provide an active extracurricular platform for technical workshops, guest lectures, industrial tours, and peer mentorship.',
  });

  useEffect(() => {
    Promise.all([
      api.getFaqs().catch(() => []),
      api.getTeam().catch(() => []),
    ]).then(([faqsData, teamData]) => {
      if (Array.isArray(faqsData)) setFaqs(faqsData);
      if (Array.isArray(teamData)) {
        const fac = teamData.find((m) => m.is_faculty_advisor);
        if (fac) setAdvisor(fac);
      }
    });
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      <section className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
          About The Society
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          PIEAS Materials Society
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The student-led academic society of the Department of Metallurgy & Materials Engineering (DMME) at the Pakistan Institute of Engineering and Applied Sciences (PIEAS), Islamabad.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl glass-card border border-orange-500/30 bg-gradient-to-br from-slate-900 to-orange-950/20 relative overflow-hidden space-y-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">
            {missionSec.title || 'Our Mission'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {missionSec.content || missionSec.subtitle}
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-cyan-950/20 relative overflow-hidden space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">
            {visionSec.title || 'Our Vision'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {visionSec.content || visionSec.subtitle}
          </p>
        </div>
      </section>

      <section className="p-8 sm:p-10 rounded-2xl glass-card border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            {storySec.badge || 'Department & Society'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          {storySec.title || 'About PMS and DMME'}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          {storySec.content || storySec.subtitle}
        </p>
      </section>

      {advisor && (
        <section className="p-8 sm:p-10 rounded-2xl glass-card border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <img
                src={advisor.photo_url || '/pms-logo.jpeg'}
                alt={advisor.name}
                className="w-44 h-44 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                  Faculty Advisor
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                  {advisor.name}
                </h3>
                <p className="text-sm text-orange-400 font-medium">
                  {advisor.role} • Department of Metallurgy & Materials Engineering
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{advisor.bio || 'PMS provides our students with practical avenues to deepen their technical curiosity and translate classroom concepts into engineering competence.'}"
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-400">
                {advisor.email && (
                  <a
                    href={`mailto:${advisor.email}`}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>{advisor.email}</span>
                  </a>
                )}
                {advisor.linkedin_url && (
                  <a
                    href={advisor.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>Academic Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="p-6 sm:p-8 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-400" />
            <h3 className="text-xl font-heading font-bold text-white">
              PMS Constitution & Bylaws
            </h3>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl">
            Review the official society charter, portfolio descriptions, election procedures, and student code of conduct.
          </p>
        </div>

        <a
          href="/uploads/pms-constitution.pdf"
          target="_blank"
          download
          className="px-6 py-3 rounded-xl font-heading font-semibold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download Charter (PDF)</span>
        </a>
      </section>

      <section className="space-y-6">
        <div className="text-left space-y-2">
          <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
            Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-300">
            Answers to common questions regarding society membership, events, and activities.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="rounded-xl glass-card border border-white/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-orange-400 transition-colors"
              >
                <span className="font-heading font-semibold text-base">
                  {faq.question}
                </span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-xl font-heading font-bold text-white">
            Get Involved with PMS
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            Join the society as an active member or participate in upcoming workshops and events.
          </p>
        </div>
        <Link
          to="/join"
          className="px-6 py-3 rounded-xl font-heading font-semibold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 shrink-0"
        >
          Apply for Membership
        </Link>
      </section>
    </div>
  );
}
