// import { EfficiencyMonthlyTypes } from "./Types";

// export namespace EfficiencyMonthlyService {
//   class PostgresHandler<P extends EfficiencyMonthlyTypes.Postgres.Program> {
//     // 1 - raw transactions properties
//     private program: P;
//     private category: EfficiencyMonthlyTypes.Postgres.Category<P>;
//     private raw: EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];

//     constructor(program: P, category: EfficiencyMonthlyTypes.Postgres.Category<P>) {
//       this.program = program;
//       this.category = category;
//     }

//     // 1
//     async getRawTransactions_1(): Promise<this> {
//       try {
//         const response: EfficiencyMonthlyTypes.Postgres.RawResponseObject =
//           await new RawTransactionHandler(this.program, this.category).retrieve();
//         this.raw = response.raw;

//         return this;
//       } catch (error) {
//         this.raw = [];
//         console.error(
//           `getRawTransactions_1 at EfficiencyMonthlyService: ${error}. Returning empty array of raw transactions.`
//         );
//         return this;
//       }
//     }
//   }
// }
