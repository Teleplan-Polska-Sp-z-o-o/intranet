import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { Brackets } from "typeorm";
import { EfficiencyService } from "../../services/analytic/efficiency/EfficiencyService";
import { GenericTypes, IngenicoTypes } from "../../services/transactions/sideControllers/Types";

// registration
// ---

// vmi
// z vmi na scrn

// screening
// z scrn

// win test
// z wint

// repair
/// lvl 2 z repB
// na wfnta (data) a potem na fnta -> (activ / fdone -> activ) => pass
// na chld% (data) => hold
// na cri => cust rel issues
/// lvl 3 z repC%
// na wfnta (data) a potem na fnta -> (activ / fdone -> activ) => pass
// na chld% (data) => hold
// na cri => cust rel issues

/// dodatkowo hold cri pass | eff z passów

// final test
// z fnta

// activation
// and h.work_center_no IN ('ACTOK','FRES')
// and h.next_work_center_no in ('CLNA','QCFR','LCAPP','LCAFR')

// customization
// and h.work_center_no IN ('LCAPP','LCAFR')
//       and h.next_work_center_no in ('CLNA','QCFR','KEYIN','KEYFR')

// KEYINJECTION:
// and h.work_center_no IN ('KEYIN','KEYFR')
//       and h.next_work_center_no in ('CLNA','QCFR')

// fgi
// and (h.work_center_no not in ('ENGH1','ENGH2','AOBA','ENGH','QCHCK','KEYIN','ACTIV','ACTOK','LCAPP','PCKA','CLNA'))
//       and h.next_work_center_no in ('RDYA','BER','UNREP','UNRFR')

// export { getRawRepairTransactions };

// VMI Transactions
const getVmiTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "VMI" })
    //   .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "SCRN" })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getVmiTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Ingenico, "vmi");
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "VMI transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving VMI transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve VMI transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// Screening Transactions
const getScreeningTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "SCRN" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getScreeningTransactions(
      opts
    );
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Ingenico,
        "screening"
      );
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "Screening transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Screening transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Screening transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// Win Test Transactions
const getWinTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "WINT" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getWinTestTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Ingenico,
        "wintest"
      );
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "Win Test transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Win Test transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Win Test transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// Final Test Transactions
const getFinalTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "FNTA" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getFinalTestTransactions(
      opts
    );
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Ingenico,
        "finaltest"
      );
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "Final Test transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Final Test transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Final Test transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// Activation Transactions
// const getActivationTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//      const contracts: string[] = JSON.parse(body.contracts);
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));
//     const getProcessed = new Date(JSON.parse(body.getProcessed));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const transactions = {
//       raw: [],
//       processed: [],
//     };

//     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
//     transactions.raw = await rawTransactionsRepo
//       .createQueryBuilder("h")
//       .select([
//         "h.transaction_id",
//         "h.contract",
//         "h.order_no",
//         "h.emp_name",
//         "h.part_no",
//         "h.work_center_no",
//         "h.next_work_center_no",
//         "h.datedtz",
//       ])
//       .where("h.contract IN (:...contracts)", { contracts })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["ACTOK", "FRES"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR", "LCAPP", "LCAFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: transactions.raw,
//       processed: [],
//       message: "Activation transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Activation transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       processed: [],
//       message: "Unknown error occurred. Failed to retrieve Activation transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Customization Transactions
// const getCustomizationTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//      const contracts: string[] = JSON.parse(body.contracts);
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));
//     const getProcessed = new Date(JSON.parse(body.getProcessed));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const transactions = {
//       raw: [],
//       processed: [],
//     };

//     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
//    transactions.raw = await rawTransactionsRepo
//       .createQueryBuilder("h")
//       .select([
//         "h.transaction_id",
//         "h.contract",
//         "h.order_no",
//         "h.emp_name",
//         "h.part_no",
//         "h.work_center_no",
//         "h.next_work_center_no",
//         "h.datedtz",
//       ])
//       .where("h.contract IN (:...contracts)", { contracts })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["LCAPP", "LCAFR"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR", "KEYIN", "KEYFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: transactions.raw,
//       processed: [],
//       message: "Customization transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Customization transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       processed: [],
//       message: "Unknown error occurred. Failed to retrieve Customization transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Key Injection Transactions
// const getKeyInjectionTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//      const contracts: string[] = JSON.parse(body.contracts);
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));
//     const getProcessed = new Date(JSON.parse(body.getProcessed));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const transactions = {
//       raw: [],
//       processed: [],
//     };

//     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
//    transactions.raw = await rawTransactionsRepo
//       .createQueryBuilder("h")
//       .select([
//         "h.transaction_id",
//         "h.contract",
//         "h.order_no",
//         "h.emp_name",
//         "h.part_no",
//         "h.work_center_no",
//         "h.next_work_center_no",
//         "h.datedtz",
//       ])
//       .where("h.contract IN (:...contracts)", { contracts })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["KEYIN", "KEYFR"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: transactions.raw,
//       processed: [],
//       message: "Key Injection transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Key Injection transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       processed: [],
//       message: "Unknown error occurred. Failed to retrieve Key Injection transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // FGI Transactions
const getFgiTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.work_center_no NOT IN (:...excludedWorkCenters)", {
    //     excludedWorkCenters: [
    //       "ENGH1",
    //       "ENGH2",
    //       "AOBA",
    //       "ENGH",
    //       "QCHCK",
    //       "KEYIN",
    //       "ACTIV",
    //       "ACTOK",
    //       "LCAPP",
    //       "PCKA",
    //       "CLNA",
    //     ],
    //   })
    //   .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
    //     nextWorkCenters: ["RDYA", "BER", "UNREP", "UNRFR"],
    //   })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getFgiTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Ingenico, "fgi");
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "FGI transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving FGI transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve FGI transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRepair2Transactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .andWhere("h.work_center_no = :repb", { repb: "REPB" })
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
    //         nextWorkCenters: ["WFNTA", "CRI"],
    //       }).orWhere("h.next_work_center_no LIKE :childPattern", { childPattern: "CHLD%" });
    //     })
    //   )
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getRepair2Transactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Ingenico,
        "repair2"
      );
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "Repair2 transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Repair2 transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Repair2 transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRepair3Transactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Ingenico] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    /// old ///
    // const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    // transactions.raw = await rawTransactionsRepo
    //   .createQueryBuilder("h")
    //   .select([
    //     "h.transaction_id",
    //     "h.contract",
    //     "h.order_no",
    //     "h.emp_name",
    //     "h.part_no",
    //     "h.work_center_no",
    //     "h.next_work_center_no",
    //     "h.dated",
    //   ])
    //   .where("h.contract IN (:...contracts)", { contracts })
    //   .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
    //   .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
    //   .andWhere("h.work_center_no LIKE :workcenterPattern", { workcenterPattern: "REPC%" })
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
    //         nextWorkCenters: ["WFNTA", "CRI"],
    //       }).orWhere("h.next_work_center_no LIKE :nextWorkcenterPattern", {
    //         nextWorkcenterPattern: "CHLD%",
    //       });
    //     })
    //   )
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await IngenicoTypes.RawTransactionQueryHandler.getRepair3Transactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Ingenico,
        "repair3"
      );
      handler.raw = transactions.raw;
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getProcessed();
      transactions.missingCache = handler.getMissingCache();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      missingCache: transactions.missingCache,
      message: "Repair2 transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Repair2 transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Repair2 transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  getVmiTransactions,
  getScreeningTransactions,
  getWinTestTransactions,
  getFinalTestTransactions,
  // getActivationTransactions,
  // getCustomizationTransactions,
  // getKeyInjectionTransactions,
  getFgiTransactions,
  getRepair2Transactions,
  getRepair3Transactions,
};
