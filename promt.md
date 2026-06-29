# PROMPT — COMUNIDAD SEGURA · Portal Web + Backend
## Para usar en: Cursor / Bolt / v0 / Lovable

---

## CONTEXTO DEL PROYECTO

Construye el portal web completo de **Comunidad Segura**, un sistema de gestión inteligente para edificios y condominios en Chile. El sistema ya tiene un backend en n8n con los siguientes endpoints listos:

```
BASE URL: https://ruthsaraiveb.app.n8n.cloud/webhook

POST /comunidad-segura/chat          → Webchat con agente IA
GET  /comunidad-segura/dashboard     → Stats en tiempo real
GET  /comunidad-segura/residentes    → Lista de residentes
GET  /comunidad-segura/status        → Estado del sistema
```

---

## LO QUE DEBES CONSTRUIR

### 1. FRONTEND (React + Tailwind)

Una Single Page Application con 4 secciones:

---

#### SECCIÓN 1 — DASHBOARD PRINCIPAL

Consume `GET /comunidad-segura/dashboard`

Muestra en tiempo real (polling cada 30s):
- Total residentes activos
- Tickets abiertos (con badge rojo si hay urgentes)
- Reservas próximas
- Reclamos pendientes
- Alertas activas (multa vigente, tickets urgentes)
- Turno conserje actual (mañana / tarde / noche)
- Indicador multa gastos comunes activa (día > 10 del mes)

**Diseño:** Cards con íconos, colores de estado (rojo=urgente, amarillo=pendiente, verde=ok)

---

#### SECCIÓN 2 — WEBCHAT IA EMBEBIDO

Consume `POST /comunidad-segura/chat`

**Request body:**
```json
{
  "message": "texto del usuario",
  "session_id": "uuid-generado-en-frontend",
  "user_name": "Nombre del residente"
}
```

**Response:**
```json
{
  "ok": true,
  "response": "texto de respuesta del agente",
  "session_id": "mismo uuid",
  "timestamp": "2026-06-28T..."
}
```

**UI del chat:**
- Burbuja flotante en esquina inferior derecha
- Al hacer clic abre panel lateral de chat
- Mensajes con avatar bot (logo CS) y avatar usuario
- Input con botón enviar + soporte Enter
- Indicador "escribiendo..." mientras espera respuesta
- Historial de mensajes en la sesión
- session_id generado con `crypto.randomUUID()` al cargar la página
- Nombre de usuario editable o "Residente" por defecto

---

#### SECCIÓN 3 — DIRECTORIO DE RESIDENTES

Consume `GET /comunidad-segura/residentes`

**Response:**
```json
{
  "ok": true,
  "data": [
    { "id": 1, "nombre": "María", "apellido": "González", "unidad": "101", "tipo_unidad": "departamento", "activo": true }
  ],
  "total": 48
}
```

**UI:**
- Tabla con búsqueda por nombre o unidad
- Filtro por tipo (departamento / local / estacionamiento)
- Badge de estado (activo / inactivo)
- Contador total

---

#### SECCIÓN 4 — ESTADO DEL SISTEMA

Consume `GET /comunidad-segura/status`

Muestra:
- Estado general (operativo / degradado)
- Estado de cada servicio (chatbot, base de datos, API UF, guardrails)
- Valor UF del día desde mindicador.cl (ya viene en el endpoint)
- Reglas activas del edificio
- Timestamp última actualización

---

### 2. DISEÑO VISUAL

**Identidad:** Sistema de gestión profesional chileno. No corporativo genérico — evoca seguridad, comunidad, confianza.

**Paleta:**
- `#1B2E4B` — Azul marino oscuro (primario, headers, sidebar)
- `#2E7D5E` — Verde esmeralda (acciones positivas, activo, confirmado)
- `#E8F4F0` — Verde muy claro (fondos de cards)
- `#F59E0B` — Ámbar (alertas, pendientes)
- `#EF4444` — Rojo (urgente, bloqueado)
- `#F8FAFC` — Gris casi blanco (fondo general)

**Tipografía:**
- Display: `Inter` bold 700 para títulos
- Body: `Inter` regular 400
- Datos/números: `JetBrains Mono` para IDs, fechas, montos

**Estructura:**
```
┌─────────────────────────────────────────────┐
│  SIDEBAR fijo 240px                         │
│  Logo + nav                                 │
├──────────────────────────────────────────── │
│                                             │
│  MAIN CONTENT                               │
│  Header con título de sección               │
│  Cards / tabla / contenido                  │
│                                             │
│                           [Chat flotante]   │
└─────────────────────────────────────────────┘
```

**Elemento signature:** El chat flotante tiene un pulso animado verde cuando el agente está disponible. Al responder, las burbujas tienen un fade-in suave desde abajo.

---

### 3. STACK TÉCNICO

```
Framework:    React 18 + Vite
Estilos:      Tailwind CSS
Íconos:       Lucide React
HTTP:         fetch nativo (sin axios)
Estado:       useState + useEffect (sin Redux)
Routing:      React Router v6
UUID:         crypto.randomUUID()
```

**NO uses:**
- Next.js (debe ser SPA puro)
- librerías de UI como shadcn o MUI (solo Tailwind)
- axios (solo fetch)
- localStorage para el chat (solo estado en memoria)

---

### 4. ESTRUCTURA DE ARCHIVOS

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── api/
│   └── n8n.js          ← todas las llamadas a n8n aquí
├── components/
│   ├── Sidebar.jsx
│   ├── Dashboard.jsx
│   ├── ChatWidget.jsx
│   ├── Residentes.jsx
│   ├── StatusPanel.jsx
│   └── ui/
│       ├── Card.jsx
│       ├── Badge.jsx
│       └── Spinner.jsx
└── hooks/
    ├── useDashboard.js  ← polling cada 30s
    └── useChat.js       ← lógica del chat
```

---

### 5. ARCHIVO API (src/api/n8n.js)

```javascript
const BASE = 'https://ruthsaraiveb.app.n8n.cloud/webhook'

export async function sendChatMessage({ message, session_id, user_name }) {
  const res = await fetch(`${BASE}/comunidad-segura/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id, user_name })
  })
  if (!res.ok) throw new Error('Error al contactar el asistente')
  return res.json()
}

export async function getDashboard() {
  const res = await fetch(`${BASE}/comunidad-segura/dashboard`)
  if (!res.ok) throw new Error('Error al cargar dashboard')
  return res.json()
}

export async function getResidentes() {
  const res = await fetch(`${BASE}/comunidad-segura/residentes`)
  if (!res.ok) throw new Error('Error al cargar residentes')
  return res.json()
}

export async function getStatus() {
  const res = await fetch(`${BASE}/comunidad-segura/status`)
  if (!res.ok) throw new Error('Error al cargar estado')
  return res.json()
}
```

---

### 6. COMPORTAMIENTO DEL CHAT

```javascript
// Hook useChat.js
const session_id = crypto.randomUUID() // generado UNA vez al cargar

// Estado inicial
const [messages, setMessages] = useState([
  {
    role: 'bot',
    text: '👋 Hola, soy CS-Bot. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date()
  }
])
const [loading, setLoading] = useState(false)

// Al enviar mensaje
async function sendMessage(text) {
  // 1. Agrega mensaje usuario
  // 2. Muestra "escribiendo..."
  // 3. POST a n8n
  // 4. Agrega respuesta bot
  // 5. Maneja error con mensaje amigable
}
```

**Manejo de errores:**
- Si el servidor tarda más de 15s → mostrar "El asistente tardó demasiado, intenta de nuevo"
- Si response.ok es false → "No pudimos procesar tu mensaje. Intenta de nuevo."
- Si está bloqueado (ok: false, blocked: true) → "Tu mensaje no pudo ser procesado por seguridad."

---

### 7. RESPONSIVE

- Desktop: sidebar visible + contenido principal
- Tablet (768px): sidebar colapsable con ícono hamburguesa
- Mobile (480px): sidebar oculto, navegación por tabs en bottom bar, chat ocupa toda la pantalla

---

### 8. DETALLES DE UX IMPORTANTES

1. **Loading states** en cada sección mientras carga datos
2. **Empty states** con mensaje claro cuando no hay datos
3. **Error states** con botón "Reintentar"
4. **Polling automático** del dashboard cada 30 segundos con indicador visual de última actualización
5. **Chat siempre visible** como burbuja flotante independiente de la sección activa
6. **Animación del logo** CS en el sidebar: pulso suave verde cuando el sistema está operativo

---

### 9. COMPONENTE CHATWIDGET — COMPORTAMIENTO EXACTO

```
Estado cerrado: burbuja circular 56px, azul marino, ícono de chat,
                badge rojo si hay mensajes nuevos,
                pulso verde animado (sistema activo)

Estado abierto: panel 380px ancho × 520px alto, fijo bottom-right,
                header con "CS-Bot" + indicador online,
                área de mensajes con scroll,
                input sticky en bottom,
                botón X para cerrar
```

---

### 10. CARD DEL DASHBOARD — ESTRUCTURA

Cada métrica tiene:
```
┌──────────────────────────┐
│  [ícono]   TÍTULO        │
│                          │
│     NÚMERO GRANDE        │
│     subtítulo            │
│                          │
│  [badge estado]          │
└──────────────────────────┘
```

Cards con alerta (tickets urgentes, multa activa) tienen borde izquierdo rojo/ámbar de 4px.

---

## LO QUE NO DEBES HACER

- No inventes endpoints — usa exactamente los que están definidos arriba
- No uses mock data permanente — solo mientras carga
- No pongas datos hardcodeados en el dashboard — todo viene de la API
- No uses localStorage para persistir el chat
- No uses librerías UI externas salvo Lucide para íconos

---

## ENTREGABLE ESPERADO

Una aplicación React completa, funcional, lista para:
1. Instalar con `npm install`
2. Correr con `npm run dev`
3. Conectarse a los endpoints reales de n8n

El código debe estar limpio, comentado en español, y con manejo de errores en cada llamada a la API.