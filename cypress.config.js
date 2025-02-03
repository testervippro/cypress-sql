// Import the required modules using ES module syntax
import { defineConfig } from 'cypress';
import * as db from '@dankieu/cypress-sql'; // Import everything from db

//whey need change to .js 
// https://github.com/cypress-io/cypress/issues/23552

// Export the Cypress configuration using ES module syntax
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      db.sqlServer(on);  // Example usage of imported method
      db.sqlOracle(on);
      db.sqlMySql(on);
      db.sqlPg(on);

      return config;
    },
  },
});
