import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://ace:ace_dev_pw@localhost:5432/ace",
});

async function seed() {
  const client = await pool.connect();
  const password = await bcrypt.hash("password123", 12);

  try {
    await client.query("BEGIN");

    // Clear existing data
    await client.query("DELETE FROM event_participants");
    await client.query("DELETE FROM events");
    await client.query("DELETE FROM users");

    // Create admin
    const { rows: [admin] } = await client.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Admin", "admin@ace.club", password, "ADMIN"]
    );

    // Create Maya (main participant)
    const { rows: [maya] } = await client.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Maya", "maya@example.com", password, "PARTICIPANT"]
    );

    // Create other participants
    const names = ["Alex S", "Tom K", "Mia R", "Jake L", "Nina P", "Kyle O", "Brooke D", "Finn H", "Quinn W", "Clara T", "Zara N", "Peter L"];
    const participantIds: string[] = [maya.id];

    for (const name of names) {
      const email = `${name.toLowerCase().replace(" ", "")}@example.com`;
      const { rows: [user] } = await client.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
        [name, email, password, "PARTICIPANT"]
      );
      participantIds.push(user.id);
    }

    // Create events
    const events = [
      { title: "Saturday Morning Cardio Clinic", category: "CLINIC", date: "2026-07-11", time: "09:00", location: "Court 1–3, Westside Tennis Club", capacity: 30, description: "High-energy drills for all levels — footwork, volleys, and live-ball rallies. Bring a racquet, we'll supply the balls." },
      { title: "Beginner Strokes Workshop", category: "CLINIC", date: "2026-07-14", time: "18:30", location: "Court 4, Backboard Wall", capacity: 12, description: "Forehand, backhand, and serve basics with a coach watching your form. Loaner racquets available at check-in." },
      { title: "Doubles Mixer Night", category: "DOUBLES", date: "2026-07-18", time: "19:00", location: "Courts 5–8, Under the Lights", capacity: 40, description: "Rotating partners every set so you play with someone new each round. Drinks and snacks at the net after." },
      { title: "Summer Singles Ladder — Round 3", category: "SINGLES_LADDER", date: "2026-07-20", time: "06:30", location: "Court 2, Center Stadium", capacity: 16, description: "Best two of three sets, self-scored. Report your result in the app and your ranking updates by Monday." },
      { title: "Junior Future Stars Camp", category: "JUNIOR", date: "2026-07-22", time: "16:00", location: "Court 9–10, Junior Courts", capacity: 20, description: "Ages 8–12. Mini-tennis games, agility ladders, and a short match at the end. Parents welcome to watch courtside." },
    ];

    const eventIds: string[] = [];
    for (const e of events) {
      const { rows: [event] } = await client.query(
        `INSERT INTO events (title, category, date, time, location, capacity, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [e.title, e.category, e.date, e.time, e.location, e.capacity, e.description, admin.id]
      );
      eventIds.push(event.id);
    }

    // Join participants to events (matching frontend sample data)
    const joinCounts = [5, 10, 2, 12, 3];
    for (let i = 0; i < eventIds.length; i++) {
      for (let j = 0; j < joinCounts[i]; j++) {
        await client.query(
          "INSERT INTO event_participants (user_id, event_id) VALUES ($1, $2)",
          [participantIds[j], eventIds[i]]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seed complete.");
    console.log(`  Admin: admin@ace.club / password123`);
    console.log(`  Participant: maya@example.com / password123`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
