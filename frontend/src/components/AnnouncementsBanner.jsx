import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Bell, ArrowRight, X } from 'lucide-react';
import { api } from '../api';

export default function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api.getAnnouncements()
      .then((data) => {
        const active = data.filter((a) => a.is_active);
        setAnnouncements(active);
      })
      .catch((err) => console.error('Failed to load announcements:', err));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-gradient-to-r from-red-950/80 via-orange-950/70 to-red-950/80 border-orange-500/40 text-orange-200';
      case 'event':
        return 'bg-gradient-to-r from-cyan-950/80 via-slate-900/80 to-cyan-950/80 border-cyan-500/40 text-cyan-200';
      default:
        return 'bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-700/50 text-slate-200';
    }
  };

  return (
    <aside aria-label="Society Announcement" className={`w-full border-b text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative z-50 ${getPriorityStyle(current.priority)}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold bg-white/10 shrink-0">
            {current.priority === 'urgent' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                Urgent
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                Update
              </>
            )}
          </span>
          <p className="truncate font-medium">{current.message}</p>
          {current.link_url && (
            <Link
              to={current.link_url}
              className="inline-flex items-center gap-1 font-semibold text-orange-400 hover:text-orange-300 hover:underline shrink-0 text-xs ml-2"
            >
              {current.link_text || 'Learn more'}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {announcements.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 shrink-0">
            {currentIndex + 1} / {announcements.length}
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
