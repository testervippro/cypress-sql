import oracledb from 'oracledb';
import sql from 'mssql';
import mysql from 'mysql';
import pg from "pg"

const { Client } = pg;

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

// Function to format rows based on metaData
function formatResultsOracle(metaData, rows) {
  return rows.map(row => {
    let formattedRow = {};

    // Map each column from metaData to the respective value from the row
    metaData.forEach((column, index) => {
      // Convert the column name to camelCase
      const key = column.name;
      // Assign the value from the row to the formatted object
      formattedRow[key] = row[index];
    });

    return formattedRow;
  });
}
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
    const formattedResult = formatResultsOracle(result.metaData, result.rows);
  
    return formattedResult; 
    //return result;

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
async function $sqlServer(connectConfig,sqlQuery) {
  try {
    const pool = await sql.connect(connectConfig,sqlQuery);
    const result = await pool.request().query(sqlQuery);

    // const formattedResult = formatResults(result.recordset);
  
    // return formattedResult; 
    return result.recordset;
  } catch (err) {
    console.error("Database query failed:", err);
    throw err;
  } finally {
    await sql.close();
  }
}
function $sqlMySql(config, query) {
  return new Promise((resolve, reject) => {
    // Create a connection to the database
    const connection = mysql.createConnection(config);

    // Connect to the database
    connection.connect((err) => {
      if (err) {
        reject('Error connecting to the database:', err.stack);
        return;
      }
      console.log('Connected to the database');
    });

    // Execute the query
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject('Error executing query:', error.stack);
        return;
      }

      // Resolve with the query results
      resolve(results);
  
    });

    // Close the connection after the query is executed
    connection.end((err) => {
      if (err) {
        reject('Error closing the connection:', err.stack);
        return;
      }
      console.log('Connection closed');
    });
  });
}


// Function to connect and execute a query
async function $sqlPg(dbConfig, query) {
  return new Promise((resolve, reject) => {
    // Create a new PostgreSQL client
    const client = new Client(dbConfig);

    // Connect to the database
    client.connect()
      .then(() => {
        console.log('Connected to PostgreSQL database');

        // Execute the query
        client.query(query, (err, result) => {
          if (err) {
            reject('Error executing query: ' + err);
          } else {
            resolve(result.rows);  // Resolve with the query result
          }

          // Close the connection when done
          client.end()
            .then(() => {
              console.log('Connection to PostgreSQL closed');
            })
            .catch((err) => {
              reject('Error closing connection: ' + err);
            });
        });
      })
      .catch((err) => {
        reject('Error connecting to PostgreSQL database: ' + err);
      });
  });
}
export const sqlOracle = ((on) => {

  on('task', {
    sqlOracle({ connectConfig, sqlQuery }) {
      return $SqlOracle(connectConfig, sqlQuery);
    },
  });

});

export const sqlServer = ((on) => {
    on('task', {
        sqlServer({ connectConfig, sqlQuery }) {
        return $sqlServer(connectConfig, sqlQuery);
      },
    });
  
  });

export const sqlMySql = ((on) => {
    on('task', {
      sqlMySql({ connectConfig, sqlQuery }) {
        return $sqlMySql(connectConfig, sqlQuery);
      },
    });
  
  });

export const sqlPg = ((on) => {
    on('task', {
      sqlPg({ connectConfig, sqlQuery }) {
        return $sqlPg(connectConfig, sqlQuery);
      },
    });
  
  });  
