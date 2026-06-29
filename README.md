# Comunidad Segura - Portal Web

Sistema de gestión inteligente para edificios y condominios en Chile. Frontend React conectado a backend n8n.

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Build para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 🔧 Stack Técnico

- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS
- **Íconos:** Lucide React
- **Routing:** React Router v6
- **HTTP:** Fetch nativo
- **Estado:** useState + useEffect

## 📡 Endpoints del Backend

```
BASE URL: https://ruthsaraiveb.app.n8n.cloud/webhook

POST /comunidad-segura/chat          → Webchat con agente IA
GET  /comunidad-segura/dashboard     → Stats en tiempo real
GET  /comunidad-segura/residentes    → Lista de residentes
GET  /comunidad-segura/status        → Estado del sistema
```

## 🎨 Secciones de la Aplicación

### 1. Dashboard Principal
- Métricas en tiempo real con polling cada 30s
- Total residentes activos
- Tickets abiertos (con alerta de urgentes)
- Reservas próximas
- Reclamos pendientes
- Turno conserje actual
- Estado multa gastos comunes

### 2. Webchat IA
- Burbuja flotante en esquina inferior derecha
- Chat con agente IA de Comunidad Segura
- Session ID generado automáticamente
- Manejo de errores con mensajes amigables
- Timeout de 15 segundos

### 3. Directorio de Residentes
- Tabla con búsqueda por nombre o unidad
- Filtro por tipo (departamento/local/estacionamiento)
- Badge de estado (activo/inactivo)
- Contador total de residentes

### 4. Estado del Sistema
- Estado general (operativo/degradado)
- Estado de cada servicio (chatbot, BD, API UF, guardrails)
- Valor UF del día desde mindicador.cl
- Reglas activas del edificio
- Timestamp última actualización

## 🎨 Paleta de Colores

- `#1B2E4B` - Azul marino oscuro (primario)
- `#2E7D5E` - Verde esmeralda (éxito)
- `#E8F4F0` - Verde muy claro (fondos)
- `#F59E0B` - Ámbar (alertas)
- `#EF4444` - Rojo (urgente)
- `#F8FAFC` - Gris casi blanco (fondo)

## 📱 Responsive

- **Desktop:** Sidebar visible + contenido principal
- **Tablet (768px):** Sidebar colapsable con ícono hamburguesa
- **Mobile (480px):** Sidebar oculto, navegación por tabs

## 📁 Estructura de Archivos

```
src/
├── App.jsx                    # Componente principal con routing
├── main.jsx                   # Punto de entrada
├── index.css                  # Estilos globales + Tailwind
├── api/
│   └── n8n.js                 # Llamadas a API de n8n
├── components/
│   ├── Sidebar.jsx            # Navegación lateral
│   ├── Dashboard.jsx          # Dashboard principal
│   ├── ChatWidget.jsx         # Chat flotante
│   ├── Residentes.jsx         # Directorio de residentes
│   ├── StatusPanel.jsx        # Estado del sistema
│   └── ui/
│       ├── Card.jsx           # Componente Card genérico
│       ├── Badge.jsx          # Badge de estado
│       └── Spinner.jsx        # Spinner de carga
└── hooks/
    ├── useDashboard.js        # Hook para dashboard con polling
    └── useChat.js             # Hook para lógica del chat
```

## ⚠️ Notas Importantes

- No se usa localStorage para persistir el chat (solo estado en memoria)
- No se usan librerías UI externas (solo Tailwind + Lucide)
- No se usa axios (solo fetch nativo)
- El session_id del chat se genera con `crypto.randomUUID()`
- El dashboard hace polling automático cada 30 segundos

## 🔐 Manejo de Errores

- **Timeout (15s):** "El asistente tardó demasiado, intenta de nuevo"
- **Error HTTP:** "No pudimos procesar tu mensaje. Intenta de nuevo."
- **Bloqueo:** "Tu mensaje no pudo ser procesado por seguridad."

## 📄 Licencia

Proyecto desarrollado para Comunidad Segura.
