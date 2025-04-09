import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { Brackets } from "typeorm";
import { EfficiencyMonthlyService } from "../../services/analytic/efficiencyMothly/EfficiencyMonthlyService";
import { EfficiencyMonthlyTypes } from "../../services/analytic/efficiencyMothly/Types";

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
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1010" }) // VMI
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "vmi");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for VMI retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for VMI: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for VMI.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1020" }) // TEST
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "test");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for TEST retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for TEST: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for TEST.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawDebugRepairTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1030" }) // DEBUG / REPAIR
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "debugrepair");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for DEBUG / REPAIR retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for DEBUG / REPAIR: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for DEBUG / REPAIR.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawCosmTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.part_no != :excludedPartNo", { excludedPartNo: "CGA6444VF" })
      .andWhere("h.work_center_no LIKE :workCenter", { workCenter: "A107%" }) // COSM
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "cosmetic");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for COSM retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for COSM: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for COSM.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawHighPotTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1080" }) // HIGH-POT
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "highpot");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for HIGH-POT retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for HIGH-POT: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for HIGH-POT.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawPackTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      // .andWhere(
      //   new Brackets((qb) => {
      //     qb.where("h.work_center_no = :workCenter1 AND h.part_no != :excludedPart", {
      //       workCenter1: "A1090",
      //       excludedPart: "DECO M4",
      //     }).orWhere("h.work_center_no IN (:...otherWorkCenters) AND h.part_no = :includedPart", {
      //       otherWorkCenters: ["A1095", "A1096", "A1097"],
      //       includedPart: "DECO M4",
      //     });
      //   })
      // )
      .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "A1200" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "pack");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for PACK retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for PACK: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for PACK.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawShipTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1200" }) // SHIP
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "ship");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for SHIP retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for SHIP: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions for SHIP.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawOobaTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contracts, startOfDay, endOfDay, getProcessed } = req.body;
    const start = new Date(JSON.parse(startOfDay));
    const end = new Date(JSON.parse(endOfDay));
    start.setHours(6, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
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
      .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "AOBA" }) // OOBA
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: start.toISOString(),
        endOfDay: end.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("liberty", "ooba");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions for OOBA retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions for OOBA: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
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
  getRawShipTransactions,
  getRawOobaTransactions,
};

// import { Request, Response } from "express";
// import { HttpResponseMessage } from "../../enums/response";
// import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
// import { SideDataSources } from "../../config/SideDataSources";
// import { Brackets } from "typeorm";

// async function fetchRawTransactions(
//   req: Request,
//   res: Response,
//   workCenter: string,
//   options?: {
//     likeWorkCenter?: boolean; // If true, use `LIKE` in the query
//     partNoConditions?: Brackets; // Optional part number conditions
//   }
// ): Promise<Response> {
//   try {
//     const { contracts, startOfDay, endOfDay } = req.body;

//     const start = new Date(JSON.parse(startOfDay));
//     const end = new Date(JSON.parse(endOfDay));
//     start.setHours(6, 0, 0, 0);
//     end.setHours(6, 0, 0, 0);
//     end.setDate(end.getDate() + 1);

//     const query = SideDataSources.postgres
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
//         "h.datedtz",
//       ])
//       .where("h.contract IN (:...contracts)", { contracts: JSON.parse(contracts) })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere(
//         options?.likeWorkCenter
//           ? "h.work_center_no LIKE :workCenter"
//           : "h.work_center_no = :workCenter",
//         { workCenter }
//       )
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
//         startOfDay: start.toISOString(),
//         endOfDay: end.toISOString(),
//       });

//     // Add optional part number conditions
//     if (options?.partNoConditions) {
//       query.andWhere(options.partNoConditions);
//     }

//     const rawTransactions = await query.getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: `RawTransactions for ${workCenter} retrieved successfully`,
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error(`Error retrieving RawTransactions for ${workCenter}: `, error);
//     return res.status(500).json({
//       raw: [],
//       message: `Unknown error occurred. Failed to retrieve RawTransactions for ${workCenter}.`,
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// }

// const getRawVmiTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1010");

// const getRawTestTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1020");

// const getRawDebugRepairTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1030");

// const getRawCosmTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A107%", { likeWorkCenter: true });

// const getRawHighPotTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1080");

// const getRawPackTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1090", {
//     partNoConditions: new Brackets((qb) => {
//       qb.where("h.part_no != :excludedPart", { excludedPart: "DECO M4" }).orWhere(
//         "h.work_center_no IN (:...otherWorkCenters) AND h.part_no = :includedPart",
//         {
//           otherWorkCenters: ["A1095", "A1096", "A1097"],
//           includedPart: "DECO M4",
//         }
//       );
//     }),
//   });

// const getRawShipTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1200");

// const getRawOobaTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "AOBA");

// export {
//   getRawVmiTransactions,
//   getRawTestTransactions,
//   getRawDebugRepairTransactions,
//   getRawCosmTransactions,
//   getRawHighPotTransactions,
//   getRawPackTransactions,
//   getRawShipTransactions,
//   getRawOobaTransactions,
// };
