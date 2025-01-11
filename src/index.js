const oracledb = require('oracledb');
const sql = require('mssql');
const Tedious = require('tedious');

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

// const executeSQLQuery = (dbConfig, sql) => {
//   return new Promise((resolve, reject) => {
//     const connection = new Tedious.Connection(dbConfig);

//     connection.on('connect', (err) => {
//       if (err) {
//         return reject(err);
//       }

//       const request = new Tedious.Request(sql, (err, rowCount, rows) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(rows);
//       });

//       connection.execSql(request);
//     });

//     connection.on('error', (err) => {
//       reject(err);
//     });
//   });
// };


async function $SqlOracle(connectConfig, sqlQuery) {

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
      return $SqlOracle(connectConfig, sqlQuery);
    },
  });

});

async function $sqlServer(connectConfig,sqlQuery) {
  try {
    const pool = await sql.connect(connectConfig,sqlQuery);
    const result = await pool.request().query(sqlQuery);
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
        return $sqlServer(connectConfig, sqlQuery);
      },
    });
  
  });


module.exports = {
  sqlOracle,
  sqlServer
}