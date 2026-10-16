import React, { useState, useEffect } from 'react';
import {
  MapPin, ExternalLink, CheckCircle, EyeOff, Eye, Building, Briefcase
} from 'lucide-react';
import { api } from '../api';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [hideExpired, setHideExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  const types = [
    'All',
    'Internship',
    'Scholarship',
    'Research Position',
    'Conference',
    'Job',
    'Competition'
  ];

  useEffect(() => {
    api.getOpportunities()
      .then((data) => {
        if (Array.isArray(data)) setOpportunities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load opportunities:', err);
        setLoading(false);
      });
  }, []);

  const getDeadlineHealth = (deadlineStr) => {
    if (!deadlineStr) return { status: 'active', label: 'Rolling Basis', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    const nowMs = Date.now();
    const deadline = new Date(deadlineStr).getTime();
    const diffDays = Math.ceil((deadline - nowMs) / (1000 * 60 * 60 * 24));


    if (diffDays < 0) {
      return { status: 'expired', label: 'Expired', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
    if (diffDays <= 7) {
      return { status: 'closing-soon', label: `Closing Soon (${diffDays}d left)`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    }
    return { status: 'active', label: `${diffDays} days left`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const filtered = opportunities.filter((opp) => {
    const health = getDeadlineHealth(opp.deadline);
    if (hideExpired && health.status === 'expired') return false;
    if (selectedType === 'All') return true;
    return opp.opportunity_type?.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
          Placements
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Opportunities Board
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Internships, graduate scholarships, and research openings relevant to metallurgy and materials engineering students.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedType === t
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setHideExpired(!hideExpired)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors shrink-0 ${
            hideExpired ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          {hideExpired ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{hideExpired ? 'Hiding Expired' : 'Hide Expired Listings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((opp) => {
          const health = getDeadlineHealth(opp.deadline);
          return (
            <div
              key={opp.id}
              className={`p-6 rounded-2xl glass-card border ${
                health.status === 'expired' ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-emerald-500/30'
              } flex flex-col justify-between transition-all duration-300 group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase bg-white/10 text-slate-300 border border-white/10">
                    {opp.opportunity_type}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${health.color}`}>
                    {health.label}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <Building className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-medium text-slate-300">{opp.organization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {opp.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {opp.posted_by_alumnus && (
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-cyan-400" />
                    <span>Shared by Alumnus: {opp.posted_by_alumnus}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Open'}
                </span>
                <a
                  href={opp.apply_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
                    health.status === 'expired'
                      ? 'bg-white/5 text-slate-500 pointer-events-none'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  } transition-all`}
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <Briefcase className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No active opportunities in this category.</p>
          <p className="text-xs">Check back soon or explore other placement categories.</p>
        </div>
      )}
    </div>
  );
}
