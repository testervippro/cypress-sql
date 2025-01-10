describe('OracleDB Query Test', () => {
    it('should fetch data from OracleDB', () => {
      // Define the connection configuration
      const connectConfigOracle = {
        user: 'hr', // Replace with your username
        password: 'hr', // Replace with your password
        connectString: 'localhost:1521/orcl', // Replace with your connect string
      };
  
// Configuration for your SQL Server
const config = {
  user: 'SA', // SQL Server username
  password: 'Password789', // SQL Server password
  server: 'localhost', // Server name or IP address
  port: 1433, // Port (default is 1433)
  database: 'master', // Database name
  options: {
      encrypt: false, // Disable encryption (for local development)
      trustServerCertificate: true, // Trust self-signed certificates
  },
};


      // Define the SQL query
      const sqlQuery = 'SELECT employee_id, first_name, last_name, salary FROM employees';

      const sqlServer = "SELECT TOP 5 * FROM dbo.DimDate";
      
      // Call the task to execute the query
      // cy.task('sqlOracle', { connectConfig: connectConfigOracle, sqlQuery }).then((results) => {
      //   // Log the results
      //   console.log('Query Results:', results);
  
      //   // Assert that the results are not empty
      //  // expect(results).to.have.length.greaterThan(0);
      // });

      //sql server 
    
      cy.task('queryDatabase', { config, sqlServer }).then((results) => {
        // Log the results
        console.log('Query Results:', results);
  
        // Assert that the results are not empty
       // expect(results).to.have.length.greaterThan(0);
      });


    });
  });