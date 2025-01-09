// src/index.d.ts
declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command description
         * @param param - Parameter description
         */
        sqlOracle(config: any , query:string): Chainable<any>;
        
        sqlServer(config: any,query: string,): Chainable<any>;
    }
}
