import { pool } from "../config/db.js";
import { AppError } from "../middleware/error.js";

interface CreateEventInput {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
}

export async function listEvents(category?: string) {
  let query = `
    SELECT e.*,
      COALESCE(json_agg(json_build_object('id', u.id, 'name', u.name))
        FILTER (WHERE u.id IS NOT NULL), '[]') AS participants
    FROM events e
    LEFT JOIN event_participants ep ON ep.event_id = e.id
    LEFT JOIN users u ON u.id = ep.user_id
  `;
  const params: string[] = [];

  if (category) {
    params.push(category);
    query += ` WHERE e.category = $1`;
  }

  query += ` GROUP BY e.id ORDER BY e.date ASC`;

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getEvent(id: string) {
  const { rows } = await pool.query(
    `SELECT e.*,
      COALESCE(json_agg(json_build_object('id', u.id, 'name', u.name))
        FILTER (WHERE u.id IS NOT NULL), '[]') AS participants
    FROM events e
    LEFT JOIN event_participants ep ON ep.event_id = e.id
    LEFT JOIN users u ON u.id = ep.user_id
    WHERE e.id = $1
    GROUP BY e.id`,
    [id]
  );
  if (rows.length === 0) throw new AppError(404, "Event not found");
  return rows[0];
}

export async function createEvent(input: CreateEventInput, createdBy: string) {
  const { rows } = await pool.query(
    `INSERT INTO events (title, category, date, time, location, capacity, description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [input.title, input.category, input.date, input.time, input.location, input.capacity, input.description, createdBy]
  );
  return rows[0];
}

export async function updateEvent(id: string, input: Partial<CreateEventInput>) {
  const { rows: existing } = await pool.query("SELECT id FROM events WHERE id = $1", [id]);
  if (existing.length === 0) throw new AppError(404, "Event not found");

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      const column = key === "createdBy" ? "created_by" : key;
      fields.push(`${column} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (fields.length === 0) throw new AppError(400, "No fields to update");

  fields.push(`updated_at = now()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE events SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0];
}

export async function deleteEvent(id: string) {
  const { rowCount } = await pool.query("DELETE FROM events WHERE id = $1", [id]);
  if (rowCount === 0) throw new AppError(404, "Event not found");
}

export async function joinEvent(eventId: string, userId: string) {
  const { rows: eventRows } = await pool.query(
    `SELECT capacity, (SELECT COUNT(*) FROM event_participants WHERE event_id = $1) AS participant_count
     FROM events WHERE id = $1`,
    [eventId]
  );
  if (eventRows.length === 0) throw new AppError(404, "Event not found");

  const event = eventRows[0];
  if (parseInt(event.participant_count) >= event.capacity) {
    throw new AppError(409, "Event is full");
  }

  const { rows: existingJoin } = await pool.query(
    "SELECT id FROM event_participants WHERE user_id = $1 AND event_id = $2",
    [userId, eventId]
  );
  if (existingJoin.length > 0) throw new AppError(409, "Already joined this event");

  const { rows } = await pool.query(
    "INSERT INTO event_participants (user_id, event_id) VALUES ($1, $2) RETURNING *",
    [userId, eventId]
  );
  return rows[0];
}

export async function leaveEvent(eventId: string, userId: string) {
  const { rowCount } = await pool.query(
    "DELETE FROM event_participants WHERE user_id = $1 AND event_id = $2",
    [userId, eventId]
  );
  if (rowCount === 0) throw new AppError(404, "Not joined this event");
}
