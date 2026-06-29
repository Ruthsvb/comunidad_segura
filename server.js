import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = 3000;

// PostgreSQL Supabase
const pool = new Pool({
  host: 'aws-1-sa-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.gfnvocyhhcybnvuxfsmy',
  password: process.env.SUPABASE_PASSWORD || '',
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// POST /api/tickets
app.post('/api/tickets', async (req, res) => {
  const { titulo, descripcion, prioridad = 'normal', residente_id } = req.body;

  if (!titulo || !descripcion || !residente_id) {
    return res.status(400).json({ ok: false, error: 'Campos requeridos faltantes' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tickets_mantencion (titulo, descripcion, estado, prioridad, residente_id, categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descripcion, 'abierto', prioridad, residente_id, 'otro']
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creando ticket:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/reservas
app.post('/api/reservas', async (req, res) => {
  const { espacio, fecha_inicio, fecha_fin, residente_id } = req.body;

  if (!espacio || !fecha_inicio || !fecha_fin || !residente_id) {
    return res.status(400).json({ ok: false, error: 'Campos requeridos faltantes' });
  }

  try {
    const start = new Date(fecha_inicio);
    const end = new Date(fecha_fin);
    const result = await pool.query(
      'INSERT INTO reservas (espacio_comun, fecha_inicio, fecha_fin, estado, residente_id, fecha, hora_inicio, hora_fin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [espacio, fecha_inicio, fecha_fin, 'confirmada', residente_id, start.toISOString().split('T')[0], start.toISOString().split('T')[1], end.toISOString().split('T')[1]]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/reclamos
app.post('/api/reclamos', async (req, res) => {
  const { tipo, descripcion, residente_id } = req.body;

  if (!tipo || !descripcion || !residente_id) {
    return res.status(400).json({ ok: false, error: 'Campos requeridos faltantes' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reclamos (tipo, descripcion, estado, residente_id, unidad_afectada, motivo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, descripcion, 'abierto', residente_id, 'por-definir', tipo]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creando reclamo:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend activo' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
