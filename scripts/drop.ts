import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function drop() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(`
    DROP TABLE IF EXISTS menu_items;
    DROP TABLE IF EXISTS menu_categories;
    DROP TABLE IF EXISTS gallery_images;
    DROP TYPE IF EXISTS menu_tab;
    DROP TYPE IF EXISTS gallery_size;
  `);
  console.log("Tables dropped.");
  await pool.end();
  process.exit(0);
}

drop();
