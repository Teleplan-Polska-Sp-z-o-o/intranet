import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";

const getRawRepairTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;

    const contracts: string[] = ["12194"]; //JSON.parse(body.contracts);

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

export { getRawRepairTransactions };
