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

  const { espacio, fecha_inicio, fecha_fin, residente_id } = req.body;

  if (!espacio || !fecha_inicio || !fecha_fin || !residente_id) {
    return res.status(400).json({ ok: false, error: 'Campos requeridos faltantes' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reservas (espacio, fecha_inicio, fecha_fin, estado, residente_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, espacio, fecha_inicio, fecha_fin, estado, residente_id',
      [espacio, fecha_inicio, fecha_fin, 'confirmada', residente_id]
    );

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
