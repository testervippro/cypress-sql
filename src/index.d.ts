// src/index.d.ts
declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command description
         * @param param - Parameter description
         */
        customCommand(param: string): Chainable<any>;
        executeSqlServer(config: any,query: any,): Chainable<any>;
    }
}
