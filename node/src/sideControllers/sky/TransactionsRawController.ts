import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { TitanTestRawTransaction } from "../../orm/sideEntity/postgres/TitanTestRawTransactionsEntity";
import { Between, In, LessThan, MoreThanOrEqual } from "typeorm";

const getRawSkyPackingTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);
    const rawTransactions = await rawTransactionsRepo
      .createQueryBuilder("h")
      .select([
        "h.transaction_id",
        "h.contract",
        "h.order_no",
        "h.emp_name",
        "h.part_no",
        "h.work_center_no",
        "h.next_work_center_no",
        "h.datedtz",
      ])
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "A1200" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDayISO,
        endOfDay: endOfDayISO,
      })
      .getMany();

    const latestOfOrderRawTransactions = Object.values(
      rawTransactions.reduce((acc, transaction) => {
        // Keep only the latest transaction per order_no
        if (
          !acc[transaction.order_no] ||
          new Date(transaction.datedtz) > new Date(acc[transaction.order_no].datedtz)
        ) {
          acc[transaction.order_no] = transaction;
        }
        return acc;
      }, {} as Record<string, RawTransaction>)
    );

    return res.status(200).json({
      raw: latestOfOrderRawTransactions,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
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

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

    const rawTransactions = await rawTransactionsRepo
      .createQueryBuilder("h")
      .select([
        "h.transaction_id",
        "h.contract",
        "h.order_no",
        "h.emp_name",
        "h.part_no",
        "h.work_center_no",
        "h.next_work_center_no",
        "h.datedtz",
      ])
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1070" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDayISO,
        endOfDay: endOfDayISO,
      })
      .getMany();

    return res.status(200).json({
      raw: rawTransactions,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
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

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

    const rawTransactions = await rawTransactionsRepo
      .createQueryBuilder("h")
      .select([
        "h.transaction_id",
        "h.contract",
        "h.order_no",
        "h.emp_name",
        "h.part_no",
        "h.work_center_no",
        "h.next_work_center_no",
        "h.datedtz",
      ])
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "OOBA" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDayISO,
        endOfDay: endOfDayISO,
      })
      .getMany();

    return res.status(200).json({
      raw: rawTransactions,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawSkyTestTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

    const rawTransactions = await rawTransactionsRepo
      .createQueryBuilder("h")
      .select([
        "h.transaction_id AS transaction_id",
        "h.contract AS contract",
        "h.order_no AS order_no",
        "h.part_no AS part_no",
        "h.work_center_no AS work_center_no",
        "h.next_work_center_no AS next_work_center_no",
        "h.datedtz AS datedtz",
      ])
      .addSelect(
        `(SELECT sr.serial_no 
          FROM ifsapp_emrept02.service_request sr 
          WHERE sr.service_request_no = 
            (SELECT wo.wo_no 
             FROM ifsapp_emrept02.work_order_shop_ord wo 
             WHERE wo.order_no = h.order_no LIMIT 1) 
          LIMIT 1)`,
        "serial_no"
      )
      .addSelect(
        `(SELECT ttr.test_value 
          FROM info_emprod02.titan2_tests_results ttr 
          WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%' 
            AND ttr.serial = 
              (SELECT sr.serial_no 
               FROM ifsapp_emrept02.service_request sr 
               WHERE sr.service_request_no = 
                 (SELECT wo.wo_no 
                  FROM ifsapp_emrept02.work_order_shop_ord wo 
                  WHERE wo.order_no = h.order_no LIMIT 1) 
               LIMIT 1) 
          LIMIT 1)`,
        "emp_name"
      )
      .addSelect(
        `(SELECT ttr.box_id 
          FROM info_emprod02.titan2_tests_results ttr 
          WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%' 
            AND ttr.serial = 
              (SELECT sr.serial_no 
               FROM ifsapp_emrept02.service_request sr 
               WHERE sr.service_request_no = 
                 (SELECT wo.wo_no 
                  FROM ifsapp_emrept02.work_order_shop_ord wo 
                  WHERE wo.order_no = h.order_no LIMIT 1) 
               LIMIT 1) 
          LIMIT 1)`,
        "box_id"
      )
      .addSelect(
        `(SELECT ttr.hostname 
          FROM info_emprod02.titan2_tests_results ttr 
          WHERE ttr.test_name LIKE 'SkyQ::OperatorScan%' 
            AND ttr.serial = 
              (SELECT sr.serial_no 
               FROM ifsapp_emrept02.service_request sr 
               WHERE sr.service_request_no = 
                 (SELECT wo.wo_no 
                  FROM ifsapp_emrept02.work_order_shop_ord wo 
                  WHERE wo.order_no = h.order_no LIMIT 1) 
               LIMIT 1) 
          LIMIT 1)`,
        "hostname"
      )
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.work_center_no = :workCenter", { workCenter: "A1020" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
      .setParameters({
        startOfDay: startOfDayISO,
        endOfDay: endOfDayISO,
      })
      .getRawMany();

    return res.status(200).json({
      raw: rawTransactions,
      message: "Enhanced RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Enhanced RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
      message: "Unknown error occurred. Failed to retrieve Enhanced RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRawSkyTestTransactions2 = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // const startOfDayISO = startOfDay.toISOString();
    // const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(TitanTestRawTransaction);

    // const rawTransactions = await rawTransactionsRepo.find({
    //   where: {
    //     test_date: Between(startOfDay, endOfDay),
    //     test_name: In([
    //       "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
    //       "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
    //       "SKYQ::OPERATORSCAN->OPERATORBARCODE",
    //       "SKYQ::OPERATORSCAN->OPERATORSCAN",
    //       "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
    //       "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
    //     ]),
    //   },
    //   order: {
    //     test_date: "ASC",
    //   },
    // });
    const rawTransactions = await rawTransactionsRepo
      .createQueryBuilder("ial")
      .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
        startOfDay,
        endOfDay,
      })
      .andWhere(
        "UPPER(ial.test_name) IN (:...testNames)", // Apply UPPER to test_name
        {
          testNames: [
            "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
            "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
            "SKYQ::OPERATORSCAN->OPERATORBARCODE",
            "SKYQ::OPERATORSCAN->OPERATORSCAN",
            "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
            "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
          ].map((name) => name.toUpperCase()), // Convert values to uppercase
        }
      )
      .orderBy("ial.test_date", "ASC")
      .getMany();

    return res.status(200).json({
      raw: rawTransactions,
      message: "Enhanced RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Enhanced RawTransactions: ", error);
    return res.status(500).json({
      raw: [],
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
