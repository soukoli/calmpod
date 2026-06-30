import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for GET /api/locations
 * 
 * Since the route uses drizzle-orm's `sql` tagged template literals which are
 * complex to mock, we test this by mocking at the neon/drizzle level and
 * providing a fake db that returns canned data through the chained API.
 */

// Create a chainable mock that simulates drizzle's query builder
function createChainableMock(finalValue: unknown) {
  const mock: Record<string, unknown> = {};
  const handler = {
    get(_target: unknown, prop: string) {
      if (prop === "then") {
        // Make it thenable (awaitable) with final value
        return (resolve: (v: unknown) => void) => resolve(finalValue);
      }
      // Every method call returns the proxy itself (chaining)
      return (..._args: unknown[]) => new Proxy(mock, handler);
    },
  };
  return new Proxy(mock, handler);
}

let mockLocationsResult: unknown[] = [];
let mockSuggestionCountsResult: unknown[] = [];
let selectCallCount = 0;

vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({
    select: (..._args: unknown[]) => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return createChainableMock(mockLocationsResult);
      }
      return createChainableMock(mockSuggestionCountsResult);
    },
  })),
}));

// Mock drizzle-orm with proper sql tagged template support
vi.mock("drizzle-orm", () => {
  const sqlTag = (..._args: unknown[]) => ({
    as: () => ({}),
  });
  // Make it work as tagged template too
  Object.defineProperty(sqlTag, Symbol.hasInstance, { value: () => true });

  return {
    sql: sqlTag,
    eq: vi.fn(),
    count: vi.fn(() => ({ as: vi.fn() })),
  };
});

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

import { GET } from "@/app/api/locations/route";

describe("GET /api/locations", () => {
  beforeEach(() => {
    selectCallCount = 0;
    mockLocationsResult = [];
    mockSuggestionCountsResult = [];
  });

  it("should return empty locations array when no data", async () => {
    mockLocationsResult = [];
    mockSuggestionCountsResult = [];

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.locations).toEqual([]);
    expect(data.total).toBe(0);
  });

  it("should return locations with vote counts and suggesters", async () => {
    mockLocationsResult = [
      {
        id: 1,
        latitude: 49.1951,
        longitude: 16.6068,
        address: "Brno, CZ",
        imageUrl: null,
        status: "pending",
        createdAt: "2025-01-01T00:00:00.000Z",
        voteCount: 3,
      },
      {
        id: 2,
        latitude: 50.0755,
        longitude: 14.4378,
        address: "Praha, CZ",
        imageUrl: "https://example.com/photo.jpg",
        status: "approved",
        createdAt: "2025-01-02T00:00:00.000Z",
        voteCount: 1,
      },
    ];
    mockSuggestionCountsResult = [
      { latRounded: 491951, lngRounded: 166068, suggesters: 2 },
      { latRounded: 500755, lngRounded: 144378, suggesters: 1 },
    ];

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.total).toBe(2);
    expect(data.locations).toHaveLength(2);

    expect(data.locations[0].id).toBe(1);
    expect(data.locations[0].address).toBe("Brno, CZ");
    expect(data.locations[0].voteCount).toBe(3);
    expect(data.locations[0].suggesters).toBe(2);

    expect(data.locations[1].id).toBe(2);
    expect(data.locations[1].imageUrl).toBe("https://example.com/photo.jpg");
    expect(data.locations[1].status).toBe("approved");
    expect(data.locations[1].suggesters).toBe(1);
  });

  it("should not expose personal data (emails, names, notes, userId)", async () => {
    mockLocationsResult = [
      {
        id: 1,
        latitude: 49.19,
        longitude: 16.60,
        address: "Test Location",
        imageUrl: null,
        status: "pending",
        createdAt: "2025-01-01T00:00:00.000Z",
        voteCount: 0,
      },
    ];
    mockSuggestionCountsResult = [];

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    const loc = data.locations[0];

    // Verify structure — only public fields
    expect(loc).toHaveProperty("id");
    expect(loc).toHaveProperty("latitude");
    expect(loc).toHaveProperty("longitude");
    expect(loc).toHaveProperty("address");
    expect(loc).toHaveProperty("imageUrl");
    expect(loc).toHaveProperty("status");
    expect(loc).toHaveProperty("createdAt");
    expect(loc).toHaveProperty("voteCount");
    expect(loc).toHaveProperty("suggesters");

    // Ensure no personal fields leak
    expect(loc).not.toHaveProperty("email");
    expect(loc).not.toHaveProperty("name");
    expect(loc).not.toHaveProperty("userId");
    expect(loc).not.toHaveProperty("note");
  });

  it("should default suggesters to 1 when no match in suggestionCounts", async () => {
    mockLocationsResult = [
      {
        id: 5,
        latitude: 48.5,
        longitude: 15.0,
        address: "Unknown",
        imageUrl: null,
        status: "pending",
        createdAt: "2025-06-01T00:00:00.000Z",
        voteCount: 0,
      },
    ];
    // No matching rounded coords
    mockSuggestionCountsResult = [
      { latRounded: 999999, lngRounded: 999999, suggesters: 10 },
    ];

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.locations[0].suggesters).toBe(1);
  });

  it("should return 500 when DATABASE_URL is not set", async () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Server configuration error");

    process.env.DATABASE_URL = originalUrl;
  });
});
