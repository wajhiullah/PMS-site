import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon, Grid, Clock, MapPin,
  AlertCircle, ExternalLink, ShieldCheck, User
} from 'lucide-react';
import { api } from '../api';
import RegistrationModal from '../components/RegistrationModal';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [certCode, setCertCode] = useState('');
  const [certResult, setCertResult] = useState(null);
  const [certLoading, setCertLoading] = useState(false);
  const [certError, setCertError] = useState(null);

  const categories = [
    'All', 'Seminar', 'Workshop', 'Lab Visit', 'Competition', 'Alumni Talk', 'Social'
  ];

  const fetchEvents = useCallback(() => {
    setLoading(true);
    const isPast = tab === 'past';
    api.getEvents(`is_past=${isPast}`)
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load events:', err);
        setLoading(false);
      });
  }, [tab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleVerifyCert = async (e) => {
    e.preventDefault();
    if (!certCode.trim()) return;
    setCertLoading(true);
    setCertError(null);
    setCertResult(null);

    try {
      const res = await api.verifyCertificate(certCode.trim());
      setCertResult(res);
    } catch (err) {
      setCertError(err.message || 'Certificate code not found or invalid.');
    } finally {
      setCertLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'All') return true;
    return ev.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
            Academic Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Events & Symposia
          </h1>
          <p className="text-sm text-slate-300">
            Seminars, hands-on workshops, and industrial visits organized by the PIEAS Materials Society.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                tab === 'upcoming'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({tab === 'upcoming' ? filteredEvents.length : '•'})
            </button>
            <button
              onClick={() => setTab('past')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                tab === 'past'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Archive
            </button>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-orange-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-white/10 text-orange-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Calendar Schedule View"
              aria-label="Calendar View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-heading font-bold text-base text-white">
                Verify PMS Participation Certificate
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Employers and academic committees can instantly verify participation and merit credentials issued by DMME PIEAS.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleVerifyCert} className="flex gap-2">
              <input
                type="text"
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Enter Certificate Code (e.g. PMS-2026-X9Y2)"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={certLoading}
                className="px-5 py-2 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors shrink-0 disabled:opacity-50"
              >
                {certLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            {certResult && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold">
                    ✓ Verified: {certResult.student_name} ({certResult.roll_number})
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">
                    Event: {certResult.event_title} • Issued: {new Date(certResult.verified_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono font-bold">
                  GENUINE
                </span>
              </div>
            )}

            {certError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{certError}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-orange-500/30 transition-all duration-200 group"
            >
              <div>
                {ev.poster_url && (
                  <div className="h-40 w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={ev.poster_url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {ev.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {ev.time_range || 'TBA'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {ev.short_description}
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    {ev.speaker_or_organizer && (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{ev.speaker_or_organizer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2">
                {tab === 'upcoming' ? (
                  <>
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="flex-1 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors text-center"
                    >
                      Register Now
                    </button>
                    {ev.registration_link && (
                      <a
                        href={ev.registration_link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="External Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </>
                ) : (
                  <div className="w-full text-center py-1 text-xs font-mono text-slate-400">
                    Concluded
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-heading font-bold text-lg text-white">
              Event Schedule Timeline
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Chronological order of society sessions
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((ev, idx) => (
              <div
                key={ev.id || idx}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-950 border border-white/10 text-center flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono uppercase text-orange-400">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-xl font-heading font-extrabold text-white">
                      {new Date(ev.date).getDate()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-cyan-500/10 text-cyan-400">
                        {ev.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {ev.time_range}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-white text-base">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {ev.venue}
                    </p>
                  </div>
                </div>

                {tab === 'upcoming' && (
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shrink-0 self-end sm:self-center"
                  >
                    Register
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center text-slate-400 space-y-2">
          <CalendarIcon className="w-12 h-12 mx-auto text-slate-500" />
          <p className="font-heading text-lg text-white">No events found in this category.</p>
          <p className="text-xs">Try selecting 'All' or checking our past events archive.</p>
        </div>
      )}

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
