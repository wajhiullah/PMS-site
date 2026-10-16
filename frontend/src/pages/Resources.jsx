import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, ExternalLink, Cpu, Database,
  ShieldAlert, Pin
} from 'lucide-react';
import { api } from '../api';
import { useSections } from '../hooks';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { getSection } = useSections();

  const standardsSec = getSection('resources_standards', {
    badge: 'Standards',
    title: 'Materials Testing & Cheatsheets',
    subtitle: 'ASTM & Metallography Protocols',
  });

  const categories = [
    'All',
    'Software Guides',
    'Phase Diagrams & Databases',
    'Standards (ASTM/ISO)',
    'Lab Safety'
  ];

  useEffect(() => {
    api.getResources()
      .then((data) => {
        if (Array.isArray(data)) setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setLoading(false);
      });
  }, []);

  const filtered = resources.filter((res) => {
    const cat = (res.category || '').toLowerCase();
    const sel = selectedCategory.toLowerCase();
    const matchesCat =
      selectedCategory === 'All' ||
      cat.includes(sel) ||
      (sel.includes('safety') && cat.includes('safety')) ||
      (sel.includes('standard') && cat.includes('standard'));

    const matchesSearch =
      !search ||
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description?.toLowerCase().includes(search.toLowerCase()) ||
      res.software_tag?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    if (category?.includes('Software')) return Cpu;
    if (category?.includes('Phase') || category?.includes('Database')) return Database;
    if (category?.includes('Safety') || category?.includes('Standards')) return ShieldAlert;
    return BookOpen;
  };

  const defaultStandards = [
    { code: 'ASTM E8 / E8M', title: 'Tension Testing of Metallic Materials', detail: 'Yield strength, UTS & elongation protocol', color: 'text-cyan-400' },
    { code: 'ASTM E112', title: 'Determining Average Grain Size', detail: 'Heyn lineal intercept & comparison charts', color: 'text-orange-400' },
    { code: 'ASTM E23', title: 'Charpy V-Notch Impact Testing', detail: 'Ductile-to-brittle transition behavior (DBTT)', color: 'text-amber-400' },
    { code: 'Acid Safety', title: 'Nital & Kroll\'s Reagents', detail: 'HNO₃ in ethanol (≤5%) & HF fume hood rules', color: 'text-emerald-400' },
  ];

  const renderedStandards = Array.isArray(standardsSec.extra) && standardsSec.extra.length > 0
    ? standardsSec.extra.map((s, idx) => ({
        code: s.code || defaultStandards[idx % defaultStandards.length].code,
        title: s.title || defaultStandards[idx % defaultStandards.length].title,
        detail: s.detail || defaultStandards[idx % defaultStandards.length].detail,
        color: defaultStandards[idx % defaultStandards.length].color,
      }))
    : defaultStandards;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
          Student Resources
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Materials Engineering Resources
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Software guides, thermodynamic databases, ASTM testing standards, and academic reference materials curated for DMME students.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides, software (Thermo-Calc, ImageJ), or standards (ASTM E8, E112)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderedStandards.map((std, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className={`text-[10px] font-mono uppercase font-bold ${std.color}`}>{std.code}</span>
            <p className="text-xs font-semibold text-white">{std.title}</p>
            <span className="text-[11px] text-slate-400 block">{std.detail}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase bg-white/10 text-cyan-300 border border-white/10">
                    {item.category}
                  </span>
                  {item.software_tag && (
                    <span className="text-[11px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {item.software_tag}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-end">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                >
                  <span>Open Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <BookOpen className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No resources found.</p>
          <p className="text-xs">Try searching for other keywords or select a different category filter.</p>
        </div>
      )}
    </div>
  );
}
