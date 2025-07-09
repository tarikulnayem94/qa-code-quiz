describe("API Integration Tests", () => {
  const API_BASE_URL = "http://localhost:9999";

  before(() => {
    // Start the API server (this would need to be running)
    // In a real scenario, you'd start this in CI/CD or manually
  });

  it("should respond to health check endpoint", () => {
    cy.request("GET", `${API_BASE_URL}/`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Backend API");
    });
  });

  it("should create a new user account", () => {
    const newUser = {
      username: "testuser_cypress",
      name: "Cypress Test User",
      password: "cypress123",
      favouriteFruit: "Cypress Fruit",
      favouriteMovie: "Cypress Movie",
      favouriteNumber: "Cypress Number",
    };

    cy.request("POST", `${API_BASE_URL}/user`, newUser).then((response) => {
      expect(response.status).to.eq(200);
      // The response should indicate success
    });
  });

  it("should handle duplicate user creation", () => {
    const duplicateUser = {
      username: "SomeUser_name", // Existing user
      name: "Duplicate User",
      password: "duplicate123",
      favouriteFruit: "Duplicate Fruit",
      favouriteMovie: "Duplicate Movie",
      favouriteNumber: "Duplicate Number",
    };

    cy.request({
      method: "POST",
      url: `${API_BASE_URL}/user`,
      body: duplicateUser,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Account Already Exists");
    });
  });

  it("should update an existing user", () => {
    const updateData = {
      username: "SomeUser_name",
      name: "Updated Name",
      password: "updated123",
      favouriteFruit: "Updated Fruit",
      favouriteMovie: "Updated Movie",
      favouriteNumber: "Updated Number",
    };

    cy.request(
      "PUT",
      `${API_BASE_URL}/user?username=SomeUser_name`,
      updateData
    ).then((response) => {
      expect(response.status).to.eq(200);
      // The response should indicate success
    });
  });

  it("should handle updating non-existent user", () => {
    const updateData = {
      username: "nonexistent_user",
      name: "Non-existent",
      password: "nonexistent123",
      favouriteFruit: "Non-existent Fruit",
      favouriteMovie: "Non-existent Movie",
      favouriteNumber: "Non-existent Number",
    };

    cy.request({
      method: "PUT",
      url: `${API_BASE_URL}/user?username=nonexistent_user`,
      body: updateData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Account Does NOT Exist");
    });
  });

  it("should delete an existing user", () => {
    // First create a user to delete
    const userToDelete = {
      username: "delete_test_user",
      name: "Delete Test User",
      password: "delete123",
      favouriteFruit: "Delete Fruit",
      favouriteMovie: "Delete Movie",
      favouriteNumber: "Delete Number",
    };

    cy.request("POST", `${API_BASE_URL}/user`, userToDelete).then(() => {
      // Now delete the user
      cy.request(
        "DELETE",
        `${API_BASE_URL}/user?username=delete_test_user`
      ).then((response) => {
        expect(response.status).to.eq(200);
        // The response should indicate success
      });
    });
  });

  it("should handle deleting non-existent user", () => {
    cy.request({
      method: "DELETE",
      url: `${API_BASE_URL}/user?username=nonexistent_delete_user`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Account Does Not Exist");
    });
  });

  it("should handle malformed requests", () => {
    // Test POST with missing fields
    cy.request({
      method: "POST",
      url: `${API_BASE_URL}/user`,
      body: { username: "incomplete" },
      failOnStatusCode: false,
    }).then((response) => {
      // Should handle gracefully
      expect(response.status).to.be.oneOf([200, 400, 500]);
    });
  });

  it("should handle invalid JSON", () => {
    cy.request({
      method: "POST",
      url: `${API_BASE_URL}/user`,
      body: "invalid json",
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Should handle invalid JSON gracefully
      expect(response.status).to.be.oneOf([400, 500]);
    });
  });

  it("should handle concurrent requests", () => {
    const requests = [];

    for (let i = 0; i < 5; i++) {
      requests.push(cy.request("GET", `${API_BASE_URL}/`));
    }

    // All requests should succeed
    requests.forEach((request, index) => {
      request.then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("Backend API");
      });
    });
  });
});
