describe('TaskFlow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should load the login page', () => {
    cy.contains('TaskFlow').should('be.visible');
    cy.contains('Create Demo Account').should('be.visible');
  });

  it('Should create demo account and login', () => {
    cy.contains('Create Demo Account').click();
    cy.contains('Welcome, Demo User', { timeout: 10000 }).should('be.visible');
    cy.contains('My Projects').should('be.visible');
  });

  it('Should create a project', () => {
    // Login first
    cy.contains('Create Demo Account').click();
    cy.contains('Welcome, Demo User', { timeout: 10000 }).should('be.visible');
    
    // Create project
    cy.get('input[placeholder="Project Name"]').type('E2E Test Project');
    cy.get('textarea[placeholder="Description"]').type('Created by Cypress E2E test');
    cy.contains('button', 'Create Project').click();
    
    // Verify project appears
    cy.contains('E2E Test Project').should('be.visible');
  });

  it('Should create and manage tasks', () => {
    // Login
    cy.contains('Create Demo Account').click();
    cy.contains('Welcome, Demo User', { timeout: 10000 }).should('be.visible');
    
    // Create project first
    cy.get('input[placeholder="Project Name"]').type('Task Test Project');
    cy.get('textarea[placeholder="Description"]').type('For task testing');
    cy.contains('button', 'Create Project').click();
    
    // Navigate to tasks
    cy.contains('View Tasks').click();
    cy.contains('Create Task').should('be.visible');
    
    // Create task
    cy.get('input[placeholder="Task Title"]').type('E2E Test Task');
    cy.get('textarea[placeholder="Description"]').type('Task created by E2E test');
    cy.get('select').select('high');
    cy.contains('button', 'Create Task').click();
    
    // Verify task appears
    cy.contains('E2E Test Task').should('be.visible');
    cy.contains('high').should('be.visible');
    cy.contains('pending').should('be.visible');
    
    // Change task status to in-progress
    cy.contains('In Progress').click();
    cy.contains('in-progress').should('be.visible');
    
    // Complete task
    cy.contains('Complete').click();
    cy.contains('completed').should('be.visible');
  });

  it('Should navigate back to dashboard', () => {
    // Login and create project
    cy.contains('Create Demo Account').click();
    cy.contains('Welcome, Demo User', { timeout: 10000 }).should('be.visible');
    
    cy.get('input[placeholder="Project Name"]').type('Navigation Test');
    cy.contains('button', 'Create Project').click();
    
    // Go to tasks
    cy.contains('View Tasks').click();
    
    // Navigate back
    cy.contains('Back to Projects').click();
    cy.contains('My Projects').should('be.visible');
    cy.contains('Navigation Test').should('be.visible');
  });
});
