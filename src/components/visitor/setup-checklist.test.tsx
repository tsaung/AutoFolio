import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SetupChecklist } from "./setup-checklist";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

describe("SetupChecklist", () => {
  it("renders 0% progress and prompts for account creation when no profile is provided", () => {
    render(<SetupChecklist profile={null} />);

    expect(screen.getByText("0% Complete")).toBeDefined();
    expect(screen.getByText("Create User Account")).toBeDefined();
    // Check for the link to login
    const loginLink = screen.getByRole("link", { name: /sign.*up/i });
    expect(loginLink.getAttribute("href")).toBe("/login");
  });

  it("renders 50% progress and prompts for profile setup when profile exists but has no name", () => {
    const profile = {
      id: "123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: "", // Empty name
    } as unknown as Profile;

    render(<SetupChecklist profile={profile} />);

    // Step 1 should be complete
    expect(screen.getByText("50% Complete")).toBeDefined();

    // Step 2 is active, so we expect "Setup Profile" as title and as button CTA (or part of it)
    expect(screen.getAllByText("Setup Profile").length).toBeGreaterThan(0);
    const settingsLink = screen.getByRole("link", { name: /setup.*profile/i });
    expect(settingsLink.getAttribute("href")).toBe("/settings/profile");
  });

  it("renders 100% progress when profile has a name", () => {
    const profile = {
      id: "123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: "Test User",
    } as unknown as Profile;

    render(<SetupChecklist profile={profile} />);

    expect(screen.getByText("100% Complete")).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull(); // No CTA links should be present if complete
  });
});
