# n8n Workflow Cleanup - Guía de Ejecución

## Contexto
Backend Express ahora maneja CRUD del frontend. n8n debe quedar solo para:
1. Bot de Telegram
2. Bot Webchat
3. APIs temporales (Dashboard, Residentes) hasta confirmar backend en producción

## Workflow a limpiar
- **Nombre**: Comunidad Segura - Agente Principal
- **ID**: yNWUzxH3DuGOWUOW
- **URL**: https://ruthsaraiveb.app.n8n.cloud/workflows/yNWUzxH3DuGOWUOW
- **Estado actual**: 90 nodos, 17 a eliminar

## Nodos a ELIMINAR (17 total)

### Dead Code (5 nodos)
1. `Pasa Guardrail?` - IF sin entrada
2. `Pasa Guardrail Web?` - IF sin entrada
3. `Descargar Audio` - HTTP Request legacy
4. `Descargar Imagen` - HTTP Request legacy
5. `Transcribir Audio Groq` - OpenAI node redundante

### Web APIs (12 nodos - reemplazadas por backend Express)

**Tickets Flow:**
- `API Tickets` (webhook)
- `Query Tickets API` (postgres)
- `Responder Tickets` (response)

**Reservas Flow:**
- `API Reservas Web` (webhook)
- `Query Reservas API` (postgres)
- `Responder Reservas` (response)

**Reclamos Flow:**
- `API Reclamos Web` (webhook)
- `Query Reclamos API` (postgres)
- `Responder Reclamos` (response)

**Gastos Flow:**
- `API Gastos Web` (webhook)
- `Query Gastos API` (postgres)
- `Responder Gastos` (response)

## Nodos a CONSERVAR

### Telegram Bot Flow (~25 nodos)
- Telegram Webhook → Detectar tipo → Guardrails → Agente → Tools → Crear Reserva → Gmail → Calendar → Enviar Respuesta
- Audio: Obtener → Descargar Fix → Transcribir Claude → Normalizar
- Imagen: Obtener → Descargar Fix → Analizar Vision → Crear Ticket → Confirmar

### Webchat Bot Flow (~20 nodos)
- Webchat Trigger → Extraer Mensaje → Guardrails Web → Agente Web → Tools Web → Crear Reserva Web → Gmail Web → Calendar Web → Responder Webchat

### Dashboard API (~8 nodos)
- API Dashboard (webhook) → Query Dashboard → Enriquecer → Responder Dashboard

### Residentes API (~5 nodos)
- API Residentes (webhook) → Query Residentes → Responder Residentes

### Status Endpoint (~3 nodos)
- REST API Endpoint (webhook) → Generar JSON → Responder REST

**Total esperado después**: ~73 nodos (90 - 17)

## Pasos de Ejecución

### 1. Acceder al Workflow
```
https://ruthsaraiveb.app.n8n.cloud/workflows/yNWUzxH3DuGOWUOW
```
Click en botón "Edit"

### 2. Eliminar Nodos

Para cada nodo en la lista anterior:

1. **Desconectar primero** (si tiene conexiones):
   - Click derecho en nodo → "Delete connection"
   - Eliminar todas las entradas y salidas
   
2. **Eliminar nodo**:
   - Click derecho en nodo → "Delete"
   - O seleccionar + presionar Delete key

**Tip**: Hacer de arriba hacia abajo para evitar desconexiones confusas

### 3. Validar Estado

Después de eliminar todos, verificar:

```
Menú superior: "Validate Workflow"
```

Esperado:
- ✅ Sin errores rojos
- ✅ Sin warnings "Node has no input"
- ✅ Sin nodos aislados (flotantes)

### 4. Guardar y Publicar

1. **Guardar**: Ctrl+S o botón "Save"
   - Esperar confirmación
   
2. **Publicar**: Botón azul "Publish" (arriba derecha)
   - Esperar: "Workflow published successfully"

### 5. Verificar Funcionamiento

#### Test Telegram
```
1. Abrir Telegram
2. Buscar bot: @ComunidadSeguraBot (o tu nombre del bot)
3. Enviar: "Hola"
4. Esperar respuesta: "¿Cómo te puedo ayudar?"
```

#### Test Webchat
```
1. Ir a: https://comunidad-seguraproyecto.vercel.app
2. Click en botón de chat (abajo derecha)
3. Escribir: "Hola"
4. Esperar respuesta en widget
```

#### Test Dashboard
```
1. Ir a: https://comunidad-seguraproyecto.vercel.app
2. Login con usuario de prueba
3. Dashboard debe mostrar conteos/métricas
4. Verificar que carga sin errores de conexión
```

## Rollback (si algo sale mal)

1. En n8n: Menú → "Previous versions"
2. Seleccionar última versión antes de cleanup
3. Click "Restore"
4. Publish

## Monitoreo Post-Cleanup

Después de publicar, monitorear:

- **Executions**: n8n Dashboard → Workflow → "Executions"
  - Ver que Telegram y Webchat executions siguen sin errores
  
- **Errors**: Si hay fallos, revisar en "Logs"
  - Log level "Warning" para conexiones
  - Log level "Error" para issues críticos

## Timeline

- **Tiempo esperado**: 15-30 minutos (manual deletion)
- **Testing**: 5 minutos por bot
- **Total**: ~45 minutos

## Notas Finales

- Backend Express debe estar deployado en Render antes de migrar Dashboard/Residentes APIs
- Después de confirmar backend en producción, migrar también esas 2 APIs
- n8n quedará muy limpio: solo bots + memoria + tools
- Reducción de ejecuciones n8n = ahorrar créditos del plan
