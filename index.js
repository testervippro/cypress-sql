const oracledb = require('oracledb');
const sql = require('mssql');


function formatResults(rows) {
  if (!rows || !Array.isArray(rows)) {
    return rows; // Return as-is if rows is not an array
  }

  // Flatten nested arrays (if any)
  const flatten = (data) => {
    if (Array.isArray(data) && data.length === 1) {
      return flatten(data[0]); // Recursively flatten
    }
    return data;
  };

  // Format the rows
  const formattedRows = rows.map((row) => {
    const formattedRow = {};
    for (const key in row) {
      formattedRow[key] = row[key];
    }
    return formattedRow;
  });

  return flatten(formattedRows[0]);
}

// Plugin function

async  function SQLServer(config, query ) {
      try {
        // Connect to the database
        await sql.connect(config);

        // Execute the query
        const result = await sql.query(query);
        // Format and return the results
        return formatResults(result.recordset);
      } catch (err) {
        console.error('SQL error:', err);
        throw err; // Rethrow the error to fail the Cypress task
      } finally {
        // Close the database connection
        await sql.close();
      }
    }


async function Oracle(connectConfig, sqlQuery) {

  if (!connectConfig || !sqlQuery) {
    throw new Error('Both connectConfig and sqlQuery must be provided.');
  }

  let connection;

  try {
    // Establish a connection to the Oracle database
    connection = await oracledb.getConnection(connectConfig);

    // Execute the query
    const result = await connection.execute(sqlQuery);

    // Return the query results
    return formatResults(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    throw new Error(`Error executing query: ${err.message}`);
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

const sqlOracle = ((on) => {

  on('task', {
    sqlOracle({ connectConfig, sqlQuery }) {
      return Oracle(connectConfig, sqlQuery);
    },
  });

});
const sqlServer = ((on) => {

    on('task', {
        sqlServer({ connectConfig, sqlQuery }) {
        return SQLServer(connectConfig, sqlQuery);
      },
    });
  
  });



const   cmd = () => {
    // Custom command for Oracle queries
    Cypress.Commands.add('sqlOracle', (connectConfig, sqlQuery) => {
      return cy.task('sqlOracle', { connectConfig, sqlQuery });
    });
  
    // Custom command for SQL Server queries
    Cypress.Commands.add('sqlServer', (connectConfig, sqlQuery) => {
      return cy.task('sqlServer', { connectConfig, sqlQuery });
    });
  }; 

cmd()

module.exports = {
  sqlOracle,
  sqlServer,
  cmd
}
