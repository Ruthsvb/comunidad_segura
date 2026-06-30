const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('jwt_token');

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (res.status === 401) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error en la solicitud');
  }

  return res.json();
};

// Auth
export const login = (email, password) => apiCall('/api/auth/login', 'POST', { email, password });
export const logout = () => apiCall('/api/auth/logout', 'POST');

// Dashboard
export const getDashboard = () => apiCall('/api/dashboard');

// Residentes
export const getResidentes = () => apiCall('/api/residentes');
export const getResidente = (id) => apiCall(`/api/residentes/${id}`);
export const createResidente = (data) => apiCall('/api/residentes', 'POST', data);
export const updateResidente = (id, data) => apiCall(`/api/residentes/${id}`, 'PUT', data);
export const deleteResidente = (id) => apiCall(`/api/residentes/${id}`, 'DELETE');

// Tickets
export const getTickets = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return apiCall(`/api/tickets?${query}`);
};
export const getTicket = (id) => apiCall(`/api/tickets/${id}`);
export const createTicket = (data) => apiCall('/api/tickets', 'POST', data);
export const updateTicket = (id, data) => apiCall(`/api/tickets/${id}`, 'PUT', data);
export const updateTicketEstado = (id, estado) => apiCall(`/api/tickets/${id}/estado`, 'PATCH', { estado });
export const deleteTicket = (id) => apiCall(`/api/tickets/${id}`, 'DELETE');

// Reservas
export const getReservas = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return apiCall(`/api/reservas?${query}`);
};
export const getReserva = (id) => apiCall(`/api/reservas/${id}`);
export const createReserva = (data) => apiCall('/api/reservas', 'POST', data);
export const updateReserva = (id, data) => apiCall(`/api/reservas/${id}`, 'PUT', data);
export const updateReservaEstado = (id, estado) => apiCall(`/api/reservas/${id}/estado`, 'PATCH', { estado });
export const deleteReserva = (id) => apiCall(`/api/reservas/${id}`, 'DELETE');

// Reclamos
export const getReclamos = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return apiCall(`/api/reclamos?${query}`);
};
export const getReclamo = (id) => apiCall(`/api/reclamos/${id}`);
export const createReclamo = (data) => apiCall('/api/reclamos', 'POST', data);
export const updateReclamo = (id, data) => apiCall(`/api/reclamos/${id}`, 'PUT', data);
export const updateReclamoEstado = (id, estado) => apiCall(`/api/reclamos/${id}/estado`, 'PATCH', { estado });
export const deleteReclamo = (id) => apiCall(`/api/reclamos/${id}`, 'DELETE');

// Gastos
export const getGastos = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return apiCall(`/api/gastos?${query}`);
};
export const getGasto = (id) => apiCall(`/api/gastos/${id}`);
export const createGasto = (data) => apiCall('/api/gastos', 'POST', data);
export const updateGasto = (id, data) => apiCall(`/api/gastos/${id}`, 'PUT', data);
export const updateGastoEstadoPago = (id, estado_pago) => apiCall(`/api/gastos/${id}/estado-pago`, 'PATCH', { estado_pago });
export const deleteGasto = (id) => apiCall(`/api/gastos/${id}`, 'DELETE');
