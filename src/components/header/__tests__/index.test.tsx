import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../index";
import { AuthContext } from "../../../contexts/auth";

const mockAuthContext: any = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
};

const mockAuthContextWithUser: any = {
  user: {
    name: "Test User",
    favouriteFruit: "Apple",
    favouriteMovie: "Test Movie",
    favouriteNumber: "42",
  },
  login: jest.fn(),
  logout: jest.fn(),
};

const renderHeaderWithContext = (authContextValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <Header />
    </AuthContext.Provider>
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render header container", () => {
    renderHeaderWithContext();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("header-content")).toBeInTheDocument();
  });

  it("should display site name when no user is logged in", () => {
    renderHeaderWithContext();

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("qa.code-quiz.dev");
  });

  it("should display greeting with user name when user is logged in", () => {
    renderHeaderWithContext(mockAuthContextWithUser);

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("Hello Test User");
  });

  it("should not display site name when user is logged in", () => {
    renderHeaderWithContext(mockAuthContextWithUser);

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).not.toHaveTextContent("qa.code-quiz.dev");
  });

  it("should handle user with different name", () => {
    const contextWithDifferentUser = {
      ...mockAuthContextWithUser,
      user: {
        ...mockAuthContextWithUser.user,
        name: "Different User",
      },
    };

    renderHeaderWithContext(contextWithDifferentUser);

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("Hello Different User");
  });

  it("should handle user with empty name", () => {
    const contextWithEmptyName = {
      ...mockAuthContextWithUser,
      user: {
        ...mockAuthContextWithUser.user,
        name: "",
      },
    };

    renderHeaderWithContext(contextWithEmptyName);

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("Hello");
  });

  it("should handle user with special characters in name", () => {
    const contextWithSpecialName = {
      ...mockAuthContextWithUser,
      user: {
        ...mockAuthContextWithUser.user,
        name: "User & Co. <Test>",
      },
    };

    renderHeaderWithContext(contextWithSpecialName);

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("Hello User & Co. <Test>");
  });

  it("should update when user state changes from null to user", () => {
    const { rerender } = renderHeaderWithContext();

    // Initially no user
    expect(screen.getByTestId("header-content")).toHaveTextContent(
      "qa.code-quiz.dev"
    );

    // Rerender with user
    rerender(
      <AuthContext.Provider value={mockAuthContextWithUser}>
        <Header />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("header-content")).toHaveTextContent(
      "Hello Test User"
    );
  });

  it("should update when user state changes from user to null", () => {
    const { rerender } = renderHeaderWithContext(mockAuthContextWithUser);

    // Initially with user
    expect(screen.getByTestId("header-content")).toHaveTextContent(
      "Hello Test User"
    );

    // Rerender without user
    rerender(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("header-content")).toHaveTextContent(
      "qa.code-quiz.dev"
    );
  });

  it("should have correct site name constant", () => {
    renderHeaderWithContext();

    const headerContent = screen.getByTestId("header-content");
    expect(headerContent).toHaveTextContent("qa.code-quiz.dev");

    // Verify the exact site name format
    expect(headerContent.textContent).toBe("qa.code-quiz.dev");
  });

  it("should maintain header structure", () => {
    renderHeaderWithContext();

    const header = screen.getByTestId("header");
    const headerContent = screen.getByTestId("header-content");

    expect(header).toContainElement(headerContent);
  });
});
