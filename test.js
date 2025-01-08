const oracledb = require('oracledb');

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

async function testOracle() {
    let connection;

    try {
        // Establish a connection to the Oracle database
        connection = await oracledb.getConnection({
            user: 'hr',
            password: 'hr',
            connectString: 'localhost:1521/orcl'
        });

        // Execute the SQL query
        const result = await connection.execute(
            `SELECT manager_id, department_id, department_name
             FROM departments`
        );

        // Format and log the results
        console.log(formatResults(result.rows));

    } catch (err) {
        // Handle any errors
        console.error(err);
    } finally {
        // Close the connection
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// Run the script
//run();

module.exports = {
    testOracle
}