import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { ProdTitanTestRawTransaction } from "../../orm/sideEntity/postgres/ProdTitanTestRawTransactionsEntity";
import { ReptTitanTestRawTransaction } from "../../orm/sideEntity/postgres/ReptTitanTestRawTransactionsEntity";
import { EfficiencyMonthlyService } from "../../services/analytic/efficiencyMothly/EfficiencyMonthlyService";
import { EfficiencyMonthlyTypes } from "../../services/analytic/efficiencyMothly/Types";

// export const manuallySKYByVariant = async (variant: "cosmetic" | "packing" | "ooba") => {
//   let workCenterCondition = "";

//   switch (variant) {
//     case "cosmetic":
//       workCenterCondition = `AND h.workcenter_no = 'A1070'`;
//       break;
//     case "packing":
//       workCenterCondition = `AND h.next_work_center_no = 'A1200'`;
//       break;
//     case "ooba":
//       workCenterCondition = `AND h.workcenter_no = 'OOBA'`;
//       break;
//   }

//   const query = `
//     SELECT
//       h.TRANS_ID AS transaction_id,
//       h.site AS contract,
//       h.order_no AS order_no,
//       h.user_name AS emp_name,
//       h.part_no,
//       so.serial_begin AS serial_no,
//       h.workcenter_no AS work_center_no,
//       h.next_work_center_no AS next_work_center_no,
//       h.action_date AS datedtz
//     FROM info_emrept02.tp_hvt_so_op_hist h
//     JOIN ifsapp_emrept02.shop_ord so
//       ON so.order_no = h.order_no
//       AND so.release_no = '*'
//       AND so.sequence_no = '*'
//     WHERE h.transaction = 'OP FEED'
//       AND h.reversed_flag_db = 'N'
//       AND h.site IN ('12196', '12195', '12176')
//       ${workCenterCondition}
//       AND h.action_date >= TO_DATE('2025-01-01 06:00:00','YYYY-MM-DD HH24:MI:SS')
//       AND h.action_date <  TO_DATE('2025-02-01 06:00:00','YYYY-MM-DD HH24:MI:SS');
//   `;

//   const pool: {
//     client: PoolClient | undefined;
//   } = {
//     client: undefined,
//   };
//   //
//   try {
//     pool.client = await new Pool(postgresPoolOptions).connect();
//     console.time("query");
//     const result = await pool.client.query(query);
//     console.timeEnd("query");

//     console.log("Query completed:", result.rowCount);

//     return {
//       raw: result.rows,
//       message: `Query executed successfully for variant: ${variant}`,
//       statusMessage: "GET_SUCCESS",
//     };
//   } catch (err) {
//     pool.client.release();
//     console.error("Query failed:", err);
//     throw err;
//   } finally {
//     pool.client.release();
//   }
// };

// export const manuallySkyTest = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;

//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const reptRawTransactionsRepo = SideDataSources.postgres.getRepository(
//       ReptTitanTestRawTransaction
//     );

//     const today = new Date();
//     today.setHours(6, 0, 0, 0); // Align with your system start time

//     const reptTransactions = await reptRawTransactionsRepo
//       .createQueryBuilder("ial")
//       .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
//         startOfDay,
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
//       .orderBy("ial.test_date", "ASC")
//       .getMany();

//     return res.status(200).json({
//       raw: reptTransactions,
//       message: "Enhanced RawTransactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Enhanced RawTransactions: ", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Enhanced RawTransactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getRawSkyPackingTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));
    const getProcessed = new Date(JSON.parse(body.getProcessed));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
    };

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    transactions.raw = await rawTransactionsRepo
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
      .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "A1200" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
      })
      .getMany();

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
      const handler = new EfficiencyMonthlyService.PostgresHandler("sky", "packing");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawCosmeticTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));
    const getProcessed = new Date(JSON.parse(body.getProcessed));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
    };

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

    transactions.raw = await rawTransactionsRepo
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
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1070" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("sky", "cosmetic");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawOobaTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));
    const getProcessed = new Date(JSON.parse(body.getProcessed));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const transactions = {
      raw: [],
      processed: [],
    };

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

    transactions.raw = await rawTransactionsRepo
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
      .andWhere("h.work_center_no = :workCenter", { workCenter: "OOBA" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
      })
      .getMany();

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("sky", "ooba");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getRawSkyTestTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;

//     const contracts: string[] = JSON.parse(body.contracts);
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
//         "h.transaction_id AS transaction_id",
//         "h.contract AS contract",
//         "h.order_no AS order_no",
//         "h.part_no AS part_no",
//         "h.work_center_no AS work_center_no",
//         "h.next_work_center_no AS next_work_center_no",
//         "h.datedtz AS datedtz",
//       ])
//       .addSelect(
//         `(SELECT sr.serial_no
//           FROM ifsapp_emrept02.service_request sr
//           WHERE sr.service_request_no =
//             (SELECT wo.wo_no
//              FROM ifsapp_emrept02.work_order_shop_ord wo
//              WHERE wo.order_no = h.order_no LIMIT 1)
//           LIMIT 1)`,
//         "serial_no"
//       )
//       .addSelect(
//         `(SELECT ttr.test_value
//           FROM info_emprod02.titan2_tests_results ttr
//           WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%'
//             AND ttr.serial =
//               (SELECT sr.serial_no
//                FROM ifsapp_emrept02.service_request sr
//                WHERE sr.service_request_no =
//                  (SELECT wo.wo_no
//                   FROM ifsapp_emrept02.work_order_shop_ord wo
//                   WHERE wo.order_no = h.order_no LIMIT 1)
//                LIMIT 1)
//           LIMIT 1)`,
//         "emp_name"
//       )
//       .addSelect(
//         `(SELECT ttr.box_id
//           FROM info_emprod02.titan2_tests_results ttr
//           WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%'
//             AND ttr.serial =
//               (SELECT sr.serial_no
//                FROM ifsapp_emrept02.service_request sr
//                WHERE sr.service_request_no =
//                  (SELECT wo.wo_no
//                   FROM ifsapp_emrept02.work_order_shop_ord wo
//                   WHERE wo.order_no = h.order_no LIMIT 1)
//                LIMIT 1)
//           LIMIT 1)`,
//         "box_id"
//       )
//       .addSelect(
//         `(SELECT ttr.hostname
//           FROM info_emprod02.titan2_tests_results ttr
//           WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%'
//             AND ttr.serial =
//               (SELECT sr.serial_no
//                FROM ifsapp_emrept02.service_request sr
//                WHERE sr.service_request_no =
//                  (SELECT wo.wo_no
//                   FROM ifsapp_emrept02.work_order_shop_ord wo
//                   WHERE wo.order_no = h.order_no LIMIT 1)
//                LIMIT 1)
//           LIMIT 1)`,
//         "hostname"
//       )
//       .where("h.contract IN (:...contracts)", { contracts })
//       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
//       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "A1020" })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
//       .setParameters({
//         startOfDay: startOfDayISO,
//         endOfDay: endOfDayISO,
//       })
//       .getRawMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Enhanced RawTransactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Enhanced RawTransactions: ", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Enhanced RawTransactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getRawSkyTestTransactions2 = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));
    const getProcessed = new Date(JSON.parse(body.getProcessed));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const prodRawTransactionsRepo = SideDataSources.postgres.getRepository(
      ProdTitanTestRawTransaction
    );
    const reptRawTransactionsRepo = SideDataSources.postgres.getRepository(
      ReptTitanTestRawTransaction
    );

    const today = new Date();
    today.setHours(6, 0, 0, 0); // Align with your system start time

    const includesToday = endOfDay > today && startOfDay <= today;

    let reptTransactions = [];
    let prodTransactions = [];

    // Fetch historical data from REPT (excluding today)
    // Fetch today's data from PROD if today's date is within range
    if (includesToday) {
      [reptTransactions, prodTransactions] = await Promise.all([
        reptRawTransactionsRepo
          .createQueryBuilder("ial")
          .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
            startOfDay,
            endOfDay: today, // Fetch until today but not including today
          })
          .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
            testNames: [
              "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
              "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
              "SKYQ::OPERATORSCAN->OPERATORBARCODE",
              "SKYQ::OPERATORSCAN->OPERATORSCAN",
              "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
              "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
            ].map((name) => name.toUpperCase()),
          })
          .andWhere("ial.hostname IN (:...hostnames)", {
            hostnames: [
              "siteserver77",
              "siteserver90",
              "siteserver78",
              "siteserver97",
              "siteserver85",
              "siteserver86",
              "siteserver91",
              "siteserver104",
              "siteserver94",
              "siteserver92",
              "siteserver82",
              "siteserver115",
            ],
          })
          .orderBy("ial.test_date", "ASC")
          .getMany(),
        prodRawTransactionsRepo
          .createQueryBuilder("ial")
          .where("ial.test_date BETWEEN :todayStart AND :endOfDay", {
            todayStart: today, // Fetch from today's start to the specified end date
            endOfDay,
          })
          .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
            testNames: [
              "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
              "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
              "SKYQ::OPERATORSCAN->OPERATORBARCODE",
              "SKYQ::OPERATORSCAN->OPERATORSCAN",
              "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
              "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
            ].map((name) => name.toUpperCase()),
          })
          .andWhere("ial.hostname IN (:...hostnames)", {
            hostnames: [
              "siteserver77",
              "siteserver90",
              "siteserver78",
              "siteserver97",
              "siteserver85",
              "siteserver86",
              "siteserver91",
              "siteserver104",
              "siteserver94",
              "siteserver92",
              "siteserver82",
              "siteserver115",
            ],
          })
          .orderBy("ial.test_date", "ASC")
          .getMany(),
      ]);
    } else {
      // If today is NOT in range, get everything from REPT
      reptTransactions = await reptRawTransactionsRepo
        .createQueryBuilder("ial")
        .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
          startOfDay,
          endOfDay,
        })
        .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
          testNames: [
            "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
            "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
            "SKYQ::OPERATORSCAN->OPERATORBARCODE",
            "SKYQ::OPERATORSCAN->OPERATORSCAN",
            "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
            "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
          ].map((name) => name.toUpperCase()),
        })
        .orderBy("ial.test_date", "ASC")
        .getMany();
    }

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
    };

    // Merge both results
    transactions.raw = normalizeEmpHrids([...reptTransactions, ...prodTransactions]);

    if (getProcessed) {
      const handler = new EfficiencyMonthlyService.PostgresHandler("sky", "test");
      handler.raw = transactions.raw as EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];
      await handler.getAnalyticFiles_2_1();
      handler.getJsObjects_2_2();
      handler.getProcessedData_3();
      transactions.processed = handler.getTable();
    }

    return res.status(200).json({
      raw: transactions.raw,
      processed: transactions.processed,
      message: "Enhanced RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Enhanced RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      message: "Unknown error occurred. Failed to retrieve Enhanced RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  getRawSkyPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
  getRawSkyTestTransactions2,
};

// import { Request, Response } from "express";
// import { HttpResponseMessage } from "../../enums/response";
// import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
// import { SideDataSources } from "../../config/SideDataSources";

// async function fetchRawTransactions(
//   req: Request,
//   res: Response,
//   workCenter: string,
//   nextWorkCenter?: string
// ): Promise<Response> {
//   try {
//     const body = req.body;

//     const contracts: string[] = JSON.parse(body.contracts);
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

//     const rawTransactionsQuery = rawTransactionsRepo
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
//       .andWhere("h.work_center_no = :workCenter", { workCenter })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
//       .setParameters({
//         startOfDay: startOfDay.toISOString(),
//         endOfDay: endOfDay.toISOString(),
//       });

//     // Add the `nextWorkCenter` condition dynamically if provided
//     if (nextWorkCenter) {
//       rawTransactionsQuery.andWhere("h.next_work_center_no = :nextWorkCenter", {
//         nextWorkCenter,
//       });
//     }

//     const rawTransactions = await rawTransactionsQuery.getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "RawTransactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving RawTransactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve RawTransactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// }

// const getRawSkyPackingTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1200");

// const getRawCosmeticTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "A1070");

// const getRawOobaTransactions = (req: Request, res: Response) =>
//   fetchRawTransactions(req, res, "OOBA");

// export { getRawSkyPackingTransactions, getRawCosmeticTransactions, getRawOobaTransactions };
