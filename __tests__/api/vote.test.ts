import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the neon serverless module
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockSet = vi.fn();

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

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

import { POST } from "@/app/api/vote/route";

describe("POST /api/vote", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock chain for select (user lookup)
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([]);

    // Default mock chain for insert
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    });

    // Default mock chain for update
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  });

  it("should return 400 if email is missing", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId: 1 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and locationId are required");
  });

  it("should return 400 if locationId is missing", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Email and locationId are required");
  });

  it("should return 400 for invalid email format", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad-email", locationId: 1 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid email format");
  });

  it("should return 400 for invalid locationId (not a number)", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", locationId: "abc" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid locationId");
  });

  it("should return 400 for invalid locationId (negative)", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", locationId: -1 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid locationId");
  });

  it("should create vote for new user", async () => {
    // No existing user
    mockLimit.mockResolvedValue([]);

    let insertCallCount = 0;
    mockInsert.mockImplementation(() => {
      insertCallCount++;
      if (insertCallCount === 1) {
        // User insert
        return {
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 10 }]),
          }),
        };
      }
      // Vote insert
      return { values: vi.fn().mockResolvedValue(undefined) };
    });

    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "voter@example.com", locationId: 5 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.alreadyVoted).toBe(false);
  });

  it("should create vote for existing user", async () => {
    // Existing user
    mockLimit.mockResolvedValue([{ id: 3, email: "existing@example.com" }]);

    mockInsert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "existing@example.com", locationId: 2 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.alreadyVoted).toBe(false);
    // Should update user's updatedAt
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should handle duplicate vote gracefully", async () => {
    // Existing user
    mockLimit.mockResolvedValue([{ id: 3, email: "dup@example.com" }]);

    // Vote insert throws unique constraint
    mockInsert.mockReturnValue({
      values: vi.fn().mockImplementation(() => {
        throw new Error("unique_user_vote constraint violation");
      }),
    });

    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "dup@example.com", locationId: 2 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.alreadyVoted).toBe(true);
  });

  it("should return 500 when DATABASE_URL is not set", async () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", locationId: 1 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Server configuration error");

    process.env.DATABASE_URL = originalUrl;
  });
});
