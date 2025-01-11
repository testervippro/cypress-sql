const sql = require("mssql");

const { defineConfig } = require("cypress");
const db = require("@dankieu/cypress-sql");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
     
      db.sqlServer(on);
      db.sqlOracle(on);
      db.sqlMySql(on);
      db.sqlPg(on);

      return config;
    },
  },
});
