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

async function SQLServer(config,query) {
  try {
    const pool = await sql.connect(config,query);
    const result = await pool.request().query(query);
    return formatResults(result);
  } catch (err) {
    console.error("Database query failed:", err);
    throw err;
  } finally {
    await sql.close();
  }
}

const sqlServer = ((on) => {

    on('task', {
        sqlServer({ connectConfig, sqlQuery }) {
        return SQLServer(connectConfig, sqlQuery);
      },
    });
  
  });



module.exports = {
  sqlOracle,
  sqlServer
}