import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Account from "../index";
import { AuthContext } from "../../../contexts/auth";

const mockLogout = jest.fn();

const mockUser = {
  name: "Test User",
  favouriteFruit: "Apple",
  favouriteMovie: "Test Movie",
  favouriteNumber: "42",
};

const mockAuthContext: any = {
  user: mockUser,
  login: jest.fn(),
  logout: mockLogout,
};

const renderAccountWithContext = (authContextValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <Account />
    </AuthContext.Provider>
  );
};

describe("Account Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render account container", () => {
    renderAccountWithContext();

    expect(screen.getByTestId("account-container")).toBeInTheDocument();
  });

  it("should display user name correctly", () => {
    renderAccountWithContext();

    expect(screen.getByTestId("name-row")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
  });

  it("should display user favorite fruit correctly", () => {
    renderAccountWithContext();

    expect(screen.getByTestId("fruit-row")).toBeInTheDocument();
    expect(screen.getByTestId("user-fruit")).toHaveTextContent("Apple");
  });

  it("should display user favorite movie correctly", () => {
    renderAccountWithContext();

    expect(screen.getByTestId("movie-row")).toBeInTheDocument();
    expect(screen.getByTestId("user-movie")).toHaveTextContent("Test Movie");
  });

  it("should display user favorite number correctly", () => {
    renderAccountWithContext();

    expect(screen.getByTestId("number-row")).toBeInTheDocument();
    expect(screen.getByTestId("user-number")).toHaveTextContent("42");
  });

  it("should render logout button", () => {
    renderAccountWithContext();

    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent("LOGOUT");
  });

  it("should call logout function when logout button is clicked", async () => {
    const user = userEvent.setup();
    renderAccountWithContext();

    const logoutButton = screen.getByTestId("logout-button");
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should display all row labels correctly", () => {
    renderAccountWithContext();

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Favourite Fruit")).toBeInTheDocument();
    expect(screen.getByText("Favourite Movie")).toBeInTheDocument();
    expect(screen.getByText("Favourite Number")).toBeInTheDocument();
  });

  it("should handle user with different data", () => {
    const differentUser = {
      name: "Different User",
      favouriteFruit: "Banana",
      favouriteMovie: "Different Movie",
      favouriteNumber: "99",
    };

    const contextWithDifferentUser = {
      ...mockAuthContext,
      user: differentUser,
    };

    renderAccountWithContext(contextWithDifferentUser);

    expect(screen.getByTestId("user-name")).toHaveTextContent("Different User");
    expect(screen.getByTestId("user-fruit")).toHaveTextContent("Banana");
    expect(screen.getByTestId("user-movie")).toHaveTextContent(
      "Different Movie"
    );
    expect(screen.getByTestId("user-number")).toHaveTextContent("99");
  });

  it("should handle user with empty string values", () => {
    const userWithEmptyValues = {
      name: "",
      favouriteFruit: "",
      favouriteMovie: "",
      favouriteNumber: "",
    };

    const contextWithEmptyUser = {
      ...mockAuthContext,
      user: userWithEmptyValues,
    };

    renderAccountWithContext(contextWithEmptyUser);

    expect(screen.getByTestId("user-name")).toHaveTextContent("");
    expect(screen.getByTestId("user-fruit")).toHaveTextContent("");
    expect(screen.getByTestId("user-movie")).toHaveTextContent("");
    expect(screen.getByTestId("user-number")).toHaveTextContent("");
  });

  it("should handle user with special characters", () => {
    const userWithSpecialChars = {
      name: "User & Co.",
      favouriteFruit: "Apple <3",
      favouriteMovie: 'Movie "The Best"',
      favouriteNumber: "BN<1234>",
    };

    const contextWithSpecialUser = {
      ...mockAuthContext,
      user: userWithSpecialChars,
    };

    renderAccountWithContext(contextWithSpecialUser);

    expect(screen.getByTestId("user-name")).toHaveTextContent("User & Co.");
    expect(screen.getByTestId("user-fruit")).toHaveTextContent("Apple <3");
    expect(screen.getByTestId("user-movie")).toHaveTextContent(
      'Movie "The Best"'
    );
    expect(screen.getByTestId("user-number")).toHaveTextContent("BN<1234>");
  });

  it("should maintain proper structure with data test ids", () => {
    renderAccountWithContext();

    // Verify all required test ids are present
    expect(screen.getByTestId("account-container")).toBeInTheDocument();
    expect(screen.getByTestId("name-row")).toBeInTheDocument();
    expect(screen.getByTestId("fruit-row")).toBeInTheDocument();
    expect(screen.getByTestId("movie-row")).toBeInTheDocument();
    expect(screen.getByTestId("number-row")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toBeInTheDocument();
    expect(screen.getByTestId("user-fruit")).toBeInTheDocument();
    expect(screen.getByTestId("user-movie")).toBeInTheDocument();
    expect(screen.getByTestId("user-number")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });
});
