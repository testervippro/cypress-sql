const sql = require('mssql');

const { defineConfig } = require('cypress');
const db = require('@dankieu/cypress-sql');


module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Optionally initialize Oracle SQL functionality
      //db.sqlOracle(on);
      // Return the updated config
      //sql server
       //sql db
    
     db.sqlServer(on);
      db.sqlOracle(on)
     

      return config;
    },
  },
});