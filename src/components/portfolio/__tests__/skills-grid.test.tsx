import { render, screen } from "@testing-library/react";
import { SkillsGrid } from "../skills-grid";
import { Database } from "@/types/database";
import { describe, it, expect } from "vitest";

type Skill = Database["public"]["Tables"]["skills"]["Row"];

const mockSkills: Skill[] = [
  {
    id: "1",
    user_id: "user1",
    name: "React",
    category: "Frontend",
    proficiency: 90,
    sort_order: 1,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "2",
    user_id: "user1",
    name: "Node.js",
    category: "Backend",
    proficiency: 80,
    sort_order: 2,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "3",
    user_id: "user1",
    name: "TypeScript",
    category: "Frontend",
    proficiency: 85,
    sort_order: 3,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
];

describe("SkillsGrid", () => {
  it("renders skills grouped by category", () => {
    render(<SkillsGrid skills={mockSkills} />);

    expect(screen.getByText("Frontend")).toBeDefined();
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("TypeScript")).toBeDefined();

    expect(screen.getByText("Backend")).toBeDefined();
    expect(screen.getByText("Node.js")).toBeDefined();
  });

  it("renders empty state when no skills provided", () => {
    render(<SkillsGrid skills={[]} />);
    expect(screen.queryByText("Frontend")).toBeNull();
  });
});
