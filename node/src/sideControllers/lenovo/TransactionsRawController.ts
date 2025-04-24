import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { EfficiencyService } from "../../services/analytic/efficiency/EfficiencyService";
import { GenericTypes, LenovoTypes } from "../../services/transactions/sideControllers/Types";

const getRawRegistrationTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // select ar.contract, ar.order_no, ar.reg_user_id, ar.part_no, ar.reg_date
    // from info_emrept02.all_rep ar
    // where
    // 	ar.contract in ('12101')
    // 	and ar.last_activity_date >= '2025-04-15T06:00:00.000Z'
    // 	and ar.last_activity_date < '2025-04-29T06:00:00.000Z'

    // temporary
    return res.status(200).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "RawTransactions for registration retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });

    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Lenovo] =
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

    transactions.raw = await SideDataSources.postgres
      .getRepository(RawTransaction)
      .createQueryBuilder("h")
      .select([
        "h.transaction_id",
        "h.contract",
        "h.order_no",
        "h.emp_name",
        "h.part_no",
        "h.work_center_no",
        "h.next_work_center_no",
        "h.dated",
      ])
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "1FNTA" }) // Registration
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Lenovo,
        "registration"
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
      message: "RawTransactions for registration retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getRawCleaningTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;

//     const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Lenovo] = ["12101"]; //JSON.parse(body.contracts);

//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const startOfDayISO = startOfDay.toISOString();
//     const endOfDayISO = endOfDay.toISOString();

//     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

//     const rawTransactions = await rawTransactionsRepo
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
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "1CLNA" }) // Cleaning
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
//       .setParameters({
//         startOfDay: startOfDayISO,
//         endOfDay: endOfDayISO,
//       })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "RawTransactions for cleaning retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving RawTransactions: ", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve RawTransactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getRawFinalTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Lenovo] =
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
    // transactions.raw = await SideDataSources.postgres
    //   .getRepository(RawTransaction)
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "1FNPA" }) // Final Test
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LenovoTypes.RawTransactionQueryHandler.getFinalTestTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Lenovo, "final");
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
      message: "RawTransactions for final test retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawLenovoPackingTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Lenovo] =
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
    // transactions.raw = await SideDataSources.postgres
    //   .getRepository(RawTransaction)
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "1PCKA" }) // Packing
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LenovoTypes.RawTransactionQueryHandler.getPackingTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Lenovo, "packing");
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
      message: "RawTransactions for packing retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawRepairTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Lenovo] =
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
    // transactions.raw = await SideDataSources.postgres
    //   .getRepository(RawTransaction)
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
    //   //
    //   .andWhere(
    //     "(h.work_center_no IN (:...workCenters) OR h.work_center_no LIKE :workCenterPattern)",
    //     {
    //       workCenters: ["1REPA", "1REW", "1AWRB"],
    //       workCenterPattern: "1HL%",
    //     }
    //   )
    //   //
    //   .andWhere(
    //     // "h.next_work_center_no IN (:...nextWorkCenters)",
    //     "(h.next_work_center_no IN (:...nextWorkCenters) OR h.next_work_center_no LIKE :nextPattern1 OR h.next_work_center_no LIKE :nextPattern2)",
    //     {
    //       nextWorkCenters: ["1BRNA", "1HREW", "1SCRA", "1NFFA"],
    //       nextPattern1: "1B%",
    //       nextPattern2: "1HL%",
    //     }
    //   )
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LenovoTypes.RawTransactionQueryHandler.getRepairTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Lenovo, "repair");
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
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  getRawRegistrationTransactions,
  // getRawCleaningTransactions,
  getRawFinalTestTransactions,
  getRawLenovoPackingTransactions,
  getRawRepairTransactions,
};
