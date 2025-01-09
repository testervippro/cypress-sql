import { sqlOracle } from "./index";
import { defineConfig } from "cypress";

//const { defineConfig } = require('cypress');
// const oracle = require('@monitorapex/cypress-oracle-db');

// const oracledb = require('oracledb');

// /**
//  * Executes a query on an Oracle database.
//  * @param {object} args - The task arguments.
//  * @param {object} args.connectConfig - The Oracle database connection configuration.
//  * @param {string} args.sqlQuery - The SQL query to execute.
//  * @returns {Promise<object>} - The query results.
//  */
// async function executeQueryOracle(connectConfig, sqlQuery) {

//   if (!connectConfig || !sqlQuery) {
//     throw new Error('Both connectConfig and sqlQuery must be provided.');
//   }

//   let connection;

//   try {
//     // Establish a connection to the Oracle database
//     connection = await oracledb.getConnection(connectConfig);

//     // Execute the query
//     const result = await connection.execute(sqlQuery);

//     // Return the query results
//     return result.rows;
//   } catch (err) {
//     console.error('Error executing query:', err);
//     throw new Error(`Error executing query: ${err.message}`);
//   } finally {
//     // Close the connection
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error('Error closing connection:', err);
//       }
//     }
//   }
// }

// const test01 = ((on) => {

//   on('task', {
//     executeQueryOracle({ connectConfig, sqlQuery }) {
//       return executeQueryOracle(connectConfig, sqlQuery);
//     },
//   });
// });


module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      sqlOracle(on)

      // Return the updated config
      return config;
    },
  },
});