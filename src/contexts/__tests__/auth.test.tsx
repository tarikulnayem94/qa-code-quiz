import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, AuthContext } from "../auth";

// Mock the account data
jest.mock("../../../storage/account.json", () => ({
  testuser: {
    name: "Test User",
    password: "testpass",
    favouriteFruit: "Apple",
    favouriteMovie: "Test Movie",
    favouriteNumber: "42",
  },
  invaliduser: {
    name: "Invalid User",
    password: "wrongpass",
    favouriteFruit: "Orange",
    favouriteMovie: "Bad Movie",
    favouriteNumber: "13",
  },
}));

// Test component to consume the context
const TestComponent = () => {
  const { user, login, logout } = React.useContext(AuthContext);

  const handleInvalidLogin = () => {
    login("testuser", "wrongpass").catch(() => {
      // Handle promise rejection silently
    });
  };

  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.name}` : "Not logged in"}
      </div>
      <button
        data-testid="login-btn"
        onClick={() => login("testuser", "testpass")}
      >
        Login
      </button>
      <button data-testid="login-invalid-btn" onClick={handleInvalidLogin}>
        Login Invalid
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      {user && (
        <div data-testid="user-details">
          <div data-testid="user-name">{user.name}</div>
          <div data-testid="user-fruit">{user.favouriteFruit}</div>
          <div data-testid="user-movie">{user.favouriteMovie}</div>
          <div data-testid="user-number">{user.favouriteNumber}</div>
        </div>
      )}
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    // Clear console warnings for cleaner test output
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should provide initial state with no user logged in", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Not logged in"
    );
    expect(screen.queryByTestId("user-details")).not.toBeInTheDocument();
  });

  it("should successfully log in with valid credentials", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId("login-btn"));
    });

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Logged in as Test User"
    );
    expect(screen.getByTestId("user-details")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
    expect(screen.getByTestId("user-fruit")).toHaveTextContent("Apple");
    expect(screen.getByTestId("user-movie")).toHaveTextContent("Test Movie");
    expect(screen.getByTestId("user-number")).toHaveTextContent("42");
  });

  it("should reject login with invalid credentials", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Mock console.error to verify the rejection
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      await user.click(screen.getByTestId("login-invalid-btn"));
      // Allow time for promise rejection to propagate
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Not logged in"
    );
    expect(screen.queryByTestId("user-details")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should successfully log out", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First log in
    await act(async () => {
      await user.click(screen.getByTestId("login-btn"));
    });

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Logged in as Test User"
    );

    // Then log out
    await act(async () => {
      await user.click(screen.getByTestId("logout-btn"));
    });

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Not logged in"
    );
    expect(screen.queryByTestId("user-details")).not.toBeInTheDocument();
  });

  it("should maintain user state across re-renders", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId("login-btn"));
    });

    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Logged in as Test User"
    );

    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Note: This will actually create a new provider instance, so the user will be reset
    // In a real app, the provider would persist across re-renders
    // For now, we'll test that the user state persists with the same provider instance
    expect(screen.getByTestId("user-status")).toHaveTextContent(
      "Logged in as Test User"
    );
  });
});
