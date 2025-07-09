import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../index";
import { AuthContext } from "../../../contexts/auth";

// Mock child components
jest.mock("../../header", () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Component</div>;
  };
});

jest.mock("../../login", () => {
  return function MockLogin() {
    return <div data-testid="mock-login">Login Component</div>;
  };
});

jest.mock("../../account", () => {
  return function MockAccount() {
    return <div data-testid="mock-account">Account Component</div>;
  };
});

// Mock the background image
jest.mock("../../../assets/bg1.jpg", () => "mocked-background-image");

const mockAuthContextWithoutUser: any = {
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

const renderAppWithContext = (
  authContextValue = mockAuthContextWithoutUser
) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <App />
    </AuthContext.Provider>
  );
};

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login view when no user is logged in", () => {
    renderAppWithContext();

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-account")).not.toBeInTheDocument();
  });

  it("should render account view when user is logged in", () => {
    renderAppWithContext(mockAuthContextWithUser);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  it("should always render header component", () => {
    // Test without user
    const { rerender } = renderAppWithContext();
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();

    // Test with user
    rerender(
      <AuthContext.Provider value={mockAuthContextWithUser}>
        <App />
      </AuthContext.Provider>
    );
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("should switch from login to account view when user logs in", () => {
    const { rerender } = renderAppWithContext();

    // Initially should show login
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-account")).not.toBeInTheDocument();

    // After login should show account
    rerender(
      <AuthContext.Provider value={mockAuthContextWithUser}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  it("should switch from account to login view when user logs out", () => {
    const { rerender } = renderAppWithContext(mockAuthContextWithUser);

    // Initially should show account
    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();

    // After logout should show login
    rerender(
      <AuthContext.Provider value={mockAuthContextWithoutUser}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-account")).not.toBeInTheDocument();
  });

  it("should handle different user objects", () => {
    const differentUser = {
      name: "Different User",
      favouriteFruit: "Banana",
      favouriteMovie: "Different Movie",
      favouriteNumber: "99",
    };

    const contextWithDifferentUser = {
      ...mockAuthContextWithUser,
      user: differentUser,
    };

    renderAppWithContext(contextWithDifferentUser);

    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  it("should handle user object with minimal data", () => {
    const minimalUser = {
      name: "Minimal User",
    };

    const contextWithMinimalUser = {
      ...mockAuthContextWithUser,
      user: minimalUser,
    };

    renderAppWithContext(contextWithMinimalUser);

    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  it("should handle empty user object as truthy", () => {
    const emptyUser = {};

    const contextWithEmptyUser = {
      ...mockAuthContextWithUser,
      user: emptyUser,
    };

    renderAppWithContext(contextWithEmptyUser);

    expect(screen.getByTestId("mock-account")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  it("should treat undefined user as falsy", () => {
    const contextWithUndefinedUser = {
      ...mockAuthContextWithUser,
      user: undefined,
    };

    renderAppWithContext(contextWithUndefinedUser);

    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-account")).not.toBeInTheDocument();
  });

  it("should render with proper component structure", () => {
    const { container } = renderAppWithContext();

    // Check that components are rendered within the main container
    const styledDiv = container.firstChild;
    expect(styledDiv).toBeInTheDocument();

    // Verify header and login are children of the main container
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
  });
});
