import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// --- Mocks ---

// Mock the Supabase admin client
const mockSingle = vi.fn();
const mockEqType = vi.fn(() => ({ single: mockSingle }));
const mockEqId = vi.fn();
const mockSelect = vi.fn(() => ({ eq: mockEqType }));
const mockUpdate = vi.fn(() => ({ eq: mockEqId }));
const mockInsert = vi.fn();
const mockListUsers = vi.fn();

const mockAdminClient = {
  from: vi.fn(() => ({
    select: mockSelect,
    update: mockUpdate,
    insert: mockInsert,
  })),
  auth: {
    admin: {
      listUsers: mockListUsers,
    },
  },
};

vi.mock("@/lib/db/admin", () => ({
  adminClient: mockAdminClient,
}));

// Mock global fetch (for Sanity /users/me verification)
const originalFetch = global.fetch;

describe("/api/admin/bot-config", () => {
  const validToken = "sanity-test-token-abc123";
  const mockSanityUser = {
    id: "user-1",
    name: "Test User",
    role: "administrator",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Helper to create a mock Request with optional auth
  function makeRequest(
    method: "GET" | "POST",
    options?: { token?: string; body?: Record<string, unknown> },
  ): NextRequest {
    const headers = new Headers();
    if (options?.token) {
      headers.set("Authorization", `Bearer ${options.token}`);
    }
    const url = "http://localhost:3000/api/admin/bot-config";

    if (method === "POST" && options?.body) {
      return new NextRequest(url, {
        method,
        headers,
        body: JSON.stringify(options.body),
      });
    }

    return new NextRequest(url, { method, headers });
  }

  // Helper to mock the Sanity /users/me fetch
  function mockSanityAuth(success: boolean) {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("api.sanity.io") && url.includes("/users/me")) {
        if (success) {
          return new Response(JSON.stringify(mockSanityUser), { status: 200 });
        }
        return new Response("Unauthorized", { status: 401 });
      }
      return originalFetch(input as any);
    }) as typeof global.fetch;
  }

  describe("GET", () => {
    let GET: (req: NextRequest) => Promise<Response>;

    beforeEach(async () => {
      const mod = await import("@/app/api/admin/bot-config/route");
      GET = mod.GET;
    });

    test("returns 401 when no Authorization header is present", async () => {
      const req = makeRequest("GET");
      const res = await GET(req);
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("returns 401 when Sanity token is invalid", async () => {
      mockSanityAuth(false);

      const req = makeRequest("GET", { token: "invalid-token" });
      const res = await GET(req);
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    test("returns config when token is valid and config exists", async () => {
      mockSanityAuth(true);

      const mockConfig = {
        id: "cfg-1",
        type: "public_agent",
        model: "google/gemini-2.0-flash-001",
        provider: "openrouter",
        system_prompt: "You are a helpful assistant.",
        predefined_prompts: [{ text: "Hello", label: "Hello" }],
      };
      mockSingle.mockResolvedValueOnce({ data: mockConfig, error: null });

      const req = makeRequest("GET", { token: validToken });
      const res = await GET(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.data).toEqual(mockConfig);
      expect(mockAdminClient.from).toHaveBeenCalledWith("bot_configs");
      expect(mockEqType).toHaveBeenCalledWith("type", "public_agent");
    });

    test("returns null data when no config exists", async () => {
      mockSanityAuth(true);
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });

      const req = makeRequest("GET", { token: validToken });
      const res = await GET(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.data).toBeNull();
    });
  });

  describe("POST", () => {
    let POST: (req: NextRequest) => Promise<Response>;

    beforeEach(async () => {
      const mod = await import("@/app/api/admin/bot-config/route");
      POST = mod.POST;
    });

    test("returns 401 when no Authorization header is present", async () => {
      const req = makeRequest("POST", {
        body: { model: "new-model" },
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    test("updates existing config when token is valid", async () => {
      mockSanityAuth(true);

      // GET check for existing config
      const existingConfig = { id: "cfg-1", type: "public_agent" };
      mockSingle.mockResolvedValueOnce({ data: existingConfig, error: null });
      mockEqId.mockResolvedValueOnce({ error: null });

      const updateData = {
        model: "new-model",
        system_prompt: "Updated prompt",
      };
      const req = makeRequest("POST", { token: validToken, body: updateData });
      const res = await POST(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "new-model",
          system_prompt: "Updated prompt",
          updated_at: expect.any(String),
        }),
      );
      expect(mockEqId).toHaveBeenCalledWith("id", "cfg-1");
    });

    test("inserts new config when none exists and token is valid", async () => {
      mockSanityAuth(true);

      // GET check returns no existing config
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });
      // listUsers returns a user for the FK
      mockListUsers.mockResolvedValueOnce({
        data: { users: [{ id: "auth-user-1" }] },
        error: null,
      });
      mockInsert.mockResolvedValueOnce({ error: null });

      const insertData = {
        model: "google/gemini-2.0-flash-001",
        system_prompt: "New prompt",
        predefined_prompts: [{ text: "Hi", label: "Hi" }],
      };
      const req = makeRequest("POST", { token: validToken, body: insertData });
      const res = await POST(req);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "public_agent",
          model: "google/gemini-2.0-flash-001",
          system_prompt: "New prompt",
          user_id: "auth-user-1",
        }),
      );
    });
  });
});
