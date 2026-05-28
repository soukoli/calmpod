import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { users, locationSuggestions } from "@/db/schema";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, latitude, longitude, address, note } = body;

    // Validation
    if (!email || latitude == null || longitude == null) {
      return Response.json(
        { error: "Email and location coordinates are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not configured");
      return Response.json({ error: "Server configuration error" }, { status: 500 });
    }

    // --- DB: upsert user + insert location ---
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema: { users, locationSuggestions } });

    // Upsert user (insert or get existing by email)
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      // Update updatedAt
      await db
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, userId));
    } else {
      const inserted = await db
        .insert(users)
        .values({ email, name: null })
        .returning({ id: users.id });
      userId = inserted[0].id;
    }

    // Round coordinates for deduplication (4 decimals ≈ 11m)
    const latRounded = Math.round(latitude * 10000);
    const lngRounded = Math.round(longitude * 10000);

    // Insert location suggestion (ON CONFLICT = ignore duplicate)
    try {
      await db.insert(locationSuggestions).values({
        userId,
        latitude,
        longitude,
        latRounded,
        lngRounded,
        address: address || null,
        note: note || null,
      });
    } catch (err: unknown) {
      // Check if it's a unique constraint violation (duplicate location)
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("unique_user_location")) {
        return Response.json(
          { success: true, duplicate: true, message: "Location already suggested" },
          { status: 200 }
        );
      }
      throw err;
    }

    // --- Email notification (non-blocking) ---
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const contactEmail = process.env.CONTACT_EMAIL || "support@calmpod.cz";

        await resend.emails.send({
          from: "CalmPod <noreply@calmpod.cz>",
          to: contactEmail,
          replyTo: email,
          subject: `CalmPod: Nový návrh lokace`,
          text: [
            `📍 Nový návrh místa pro CalmPod`,
            ``,
            `Email: ${email}`,
            `Souřadnice: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            `Adresa: ${address || "neuvedena"}`,
            note ? `Poznámka: ${note}` : "",
            ``,
            `→ Uloženo v databázi.`,
          ]
            .filter(Boolean)
            .join("\n"),
        });

        // Also add to Resend Audience (subscriber list)
        const audienceId = process.env.RESEND_AUDIENCE_ID;
        if (audienceId) {
          await resend.contacts.create({
            email,
            audienceId,
          }).catch(() => { /* ignore duplicate */ });
        }
      } catch (emailErr) {
        console.warn("Email notification failed:", emailErr);
        // Don't fail the request — DB save is the priority
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Location API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
