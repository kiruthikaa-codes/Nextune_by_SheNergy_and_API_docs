const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let details: any = null;
    try {
      details = await res.json();
    } catch {}
    throw new Error(details?.message || `API request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  signup: (body: any) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // Services
  listServices: () => request('/services/list'),

  // Predictive maintenance
  predictMaintenance: (body: { customer_id: string; vin: string }) =>
    request('/predict-maintenance', { method: 'POST', body: JSON.stringify(body) }),

  // Dealerships
  listDealerships: () => request('/dealerships'),
  rankDealerships: (body: any) =>
    request('/dealerships/rank', { method: 'POST', body: JSON.stringify(body) }),

  // Inventory
  checkInventory: (body: any) =>
    request('/inventory/check', { method: 'POST', body: JSON.stringify(body) }),

  // Appointments
  bookAppointment: (body: any) =>
    request('/appointments/book', { method: 'POST', body: JSON.stringify(body) }),
  listAppointments: (customer_id: string) =>
    request(`/appointments/list?customer_id=${encodeURIComponent(customer_id)}`),
  getAppointment: (id: string) => request(`/appointments/${id}`),

  // Chat
  createChatSession: (body: any) =>
    request('/chat/session', { method: 'POST', body: JSON.stringify(body) }),
  sendChatMessage: (body: any) =>
    request('/chat/message', { method: 'POST', body: JSON.stringify(body) }),
};
