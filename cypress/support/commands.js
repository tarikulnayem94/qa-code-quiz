// Custom commands for the login portal

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/");
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout-button"]').click();
});

// Custom command to check if user is logged in
Cypress.Commands.add("checkLoggedIn", (username) => {
  cy.get('[data-testid="header"]').should("contain", `Hello ${username}`);
  cy.get('[data-testid="account-container"]').should("be.visible");
});

// Custom command to check if user is logged out
Cypress.Commands.add("checkLoggedOut", () => {
  cy.get('[data-testid="header"]').should("contain", "qa.code-quiz.dev");
  cy.get('[data-testid="login-container"]').should("be.visible");
});
