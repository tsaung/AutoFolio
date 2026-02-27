import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileHero } from "./profile-hero";
import { Database } from "@/types/database";

// Mock the Avatar components (no longer using AvatarImage)
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

// Mock next/image to render a simple img
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} />,
}));

// Mock cloudinaryUrl to passthrough (non-Cloudinary URLs are unchanged)
vi.mock("@/lib/cloudinary", () => ({
  cloudinaryUrl: (url: string) => url,
  cloudinaryLoader: ({ src }: any) => src,
}));

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

describe("ProfileHero", () => {
  it("renders default avatar.jpg when profile is null", () => {
    render(<ProfileHero profile={null} />);

    // Should show avatar.jpg instead of Bot icon
    const img = screen.getByRole("img", { name: /default profile/i });
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });

  it("renders default avatar.jpg when profile exists but has no avatar_url", () => {
    const profile = {
      id: "123",
      name: "John Doe",
      avatar_url: null,
      profession: "Developer",
    } as Profile;

    render(<ProfileHero profile={profile} />);

    const img = screen.getByRole("img", { name: /john doe/i });
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });

  it("renders user avatar when profile has avatar_url", () => {
    const profile = {
      id: "123",
      name: "Jane Smith",
      avatar_url: "https://example.com/jane.jpg",
      profession: "Designer",
    } as Profile;

    render(<ProfileHero profile={profile} />);

    const img = screen.getByRole("img", { name: /jane smith/i });
    expect(img).toHaveAttribute("src", "https://example.com/jane.jpg");
  });
});
