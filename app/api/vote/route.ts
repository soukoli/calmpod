import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { users, votes } from "@/db/schema";

/**
 * POST /api/vote
 * Vote for a location suggestion. One vote per user (email) per location.
 * Body: { email: string, locationId: number }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, locationId } = body;

    // Validation
    if (!email || !locationId) {
      return Response.json(
        { error: "Email and locationId are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (typeof locationId !== "number" || locationId < 1) {
      return Response.json({ error: "Invalid locationId" }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Upsert user (get or create by email)
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
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

    // Insert vote (ON CONFLICT = already voted)
    try {
      await db.insert(votes).values({
        userId,
        locationId,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("unique_user_vote")) {
        return Response.json(
          { success: true, alreadyVoted: true, message: "Already voted for this location" },
          { status: 200 }
        );
      }
      throw err;
    }

    return Response.json({ success: true, alreadyVoted: false });
  } catch (err) {
    console.error("Vote API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
