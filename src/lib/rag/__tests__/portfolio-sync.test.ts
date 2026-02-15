import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatProjects,
  formatExperiences,
  formatSkills,
  syncProjectsToKnowledge,
  syncExperiencesToKnowledge,
  syncSkillsToKnowledge,
} from "../portfolio-sync";
import { adminClient } from "@/lib/db/admin";
import { processDocument } from "../pipeline";

// Mock dependencies
vi.mock("@/lib/db/admin", () => ({
  adminClient: {
    from: vi.fn(() => ({
      select: vi.fn(),
      upsert: vi.fn(),
      eq: vi.fn(),
    })),
  },
}));

vi.mock("../pipeline", () => ({
  processDocument: vi.fn(),
}));

describe("Portfolio Sync", () => {
  const userId = "test-user-id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Formatting", () => {
    it("formats projects correctly", () => {
      const projects = [
        {
          id: "1",
          title: "Project A",
          description: "Description A",
          tags: ["React", "Node"],
          live_url: "https://example.com",
          repo_url: "https://github.com/example",
          // database types
          user_id: userId,
          image_url: null,
          sort_order: 0,
          status: "published",
          created_at: null,
          updated_at: null,
        },
      ];

      const markdown = formatProjects(projects);
      expect(markdown).toContain("# Project A");
      expect(markdown).toContain("Description A");
      expect(markdown).toContain("- **Tech Stack**: React, Node");
      expect(markdown).toContain("[Live Demo](https://example.com)");
    });

    it("formats experiences correctly", () => {
      const experiences = [
        {
          id: "1",
          title: "Senior Dev",
          company: "Tech Corp",
          start_date: "2020-01-01",
          end_date: "2022-01-01",
          description: "Led team",
          location: "Remote",
          // database types
          user_id: userId,
          sort_order: 0,
          created_at: null,
          updated_at: null,
        },
      ];

      const markdown = formatExperiences(experiences);
      expect(markdown).toContain("## Senior Dev at Tech Corp");
      expect(markdown).toContain("2020-01-01 - 2022-01-01");
      expect(markdown).toContain("Led team");
    });

    it("formats skills correctly", () => {
      const skills = [
        {
          id: "1",
          name: "React",
          category: "Frontend",
          proficiency: 5,
          // database types
          user_id: userId,
          sort_order: 0,
          created_at: null,
          updated_at: null,
        },
        {
          id: "2",
          name: "Node.js",
          category: "Backend",
          proficiency: 4,
          user_id: userId,
          sort_order: 1,
          created_at: null,
          updated_at: null,
        },
      ];

      const markdown = formatSkills(skills);
      expect(markdown).toContain("## Frontend");
      expect(markdown).toContain("- React (5/5)");
      expect(markdown).toContain("## Backend");
      expect(markdown).toContain("- Node.js (4/5)");
    });
  });
});
