import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getPublicProjects,
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getPublicSkills,
} from "../sanity-portfolio";
import {
  PROJECTS_QUERY,
  PROJECT_BY_ID_QUERY,
  PUBLIC_PROJECTS_QUERY,
  SKILLS_QUERY,
  SKILL_BY_ID_QUERY,
} from "@/sanity/lib/queries";

// --- Mocks ---

const {
  mockGetUser,
  mockFetch,
  mockCreate,
  mockPatch,
  mockSet,
  mockCommit,
  mockDelete,
  mockTransaction,
} = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockFetch: vi.fn(),
    mockCreate: vi.fn(),
    mockPatch: vi.fn(),
    mockSet: vi.fn(),
    mockCommit: vi.fn(),
    mockDelete: vi.fn(),
    mockTransaction: vi.fn(),
  };
});

// Mock Supabase Server Client
vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

// Mock Sanity Clients
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: mockFetch,
    withConfig: vi.fn(() => ({ fetch: mockFetch })),
  },
}));

vi.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    create: mockCreate,
    patch: mockPatch,
    delete: mockDelete,
    transaction: mockTransaction,
  },
}));

// Mock Next.js Cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Sanity Portfolio Server Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const patchChain = {
      set: mockSet,
      commit: mockCommit,
    };
    mockPatch.mockReturnValue(patchChain);
    mockSet.mockReturnValue(patchChain);
    mockCommit.mockResolvedValue({ _id: "patched" });

    const txChain = {
      patch: vi.fn(),
      commit: vi.fn(),
    };
    mockTransaction.mockReturnValue(txChain);
  });

  // ==========================================
  // PROJECTS
  // ==========================================
  describe("Projects", () => {
    it("getProjects should return projects for authenticated user", async () => {
      const mockData = [{ _id: "1", title: "Project 1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFetch.mockResolvedValue(mockData);

      const result = await getProjects();

      expect(mockFetch).toHaveBeenCalledWith(PROJECTS_QUERY, {}, { cache: "no-store" });
      expect(result).toEqual(mockData);
    });

    it("getProject should return a single project for authenticated user", async () => {
      const mockData = { _id: "1", title: "Project 1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFetch.mockResolvedValue(mockData);

      const result = await getProject("1");

      expect(mockFetch).toHaveBeenCalledWith(PROJECT_BY_ID_QUERY, { id: "1" }, { cache: "no-store" });
      expect(result).toEqual(mockData);
    });

    it("createProject should create a project with createdBy and updatedBy", async () => {
      const input = { title: "New Project", description: "Desc", status: "published" as const, sortOrder: 0 };
      const created = { ...input, _id: "new-id", _type: "project" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockCreate.mockResolvedValue(created);

      const result = await createProject(input);

      expect(mockCreate).toHaveBeenCalledWith({
        _type: "project",
        ...input,
        createdBy: "user-1",
        updatedBy: "user-1",
      });
      expect(result).toEqual(created);
    });

    it("getPublicProjects should fetch without auth", async () => {
      const mockData = [{ _id: "1", title: "Public Project" }];
      mockFetch.mockResolvedValue(mockData);

      const result = await getPublicProjects();

      expect(mockGetUser).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(PUBLIC_PROJECTS_QUERY);
      expect(result).toEqual(mockData);
    });
  });

  // ==========================================
  // SKILLS
  // ==========================================
  describe("Skills", () => {
    it("getSkills should return skills for authenticated user", async () => {
      const mockData = [{ _id: "1", name: "Skill 1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockFetch.mockResolvedValue(mockData);

      const result = await getSkills();

      expect(mockFetch).toHaveBeenCalledWith(SKILLS_QUERY, {}, { cache: "no-store" });
      expect(result).toEqual(mockData);
    });

    it("createSkill should create a skill with createdBy and updatedBy", async () => {
      const input = { name: "New Skill", category: "Cat", proficiency: 5, sortOrder: 0 };
      const created = { ...input, _id: "new-id", _type: "skill" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockCreate.mockResolvedValue(created);

      const result = await createSkill(input);

      expect(mockCreate).toHaveBeenCalledWith({
        _type: "skill",
        ...input,
        createdBy: "user-1",
        updatedBy: "user-1",
      });
      expect(result).toEqual(created);
    });

    it("reorderSkills should run a transaction to update sortOrders", async () => {
      const items = [
        { id: "1", sortOrder: 1 },
        { id: "2", sortOrder: 2 },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      const mockTxCommit = vi.fn();
      const mockTxPatch = vi.fn();
      mockTransaction.mockReturnValue({
        patch: mockTxPatch,
        commit: mockTxCommit,
      });

      await reorderSkills(items);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockTxPatch).toHaveBeenCalledTimes(2);
      expect(mockTxCommit).toHaveBeenCalled();
    });
  });
});
