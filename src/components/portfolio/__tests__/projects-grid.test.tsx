import { render, screen } from "@testing-library/react";
import { ProjectsGrid } from "../projects-grid";
import { Database } from "@/types/database";
import { describe, it, expect } from "vitest";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const mockProjects: Project[] = [
  {
    id: "1",
    user_id: "user1",
    title: "Project Alpha",
    description: "A cool project",
    image_url: "https://example.com/image.png",
    live_url: "https://example.com",
    repo_url: "https://github.com/example",
    tags: ["React", "TypeScript"],
    sort_order: 1,
    status: "published",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "2",
    user_id: "user1",
    title: "Project Beta",
    description: "Another cool project",
    image_url: null,
    live_url: null,
    repo_url: null,
    tags: ["Next.js"],
    sort_order: 2,
    status: "published",
    created_at: "2023-01-02",
    updated_at: "2023-01-02",
  },
];

describe("ProjectsGrid", () => {
  it("renders projects correctly", () => {
    render(<ProjectsGrid projects={mockProjects} />);

    expect(screen.getByText("Project Alpha")).toBeDefined();
    expect(screen.getByText("A cool project")).toBeDefined();
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("TypeScript")).toBeDefined();

    expect(screen.getByText("Project Beta")).toBeDefined();
    expect(screen.getByText("Next.js")).toBeDefined();
  });

  it("renders empty state when no projects provided", () => {
    render(<ProjectsGrid projects={[]} />);
    expect(screen.queryByText("Project Alpha")).toBeNull();
  });
});
