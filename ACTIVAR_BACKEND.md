# Activar Backend en n8n

El frontend está configurado pero los webhooks de n8n necesitan ser activados.

## 📋 Pasos para Activar

### 1. Importar Workflow en n8n

1. Abre tu instancia de n8n: `https://ruthsaraiveb.app.n8n.cloud`
2. Ve a **Workflows** → **Import from File**
3. Importa el archivo JSON del workflow (está en `n8n_workflows/`)

### 2. Activar Webhooks

Cada webhook necesita ser activado individualmente:

**Webhook 1: /comunidad-segura/status**
- Busca el nodo "REST API Endpoint"
- Haz clic en "Activate" o cambia a "Production" mode
- Webhook ID: `4b824a43-82be-4be1-af08-b3f3b931d6e0`

**Webhook 2: /comunidad-segura/residentes**
- Busca el nodo "API Residentes"
- Activa el webhook
- Webhook ID: `48162541-0c7b-43fe-ae9d-e338d7cd1443`

**Webhook 3: /comunidad-segura/dashboard**
- Busca el nodo "API Dashboard"
- Activa el webhook
- Webhook ID: `2ff2e518-8b09-4429-9cd0-d2de7c74d8d3`

**Webhook 4: /comunidad-segura/chat**
- Busca el nodo "Webchat Trigger"
- Activa el webhook
- Webhook ID: `f76c9dc0-c68c-424b-a7c7-4522b4359468`

### 3. Configurar Credenciales

El workflow requiere las siguientes credenciales:

**Telegram API** (opcional, solo para el bot de Telegram)
- Crea credenciales de tipo "Telegram API"
- Ingresa tu Bot Token de @BotFather

**PostgreSQL** (requerido)
- Crea credenciales de tipo "Postgres"
- Host, Database, User, Password
- Asegúrate que la base de datos tenga las tablas creadas (ver BACKEND.md)

**Anthropic API** (requerido para Claude Haiku)
- Crea credenciales de tipo "Anthropic API"
- Ingresa tu API Key de Anthropic

### 4. Verificar Conexión

Una vez activados, los webhooks estarán disponibles en:
```
https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/status
https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/residentes
https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/dashboard
https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/chat
```

### 5. Probar Endpoints

Puedes probar los endpoints con curl:

```bash
# Test status
curl https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/status

# Test residentes
curl https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/residentes

# Test dashboard
curl https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/dashboard

# Test chat
curl -X POST https://ruthsaraiveb.app.n8n.cloud/webhook/comunidad-segura/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hola","session_id":"test-123","user_name":"Test"}'
```

## ⚠️ Problemas Comunes

### Error: "Failed to fetch"
- Los webhooks no están activados
- La URL del webhook es incorrecta
- CORS no está configurado (los webhooks del workflow tienen `Access-Control-Allow-Origin: *`)

### Error: "Connection refused"
- La instancia de n8n no está corriendo
- Firewall bloqueando conexiones

### Error: "Database connection failed"
- Credenciales de PostgreSQL incorrectas
- Base de datos no existe
- Tablas no creadas

### Error: "Anthropic API error"
- API Key inválida o expirada
- Sin créditos en Anthropic

## 🔗 URLs de los Webhooks

| Endpoint | Webhook ID | Path |
|----------|------------|------|
| Status | 4b824a43-82be-4be1-af08-b3f3b931d6e0 | /comunidad-segura/status |
| Residentes | 48162541-0c7b-43fe-ae9d-e338d7cd1443 | /comunidad-segura/residentes |
| Dashboard | 2ff2e518-8b09-4429-9cd0-d2de7c74d8d3 | /comunidad-segura/dashboard |
| Chat | f76c9dc0-c68c-424b-a7c7-4522b4359468 | /comunidad-segura/chat |

## 📝 Nota

El workflow JSON completo está en `n8n_workflows/comunidad_segura_workflow.json` o cualquiera de los archivos JSON en esa carpeta. Importa el que esté más actualizado según tu versión.
