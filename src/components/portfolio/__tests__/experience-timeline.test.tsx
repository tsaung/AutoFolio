import { render, screen } from "@testing-library/react";
import { ExperienceTimeline } from "../experience-timeline";
import { Database } from "@/types/database";
import { describe, it, expect } from "vitest";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];

const mockExperiences: Experience[] = [
  {
    id: "1",
    user_id: "user1",
    company: "Tech Corp",
    title: "Senior Developer",
    location: "Remote",
    start_date: "2022-01-01",
    end_date: null, // Present
    description: "Built amazing things.",
    sort_order: 1,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
  {
    id: "2",
    user_id: "user1",
    company: "Startup Inc",
    title: "Junior Developer",
    location: "New York",
    start_date: "2020-01-01",
    end_date: "2021-12-31",
    description: "Learned a lot.",
    sort_order: 2,
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
  },
];

describe("ExperienceTimeline", () => {
  it("renders experiences correctly", () => {
    render(<ExperienceTimeline experiences={mockExperiences} />);

    expect(screen.getByText("@Tech Corp")).toBeDefined();
    expect(screen.getByText("Senior Developer")).toBeDefined();
    expect(screen.getByText(/Present/)).toBeDefined();
    expect(screen.getByText("Built amazing things.")).toBeDefined();

    expect(screen.getByText("@Startup Inc")).toBeDefined();
    expect(screen.getByText("Junior Developer")).toBeDefined();
    expect(screen.getByText(/2020/)).toBeDefined();
    expect(screen.getByText(/2021/)).toBeDefined();
  });

  it("renders empty state when no experiences provided", () => {
    render(<ExperienceTimeline experiences={[]} />);
    expect(screen.queryByText("Tech Corp")).toBeNull();
  });
});
