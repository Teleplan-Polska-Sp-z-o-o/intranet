import { HttpResponseMessage } from "../../../enums/response";

export namespace EfficiencyMonthlyTypes {
  export namespace Postgres {
    // PROGRAM CATEGORY
    export type ProgramCategories = {
      sky: "packing" | "cosmetic" | "ooba";
      lenovo: "repair" | "registration" | "cleaning" | "final" | "packing";
      ingenico:
        | "models"
        | "vmi"
        | "screening"
        | "wintest"
        | "finaltest"
        | "activation"
        | "customization"
        | "keyinjection"
        | "fgi"
        | "repair2"
        | "repair3";
      liberty: "vmi" | "test" | "debugrepair" | "cosmetic" | "highpot" | "pack" | "ship" | "ooba";
    };
    export type Program = keyof ProgramCategories;
    export type Category<P extends Program> = ProgramCategories[P];

    // RAW API

    export interface ITransactionsRecord {
      [key: string]: number | string | Date;
      transaction_id: number;
      contract: string;
      order_no: string;
      emp_name: string;
      part_no: string;
      work_center_no: string;
      next_work_center_no: string;
      datedtz: Date;
    }
    export type RawResponseObject = {
      raw: ITransactionsRecord[];
      message: string;
      statusMessage: HttpResponseMessage;
    };

    // RawTransactionHandler interface
    // type RawMethod = (req: Request, res: Response) => Promise<Response>;
    // type RawBody = {
    //   contracts: string;
    //   startOfDay: string;
    //   endOfDay: string;
    // };
    // class RawTransactionHandler {
    //   transactionMethods: Record<Category, RawMethod> = {
    //     packing: getRawSkyPackingTransactions,
    //     cosmetic: getRawCosmeticTransactions,
    //     ooba: getRawOobaTransactions,
    //   };
    //   method: RawMethod;
    //   transactionContracts: Record<Program, string[]> = {
    //     sky: ["12195", "12196", "12176"],
    //   };
    //   mockRequest: Request;
    //   mockResponse: Response;

    //   constructor(program: Program, category: Category) {
    //     if (!this.transactionMethods[category]) {
    //       throw new Error(
    //         `RawTransactionHandler at PackedService: Invalid method type: ${category}.`
    //       );
    //     }

    //     this.method = this.transactionMethods[category];

    //     class MockRequest {
    //       body: RawBody;
    //       constructor(transactionContracts: Record<Program, string[]>) {
    //         // Get the current time in the "Europe/Warsaw" timezone
    //         const now = moment().tz("Europe/Warsaw");
    //         // If the current time is between 00:00 and 06:00, subtract one day
    //         const baseDate =
    //           now.hour() >= 0 && now.hour() < 7 ? now.clone().subtract(1, "day") : now;
    //         // Set startOfDay to 06:00 of the baseDate (either today or the previous day)
    //         const startOfDay = baseDate
    //           .clone()
    //           .set({ hour: 6, minute: 0, second: 0, millisecond: 0 });
    //         // Set endOfDay to 06:00 of the next day
    //         const endOfDay = startOfDay.clone().add(1, "day");
    //         this.body = {
    //           contracts: JSON.stringify(transactionContracts[program]),
    //           startOfDay: JSON.stringify(startOfDay),
    //           endOfDay: JSON.stringify(endOfDay),
    //         };
    //       }
    //     }

    //     class MockResponse {
    //       statusCode?: number;
    //       status(code: number): this {
    //         this.statusCode = code;
    //         return this;
    //       }
    //       json(object: object) {
    //         return object;
    //       }
    //     }

    //     this.mockRequest = new MockRequest(this.transactionContracts) as Request;
    //     this.mockResponse = new MockResponse() as Response;
    //   }

    //   retrieve(): Promise<RawResponseObject> {
    //     return this.method(
    //       this.mockRequest,
    //       this.mockResponse
    //     ) as unknown as Promise<RawResponseObject>;
    //   }
    // }
  }
}
