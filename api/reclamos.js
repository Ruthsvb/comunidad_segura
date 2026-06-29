import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  port: process.env.SUPABASE_PORT || 6543,
  database: process.env.SUPABASE_DB || 'postgres',
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tipo, descripcion, residente_id } = req.body;

  if (!tipo || !descripcion || !residente_id) {
    return res.status(400).json({ ok: false, error: 'Campos requeridos faltantes' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reclamos (tipo, descripcion, estado, residente_id) VALUES ($1, $2, $3, $4) RETURNING id, tipo, descripcion, estado, fecha_creacion, residente_id',
      [tipo, descripcion, 'pendiente', residente_id]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
