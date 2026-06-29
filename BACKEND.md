# Backend - Comunidad Segura (n8n)

Documentación del backend implementado en n8n con PostgreSQL y Anthropic Claude.

## 📡 Endpoints API

### 1. POST /comunidad-segura/chat
**Webhook ID:** f76c9dc0-c68c-424b-a7c7-4522b4359468

**Request Body:**
```json
{
  "message": "texto del usuario",
  "session_id": "uuid-generado-en-frontend",
  "user_name": "Nombre del residente"
}
```

**Response (Éxito):**
```json
{
  "ok": true,
  "response": "texto de respuesta del agente",
  "session_id": "mismo uuid",
  "timestamp": "2026-06-28T..."
}
```

**Response (Bloqueado):**
```json
{
  "ok": false,
  "response": "🚫 Tu mensaje fue bloqueado por contener contenido inapropiado.",
  "blocked": true
}
```

**Flujo:**
1. Extraer mensaje webchat
2. Guardrail (jailbreak + NSFW detection con Claude Haiku)
3. Si pasa → Agente Web con memoria PostgreSQL
4. Si falla → Responder con bloqueo (403)

---

### 2. GET /comunidad-segura/status
**Webhook ID:** 4b824a43-82be-4be1-af08-b3f3b931d6e0

**Response:**
```json
{
  "sistema": "Comunidad Segura v1.0",
  "estado": "operativo",
  "timestamp": "2026-06-28T...",
  "fecha": "28/06/2026",
  "hora": "14:30:00",
  "turnoConserje": "Mañana (08:00-16:00)",
  "gastosComunes": {
    "multaActiva": false,
    "diasParaVencimiento": 5,
    "proximoVencimiento": "10/07/2026",
    "diasHastaVencimiento": 12
  },
  "reglas": {
    "anticipacionReservas": "48 horas",
    "slaUrgente": "24 horas",
    "multaPorAtraso": "1.5%"
  },
  "servicios": {
    "chatbot": "activo",
    "baseDatos": "conectada",
    "apiUF": "disponible",
    "guardrails": "activos"
  }
}
```

**Nota:** El endpoint NO incluye valor UF. El frontend debe obtenerlo de mindicador.cl directamente o agregarlo al workflow.

---

### 3. GET /comunidad-segura/residentes
**Webhook ID:** 48162541-0c7b-43fe-ae9d-e338d7cd1443

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nombre": "María",
      "apellido": "González",
      "unidad": "101",
      "tipo_unidad": "departamento",
      "activo": true
    }
  ],
  "total": 48
}
```

**Query:**
```sql
SELECT id, nombre, apellido, unidad, tipo_unidad, activo 
FROM residentes 
ORDER BY unidad
```

---

### 4. GET /comunidad-segura/dashboard
**Webhook ID:** 2ff2e518-8b09-4429-9cd0-d2de7c74d8d3

**Response:**
```json
{
  "ok": true,
  "data": {
    "residentes_activos": 45,
    "tickets_abiertos": 12,
    "tickets_urgentes": 3,
    "reservas_proximas": 8,
    "reclamos_pendientes": 5,
    "gastos_pendientes": 2,
    "alertas": [
      {
        "tipo": "urgente",
        "mensaje": "3 ticket(s) urgente(s) pendiente(s)"
      }
    ],
    "turnoConserje": "mañana",
    "multaGastosActiva": false,
    "timestamp": "2026-06-28T..."
  }
}
```

**Query Base:**
```sql
SELECT 
  (SELECT COUNT(*) FROM residentes WHERE activo=true) AS residentes_activos,
  (SELECT COUNT(*) FROM tickets_mantencion WHERE estado='abierto') AS tickets_abiertos,
  (SELECT COUNT(*) FROM tickets_mantencion WHERE estado='abierto' AND prioridad='urgente') AS tickets_urgentes,
  (SELECT COUNT(*) FROM reservas WHERE fecha_inicio >= NOW()) AS reservas_proximas,
  (SELECT COUNT(*) FROM reclamos WHERE estado='pendiente') AS reclamos_pendientes,
  (SELECT COUNT(*) FROM gastos_comunes WHERE estado='pendiente') AS gastos_pendientes
```

**Enriquecimiento (Code Node):**
- Calcula turno conserje (mañana/tarde/noche)
- Detecta multa activa (día > 10)
- Genera alertas dinámicas

---

## 🗄️ Estructura de Base de Datos PostgreSQL

### Tabla: residentes
```sql
CREATE TABLE residentes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50),
  unidad VARCHAR(20) NOT NULL,
  tipo_unidad VARCHAR(50), -- departamento, local, estacionamiento
  activo BOOLEAN DEFAULT true
);
```

### Tabla: tickets_mantencion
```sql
CREATE TABLE tickets_mantencion (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50), -- abierto, en_proceso, resuelto
  prioridad VARCHAR(50), -- normal, urgente
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  residente_id INTEGER REFERENCES residentes(id)
);
```

### Tabla: reservas
```sql
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  espacio VARCHAR(100) NOT NULL, -- quincho, sala_multiuso, estacionamiento_visitas
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL,
  estado VARCHAR(50), -- confirmada, cancelada, completada
  residente_id INTEGER REFERENCES residentes(id)
);
```

### Tabla: gastos_comunes
```sql
CREATE TABLE gastos_comunes (
  id SERIAL PRIMARY KEY,
  periodo VARCHAR(20), -- MM/YYYY
  estado VARCHAR(50), -- pendiente, pagado, vencido
  monto_total_clp DECIMAL(15,2),
  monto_total_uf DECIMAL(10,2),
  fecha_vencimiento DATE,
  residente_id INTEGER REFERENCES residentes(id)
);
```

### Tabla: reclamos
```sql
CREATE TABLE reclamos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100),
  descripcion TEXT,
  estado VARCHAR(50), -- pendiente, en_revision, resuelto
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  residente_id INTEGER REFERENCES residentes(id)
);
```

### Tabla: cs_chat_histories (Memoria del Chat)
```sql
CREATE TABLE cs_chat_histories (
  session_id VARCHAR(255) PRIMARY KEY,
  messages JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 Agente IA (CS-Bot)

### Modelo
- **Principal:** Claude Haiku 4.5 (Anthropic)
- **Guardrails:** Jailbreak detection + NSFW detection (threshold 0.7)

### Herramientas Disponibles
1. **Think** - Razonamiento antes de actuar
2. **Consultar Residentes** - Query PostgreSQL
3. **Consultar Tickets** - Query PostgreSQL
4. **Consultar Reservas** - Query PostgreSQL
5. **Consultar Gastos** - Query PostgreSQL
6. **Consultar Reclamos** - Query PostgreSQL
7. **Crear Reserva** - Insert PostgreSQL
8. **Consultar UF Actual** - HTTP request a mindicador.cl

### Memoria
- **Postgres Chat Memory** - 10 mensajes de contexto
- Session ID como clave (web_session_id para webchat)

### Reglas de Negocio
1. Gastos comunes vencen día 10 → multa 1.5%
2. Reservas requieren 48h anticipación
3. Solo una reserva activa por unidad
4. Tickets urgentes: máximo 24h resolución

---

## 🔐 Seguridad

### Guardrails
- **Jailbreak Detection:** Threshold 0.7
- **NSFW Detection:** Threshold 0.7
- Mensajes bloqueados retornan HTTP 403

### CORS
- Headers: `Access-Control-Allow-Origin: *`
- Content-Type: `application/json`

---

## 📱 Canales Adicionales (Telegram)

El workflow también soporta:
- **Telegram Trigger** - Chat por Telegram
- **Audio** - Transcripción con Groq
- **Imágenes** - Análisis con Claude Vision + creación automática de tickets

Estos canales NO están expuestos por API REST, solo por Telegram Bot.

---

## ⚠️ Diferencias con Especificación Original

1. **Valor UF en /status:** El endpoint NO retorna valor UF. El frontend debe obtenerlo de mindicador.cl directamente.
2. **Response /dashboard:** Incluye `gastos_pendientes` que no estaba en la especificación original.
3. **Response /status:** Formato diferente al especificado (no tiene estructura `data` ni `servicios` como array).

---

## 🔧 Compatibilidad Frontend-Backend

### ✅ Compatible
- `/comunidad-segura/chat` - Response format coincide
- `/comunidad-segura/residentes` - Response format coincide
- `/comunidad-segura/dashboard` - Response format coincide (con campos extra)

### ⚠️ Requiere Ajuste
- `/comunidad-segura/status` - Response format diferente al esperado por `StatusPanel.jsx`

### Ajustes Necesarios en Frontend

El componente `StatusPanel.jsx` espera:
```json
{
  "data": {
    "estado_general": "operativo",
    "servicios": { ... },
    "valor_uf": 35000,
    "reglas_activas": [ ... ],
    "ultima_actualizacion": "..."
  }
}
```

Pero el backend retorna:
```json
{
  "estado": "operativo",
  "servicios": { ... },
  "reglas": { ... },
  "timestamp": "..."
}
```

Necesito actualizar `StatusPanel.jsx` para adaptarse al formato real del backend.
