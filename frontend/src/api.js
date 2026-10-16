const API_BASE = '/api';

async function request(url, options = {}) {
  const token = localStorage.getItem('pms_token');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  
  return res.json();
}

export const api = {
  getAnnouncements: () => request('/announcements'),
  getStats: () => request('/stats'),
  getEvents: (params = '') => request(`/events${params ? '?' + params : ''}`),
  getEvent: (id) => request(`/events/${id}`),
  registerForEvent: (eventId, data) => request(`/events/${eventId}/register`, { method: 'POST', body: data }),
  verifyCertificate: (code) => request(`/certificates/verify?code=${encodeURIComponent(code)}`),
  getTeam: (params = '') => request(`/team${params ? '?' + params : ''}`),
  getGallery: (params = '') => request(`/gallery${params ? '?' + params : ''}`),
  getPosts: (params = '') => request(`/posts${params ? '?' + params : ''}`),
  getPostBySlug: (slug) => request(`/posts/${slug}`),
  getResources: (params = '') => request(`/resources${params ? '?' + params : ''}`),
  getOpportunities: (params = '') => request(`/opportunities${params ? '?' + params : ''}`),
  getAlumni: () => request('/alumni'),
  getProjects: (params = '') => request(`/projects${params ? '?' + params : ''}`),
  getSponsors: () => request('/sponsors'),
  getFaqs: () => request('/faqs'),
  submitMembership: (data) => request('/membership', { method: 'POST', body: data }),
  submitContact: (data) => request('/contact', { method: 'POST', body: data }),
  subscribeNewsletter: (email) => request('/newsletter', { method: 'POST', body: { email } }),
  getSections: () => request('/sections'),

  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  admin: {
    upload: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/admin/upload', { method: 'POST', body: formData });
    },
    list: (model) => request(`/admin/${model}`),
    create: (model, data) => request(`/admin/${model}`, { method: 'POST', body: data }),
    update: (model, id, data) => request(`/admin/${model}/${id}`, { method: 'PUT', body: data }),
    delete: (model, id) => request(`/admin/${model}/${id}`, { method: 'DELETE' }),
  },
};
