describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login page elements correctly", () => {
    // Check that login page elements are visible
    cy.get('[data-testid="header"]').should("be.visible");
    cy.get('[data-testid="header-content"]').should(
      "contain",
      "qa.code-quiz.dev"
    );
    cy.get('[data-testid="login-container"]').should("be.visible");
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");
    cy.get('[data-testid="contact-admin-message"]').should("be.visible");
  });

  it("should have correct placeholder text", () => {
    cy.get('[data-testid="username-input"]').should(
      "have.attr",
      "placeholder",
      "Enter Username"
    );
    cy.get('[data-testid="password-input"]').should(
      "have.attr",
      "placeholder",
      "password"
    );
  });

  it("should successfully log in with valid credentials - SomeUser_name", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];

      cy.get('[data-testid="username-input"]').type(validUser.username);
      cy.get('[data-testid="password-input"]').type(validUser.password);
      cy.get('[data-testid="login-button"]').click();

      // Should be redirected to account page
      cy.get('[data-testid="account-container"]').should("be.visible");
      cy.get('[data-testid="header-content"]').should(
        "contain",
        `Hello ${validUser.name}`
      );

      // Verify user data is displayed correctly
      cy.get('[data-testid="user-name"]').should("contain", validUser.name);
      cy.get('[data-testid="user-fruit"]').should(
        "contain",
        validUser.favouriteFruit
      );
      cy.get('[data-testid="user-movie"]').should(
        "contain",
        validUser.favouriteMovie
      );
      cy.get('[data-testid="user-number"]').should(
        "contain",
        validUser.favouriteNumber
      );
    });
  });

  it("should successfully log in with valid credentials - dummytree", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[1];

      cy.get('[data-testid="username-input"]').type(validUser.username);
      cy.get('[data-testid="password-input"]').type(validUser.password);
      cy.get('[data-testid="login-button"]').click();

      // Should be redirected to account page
      cy.get('[data-testid="account-container"]').should("be.visible");
      cy.get('[data-testid="header-content"]').should(
        "contain",
        `Hello ${validUser.name}`
      );
    });
  });

  it("should handle invalid credentials gracefully", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUsers[0];

      cy.get('[data-testid="username-input"]').type(invalidUser.username);
      cy.get('[data-testid="password-input"]').type(invalidUser.password);
      cy.get('[data-testid="login-button"]').click();

      // Should remain on login page
      cy.get('[data-testid="login-container"]').should("be.visible");
      cy.get('[data-testid="header-content"]').should(
        "contain",
        "qa.code-quiz.dev"
      );

      // Account page should not be visible
      cy.get('[data-testid="account-container"]').should("not.exist");
    });
  });

  it("should handle wrong password for valid username", () => {
    cy.fixture("users").then((users) => {
      const invalidUser = users.invalidUsers[1];

      cy.get('[data-testid="username-input"]').type(invalidUser.username);
      cy.get('[data-testid="password-input"]').type(invalidUser.password);
      cy.get('[data-testid="login-button"]').click();

      // Should remain on login page
      cy.get('[data-testid="login-container"]').should("be.visible");
      cy.get('[data-testid="header-content"]').should(
        "contain",
        "qa.code-quiz.dev"
      );
    });
  });

  it("should handle empty credentials", () => {
    cy.get('[data-testid="login-button"]').click();

    // Should remain on login page
    cy.get('[data-testid="login-container"]').should("be.visible");
    cy.get('[data-testid="header-content"]').should(
      "contain",
      "qa.code-quiz.dev"
    );
  });

  it("should allow typing in input fields", () => {
    cy.get('[data-testid="username-input"]').type("testuser");
    cy.get('[data-testid="username-input"]').should("have.value", "testuser");

    cy.get('[data-testid="password-input"]').type("testpass");
    cy.get('[data-testid="password-input"]').should("have.value", "testpass");
  });

  it("should clear input fields when typed again", () => {
    cy.get('[data-testid="username-input"]')
      .type("first")
      .clear()
      .type("second");
    cy.get('[data-testid="username-input"]').should("have.value", "second");
  });

  it("should mask password input", () => {
    cy.get('[data-testid="password-input"]').should(
      "have.attr",
      "type",
      "password"
    );
  });

  it("should display admin contact message", () => {
    cy.get('[data-testid="contact-admin-message"]')
      .should("be.visible")
      .and("contain", "If you do not have an account, contact an admin");
  });

  it("should handle special characters in credentials", () => {
    cy.get('[data-testid="username-input"]').type("user@domain.com");
    cy.get('[data-testid="password-input"]').type("P@ssw0rd!");
    cy.get('[data-testid="login-button"]').click();

    // Should remain on login page (invalid credentials)
    cy.get('[data-testid="login-container"]').should("be.visible");
  });
});
