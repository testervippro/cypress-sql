"use strict";
// const oracledb = require('oracledb');
Object.defineProperty(exports, "__esModule", { value: true });
Cypress.Commands.add('customCommand', (param) => {
    cy.log(`Running custom command with param: ${param}`);
    // Add your custom logic here
});
