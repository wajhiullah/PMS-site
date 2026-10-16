import React, { useState } from 'react';
import { X, CheckCircle, Copy, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { api } from '../api';

export default function RegistrationModal({ event, onClose }) {
  const [formData, setFormData] = useState({
    student_name: '',
    roll_number: '',
    batch: '2022-2026',
    department: 'DMME',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.registerForEvent(event.id, formData);
      setSuccessData(res.registration || res);
    } catch (err) {
      setError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (successData?.certificate_code) {
      navigator.clipboard.writeText(successData.certificate_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-card border border-white/10 p-6 sm:p-8 shadow-2xl bg-slate-900 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!successData ? (
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-2">
                Event Registration
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                {event.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {event.venue}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ali Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    PIEAS Roll Number *
                  </label>
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 22-3-1-045"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="DMME">DMME (Materials & Metallurgy)</option>
                    <option value="DME">DME (Mechanical)</option>
                    <option value="DEE">DEE (Electrical)</option>
                    <option value="DCIS">DCIS (Computer & Info Sci)</option>
                    <option value="DPAM">DPAM (Physics & Applied Math)</option>
                    <option value="DCHE">DCHE (Chemical)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Batch / Session
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="e.g. 2022-2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="student@pieas.edu.pk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Registration Confirmation Screen */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-white">
                Registration Confirmed!
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                Thank you, <strong>{successData.student_name}</strong>. You are officially registered for{' '}
                <strong>{event.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                Verification & Attendance Passcode
              </span>
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-white/10">
                <code className="text-base font-mono font-bold text-orange-400">
                  {successData.certificate_code}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Keep this code safe! You can use it at the event entry desk and to download your verifiable certificate of participation.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
