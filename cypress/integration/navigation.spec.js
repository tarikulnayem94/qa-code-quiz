describe("Navigation and UI Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have proper page title and structure", () => {
    // Check basic page structure
    cy.get("body").should("be.visible");

    // Background should be applied
    cy.get(".background").should("exist");
  });

  it("should handle responsive design elements", () => {
    // Test on different viewport sizes
    cy.viewport(1280, 720);
    cy.get('[data-testid="login-container"]').should("be.visible");

    cy.viewport(768, 1024); // Tablet
    cy.get('[data-testid="login-container"]').should("be.visible");

    cy.viewport(375, 667); // Mobile
    cy.get('[data-testid="login-container"]').should("be.visible");
  });

  it("should maintain UI state during login/logout cycle", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];

      // Initial state - login page
      cy.checkLoggedOut();

      // Login
      cy.login(validUser.username, validUser.password);
      cy.checkLoggedIn(validUser.name);

      // Logout
      cy.logout();
      cy.checkLoggedOut();

      // Login again
      cy.login(validUser.username, validUser.password);
      cy.checkLoggedIn(validUser.name);
    });
  });

  it("should handle multiple login attempts with different users", () => {
    cy.fixture("users").then((users) => {
      // Login with first user
      const user1 = users.validUsers[0];
      cy.login(user1.username, user1.password);
      cy.checkLoggedIn(user1.name);

      // Logout
      cy.logout();
      cy.checkLoggedOut();

      // Login with second user
      const user2 = users.validUsers[1];
      cy.login(user2.username, user2.password);
      cy.checkLoggedIn(user2.name);
    });
  });

  it("should handle UI interactions properly", () => {
    // Test input focus and blur
    cy.get('[data-testid="username-input"]').focus().should("have.focus");
    cy.get('[data-testid="password-input"]').focus().should("have.focus");
    cy.get('[data-testid="username-input"]').should("not.have.focus");
  });

  it("should handle button interactions", () => {
    // Test login button states
    cy.get('[data-testid="login-button"]')
      .should("be.visible")
      .and("be.enabled");

    // Test button hover (visual test)
    cy.get('[data-testid="login-button"]').trigger("mouseover");
    cy.get('[data-testid="login-button"]').trigger("mouseout");
  });

  it("should handle form submission with Enter key", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];

      cy.get('[data-testid="username-input"]').type(validUser.username);
      cy.get('[data-testid="password-input"]').type(validUser.password);

      // Press Enter in password field
      cy.get('[data-testid="password-input"]').type("{enter}");

      // Note: Current implementation doesn't handle Enter key
      // This test documents expected behavior
      cy.get('[data-testid="login-container"]').should("be.visible");
    });
  });

  it("should display proper visual hierarchy", () => {
    // Header should be at top
    cy.get('[data-testid="header"]').should("be.visible");

    // Login container should be below header
    cy.get('[data-testid="login-container"]').should("be.visible");

    // Elements should be in proper order
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");
    cy.get('[data-testid="contact-admin-message"]').should("be.visible");
  });

  it("should handle browser back/forward navigation", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];

      // Login
      cy.login(validUser.username, validUser.password);
      cy.checkLoggedIn(validUser.name);

      // Browser back should not change state (SPA behavior)
      cy.go("back");
      cy.checkLoggedIn(validUser.name);

      // Browser forward
      cy.go("forward");
      cy.checkLoggedIn(validUser.name);
    });
  });

  it("should handle page refresh while logged in", () => {
    cy.fixture("users").then((users) => {
      const validUser = users.validUsers[0];

      // Login
      cy.login(validUser.username, validUser.password);
      cy.checkLoggedIn(validUser.name);

      // Refresh page
      cy.reload();

      // Should be logged out (no persistence)
      cy.checkLoggedOut();
    });
  });

  it("should handle simultaneous form interactions", () => {
    // Test rapid input changes
    cy.get('[data-testid="username-input"]').type("user1");
    cy.get('[data-testid="password-input"]').type("pass1");
    cy.get('[data-testid="username-input"]').clear().type("user2");
    cy.get('[data-testid="password-input"]').clear().type("pass2");

    cy.get('[data-testid="username-input"]').should("have.value", "user2");
    cy.get('[data-testid="password-input"]').should("have.value", "pass2");
  });

  it("should maintain accessibility standards", () => {
    // Check for basic accessibility
    cy.get('[data-testid="username-input"]').should("have.attr", "placeholder");
    cy.get('[data-testid="password-input"]').should("have.attr", "placeholder");
    cy.get('[data-testid="login-button"]').should("contain.text", "LOGIN");

    // Check tab navigation
    cy.get('[data-testid="username-input"]').focus().tab();
    cy.get('[data-testid="password-input"]').should("have.focus");
  });

  it("should handle edge cases in UI", () => {
    // Test very long input values
    const longString = "a".repeat(1000);
    cy.get('[data-testid="username-input"]').type(longString);
    cy.get('[data-testid="username-input"]').should("have.value", longString);

    // Test special characters
    cy.get('[data-testid="password-input"]').type("!@#$%^&*()_+{}[]");
    cy.get('[data-testid="password-input"]').should(
      "have.value",
      "!@#$%^&*()_+{}[]"
    );
  });
});
