import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Calendar, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { api } from '../api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gallery:', err);
        setLoading(false);
      });
  }, []);

  const years = ['All', '2026', '2025', '2024'];

  const filtered = images.filter((img) => {
    if (selectedYear === 'All') return true;
    return img.year === selectedYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
            Archive
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Event Gallery
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Photographs from society events, workshops, industrial visits, and annual gatherings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedYear === y
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setLightboxImg(item)}
            className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 aspect-video sm:aspect-4/3 cursor-pointer"
          >
            <img
              src={item.image_url || '/pms-logo.jpeg'}
              alt={item.caption || 'PMS Gallery photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {item.year || '2026'} • {item.event_name || 'Society Event'}
              </span>
              <p className="text-sm font-heading font-bold text-white line-clamp-2">
                {item.caption}
              </p>
            </div>

            <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No photos found for year: {selectedYear}</p>
        </div>
      )}

      {lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={lightboxImg.image_url || '/pms-logo.jpeg'}
              alt={lightboxImg.caption}
              className="max-w-full max-h-[75vh] rounded-xl object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center space-y-1 max-w-xl">
              <p className="text-base font-heading font-bold text-white">
                {lightboxImg.caption}
              </p>
              <p className="text-xs font-mono text-orange-400">
                {lightboxImg.event_name} ({lightboxImg.year})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
