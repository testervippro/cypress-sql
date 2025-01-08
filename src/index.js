// src/index.js
const sql = require('mssql');

// Plugin function
const executeSqlServer = () => {
  on('task', {
    async executeSqlServer({ config, query }) {
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
    },
  });
};

// Function to format SQL query results
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

  return flatten(formattedRows);
}

// Export the functions
module.exports = {
  formatResults,
  executeSqlServer,
};