import React, { useState } from 'react';
import {
  Users, Mail, MapPin, Phone, Send, CheckCircle2,
  AlertCircle, Building, Compass
} from 'lucide-react';
import { api } from '../api';

export default function Join() {
  const [activeTab, setActiveTab] = useState('membership');

  const [memberForm, setMemberForm] = useState({
    full_name: '',
    roll_number: '',
    batch: '2022-2026',
    department: 'DMME',
    email: '',
    phone: '',
    interests: [],
    why_join: '',
  });
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [memberError, setMemberError] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState(null);

  const interestOptions = [
    'Metallography & Microscopy',
    'Computational Thermodynamics (Thermo-Calc)',
    'Welding & NDT Inspection',
    'Nuclear Cladding & Radiation Damage',
    'Nanomaterials & Biomaterials',
    'Failure Analysis & Fractography',
    'Event Operations & Logistics',
    'Media, Graphics & Web Tech'
  ];

  const handleInterestToggle = (interest) => {
    setMemberForm((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberLoading(true);
    setMemberError(null);

    try {
      await api.submitMembership({
        ...memberForm,
        interests: memberForm.interests.join(', '),
      });
      setMemberSuccess(true);
    } catch (err) {
      setMemberError(err.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);

    try {
      await api.submitContact(contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setContactError(err.message || 'Failed to send message.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
          Community & Contact
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Join PMS & Connect
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Apply for society membership, volunteer for executive committees, or get in touch with the PMS council.
        </p>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit pt-2">
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
              activeTab === 'membership'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Membership Application
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contact & Department Location
          </button>
        </div>
      </div>

      {activeTab === 'membership' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 p-8 rounded-2xl glass-card border border-white/10 space-y-6">
            {!memberSuccess ? (
              <form onSubmit={handleMemberSubmit} className="space-y-5">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    General Membership & Council Volunteer Form
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Open to all undergraduate & graduate students at PIEAS.
                  </p>
                </div>

                {memberError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{memberError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.full_name}
                      onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })}
                      placeholder="e.g. Fatima Zahra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      PIEAS Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.roll_number}
                      onChange={(e) => setMemberForm({ ...memberForm, roll_number: e.target.value })}
                      placeholder="e.g. 23-3-1-012"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Department *
                    </label>
                    <select
                      value={memberForm.department}
                      onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                    >
                      <option value="DMME">DMME (Metallurgy & Materials)</option>
                      <option value="DME">DME (Mechanical)</option>
                      <option value="DEE">DEE (Electrical)</option>
                      <option value="DCIS">DCIS (Computer & Info Sci)</option>
                      <option value="DPAM">DPAM (Physics & Applied Math)</option>
                      <option value="DCHE">DCHE (Chemical)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Batch / Session
                    </label>
                    <input
                      type="text"
                      value={memberForm.batch}
                      onChange={(e) => setMemberForm({ ...memberForm, batch: e.target.value })}
                      placeholder="e.g. 2023-2027"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      placeholder="student@pieas.edu.pk"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Areas of Interest (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => {
                      const isSelected = memberForm.interests.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleInterestToggle(opt)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                            isSelected
                              ? 'bg-orange-500 text-white font-semibold shadow-sm'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Why do you want to join PMS? (Brief Motivation)
                  </label>
                  <textarea
                    rows={3}
                    value={memberForm.why_join}
                    onChange={(e) => setMemberForm({ ...memberForm, why_join: e.target.value })}
                    placeholder="Tell us what you hope to learn or what portfolio you want to support..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={memberLoading}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-heading font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                  >
                    {memberLoading ? 'Submitting Application...' : 'Submit Membership Application'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white">
                  Application Submitted!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{memberForm.full_name}</strong>. Your membership application has been registered with the PMS Council. You will receive an onboarding confirmation email shortly.
                </p>
                <button
                  onClick={() => {
                    setMemberSuccess(false);
                    setMemberForm({
                      full_name: '',
                      roll_number: '',
                      batch: '2022-2026',
                      department: 'DMME',
                      email: '',
                      phone: '',
                      interests: [],
                      why_join: '',
                    });
                  }}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Submit Another Application
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-orange-500/30 bg-gradient-to-b from-slate-900 to-orange-950/20 space-y-4">
              <h4 className="font-heading font-bold text-lg text-white">
                Member Privileges
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Priority registration for hands-on Thermo-Calc & ImageJ computational bootcamps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Subsidized seats on industrial visits to Heavy Mechanical Complex (HMC) & steel mills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Eligibility to run for Executive Council portfolios in annual elections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Direct mentorship from alumni working in PAEC, NESCOM, and international labs.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'contact' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 p-8 rounded-2xl glass-card border border-white/10 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Send a Direct Message
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Reach out to the PMS Executive Council for collaborations, workshop proposals, or society inquiries.
              </p>
            </div>

            {contactSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Message received! The council secretary will respond to your email.</span>
              </div>
            )}

            {contactError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{contactError}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Dr. Muhammad Asif"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Industrial Workshop Proposal / Guest Lecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                className="px-6 py-2.5 rounded-xl font-heading font-semibold text-xs text-white bg-cyan-600 hover:bg-cyan-500 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{contactLoading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-5">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-400" />
                <h4 className="font-heading font-bold text-lg text-white">
                  Department Headquarters
                </h4>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Physical Location:</strong>
                    Department of Metallurgy & Materials Engineering (DMME) Academic Block, PIEAS Campus, Lehtrar Road, Nilore, Islamabad, Pakistan.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Official Email:</strong>
                    <a href="mailto:pms@pieas.edu.pk" className="text-orange-400 font-mono hover:underline">
                      pms@pieas.edu.pk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Office Hours:</strong>
                    Monday – Friday: 9:00 AM – 4:30 PM (PKT)
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block mb-2">
                  Social Channels
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-mono transition-colors"
                  >
                    LinkedIn PMS
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-orange-400 text-xs font-mono transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
