import app from "./app";
import { sql } from "./utils/db";
import dotenv from "dotenv";
import { createClient } from "redis";
import { disconnectKafka } from "./producer";
dotenv.config();

const PORT = process.env.PORT || 5000;


//Redis client setup
export const redisClient = createClient({
  url: process.env.REDIS_URL,

});

redisClient.connect().then(() => {
  console.log("✅Connected to Redis");
}).catch((err) => {
  console.error("Could not connect to Redis", err);
});

// Handle shutdown signals for clean disconnect
process.on('SIGINT', async () => {
  console.log('Disconnecting from Kafka and Redis...');
  await disconnectKafka();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Disconnecting from Kafka and Redis...');
  await disconnectKafka();
  await redisClient.quit();
  process.exit(0);
});

//db schema
async function initDB() {
  try {
    await sql`
     DO $$
     BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
        END IF;
      END
      $$;
     `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_picture VARCHAR(255),   
        profile_picture_public_id VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMP  
      );
    `;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS resume VARCHAR(255);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_public_id VARCHAR(255);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_public_id VARCHAR(255);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription TIMESTAMP;`;

    await sql`

      CREATE TABLE IF NOT EXISTS skills (
        skill_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
  `;

    await sql`
  
      CREATE TABLE IF NOT EXISTS user_skills (
       user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
       skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
       PRIMARY KEY (user_id, skill_id)
      
      );


      `;
  } catch (error: any) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDB();

// Routes

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
