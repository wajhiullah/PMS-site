import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Building, MapPin, Quote, Search
} from 'lucide-react';
import { Linkedin } from '../components/Icons';
import { api } from '../api';

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlumni()
      .then((data) => {
        if (Array.isArray(data)) setAlumni(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load alumni:', err);
        setLoading(false);
      });
  }, []);

  const filtered = alumni.filter((al) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      al.name.toLowerCase().includes(q) ||
      al.organization?.toLowerCase().includes(q) ||
      al.current_position?.toLowerCase().includes(q) ||
      al.research_domain?.toLowerCase().includes(q) ||
      al.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            Alumni
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            DMME Alumni Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Graduates of the Department of Metallurgy & Materials Engineering working across industry, academia, and research organizations.
          </p>
        </div>

        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alumni, domain, company..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((alumnus) => (
          <div
            key={alumnus.id}
            className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={alumnus.photo_url || '/pms-logo.jpeg'}
                  alt={alumnus.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 group-hover:border-cyan-500/50 transition-colors shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Batch: {alumnus.batch}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {alumnus.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {alumnus.current_position}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="text-slate-200 font-medium truncate">{alumnus.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{alumnus.location}</span>
                </div>
                {alumnus.research_domain && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Domain:</span>
                    <span className="text-amber-300 font-mono text-[11px]">{alumnus.research_domain}</span>
                  </div>
                )}
              </div>

              {alumnus.quote_testimonial && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 relative">
                  <Quote className="w-4 h-4 text-cyan-500/30 absolute top-2 right-2" />
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{alumnus.quote_testimonial}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                DMME Graduate
              </span>
              {alumnus.linkedin_url && (
                <a
                  href={alumnus.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No alumni matching "{search}".</p>
        </div>
      )}
    </div>
  );
}
