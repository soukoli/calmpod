import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the neon serverless module
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockSet = vi.fn();
const mockValues = vi.fn();
const mockReturning = vi.fn();

const mockDb = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
};

vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => mockDb),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: vi.fn().mockResolvedValue({}) };
    contacts = { create: vi.fn().mockResolvedValue({}) };
  },
}));

// Set env vars before importing the route
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.RESEND_API_KEY = "re_test_key";
process.env.CONTACT_EMAIL = "test@calmpod.cz";

// Import the route handler
import { POST } from "@/app/api/location/route";

describe("POST /api/location", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock chain for select (user lookup)
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([]);

    // Default mock chain for insert (new user)
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({ returning: mockReturning });
    mockReturning.mockResolvedValue([{ id: 1 }]);

    // Default mock chain for update
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  });

  it("should return 400 if email is missing", async () => {
    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: 49.19, longitude: 16.60 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and location coordinates are required");
  });

  it("should return 400 if latitude is missing", async () => {
    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", longitude: 16.60 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and location coordinates are required");
  });

  it("should return 400 if longitude is missing", async () => {
    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", latitude: 49.19 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and location coordinates are required");
  });

  it("should return 400 for invalid email format", async () => {
    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        latitude: 49.19,
        longitude: 16.60,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid email format");
  });

  it("should create a new user and insert location for new email", async () => {
    // Mock: no existing user found
    mockLimit.mockResolvedValue([]);
    // Mock: user created with id 42
    mockReturning.mockResolvedValue([{ id: 42 }]);
    // Mock: location insert succeeds (re-mock insert for second call)
    let insertCallCount = 0;
    mockInsert.mockImplementation(() => {
      insertCallCount++;
      if (insertCallCount === 1) {
        // First insert = user
        return { values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 42 }]) }) };
      }
      // Second insert = location
      return { values: vi.fn().mockResolvedValue(undefined) };
    });

    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "new@example.com",
        latitude: 49.1951,
        longitude: 16.6068,
        address: "Brno, Czech Republic",
        note: "Nice park nearby",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should use existing user when email already in DB", async () => {
    // Mock: existing user found
    mockLimit.mockResolvedValue([{ id: 7, email: "existing@example.com" }]);

    // Mock: location insert succeeds
    let insertCallCount = 0;
    mockInsert.mockImplementation(() => {
      insertCallCount++;
      return { values: vi.fn().mockResolvedValue(undefined) };
    });

    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "existing@example.com",
        latitude: 50.0755,
        longitude: 14.4378,
        address: "Praha",
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    // Should have called update (to update updatedAt)
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should handle duplicate location gracefully", async () => {
    // Mock: existing user
    mockLimit.mockResolvedValue([{ id: 5, email: "dup@example.com" }]);

    // Mock: location insert throws unique constraint error
    let insertCallCount = 0;
    mockInsert.mockImplementation(() => {
      insertCallCount++;
      return {
        values: vi.fn().mockImplementation(() => {
          throw new Error("unique_user_location constraint violation");
        }),
      };
    });

    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "dup@example.com",
        latitude: 49.1951,
        longitude: 16.6068,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.duplicate).toBe(true);
  });

  it("should return 500 when DATABASE_URL is not set", async () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        latitude: 49.19,
        longitude: 16.60,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Server configuration error");

    // Restore
    process.env.DATABASE_URL = originalUrl;
  });

  it("should accept latitude=0 and longitude=0 as valid coordinates", async () => {
    mockLimit.mockResolvedValue([]);
    let insertCallCount = 0;
    mockInsert.mockImplementation(() => {
      insertCallCount++;
      if (insertCallCount === 1) {
        return { values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 1 }]) }) };
      }
      return { values: vi.fn().mockResolvedValue(undefined) };
    });

    const req = new Request("http://localhost/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "zero@example.com",
        latitude: 0,
        longitude: 0,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    // latitude=0 and longitude=0 are valid (null island)
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
