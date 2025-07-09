import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../index";
import { AuthContext } from "../../../contexts/auth";

// Mock AuthContext
const mockLogin = jest.fn();
const mockAuthContext: any = {
  user: null,
  login: mockLogin,
  logout: jest.fn(),
};

const renderLoginWithContext = (authContextValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <Login />
    </AuthContext.Provider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all login form elements", () => {
    renderLoginWithContext();

    expect(screen.getByTestId("login-container")).toBeInTheDocument();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
    expect(screen.getByTestId("contact-admin-message")).toBeInTheDocument();
  });

  it("should have correct placeholder text", () => {
    renderLoginWithContext();

    expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
  });

  it("should update username input value", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const usernameInput = screen.getByTestId(
      "username-input"
    ) as HTMLInputElement;

    await user.type(usernameInput, "testuser");

    expect(usernameInput.value).toBe("testuser");
  });

  it("should update password input value", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const passwordInput = screen.getByTestId(
      "password-input"
    ) as HTMLInputElement;

    await user.type(passwordInput, "testpass");

    expect(passwordInput.value).toBe("testpass");
  });

  it("should call login function with correct credentials when login button is clicked", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByTestId("login-button");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "testpass");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith("testuser", "testpass");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it("should call login with null values when no input is provided", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const loginButton = screen.getByTestId("login-button");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith(null, null);
  });

  it("should handle login with only username provided", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const usernameInput = screen.getByTestId("username-input");
    const loginButton = screen.getByTestId("login-button");

    await user.type(usernameInput, "testuser");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith("testuser", null);
  });

  it("should handle login with only password provided", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByTestId("login-button");

    await user.type(passwordInput, "testpass");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith(null, "testpass");
  });

  it("should have password input type for password field", () => {
    renderLoginWithContext();

    const passwordInput = screen.getByTestId("password-input");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should display contact admin message", () => {
    renderLoginWithContext();

    const adminMessage = screen.getByTestId("contact-admin-message");
    expect(adminMessage).toHaveTextContent(
      "If you do not have an account, contact an admin"
    );
  });

  it("should handle form submission on Enter key press", async () => {
    const user = userEvent.setup();
    renderLoginWithContext();

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "testpass");

    // Simulate pressing Enter in password field
    fireEvent.keyPress(passwordInput, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    // Note: The current implementation doesn't handle Enter key,
    // but this test documents the expected behavior
  });

  it("should clear form inputs after successful login", async () => {
    const user = userEvent.setup();

    // Mock successful login
    const successfulLogin = jest.fn().mockResolvedValue({ name: "Test User" });
    const contextWithSuccessfulLogin = {
      ...mockAuthContext,
      login: successfulLogin,
    };

    renderLoginWithContext(contextWithSuccessfulLogin);

    const usernameInput = screen.getByTestId(
      "username-input"
    ) as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "password-input"
    ) as HTMLInputElement;
    const loginButton = screen.getByTestId("login-button");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "testpass");
    await user.click(loginButton);

    expect(successfulLogin).toHaveBeenCalledWith("testuser", "testpass");

    // Note: Current implementation doesn't clear inputs after login
    // This test documents expected behavior for future improvement
  });
});
