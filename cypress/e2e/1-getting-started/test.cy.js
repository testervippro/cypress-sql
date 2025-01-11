describe("OracleDB Query Test", () => {

  
  it("should fetch data from SQL Server", () => {
    const config = {
      user: "SA", // SQL Server username
      password: "Password789", // SQL Server password
      server: "localhost", // Server name or IP address
      port: 1433, // Port (default is 1433)
      database: "master", // Database name
      options: {
        encrypt: false, // Disable encryption (for local development)
        trustServerCertificate: true, // Trust self-signed certificates
      },
    };

    const sqlServer = "SELECT * FROM sys.tables;";
  
    cy.task("sqlServer", { connectConfig:config, sqlQuery:sqlServer }).then((results) => {
      // Log the results
      console.log("Query Results:SQL Server", results);
    });
  });



  it("should fetch data from OracleDB", () => {
    // Define the connection configuration
    let configOracle = {
      user: "hr", // Replace with your username
      password: "hr", // Replace with your password
      connectString: "localhost:1521/orcl", // Replace with your connect string
    };
  
    // Define the SQL query
    let sqlQueryOracle = "SELECT employee_id, first_name, last_name, salary FROM employees";
  
    // Use the sqlOracle task to execute the query
    cy.task("sqlOracle", { connectConfig: configOracle, sqlQuery: sqlQueryOracle }).then((results) => {
      // Log the results
      console.log("Query Results: Oracle", results);
     
      
    });
  });


});
