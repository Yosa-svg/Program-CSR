  it("berhasil masuk ke dashboard admin", () => {
    cy.visit("/admin/login");

  cy.get('input[type="email"]')
    .type("EMAIL_ADMIN_KAMU");

  cy.get('input[type="password"]')
    .type("PASSWORD_ADMIN_KAMU");

    cy.contains("button", "Masuk").click();

    cy.url().should("include", "/admin");
  cy.contains("Dashboard").should("be.visible");
});
