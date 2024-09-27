import { Request, Response } from "express";
import { HttpResponseMessage } from "../enums/response";
import { RawTransactions } from "../orm/sideEntity/RawTransactionsEntity";
import { SideDataSources } from "../config/SideDataSources";

const getRawPackingTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = JSON.parse(body.contracts);

    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransactions);

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
      .andWhere("h.datedtz >= :startOfDay AND h.datedtz < :endOfDay")
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
      }, {} as Record<string, RawTransactions>)
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

    startOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransactions);

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
      .andWhere("h.datedtz >= :startOfDay AND h.datedtz < :endOfDay")
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

    startOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setHours(4, 0, 0, 0); // Set to 6 AM in the database's +2
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert these timestamps to ISO date strings for the query
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransactions);

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
      .andWhere("h.datedtz >= :startOfDay AND h.datedtz < :endOfDay")
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

export { getRawPackingTransactions, getRawCosmeticTransactions, getRawOobaTransactions };
