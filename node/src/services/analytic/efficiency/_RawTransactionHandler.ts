// import {
//   getRawSkyPackingTransactions,
//   getRawCosmeticTransactions,
//   getRawOobaTransactions,
//   getRawSkyTestTransactions,
// } from "../../../sideControllers/sky/TransactionsRawController";

// import {
//   getRawRegistrationTransactions,
//   // getRawCleaningTransactions,
//   getRawFinalTestTransactions,
//   getRawLenovoPackingTransactions,
//   getRawRepairTransactions,
// } from "../../../sideControllers/lenovo/TransactionsRawController";

// import {
//   getVmiTransactions,
//   getScreeningTransactions,
//   getWinTestTransactions,
//   getFinalTestTransactions,
//   // getActivationTransactions,
//   // getCustomizationTransactions,
//   // getKeyInjectionTransactions,
//   getFgiTransactions,
//   getRepair2Transactions,
//   getRepair3Transactions,
// } from "../../../sideControllers/ingenico/TransactionsRawController";

// import {
//   getRawCosmTransactions,
//   getRawDebugRepairTransactions,
//   getRawHighPotTransactions,
//   getRawPackTransactions,
//   // getRawShipTransactions,
//   getRawTestTransactions,
//   getRawVmiTransactions,
// } from "../../../sideControllers/liberty/TransactionsRawController";

// // import {
// //   getDellEcoCheckTransactions,
// //   getDellEcoWorksTransactions,
// //   getDellFchTransactions,
// //   getDellFinalTestTransactions,
// //   getDellHoldTransactions,
// //   getDellObaTransactions,
// //   getDellPackTransactions,
// //   getDellRepairL1L2Transactions,
// //   getDellRepairL3Transactions,
// //   getDellScrapTransactions,
// //   getDellScreeningTransactions,
// //   getDellShipTransactions,
// //   getDellVmiTransactions,
// //   getDellWffaTransactions,
// // } from "../../../sideControllers/dell/TransactionsRawController";

// import moment from "moment";
// import { EfficiencyMonthlyTypes } from "./Types";

// // Mapping objects
// const transactionFunctionMapping: Record<string, Record<string, Function>> = {
//   sky: {
//     packing: getRawSkyPackingTransactions,
//     cosmetic: getRawCosmeticTransactions,
//     ooba: getRawOobaTransactions,
//     test: getRawSkyTestTransactions,
//   },
//   lenovo: {
//     registration: getRawRegistrationTransactions,
//     // cleaning: getRawCleaningTransactions,
//     final: getRawFinalTestTransactions,
//     packing: getRawLenovoPackingTransactions,
//     repair: getRawRepairTransactions,
//   },
//   ingenico: {
//     vmi: getVmiTransactions,
//     screening: getScreeningTransactions,
//     wintest: getWinTestTransactions,
//     finaltest: getFinalTestTransactions,
//     // activation: getActivationTransactions,
//     // customization: getCustomizationTransactions,
//     // keyinjection: getKeyInjectionTransactions,
//     fgi: getFgiTransactions,
//     repair2: getRepair2Transactions,
//     repair3: getRepair3Transactions,
//   },
//   liberty: {
//     vmi: getRawVmiTransactions,
//     test: getRawTestTransactions,
//     debugrepair: getRawDebugRepairTransactions,
//     cosmetic: getRawCosmTransactions,
//     highpot: getRawHighPotTransactions,
//     pack: getRawPackTransactions,
//     // ship: getRawShipTransactions,
//     ooba: getRawOobaTransactions,
//   },
//   //   dell: {
//   //     vmi: getDellVmiTransactions,
//   //     wffa: getDellWffaTransactions,
//   //     pack: getDellPackTransactions,
//   //     finaltest: getDellFinalTestTransactions,
//   //     ecocheck: getDellEcoCheckTransactions,
//   //     fch: getDellFchTransactions,
//   //     repairl1l2: getDellRepairL1L2Transactions,
//   //     screening: getDellScreeningTransactions,
//   //     ecoworks: getDellEcoWorksTransactions,
//   //     oba: getDellObaTransactions,
//   //     repairl3: getDellRepairL3Transactions,
//   //     scrap: getDellScrapTransactions,
//   //     hold: getDellHoldTransactions,
//   //     ship: getDellShipTransactions,
//   //   },
// };
// const transactionContractsMapping: Record<string, string[]> = {
//   sky: ["12195", "12196", "12176"],
//   lenovo: ["12101"],
//   ingenico: ["12194"],
//   liberty: [
//     "12192",
//     "12120",
//     "12188",
//     "12172",
//     "12136",
//     "12156",
//     "12178",
//     "12140",
//     "12139",
//     "12158",
//     "12141",
//     "12190",
//     "12148",
//     "12197",
//     "12198",
//   ],
//   dell: ["10064"],
// };

// class MockRequest {
//   body: {
//     contracts: string;
//     startOfDay: string;
//     endOfDay: string;
//   };
//   constructor(program: string) {
//     // const startOfDay = "2024-11-01T06:00:00.000Z";
//     const startOfDay = moment()
//       .subtract(1, "months")
//       .startOf("month")
//       .hour(6)
//       .minute(0)
//       .second(0)
//       .toISOString();
//     // const endOfDay = "2024-11-29T06:00:00.000Z";
//     const endOfDay = moment().startOf("month").hour(6).minute(0).second(0).toISOString();
//     this.body = {
//       contracts: JSON.stringify(transactionContractsMapping[program]),
//       startOfDay: JSON.stringify(startOfDay),
//       endOfDay: JSON.stringify(endOfDay),
//     };
//   }
// }

// class MockResponse {
//   statusCode?: number;
//   status(code: number): this {
//     this.statusCode = code;
//     return this;
//   }
//   json(object: object) {
//     return object;
//   }
// }

// // Handler class
// class RawTransactionFactory<P extends EfficiencyMonthlyTypes.Postgres.Program> {
//   private program: P;
//   private category: EfficiencyMonthlyTypes.Postgres.Category<P>;

//   private handler: Function;

//   private mockRequest: Request;
//   private mockResponse: Response;

//   constructor(program: P, category: EfficiencyMonthlyTypes.Postgres.Category<P>) {
//     this.program = program; // Normalize to lowercase for consistent mapping
//     this.category = category; // Normalize to lowercase for consistent mapping

//     this.handler = this.getHandler();

//     this.mockRequest = new MockRequest(this.program as string) as unknown as Request;
//     this.mockResponse = new MockResponse() as unknown as Response;
//   }

//   private getHandler(): Function {
//     const programMapping = transactionFunctionMapping[this.program as string];
//     if (!programMapping) {
//       throw new Error(`Invalid program: ${this.program}`);
//     }

//     const transactionFunction = programMapping[this.category];
//     if (!transactionFunction) {
//       throw new Error(`Invalid category: ${this.category} for program: ${this.program}`);
//     }

//     return transactionFunction;
//   }

//   public async retrieve(): Promise<EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[]> {
//     try {
//       const response = await this.handler(this.mockRequest, this.mockResponse);
//       return response.raw;
//     } catch (error) {
//       throw new Error(`Failed to retrieve transactions: ${error.message}`);
//     }
//   }
// }

// export { transactionFunctionMapping, RawTransactionFactory };
