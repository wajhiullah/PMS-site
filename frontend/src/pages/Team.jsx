import React, { useState, useEffect } from 'react';
import { Users, Mail } from 'lucide-react';
import { Linkedin } from '../components/Icons';
import { api } from '../api';
import { useSections } from '../hooks';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [selectedTenure, setSelectedTenure] = useState('current');
  const { getSection } = useSections();

  const guidanceSec = getSection('team_guidance', {
    badge: 'Junior Batch Guidance',
    title: 'Council Portfolios & Responsibilities',
    subtitle: 'Interested in running for council? Here is the exact scope of duties for each portfolio so you can align your skills with the society\'s goals.',
  });

  useEffect(() => {
    api.getTeam()
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch((err) => {
        console.error('Failed to load team:', err);
      });
  }, []);

  const tenures = ['current', '2025-2026', '2024-2025', '2023-2024'];

  const advisor = members.find((m) => m.is_faculty_advisor);

  const displayedMembers = members.filter((m) => {
    if (m.is_faculty_advisor) return false;
    if (selectedTenure === 'current') return m.is_current;
    return m.tenure_year === selectedTenure;
  });

  const defaultRolesGuide = [
    {
      title: 'President',
      scope: 'Executive Leadership & External Representation',
      description: 'Liaises with DMME Department Head, PIEAS Central Administration, PAEC dignitaries, and industrial partners. Sets the society annual roadmap and oversees all executive departments.',
    },
    {
      title: 'General Secretary',
      scope: 'Operational Coordination & Administration',
      description: 'Manages day-to-day communications, official documentation, permissions for auditorium and campus venues, council meetings, and logistical approvals.',
    },
    {
      title: 'Treasurer',
      scope: 'Financial Governance & Budgeting',
      description: 'Maintains PMS financial ledgers, sponsorship accounts, ticket sales for symposia, workshop equipment disbursements, and semester financial reporting.',
    },
    {
      title: 'Technical & Academic Head',
      scope: 'Workshops, Computational Training & Study Guides',
      description: 'Directs technical bootcamps on Thermo-Calc, ImageJ, and JMatPro. Coordinates with faculty on research seminars and maintains the undergraduate Materials Toolkit.',
    },
    {
      title: 'Media & Publications Head',
      scope: 'Visual Branding, Social Media & Newsletter',
      description: 'Oversees graphic design, event posters, LinkedIn and Instagram campaigns, the "Material of the Month" series, and photography coverage.',
    },
    {
      title: 'Event Coordinator & Logistics Head',
      scope: 'On-Ground Execution & Industrial Visits',
      description: 'Executes venue setup, guest hospitality, stage management, registration desks, and transport logistics for industrial tours to HMC and steel plants.',
    },
  ];

  const displayedRoles = Array.isArray(guidanceSec.extra) && guidanceSec.extra.length > 0
    ? guidanceSec.extra.map((r, idx) => ({
        title: r.title,
        scope: r.scope || defaultRolesGuide[idx % defaultRolesGuide.length].scope,
        description: r.desc || r.description || defaultRolesGuide[idx % defaultRolesGuide.length].description,
      }))
    : defaultRolesGuide;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left">
      <section className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase text-orange-400 font-semibold tracking-wider">
          Society Leadership
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
          Executive Council & Advisors
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          The student council and faculty leadership responsible for PMS operations, academic initiatives, workshops, and student representation at DMME PIEAS.
        </p>
      </section>

      {advisor && (
        <section className="p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="shrink-0">
              <img
                src={advisor.photo_url || '/pms-logo.jpeg'}
                alt={advisor.name}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
              />
            </div>

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Faculty Advisor
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                  {advisor.name}
                </h2>
                <p className="text-sm text-orange-400 font-medium">
                  {advisor.role} • Department of Metallurgy & Materials Engineering (DMME), PIEAS
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {advisor.bio ||
                  'Guiding PMS initiatives, facilitating industrial linkages with national research institutes, and supporting student academic programs.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
                {advisor.email && (
                  <a href={`mailto:${advisor.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>{advisor.email}</span>
                  </a>
                )}
                {advisor.linkedin_url && (
                  <a href={advisor.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4 text-cyan-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {selectedTenure === 'current' ? 'Executive Council' : `Council Archive (${selectedTenure})`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse current and past tenures of society leadership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
            {tenures.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTenure(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedTenure === t
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t === 'current' ? 'Current' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl glass-card border border-white/10 hover:border-orange-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={member.photo_url || '/pms-logo.jpeg'}
                    alt={member.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 group-hover:border-orange-500/50 transition-colors"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {member.role}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Batch: {member.batch || 'DMME'}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {member.role_responsibility || member.bio || 'Managing society portfolios, workshops, and student academic welfare.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-500">
                  Tenure: {member.tenure_year}
                </span>
                <div className="flex items-center gap-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                      title={member.email}
                      aria-label="Send email"
                    >
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                      title="LinkedIn profile"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedMembers.length === 0 && (
          <div className="p-10 rounded-2xl glass-card border border-white/10 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-500 mb-2" />
            <p className="font-mono text-sm">No historical records found for tenure: {selectedTenure}</p>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            {guidanceSec.badge || 'Portfolios'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {guidanceSec.title || 'Council Portfolios & Responsibilities'}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            {guidanceSec.subtitle || guidanceSec.content || 'Overview of responsibilities for executive positions within the PIEAS Materials Society.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRoles.map((role, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-white/10 hover:border-white/20 transition-all space-y-2.5"
            >
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {role.title}
                </h3>
                <span className="text-xs font-mono text-orange-400">
                  {role.scope}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
