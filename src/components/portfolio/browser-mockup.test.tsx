import { render, screen } from "@testing-library/react";
import { BrowserMockup } from "./browser-mockup";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion since we don't need to test animations in unit tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div
        className={className}
        data-testid="motion-div"
        {...{ ...props, whileHover: undefined, transition: undefined }}
      >
        {children}
      </div>
    ),
  },
}));

describe("BrowserMockup", () => {
  it("renders children inside the mockup", () => {
    render(
      <BrowserMockup>
        <div data-testid="mock-child">Mock Content</div>
      </BrowserMockup>,
    );
    expect(screen.getByTestId("mock-child")).toBeInTheDocument();
  });

  it("renders the url if provided", () => {
    render(
      <BrowserMockup url="https://example.com">
        <div>Content</div>
      </BrowserMockup>,
    );
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });
});
