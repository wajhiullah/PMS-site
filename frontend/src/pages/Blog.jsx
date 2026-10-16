import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Atom, BookOpen, Calendar, User, ArrowRight, X,
  Sparkles, Layers, Shield, FileText, CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const categories = [
    'All',
    'Material of the Month',
    'Explainer',
    'Event Report',
    'Research News'
  ];

  useEffect(() => {
    api.getPosts()
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          // Check if URL has a specific post slug query
          const slugParam = searchParams.get('post');
          if (slugParam) {
            const match = data.find((p) => p.slug === slugParam);
            if (match) setActivePost(match);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load posts:', err);
        setLoading(false);
      });
  }, [searchParams]);

  const materialOfTheMonth = posts.find((p) => p.category === 'Material of the Month');

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
          Publications
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Technical Articles & Notes
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Articles on physical metallurgy, materials characterization, alloy design, and student research at DMME PIEAS.
        </p>
      </div>

      {materialOfTheMonth && (
        <section className="p-6 sm:p-10 rounded-2xl glass-card border border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5" />
                  Material of the Month
                </span>
                <span className="text-xs font-mono text-slate-400">
                  DMME Metallurgy Feature
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                {materialOfTheMonth.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {materialOfTheMonth.material_formula && (
                  <span className="px-3 py-1 rounded-xl text-xs font-mono bg-white/5 border border-white/10 text-amber-300">
                    Formula: <strong>{materialOfTheMonth.material_formula}</strong>
                  </span>
                )}
                {materialOfTheMonth.crystal_structure && (
                  <span className="px-3 py-1 rounded-xl text-xs font-mono bg-white/5 border border-white/10 text-cyan-300">
                    Crystal Lattice: <strong>{materialOfTheMonth.crystal_structure}</strong>
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {materialOfTheMonth.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>By {materialOfTheMonth.author_name} ({materialOfTheMonth.author_batch})</span>
                <button
                  onClick={() => setActivePost(materialOfTheMonth)}
                  className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all flex items-center gap-2"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-xl bg-slate-950/70 border border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase text-orange-400 block font-semibold">
                Key Characteristics
              </span>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Low thermal neutron absorption cross-section</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Corrosion resistance in high-temperature pressurized water</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mechanical stability under thermal gradient cycles</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group cursor-pointer"
            onClick={() => setActivePost(post)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase bg-white/10 text-orange-400 border border-white/10">
                  {post.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{post.author_name}</span>
              <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                Read Article →
              </span>
            </div>
          </article>
        ))}
      </div>

      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl glass-card border border-white/10 p-6 sm:p-10 shadow-2xl bg-slate-900 text-white overflow-y-auto">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 inline-block">
                  {activePost.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {activePost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span>Author: {activePost.author_name} ({activePost.author_batch || 'DMME'})</span>
                  <span>Published: {new Date(activePost.published_at).toLocaleDateString()}</span>
                </div>
              </div>

              {(activePost.material_formula || activePost.crystal_structure) && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap gap-4 text-xs font-mono">
                  {activePost.material_formula && (
                    <div>
                      <span className="text-slate-400 block">Nominal Composition:</span>
                      <strong className="text-amber-300">{activePost.material_formula}</strong>
                    </div>
                  )}
                  {activePost.crystal_structure && (
                    <div>
                      <span className="text-slate-400 block">Phase & Crystal Lattice:</span>
                      <strong className="text-cyan-300">{activePost.crystal_structure}</strong>
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line border-t border-white/10 pt-6">
                {activePost.body_markdown}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setActivePost(null)}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
