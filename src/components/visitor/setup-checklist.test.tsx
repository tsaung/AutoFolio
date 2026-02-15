import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SetupChecklist } from "./setup-checklist";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

describe("SetupChecklist", () => {
  it("renders 0% progress when no user exists", () => {
    render(<SetupChecklist profile={null} hasAnyUser={false} />);

    expect(screen.getByText("0% Complete")).toBeDefined();
    expect(screen.getByText("Create Owner Account")).toBeDefined();
    // Check for the link to login
    const loginLink = screen.getByRole("link", { name: /create.*user/i });
    expect(loginLink.getAttribute("href")).toBe("/login");
  });

  it("renders 50% progress when user exists but profile is missing/incomplete", () => {
    render(<SetupChecklist profile={null} hasAnyUser={true} />);

    expect(screen.getByText("50% Complete")).toBeDefined();

    // Step 1 should be indicated as complete (visual check is hard without implementation details, but we can check Step 2 is active)
    expect(screen.getAllByText("Setup Profile").length).toBeGreaterThan(0);
    const settingsLink = screen.getByRole("link", { name: /setup.*profile/i });
    expect(settingsLink.getAttribute("href")).toBe("/settings/profile");
  });

  it("renders 100% progress when profile is complete", () => {
    const profile = {
      id: "123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: "Test User",
    } as unknown as Profile;

    render(<SetupChecklist profile={profile} hasAnyUser={true} />);

    expect(screen.getByText("100% Complete")).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull(); // No CTA links should be present if complete
  });
});
