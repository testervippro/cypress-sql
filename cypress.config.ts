const { defineConfig } = require('cypress');
const db = require('@dankieu/cypress-sql');

// const test01 = (on) => {
//   on('task', {
//     executeQueryOracle({ connectConfig, sqlQuery }) {
//       return executeQueryOracle(connectConfig, sqlQuery);
//     },
//   });
// };

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Optionally initialize Oracle SQL functionality
      db.sqlOracle(on);
      // Return the updated config
      return config;
    },
  },
});