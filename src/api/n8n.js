// Conexión directa a los webhooks de n8n Cloud
const BASE = 'https://ruthsaraiveb.app.n8n.cloud/webhook';

/**
 * Envía un mensaje al chatbot de Comunidad Segura
 * @param {Object} params - Parámetros del mensaje
 * @param {string} params.message - Texto del mensaje del usuario
 * @param {string} params.session_id - UUID de la sesión
 * @param {string} params.user_name - Nombre del residente
 * @returns {Promise<Object>} Respuesta del chatbot
 */
export async function sendChatMessage({ message, session_id, user_name, unidad, email, residente_id }) {
  const res = await fetch(`${BASE}/comunidad-segura/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id, user_name, unidad, email, residente_id })
  });
  
  try {
    return await res.json();
  } catch (err) {
    if (!res.ok) throw new Error('Error al contactar el asistente');
    throw err;
  }
}

/**
 * Obtiene las estadísticas del dashboard en tiempo real
 * @returns {Promise<Object>} Datos del dashboard
 */
export async function getDashboard() {
  const res = await fetch(`${BASE}/comunidad-segura/dashboard`)
  if (!res.ok) throw new Error('Error al cargar dashboard')
  return res.json()
}

/**
 * Obtiene la lista de residentes
 * @returns {Promise<Object>} Lista de residentes con total
 */
export async function getResidentes() {
  const res = await fetch(`${BASE}/comunidad-segura/residentes`)
  if (!res.ok) throw new Error('Error al cargar residentes')
  return res.json()
}

/**
 * Obtiene el estado del sistema
 * @returns {Promise<Object>} Estado de servicios y sistema
 */
export async function getStatus() {
  const res = await fetch(`${BASE}/comunidad-segura/status`)
  if (!res.ok) throw new Error('Error al cargar estado')
  return res.json()
}

/**
 * Obtiene la lista de tickets
 * @returns {Promise<Array>} Lista de tickets
 */
export async function getTickets() {
  const res = await fetch(`${BASE}/comunidad-segura/tickets`);
  if (!res.ok) throw new Error('Error al cargar tickets');
  const data = await res.json();
  if (data.message === 'Error in workflow') throw new Error('El flujo de tickets en n8n tiene un error interno.');
  return Array.isArray(data) ? data : data.data || [];
}

/**
 * Crea un ticket de mantenimiento
 * @param {Object} params - Parámetros del ticket
 * @param {string} params.titulo - Título del ticket
 * @param {string} params.descripcion - Descripción del problema
 * @param {string} params.prioridad - Prioridad (normal, urgente)
 * @param {number} params.residente_id - ID del residente
 * @returns {Promise<Object>} Ticket creado
 */
export async function createTicket({ titulo, descripcion, prioridad = 'normal', residente_id }) {
  const res = await fetch(`${BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion, prioridad, residente_id })
  })

  try {
    return await res.json()
  } catch (err) {
    if (!res.ok) throw new Error('Error al crear ticket')
    throw err
  }
}

/**
 * Obtiene la lista de reclamos
 * @returns {Promise<Array>} Lista de reclamos
 */
export async function getReclamos() {
  const res = await fetch(`${BASE}/comunidad-segura/reclamos`);
  if (!res.ok) throw new Error('Error al cargar reclamos');
  const data = await res.json();
  if (data.message === 'Error in workflow') throw new Error('El flujo de reclamos en n8n tiene un error interno.');
  return Array.isArray(data) ? data : data.data || [];
}

/**
 * Obtiene la lista de gastos
 * @returns {Promise<Array>} Lista de gastos
 */
export async function getGastos() {
  const res = await fetch(`${BASE}/comunidad-segura/gastos`);
  if (!res.ok) throw new Error('Error al cargar gastos');
  const data = await res.json();
  if (data.message === 'Error in workflow') throw new Error('El flujo de gastos en n8n tiene un error interno.');
  return Array.isArray(data) ? data : data.data || [];
}

/**
 * Obtiene la lista de reservas
 * @returns {Promise<Array>} Lista de reservas
 */
export async function getReservas() {
  const res = await fetch(`${BASE}/comunidad-segura/reservas`);
  
  if (!res.ok) {
    throw new Error('Error al cargar reservas');
  }
  
  try {
    const data = await res.json();
    // Si n8n devuelve { message: 'Error in workflow' } o similar
    if (data.message === 'Error in workflow') {
      throw new Error('El flujo de reservas en n8n tiene un error interno.');
    }
    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    throw err;
  }
}

/**
 * Crea una reserva de espacio común
 * @param {Object} params - Parámetros de la reserva
 * @param {string} params.espacio - Espacio a reservar (quincho, sala_multiuso, etc)
 * @param {string} params.fecha_inicio - Fecha/hora inicio (ISO 8601)
 * @param {string} params.fecha_fin - Fecha/hora fin (ISO 8601)
 * @param {number} params.residente_id - ID del residente
 * @returns {Promise<Object>} Reserva creada
 */
export async function createReserva({ espacio, fecha_inicio, fecha_fin, residente_id }) {
  const res = await fetch(`${BASE}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ espacio, fecha_inicio, fecha_fin, residente_id })
  })

  try {
    return await res.json()
  } catch (err) {
    if (!res.ok) throw new Error('Error al crear reserva')
    throw err
  }
}

/**
 * Crea un reclamo
 * @param {Object} params - Parámetros del reclamo
 * @param {string} params.tipo - Tipo de reclamo
 * @param {string} params.descripcion - Descripción del reclamo
 * @param {number} params.residente_id - ID del residente
 * @returns {Promise<Object>} Reclamo creado
 */
export async function createReclamo({ tipo, descripcion, residente_id }) {
  const res = await fetch(`${BASE}/reclamos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, descripcion, residente_id })
  })

  try {
    return await res.json()
  } catch (err) {
    if (!res.ok) throw new Error('Error al crear reclamo')
    throw err
  }
}
