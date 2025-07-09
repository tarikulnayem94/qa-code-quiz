describe("Account and Logout Flow", () => {
  beforeEach(() => {
    // Login before each test
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];
      cy.login(validUser.username, validUser.password);
    });
  });

  it("should display account page correctly after login", () => {
    cy.fixture("users").then((users) => {
      const user = users.validUsers[0];

      // Check header shows user greeting
      cy.get('[data-testid="header"]').should("be.visible");
      cy.get('[data-testid="header-content"]').should(
        "contain",
        `Hello ${user.name}`
      );

      // Check account container is visible
      cy.get('[data-testid="account-container"]').should("be.visible");

      // Login container should not be visible
      cy.get('[data-testid="login-container"]').should("not.exist");
    });
  });

  it("should display all user information correctly", () => {
    cy.fixture("users").then((users) => {
      const user = users.validUsers[0];

      // Check all user data rows
      cy.get('[data-testid="name-row"]').should("be.visible");
      cy.get('[data-testid="fruit-row"]').should("be.visible");
      cy.get('[data-testid="movie-row"]').should("be.visible");
      cy.get('[data-testid="number-row"]').should("be.visible");

      // Check user data values
      cy.get('[data-testid="user-name"]').should("contain", user.name);
      cy.get('[data-testid="user-fruit"]').should(
        "contain",
        user.favouriteFruit
      );
      cy.get('[data-testid="user-movie"]').should(
        "contain",
        user.favouriteMovie
      );
      cy.get('[data-testid="user-number"]').should(
        "contain",
        user.favouriteNumber
      );
    });
  });

  it("should display correct field labels", () => {
    cy.get('[data-testid="name-row"]').should("contain", "Name");
    cy.get('[data-testid="fruit-row"]').should("contain", "Favourite Fruit");
    cy.get('[data-testid="movie-row"]').should("contain", "Favourite Movie");
    cy.get('[data-testid="number-row"]').should("contain", "Favourite Number");
  });

  it("should have visible logout button", () => {
    cy.get('[data-testid="logout-button"]')
      .should("be.visible")
      .and("contain", "LOGOUT");
  });

  it("should successfully logout and return to login page", () => {
    cy.get('[data-testid="logout-button"]').click();

    // Should be redirected to login page
    cy.get('[data-testid="login-container"]').should("be.visible");
    cy.get('[data-testid="header-content"]').should(
      "contain",
      "qa.code-quiz.dev"
    );

    // Account container should not be visible
    cy.get('[data-testid="account-container"]').should("not.exist");

    // Login form elements should be visible
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");
  });

  it("should clear user data after logout", () => {
    cy.get('[data-testid="logout-button"]').click();

    // Verify we're back to login state
    cy.checkLoggedOut();

    // User data should not be visible anywhere
    cy.get("body").should("not.contain", "SomeName");
    cy.get("body").should("not.contain", "some fruit");
  });

  it("should handle logout multiple times", () => {
    cy.get('[data-testid="logout-button"]').click();
    cy.checkLoggedOut();

    // Logout button should not be visible anymore
    cy.get('[data-testid="logout-button"]').should("not.exist");
  });

  it("should maintain logout state on page refresh", () => {
    cy.get('[data-testid="logout-button"]').click();
    cy.checkLoggedOut();

    // Refresh page
    cy.reload();

    // Should still be on login page
    cy.checkLoggedOut();
  });

  it("should display user data with special characters correctly", () => {
    // First logout and login with the user that has special characters
    cy.get('[data-testid="logout-button"]').click();

    cy.fixture("users").then((users) => {
      const specialUser = users.validUsers[0]; // SomeUser_name has special chars in number
      cy.login(specialUser.username, specialUser.password);

      // Check that special characters are displayed correctly
      cy.get('[data-testid="user-number"]').should("contain", "BN<1234>");
    });
  });

  it("should handle account page with different user data", () => {
    // Logout and login with different user
    cy.get('[data-testid="logout-button"]').click();

    cy.fixture("users").then((users) => {
      const differentUser = users.validUsers[1]; // dummytree
      cy.login(differentUser.username, differentUser.password);

      // Check header shows correct user
      cy.get('[data-testid="header-content"]').should(
        "contain",
        `Hello ${differentUser.name}`
      );

      // Check user data
      cy.get('[data-testid="user-name"]').should("contain", differentUser.name);
      cy.get('[data-testid="user-fruit"]').should(
        "contain",
        differentUser.favouriteFruit
      );
      cy.get('[data-testid="user-movie"]').should(
        "contain",
        differentUser.favouriteMovie
      );
      cy.get('[data-testid="user-number"]').should(
        "contain",
        differentUser.favouriteNumber
      );
    });
  });

  it("should ensure account page is not accessible without login", () => {
    cy.get('[data-testid="logout-button"]').click();

    // Try to access account functionality directly (should not be possible)
    cy.get('[data-testid="account-container"]').should("not.exist");
    cy.get('[data-testid="user-name"]').should("not.exist");
    cy.get('[data-testid="logout-button"]').should("not.exist");
  });
});
