describe('OracleDB Query Test', () => {
    it('should fetch data from OracleDB', () => {
      // Define the connection configuration
      const connectConfig = {
        user: 'hr', // Replace with your username
        password: 'hr', // Replace with your password
        connectString: 'localhost:1521/orcl', // Replace with your connect string
      };
  
      // Define the SQL query
      const sqlQuery = 'SELECT employee_id, first_name, last_name, salary FROM employees';
  
      // Call the task to execute the query
      cy.task('sqlOracle', { connectConfig, sqlQuery }).then((results) => {
        // Log the results
        console.log('Query Results:', results);
  
        // Assert that the results are not empty
       // expect(results).to.have.length.greaterThan(0);
      });
    });
  });