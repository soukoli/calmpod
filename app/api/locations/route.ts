import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql, eq, count } from "drizzle-orm";
import { locationSuggestions, votes } from "@/db/schema";

/**
 * GET /api/locations
 * Public endpoint — returns all location suggestions with vote counts.
 * No personal data (emails, names) is exposed. GDPR-safe.
 */
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const sqlClient = neon(process.env.DATABASE_URL);
    const db = drizzle(sqlClient);

    // Query locations with vote counts using a left join + group by
    const locations = await db
      .select({
        id: locationSuggestions.id,
        latitude: locationSuggestions.latitude,
        longitude: locationSuggestions.longitude,
        address: locationSuggestions.address,
        imageUrl: locationSuggestions.imageUrl,
        status: locationSuggestions.status,
        createdAt: locationSuggestions.createdAt,
        voteCount: sql<number>`COALESCE(COUNT(${votes.id}), 0)::int`.as("vote_count"),
      })
      .from(locationSuggestions)
      .leftJoin(votes, eq(votes.locationId, locationSuggestions.id))
      .groupBy(locationSuggestions.id)
      .orderBy(sql`vote_count DESC, ${locationSuggestions.createdAt} DESC`);

    // Also count how many unique users suggested each rounded location
    // (multiple users can suggest the same ~11m spot)
    const suggestionCounts = await db
      .select({
        latRounded: locationSuggestions.latRounded,
        lngRounded: locationSuggestions.lngRounded,
        suggesters: count(locationSuggestions.userId).as("suggesters"),
      })
      .from(locationSuggestions)
      .groupBy(locationSuggestions.latRounded, locationSuggestions.lngRounded);

    // Build a lookup map for suggester counts
    const suggesterMap = new Map<string, number>();
    for (const row of suggestionCounts) {
      const key = `${row.latRounded}_${row.lngRounded}`;
      suggesterMap.set(key, Number(row.suggesters));
    }

    // Enrich locations with suggester count
    const enrichedLocations = locations.map((loc) => {
      const latRounded = Math.round(loc.latitude * 10000);
      const lngRounded = Math.round(loc.longitude * 10000);
      const key = `${latRounded}_${lngRounded}`;

      return {
        id: loc.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: loc.address,
        imageUrl: loc.imageUrl,
        status: loc.status,
        createdAt: loc.createdAt,
        voteCount: loc.voteCount,
        suggesters: suggesterMap.get(key) || 1,
      };
    });

    return Response.json({
      locations: enrichedLocations,
      total: enrichedLocations.length,
    });
  } catch (err) {
    console.error("Locations API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
