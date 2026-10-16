import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { api } from '../api';
import { useSections } from '../hooks';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const { getSection } = useSections();

  const pitchSec = getSection('sponsors_pitch', {
    badge: 'Collaboration',
    title: 'Partner with PIEAS Materials Society',
    subtitle: 'Collaborate with the Department of Metallurgy & Materials Engineering student chapter on technical seminars, industrial training, and student recruitment.',
  });

  useEffect(() => {
    api.getSponsors()
      .then((data) => {
        if (Array.isArray(data)) setSponsors(data);
      })
      .catch((err) => {
        console.error('Failed to load sponsors:', err);
      });
  }, []);

  const getTierBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';
      case 'gold':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
      case 'silver':
        return 'border-slate-400/40 bg-slate-400/10 text-slate-300';
      default:
        return 'border-white/10 bg-white/5 text-slate-400';
    }
  };

  const defaultPartnerBenefits = [
    {
      title: 'Direct Talent Linkages',
      description: 'Engage directly with graduating metallurgy and materials engineering students for internships, trainee programs, and recruitment.',
    },
    {
      title: 'Technical Event Visibility',
      description: 'Prominent organizational presence at society workshops, annual symposia, conference proceedings, and student competitions.',
    },
    {
      title: 'Collaborative Projects',
      description: 'Support student research initiatives, industrial testing challenges, and metallurgical case studies with DMME faculty guidance.',
    },
  ];

  const renderedBenefits = Array.isArray(pitchSec.extra) && pitchSec.extra.length > 0
    ? pitchSec.extra.map((b, idx) => ({
        title: b.title || defaultPartnerBenefits[idx % defaultPartnerBenefits.length].title,
        description: b.desc || b.description || defaultPartnerBenefits[idx % defaultPartnerBenefits.length].description,
      }))
    : defaultPartnerBenefits;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
          Linkages & Collaborations
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Sponsors & Partners
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          We collaborate with research institutions, metallurgical testing labs, and industrial organizations to advance materials engineering education at PIEAS.
        </p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
          <h2 className="font-heading font-bold text-xl text-white">
            Current Partners & Collaborators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="p-6 rounded-2xl glass-card border border-white/10 hover:border-white/25 flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider border ${getTierBadge(sp.tier)}`}>
                    {sp.tier} Partner
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  {sp.name}
                </h3>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Institutional Partner
                </span>
                {sp.website_url && (
                  <a
                    href={sp.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-10 rounded-2xl glass-card border border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20 space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
            {pitchSec.badge || 'Collaboration'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {pitchSec.title || 'Partner with PIEAS Materials Society'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {pitchSec.subtitle || pitchSec.content || 'Connect with materials engineering students at PIEAS for technical seminars, research projects, and campus engagement.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderedBenefits.map((b, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-mono font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                {b.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-slate-400">
            For collaboration inquiries: <strong className="text-orange-400">pms@pieas.edu.pk</strong>
          </p>
          <Link
            to="/join"
            className="px-6 py-2.5 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors shrink-0"
          >
            Inquire for Sponsorship
          </Link>
        </div>
      </section>
    </div>
  );
}
