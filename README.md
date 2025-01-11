
## Configure Cypress to Use `@dankieu/cypress-sql`

1. **Ensure TypeScript Configuration (`tsconfig.json`) is Set Up Properly**

   In your `tsconfig.json` file, make sure to enable `esModuleInterop`:

   ```json
   {
     "compilerOptions": {
       "esModuleInterop": true
     }
   }
   ```

2. **Modify `cypress.config.ts` to Use the `@dankieu/cypress-sql` Package**

  

## Available Database Connections

The `@dankieu/cypress-sql` package supports the following database connections:

- **SQL Server**: `db.sqlServer(on)`
- **Oracle Database**: `db.sqlOracle(on)`
- **MySQL**: `db.sqlMySql(on)`
- **PostgreSQL**: `db.sqlPg(on)`

Each of these methods establishes a connection to the respective database type when Cypress tests are running.

## Example Setup

Here's an example of a complete `cypress.config.ts` file setup with all database connections:

```typescript
import * as db from "@dankieu/cypress-sql";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Connect to SQL Server
      db.sqlServer(on);

      // Connect to Oracle
      db.sqlOracle(on);

      // Connect to MySQL
      db.sqlMySql(on);

      // Connect to PostgreSQL
      db.sqlPg(on);
    },
  },
});
```

