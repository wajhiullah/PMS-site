import React, { useState, useEffect } from 'react';
import {
  Lock, LogOut, Plus, Edit2, Trash2, Search,
  Download, Upload, AlertCircle, ChevronRight,
  Database, Calendar, Users, FileText, Briefcase,
  GraduationCap, Image as ImageIcon, Handshake, HelpCircle,
  Mail, Bell, Sparkles, X, CheckSquare, Square
} from 'lucide-react';
import { api } from '../api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('pms_token'));
  const [loginEmail, setLoginEmail] = useState('admin@pms.pieas.edu.pk');
  const [loginPass, setLoginPass] = useState('PMS@Admin2026');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [selectedModel, setSelectedModel] = useState('events');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'High-resolution PMS Logo (SVG/PNG) & DMME/PIEAS emblem', done: true },
    { id: 2, text: '1–3 Hero SEM Micrographs or Metallography Lab Photos', done: true },
    { id: 3, text: 'Official Council Headshots + Faculty Advisor Portrait & Short Bio', done: true },
    { id: 4, text: 'PMS Official Constitution / Bylaws PDF file uploaded to /uploads', done: false },
    { id: 5, text: 'Past 10–15 Event Details (Dates, Speakers, Posters) & Photos for Gallery', done: false },
    { id: 6, text: '5–10 Alumni Testimonials & Current Designations verified', done: false },
  ]);

  const modelGroups = [
    {
      group: 'Website Content & Layout',
      models: [
        { key: 'sections', label: 'Frontend Text Sections', icon: FileText },
        { key: 'announcements', label: 'Ticker Announcements', icon: Bell },
        { key: 'stats', label: 'Site Stats & Metrics', icon: Database, isSingle: true },
      ],
    },
    {
      group: 'Core Operations',
      models: [
        { key: 'events', label: 'Events & Symposia', icon: Calendar },
        { key: 'registrations', label: 'Event Registrations', icon: CheckSquare, readOnly: true },
        { key: 'membership', label: 'Membership Applications', icon: GraduationCap },
      ],
    },
    {
      group: 'People',
      models: [
        { key: 'team', label: 'Council & Advisors', icon: Users },
        { key: 'alumni', label: 'Alumni Network', icon: GraduationCap },
      ],
    },
    {
      group: 'Knowledge & Media',
      models: [
        { key: 'posts', label: 'Blog & Materials', icon: FileText },
        { key: 'resources', label: 'Student Resources', icon: Database },
        { key: 'projects', label: 'Research & FYPs', icon: Sparkles },
        { key: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
      ],
    },
    {
      group: 'Outreach & Comms',
      models: [
        { key: 'opportunities', label: 'Opportunities Board', icon: Briefcase },
        { key: 'sponsors', label: 'Sponsors & Partners', icon: Handshake },
        { key: 'faqs', label: 'FAQs Accordion', icon: HelpCircle },
        { key: 'contacts', label: 'Contact Messages', icon: Mail, readOnly: true },
        { key: 'newsletter', label: 'Newsletter Subscribers', icon: Mail, readOnly: true },
      ],
    },
    {
      group: 'Society Operations',
      models: [
        { key: 'checklist', label: 'Asset Collection Checklist', icon: CheckSquare, isChecklist: true },
      ],
    },
  ];

  const schemas = {
    events: [
      { key: 'title', label: 'Event Title', type: 'text', required: true },
      { key: 'slug', label: 'URL Slug', type: 'text', required: true },
      { key: 'date', label: 'Date (ISO / YYYY-MM-DD)', type: 'date', required: true },
      { key: 'time_range', label: 'Time Range (e.g. 10:00 AM - 1:00 PM)', type: 'text' },
      { key: 'venue', label: 'Venue (e.g. DMME Main Auditorium)', type: 'text', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Seminar', 'Workshop', 'Lab Visit', 'Competition', 'Alumni Talk', 'Social'],
      },
      { key: 'short_description', label: 'Short Description', type: 'textarea', required: true },
      { key: 'full_summary', label: 'Full Summary / Agenda', type: 'textarea' },
      { key: 'poster_url', label: 'Event Poster Image', type: 'image' },
      { key: 'registration_link', label: 'External Registration Link', type: 'text' },
      { key: 'speaker_or_organizer', label: 'Keynote Speaker / Organizer', type: 'text' },
      { key: 'is_past', label: 'Mark as Past (Concluded)', type: 'boolean' },
      { key: 'is_featured', label: 'Featured on Homepage Spotlight', type: 'boolean' },
    ],
    announcements: [
      { key: 'message', label: 'Announcement Message', type: 'text', required: true },
      { key: 'link_text', label: 'Link Button Text', type: 'text' },
      { key: 'link_url', label: 'Link Destination URL', type: 'text' },
      { key: 'priority', label: 'Priority Level', type: 'select', options: ['info', 'urgent', 'event'] },
      { key: 'is_active', label: 'Is Banner Active', type: 'boolean' },
    ],
    team: [
      { key: 'name', label: 'Member Name', type: 'text', required: true },
      { key: 'role', label: 'Role Title (e.g. President, General Secretary)', type: 'text', required: true },
      { key: 'role_responsibility', label: 'Portfolio Responsibilities', type: 'textarea' },
      { key: 'photo_url', label: 'Headshot Photo', type: 'image' },
      { key: 'batch', label: 'Batch (e.g. 2022-2026)', type: 'text' },
      { key: 'tenure_year', label: 'Tenure (e.g. 2025-2026)', type: 'text', required: true },
      { key: 'is_current', label: 'Current Active Council Member', type: 'boolean' },
      { key: 'is_faculty_advisor', label: 'Is DMME Faculty Advisor', type: 'boolean' },
      { key: 'bio', label: 'Biography / Statement', type: 'textarea' },
      { key: 'linkedin_url', label: 'LinkedIn Profile URL', type: 'text' },
      { key: 'email', label: 'Official / PIEAS Email', type: 'text' },
      { key: 'display_order', label: 'Display Order Priority', type: 'number' },
    ],
    posts: [
      { key: 'title', label: 'Article Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'excerpt', label: 'Summary Excerpt', type: 'textarea', required: true },
      { key: 'body_markdown', label: 'Full Markdown Content', type: 'textarea', required: true },
      { key: 'author_name', label: 'Author Name', type: 'text', required: true },
      { key: 'author_batch', label: 'Author Batch (e.g. DMME 22)', type: 'text' },
      { key: 'cover_image_url', label: 'Cover Image', type: 'image' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Material of the Month', 'Explainer', 'Event Report', 'Research News'],
      },
      { key: 'material_formula', label: 'Chemical Formula (if Material of Month)', type: 'text' },
      { key: 'crystal_structure', label: 'Crystal Lattice (e.g. HCP, BCC, Austenite)', type: 'text' },
      { key: 'published_at', label: 'Publish Date', type: 'date', required: true },
    ],
    resources: [
      { key: 'title', label: 'Resource Title', type: 'text', required: true },
      { key: 'url', label: 'External Resource URL / PDF Link', type: 'text', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          'Software Guides',
          'Phase Diagrams & Databases',
          'Lecture Notes & OCW',
          'Lab Safety & Standards',
        ],
      },
      { key: 'software_tag', label: 'Software / Tag (e.g. Thermo-Calc, ImageJ)', type: 'text' },
      { key: 'description', label: 'Detailed Description', type: 'textarea', required: true },
      { key: 'is_pinned', label: 'Pin to Top of Resources Hub', type: 'boolean' },
    ],
    opportunities: [
      { key: 'title', label: 'Opportunity Title', type: 'text', required: true },
      { key: 'organization', label: 'Organization / Company / Lab', type: 'text', required: true },
      {
        key: 'opportunity_type',
        label: 'Type',
        type: 'select',
        options: ['Internship', 'Scholarship', 'Research Position', 'Conference', 'Competition', 'Job'],
      },
      { key: 'location', label: 'Location (City, Country)', type: 'text', required: true },
      { key: 'deadline', label: 'Application Deadline (YYYY-MM-DD)', type: 'date' },
      { key: 'apply_url', label: 'Application / Portal URL', type: 'text', required: true },
      { key: 'description', label: 'Role Description & Requirements', type: 'textarea', required: true },
      { key: 'posted_by_alumnus', label: 'Shared By Alumnus (Name)', type: 'text' },
    ],
    alumni: [
      { key: 'name', label: 'Alumnus Name', type: 'text', required: true },
      { key: 'batch', label: 'Graduating Batch', type: 'text', required: true },
      { key: 'current_position', label: 'Current Job Title', type: 'text', required: true },
      { key: 'organization', label: 'Current Company / University', type: 'text', required: true },
      { key: 'location', label: 'Location (e.g. Islamabad, Munich, Boston)', type: 'text', required: true },
      { key: 'photo_url', label: 'Profile Photo', type: 'image' },
      { key: 'quote_testimonial', label: 'Quote / Advice for Students', type: 'textarea' },
      { key: 'linkedin_url', label: 'LinkedIn Profile URL', type: 'text' },
      { key: 'research_domain', label: 'Specialization Domain', type: 'text' },
    ],
    projects: [
      { key: 'title', label: 'Project / Thesis Title', type: 'text', required: true },
      { key: 'student_names', label: 'Student Names', type: 'text', required: true },
      { key: 'batch', label: 'Batch', type: 'text', required: true },
      { key: 'supervisor_name', label: 'Faculty Supervisor', type: 'text' },
      {
        key: 'project_type',
        label: 'Project Type',
        type: 'select',
        options: ['FYP Highlight', 'Competition Entry', 'Publication', 'Lab Project'],
      },
      { key: 'abstract_summary', label: 'Abstract / Key Results', type: 'textarea', required: true },
      { key: 'image_url', label: 'Project Micrograph / Photo', type: 'image' },
      { key: 'paper_or_repo_url', label: 'Publication / Repository URL', type: 'text' },
      { key: 'tags', label: 'Comma-separated Tags', type: 'text' },
    ],
    gallery: [
      { key: 'image_url', label: 'Image File', type: 'image', required: true },
      { key: 'caption', label: 'Photo Caption', type: 'text', required: true },
      { key: 'event_name', label: 'Event Name', type: 'text' },
      { key: 'year', label: 'Year (e.g. 2026)', type: 'text', required: true },
    ],
    sponsors: [
      { key: 'name', label: 'Organization Name', type: 'text', required: true },
      { key: 'logo_url', label: 'Logo Image', type: 'image' },
      { key: 'website_url', label: 'Official Website URL', type: 'text' },
      { key: 'tier', label: 'Sponsorship Tier', type: 'select', options: ['Platinum', 'Gold', 'Silver', 'Partner'] },
    ],
    faqs: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Detailed Answer', type: 'textarea', required: true },
      { key: 'display_order', label: 'Display Order Priority', type: 'number' },
    ],
    membership: [
      { key: 'status', label: 'Application Status', type: 'select', options: ['Pending', 'Approved'] },
    ],
    stats: [
      { key: 'active_members', label: 'Active Members Count', type: 'number', required: true },
      { key: 'events_held', label: 'Events & Symposia Held', type: 'number', required: true },
      { key: 'years_active', label: 'Years of Excellence', type: 'number', required: true },
      { key: 'industrial_partners', label: 'Industrial & Research Partners', type: 'number', required: true },
      { key: 'constitution_pdf_url', label: 'Constitution PDF URL', type: 'text' },
      { key: 'office_location', label: 'Department / Office Location', type: 'text' },
      { key: 'contact_email', label: 'Official Contact Email', type: 'text' },
    ],
    sections: [
      { key: 'section_key', label: 'Section Key (e.g. home_hero, about_mission)', type: 'text', required: true },
      { key: 'badge', label: 'Badge / Pill Text', type: 'text' },
      { key: 'title', label: 'Section Main Headline / Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle / Eyebrow Text', type: 'text' },
      { key: 'content', label: 'Main Content / Narrative', type: 'textarea', required: true },
      { key: 'extra_json', label: 'Structured JSON Elements (Buttons, Features, Cards)', type: 'textarea' },
    ],
  };

  const loadModelData = async (model) => {
    if (model === 'checklist') return;
    setLoading(true);
    try {
      if (model === 'stats') {
        const res = await api.getStats();
        setItems(res ? [res] : []);
      } else {
        const res = await api.admin.list(model);
        setItems(Array.isArray(res) ? res : []);
      }
    } catch (err) {
      console.error(`Failed to load ${model}:`, err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadModelData(selectedModel);
    }
  }, [token, selectedModel]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await api.login(loginEmail, loginPass);
      localStorage.setItem('pms_token', res.token);
      setToken(res.token);
    } catch (err) {
      setLoginError(err.message || 'Invalid council administrator credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pms_token');
    setToken(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        if (selectedModel === 'stats') {
          await api.admin.update('stats', editingItem.id, formData);
        } else {
          await api.admin.update(selectedModel, editingItem.id, formData);
        }
      } else {
        await api.admin.create(selectedModel, formData);
      }
      setFormDrawerOpen(false);
      setEditingItem(null);
      setFormData({});
      loadModelData(selectedModel);
    } catch (err) {
      alert(`Error saving record: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this database record?')) return;
    try {
      await api.admin.delete(selectedModel, id);
      loadModelData(selectedModel);
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.admin.upload(file);
      setFormData((prev) => ({ ...prev, [key]: res.url }));
    } catch (err) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${(val || '').toString().replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl glass-card border border-white/10 bg-slate-900/90 shadow-2xl text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white">
              PMS Council Portal
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Department of Metallurgy & Materials Engineering
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl font-heading font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
            <span className="text-orange-400 font-bold block">Seeded Credentials:</span>
            <p>Email: admin@pms.pieas.edu.pk</p>
            <p>Password: PMS@Admin2026</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    return JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-[96rem] mx-auto px-4 sm:px-6 py-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10 mb-6 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-lg text-white">
                PMS Admin Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live Schema Control • PIEAS Materials Society
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside aria-label="Admin Navigation" className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-white/10 bg-slate-900/80 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 block font-semibold">
              Database Models
            </span>

            <div className="space-y-4">
              {modelGroups.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-orange-400/80 px-2 font-bold">
                    {grp.group}
                  </p>
                  <div className="space-y-0.5">
                    {grp.models.map((m) => {
                      const Icon = m.icon;
                      const active = selectedModel === m.key;
                      return (
                        <button
                          key={m.key}
                          onClick={() => {
                            setSelectedModel(m.key);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            active
                              ? 'bg-orange-500 text-white font-semibold shadow-md'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{m.label}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 ${active ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-4">
          {selectedModel === 'checklist' ? (
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading font-bold text-xl text-white">
                  PMS Council Content Collection Checklist
                </h2>
                <p className="text-xs text-slate-300">
                  Track real digital assets to replace initial seeded placeholder data with verified council documents.
                </p>
              </div>

              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setChecklist((prev) =>
                        prev.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c))
                      );
                    }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    {item.done ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-heading font-bold text-xl text-white capitalize">
                    {selectedModel.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    {filteredItems.length} records in database table
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search table..."
                      className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {(selectedModel === 'registrations' || selectedModel === 'membership') && (
                    <button
                      onClick={() => exportCSV(filteredItems, selectedModel)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  )}

                  {schemas[selectedModel] && selectedModel !== 'stats' && (
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setFormData({});
                        setFormDrawerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Record</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Primary Identifier</th>
                      <th className="p-3">Details</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-slate-500">{item.id}</td>
                        <td className="p-3 font-semibold text-white">
                          {item.title || item.name || item.student_name || item.full_name || item.message || item.email || item.section_key || `Record #${item.id}`}
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                          {item.category || item.role || item.organization || item.subject || item.certificate_code || item.status || item.badge || 'Active'}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {schemas[selectedModel] && (
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setFormData({ ...item });
                                setFormDrawerOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-orange-400 transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {selectedModel !== 'stats' && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredItems.length === 0 && !loading && (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No matching records found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {formDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl glass-card border border-white/10 p-6 sm:p-8 bg-slate-900 text-white overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">
                  {editingItem ? 'Edit Database Record' : 'Create New Record'}
                </h3>
                <p className="text-xs font-mono text-orange-400 uppercase">
                  Model: {selectedModel}
                </p>
              </div>
              <button
                onClick={() => setFormDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              {schemas[selectedModel]?.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    {field.label} {field.required && '*'}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      required={field.required}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                        className="rounded bg-slate-950 border-white/20 text-orange-500 focus:ring-0"
                      />
                      <span className="text-xs text-slate-300">Enable / Active</span>
                    </label>
                  ) : field.type === 'image' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder="Image URL or upload below..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? 'Uploading to /uploads...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, field.key)}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                        })
                      }
                      required={field.required}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-heading font-semibold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-md"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
