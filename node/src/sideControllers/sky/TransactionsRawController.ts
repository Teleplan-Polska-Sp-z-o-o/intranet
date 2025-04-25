import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { ProdTitanTestRawTransaction } from "../../orm/sideEntity/postgres/ProdTitanTestRawTransactionsEntity";
import { ReptTitanTestRawTransaction } from "../../orm/sideEntity/postgres/ReptTitanTestRawTransactionsEntity";
import { EfficiencyService } from "../../services/analytic/efficiency/EfficiencyService";
import { GenericTypes, SkyTypes } from "../../services/transactions/sideControllers/Types";

const getRawSkyPackingTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Sky] =
      JSON.parse(contractsStringified);
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    const transactions: GenericTypes.Transactions<RawTransaction> = {
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
    //   .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "A1200" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Sky> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await SkyTypes.RawTransactionQueryHandler.getPackingTransactions(opts);
    /// new ///

    transactions.raw = Object.values(
      transactions.raw.reduce((acc, transaction) => {
        // Keep only the latest transaction per order_no
        if (
          !acc[transaction.order_no] ||
          new Date(transaction.dated) > new Date(acc[transaction.order_no].dated)
        ) {
          acc[transaction.order_no] = transaction;
        }
        return acc;
      }, {} as Record<string, RawTransaction>)
    );

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Sky, "packing");
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

const getRawCosmeticTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Sky] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "A1070" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Sky> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await SkyTypes.RawTransactionQueryHandler.getCosmeticTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Sky, "cosmetic");
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

const getRawOobaTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Sky] =
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
    //   .andWhere("h.work_center_no = :workCenter", { workCenter: "OOBA" })
    //   .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
    //   .setParameters({
    //     startOfDay: startOfDay.toISOString(),
    //     endOfDay: endOfDay.toISOString(),
    //   })
    //   .getMany();
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Sky> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await SkyTypes.RawTransactionQueryHandler.getOobaTransactions(opts);
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Sky, "ooba");
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

const getRawSkyTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { startOfDay: start, endOfDay: end, getProcessed: getProcessedStringified } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Sky] = JSON.parse("[]");
    const startOfDay: Date = new Date(JSON.parse(start));
    const endOfDay: Date = new Date(JSON.parse(end));
    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const getProcessed: boolean = getProcessedStringified === "true";

    /// old ///
    // const prodRawTransactionsRepo = SideDataSources.postgres.getRepository(
    //   ProdTitanTestRawTransaction
    // );
    // const reptRawTransactionsRepo = SideDataSources.postgres.getRepository(
    //   ReptTitanTestRawTransaction
    // );

    // const today = new Date();
    // today.setHours(6, 0, 0, 0);
    // const includesToday = endOfDay > today && startOfDay <= today;

    // let reptTransactions = [];
    // let prodTransactions = [];

    // if (includesToday) {
    //   [reptTransactions, prodTransactions] = await Promise.all([
    //     reptRawTransactionsRepo
    //       .createQueryBuilder("ial")
    //       .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
    //         startOfDay,
    //         endOfDay: today, // Fetch until today but not including today
    //       })
    //       .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
    //         testNames: [
    //           "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYQ::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYQ::OPERATORSCAN->OPERATORSCAN",
    //           "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
    //           "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
    //         ].map((name) => name.toUpperCase()),
    //       })
    //       .andWhere("ial.hostname IN (:...hostnames)", {
    //         hostnames: [
    //           "siteserver77",
    //           "siteserver90",
    //           "siteserver78",
    //           "siteserver97",
    //           "siteserver85",
    //           "siteserver86",
    //           "siteserver91",
    //           "siteserver104",
    //           "siteserver94",
    //           "siteserver92",
    //           "siteserver82",
    //           "siteserver115",
    //         ],
    //       })
    //       .orderBy("ial.test_date", "ASC")
    //       .getMany(),
    //     prodRawTransactionsRepo
    //       .createQueryBuilder("ial")
    //       .where("ial.test_date BETWEEN :todayStart AND :endOfDay", {
    //         todayStart: today, // Fetch from today's start to the specified end date
    //         endOfDay,
    //       })
    //       .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
    //         testNames: [
    //           "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYQ::OPERATORSCAN->OPERATORBARCODE",
    //           "SKYQ::OPERATORSCAN->OPERATORSCAN",
    //           "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
    //           "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
    //         ].map((name) => name.toUpperCase()),
    //       })
    //       .andWhere("ial.hostname IN (:...hostnames)", {
    //         hostnames: [
    //           "siteserver77",
    //           "siteserver90",
    //           "siteserver78",
    //           "siteserver97",
    //           "siteserver85",
    //           "siteserver86",
    //           "siteserver91",
    //           "siteserver104",
    //           "siteserver94",
    //           "siteserver92",
    //           "siteserver82",
    //           "siteserver115",
    //         ],
    //       })
    //       .orderBy("ial.test_date", "ASC")
    //       .getMany(),
    //   ]);
    // } else {
    //   // If today is NOT in range, get everything from REPT
    //   reptTransactions = await reptRawTransactionsRepo
    //     .createQueryBuilder("ial")
    //     .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
    //       startOfDay,
    //       endOfDay,
    //     })
    //     .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
    //       testNames: [
    //         "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
    //         "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
    //         "SKYQ::OPERATORSCAN->OPERATORBARCODE",
    //         "SKYQ::OPERATORSCAN->OPERATORSCAN",
    //         "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
    //         "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
    //       ].map((name) => name.toUpperCase()),
    //     })
    //     .orderBy("ial.test_date", "ASC")
    //     .getMany();
    // }
    /// old ///

    const normalizeEmpHrid = (hrid: string): string => {
      return hrid.toString().padStart(8, "0");
    };

    const normalizeEmpHrids = (
      transactions: ProdTitanTestRawTransaction[]
    ): ProdTitanTestRawTransaction[] =>
      transactions.map((t) => ({
        ...t,
        emp_hrid: normalizeEmpHrid(t.emp_hrid),
      }));

    const transactions = {
      raw: [],
      processed: [],
      missingCache: [],
    };

    // Merge both results
    /// old ///
    // transactions.raw = normalizeEmpHrids([...reptTransactions, ...prodTransactions]);
    /// old ///

    /// new ///
    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Sky> = {
      startOfDay,
      endOfDay,
      contracts,
    };

    transactions.raw = normalizeEmpHrids(
      await SkyTypes.TestRawTransactionHandler.getTestTransactions(opts)
    );
    /// new ///

    if (getProcessed) {
      const handler = new EfficiencyService.PostgresHandler(GenericTypes.Program.Sky, "test");
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
      message: "Enhanced RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Enhanced RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Enhanced RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  getRawSkyPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
  getRawSkyTestTransactions,
};
