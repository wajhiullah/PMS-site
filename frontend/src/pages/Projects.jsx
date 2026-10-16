import React, { useState, useEffect } from 'react';
import { Sparkles, User, ExternalLink, Microscope } from 'lucide-react';
import { api } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  const types = [
    'All',
    'FYP Highlight',
    'Competition Entry',
    'Publication',
    'Lab Project'
  ];

  useEffect(() => {
    api.getProjects()
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) => {
    if (selectedType === 'All') return true;
    return p.project_type?.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-purple-400 font-semibold tracking-wider">
          Student Research
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Research & FYP Showcase
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Undergraduate final-year projects, research publications, and metallurgy competition entries conducted at DMME laboratories.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedType === t
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-7 rounded-2xl glass-card border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {proj.project_type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Batch: {proj.batch}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                {proj.title}
              </h3>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="font-medium">Students:</span>
                  <span className="text-slate-200">{proj.student_names}</span>
                </div>
                {proj.supervisor_name && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Microscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Supervisor:</span>
                    <span className="text-slate-300">{proj.supervisor_name}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {proj.abstract_summary}
              </p>

              {proj.tags && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                DMME Undergraduate Research
              </span>
              {proj.paper_or_repo_url && (
                <a
                  href={proj.paper_or_repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors"
                >
                  <span>Read Paper / Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <Sparkles className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
