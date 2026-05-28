import { neon } from "@neondatabase/serverless";

/**
 * One-time migration endpoint.
 * Call POST /api/db-migrate to create tables.
 * Protected by a simple secret check.
 * Remove this route after initial migration.
 */
export async function POST(req: Request) {
  // Simple protection — require secret header
  const secret = req.headers.get("x-migrate-secret");
  if (secret !== process.env.RESEND_API_KEY?.slice(0, 10)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(255),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      )
    `;

    // Create location_suggestions table
    await sql`
      CREATE TABLE IF NOT EXISTS "location_suggestions" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "latitude" real NOT NULL,
        "longitude" real NOT NULL,
        "lat_rounded" integer NOT NULL,
        "lng_rounded" integer NOT NULL,
        "address" text,
        "note" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "location_suggestions_user_id_users_id_fk" 
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
          ON DELETE no action ON UPDATE no action
      )
    `;

    // Create unique index for deduplication
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_location" 
      ON "location_suggestions" USING btree ("user_id","lat_rounded","lng_rounded")
    `;

    return Response.json({ success: true, message: "Tables created successfully" });
  } catch (err) {
    console.error("Migration error:", err);
    return Response.json(
      { error: "Migration failed", details: String(err) },
      { status: 500 }
    );
  }
}
