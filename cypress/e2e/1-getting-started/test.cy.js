describe("Test connect to Db", () => {
  it("should fetch data from SQL Server", () => {
    const config = {
      user: "SA", 
      password: "Password789",
      server: "localhost", 
      port: 1433, 
      database: "master", 
      options: {
        encrypt: false, 
        trustServerCertificate: true, 
      },
    };

    const sql = "SELECT * FROM sys.tables;";

    cy.task("sqlServer", { connectConfig: config, sqlQuery: sql }).then(
      (results) => {
        // Log the results
        console.log("Query Results:SQL Server", results[0]);
      }
    );

    cy.sqlServer(config,sql).then(
      (results) => {
        // Log the results
        console.log("Query Results Custom CMD:SQL Server", results[0]);
      }
    );
    
  });

  it("should fetch data from OracleDB", () => {
    // Define the connection configuration
    let config = {
      user: "hr", 
      password: "hr",
      connectString: "localhost:1521/orcl", 
    };

    // Define the SQL query
    let sql =
      "SELECT employee_id, first_name, last_name, salary FROM employees";

    // Use the sqlOracle task to execute the query
    cy.task("sqlOracle", {
      connectConfig: config,
      sqlQuery: sql,
    }).then((results) => {
      // Log the results
      console.log("Query Results: Oracle", results[0]);
    });


    cy.sqlOracle(config,sql).then(
      (results) => {
        // Log the results
        console.log("Query Results Custom CMD:SQL Oracle", results[0]);
      }
    );
  });

  it("should fetch data from MySQL", () => {
    // Define the connection configuration
    let dbConfig = {
      host: "localhost",
      user: "root", 
      password: "college", 
      database: "employees", 
    };

    // Define the SQL query
    let sql = "SELECT dept_no, dept_name FROM employees.departments;";

    // Use the sqlOracle task to execute the query
    cy.task("sqlMySql", {
      connectConfig: dbConfig,
      sqlQuery: sql,
    }).then((results) => {
      // Log the results
      console.log("Query Results: MySQL", results[0]);
    });

    //use custom cmd 
    cy.sqlMySql(dbConfig,sql).then(
      (results) => {
        // Log the results
        console.log("Query Results Custom CMD:SQL MySQL", results[0]);
      }
    );
  });



  //connect to pg
  it("should fetch data from PG", () => {
    const dbConfig = {
      user: "world",
      password: "world123",
      host: "localhost", 
      port: 5432, 
      database: "world-db",
    };

const sql = "SELECT code,continent, region, surface_area, indep_year, population, life_expectancy, gnp, gnp_old, local_name, government_form, head_of_state, capital, code2 FROM public.country;";

    // Use the sqlOracle task to execute the query
    cy.task("sqlPg", { connectConfig: dbConfig, sqlQuery: sql }).then(
      (results) => {
        // Log the results
        console.log("Query Results: Pg", results[0]);
      }
    );

    cy.sqlPg(dbConfig,sql).then(
      (results) => {
        // Log the results
        console.log("Query Results Custom CMD:SQL Pg", results[0]);
      }
    );
   
  });
});
