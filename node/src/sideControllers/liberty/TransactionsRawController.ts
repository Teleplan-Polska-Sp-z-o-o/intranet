import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { EfficiencyService } from "../../services/analytic/efficiency/EfficiencyService";
import { GenericTypes, LibertyTypes } from "../../services/transactions/sideControllers/Types";

/*
 *   VMI
 * from work_center_no A1010
 *
 *   TEST
 * from work_center_no A1020
 *
 *   DEBUG / REPAIR
 * from work_center_no A1030
 *
 *   COSM
 * from work_center_no like A107*
 *
 *   HIGH-POT
 * from work_center_no A1080
 *
 *   PACK
 * from work_center_no A1090
 *
 *   SHIP
 * from work_center_no A1200
 *
 *   OOBA
 * from work_center_no AOBA
 *
 */

const getRawVmiTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "A1010" }) // VMI
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getVmiTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Liberty, "vmi");
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
      message: "RawTransactions for VMI retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for VMI: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for VMI.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "A1020" }) // TEST
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getTestTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Liberty, "test");
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
      message: "RawTransactions for TEST retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for TEST: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for TEST.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawDebugRepairTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    // const start = new Date(JSON.parse(startOfDay));
    // const end = new Date(JSON.parse(endOfDay));
    // start.setHours(6, 0, 0, 0);
    // end.setHours(6, 0, 0, 0);
    // end.setDate(end.getDate() + 1);

    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "A1030" }) // DEBUG / REPAIR
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getDebugRepairTransactions(
      opts
    );
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Liberty,
        "debugrepair"
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
      message: "RawTransactions for DEBUG / REPAIR retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for DEBUG / REPAIR: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for DEBUG / REPAIR.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawCosmTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    // const start = new Date(JSON.parse(startOfDay));
    // const end = new Date(JSON.parse(endOfDay));
    // start.setHours(6, 0, 0, 0);
    // end.setHours(6, 0, 0, 0);
    // end.setDate(end.getDate() + 1);

    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.part_no != :excludedPartNo", { excludedPartNo: "CGA6444VF" })
    //   .andWhere("h.work_center_no LIKE :workCenter", { workCenter: "A107%" }) // COSM
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getCosmeticTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Liberty,
        "cosmetic"
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
      message: "RawTransactions for COSM retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for COSM: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for COSM.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawHighPotTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    // const start = new Date(JSON.parse(startOfDay));
    // const end = new Date(JSON.parse(endOfDay));
    // start.setHours(6, 0, 0, 0);
    // end.setHours(6, 0, 0, 0);
    // end.setDate(end.getDate() + 1);

    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "A1080" }) // HIGH-POT
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getHighPotTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(
        GenericTypes.Program.Liberty,
        "highpot"
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
      message: "RawTransactions for HIGH-POT retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for HIGH-POT: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for HIGH-POT.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawPackTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    // const start = new Date(JSON.parse(startOfDay));
    // const end = new Date(JSON.parse(endOfDay));
    // start.setHours(6, 0, 0, 0);
    // end.setHours(6, 0, 0, 0);
    // end.setDate(end.getDate() + 1);

    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "A1200" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getPackTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Liberty, "pack");
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
      message: "RawTransactions for PACK retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for PACK: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for PACK.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getRawShipTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
//     const start = new Date(JSON.parse(startOfDay));
//     const end = new Date(JSON.parse(endOfDay));
//     start.setHours(6, 0, 0, 0);
//     end.setHours(6, 0, 0, 0);
//     end.setDate(end.getDate() + 1);

//     const transactions = {
//       raw: [],
//       processed: [],
//     };

//     transactions.raw = await SideDataSources.postgres
//       .getRepository(RawTransaction)
//       .createQueryBuilder("h")
//       .select([
//         "h.transaction_id",
//         "h.contract",
//         "h.order_no",
//         "h.emp_name",
//         "h.part_no",
//         "h.work_center_no",
//         "h.next_work_center_no",
//         "h.dated",
//       ])
//       .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "A1200" }) // SHIP
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
//         startOfDay: start.toISOString(),
//         endOfDay: end.toISOString(),
//       })
//       .getMany();

//     if (getProcessed) {
//       const handler = new EfficiencyMonthlyService.PostgresHandler(GenericTypes.Program.Liberty, "ship");
//       handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
//       await handler.getAnalyticFiles_2_1();
//       handler.getJsObjects_2_2();
//       handler.getProcessedData_3();
//       transactions.processed = handler.getProcessed();
//     }

//     return res.status(200).json({
//       raw: transactions.raw,
//       processed: transactions.processed,
//       message: "RawTransactions for SHIP retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving RawTransactions for SHIP: ", error);
//     return res.status(500).json({
//       raw: [],
//       processed: [],
//       message: "Unknown error occurred. Failed to retrieve RawTransactions for SHIP.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getRawOobaTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    // const start = new Date(JSON.parse(startOfDay));
    // const end = new Date(JSON.parse(endOfDay));
    // start.setHours(6, 0, 0, 0);
    // end.setHours(6, 0, 0, 0);
    // end.setDate(end.getDate() + 1);
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Liberty] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "AOBA" }) // OOBA
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Liberty> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await LibertyTypes.RawTransactionQueryHandler.getOobaTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Liberty, "ooba");
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
      message: "RawTransactions for OOBA retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for OOBA: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for OOBA.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  getRawVmiTransactions,
  getRawTestTransactions,
  getRawDebugRepairTransactions,
  getRawCosmTransactions,
  getRawHighPotTransactions,
  getRawPackTransactions,
  // getRawShipTransactions,
  getRawOobaTransactions,
};
