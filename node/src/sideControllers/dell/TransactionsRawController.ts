/*

BASE QUERY

SELECT
	wosh.ID As id,
    woh.ProgramID AS contract,
    u.Username AS username,  
    woh.PartNo AS partNo,
    woh.SerialNo AS serialNo,
    (
        SELECT TOP 1 cwscd.Code
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.WorkStationID
    ) AS workStationCode,
    (
        SELECT TOP 1 cwscd.Description
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.WorkStationID
    ) AS workStationDesc,
    (
        SELECT TOP 1 cwscd.Code
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.ToWorkStationID
    ) AS nextWorkStationCode,
    (
        SELECT TOP 1 cwscd.Description
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.ToWorkStationID
    ) AS nextWorkStationDesc,
    woh.LastActivityDate AS lastActivityDate
FROM 
    pls.WOHeader AS woh
INNER JOIN 
    pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
INNER JOIN 
    pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
WHERE 
	woh.ProgramID = '10064' -- dell
    and wosh.Iteration = 1

VIEWS

1) 

*/

import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { SideDataSources } from "../../config/SideDataSources";
import { RawDellBoseTransactionDTO } from "../../orm/sideEntity/mssql/RawDellBoseTransactionsEntity";

async function fetchTransactions(
  startOfDay: Date,
  endOfDay: Date,
  workCenter: string,
  nextWorkCenter?: string
) {
  const queryRunner = SideDataSources.mssql.createQueryRunner();

  try {
    const result: RawDellBoseTransactionDTO[] = await queryRunner.query(
      `
    SELECT 
      wosh.ID AS id,
      woh.ProgramID AS contract,
      u.Username AS username,
      woh.PartNo AS partNo,
      woh.SerialNo AS serialNo,
      ws.Description AS workStationDesc,
      nws.Description AS nextWorkStationDesc,
      woh.LastActivityDate AS lastActivityDate
    FROM pls.WOHeader woh
    INNER JOIN pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
    INNER JOIN pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
    LEFT JOIN pls.CodeWorkStation ws ON ws.ID = wosh.WorkStationID
    LEFT JOIN pls.CodeWorkStation nws ON nws.ID = wosh.ToWorkStationID
    WHERE woh.ProgramID = '10064'
      AND wosh.Iteration = 1
      AND woh.LastActivityDate >= @0
      AND woh.LastActivityDate < @1
      AND ws.Description = @2
      ${nextWorkCenter ? "AND nws.Description = @3" : ""}
    `,
      nextWorkCenter
        ? [startOfDay, endOfDay, workCenter, nextWorkCenter]
        : [startOfDay, endOfDay, workCenter]
    );

    return result;
  } finally {
    await queryRunner.release();
  }
}

// Utility function to fetch transactions
const fetchTransactionsForWorkCenter = async (
  req: Request,
  res: Response,
  workCenter: string
): Promise<Response> => {
  try {
    const body = req.body;
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    console.log(startOfDay, endOfDay);

    const rawTransactions = await fetchTransactions(startOfDay, endOfDay, workCenter);
    return res.status(200).json({
      raw: rawTransactions,
      message: `${workCenter} transactions retrieved successfully`,
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error(`Error retrieving ${workCenter} transactions:`, error);
    return res.status(500).json({
      raw: [],
      message: `Unknown error occurred. Failed to retrieve ${workCenter} transactions.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

enum WorkStationMapping {
  VMI = "gTask1",
  WFFA = "gTask0",
  PACK = "gTask8",
  FINALTEST = "gTest1",
  ECOCHECK = "gTask2",
  FCH = "gTask3",
  REPAIRL1L2 = "gTask5",
  SCREENING = "gTest0",
  ECOWORKS = "gTask7",
  OBA = "gTask9",
  REPAIRL3 = "gTask6",
  SCRAP = "Scrap",
  HOLD = "gTask12",
  SHIP = "gTask10",
}

// Handlers for each work center
const getDellVmiTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.VMI);

const getDellWffaTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.WFFA);

const getDellPackTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.PACK);

const getDellFinalTestTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.FINALTEST);

const getDellEcoCheckTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.ECOCHECK);

const getDellFchTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.FCH);

const getDellRepairL1L2Transactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.REPAIRL1L2);

const getDellScreeningTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.SCREENING);

const getDellEcoWorksTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.ECOWORKS);

const getDellObaTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.OBA);

const getDellRepairL3Transactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.REPAIRL3);

const getDellScrapTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.SCRAP);

const getDellHoldTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.HOLD);

const getDellShipTransactions = (req: Request, res: Response) =>
  fetchTransactionsForWorkCenter(req, res, WorkStationMapping.SHIP);

// Export all handlers
export {
  getDellVmiTransactions,
  getDellWffaTransactions,
  getDellPackTransactions,
  getDellFinalTestTransactions,
  getDellEcoCheckTransactions,
  getDellFchTransactions,
  getDellRepairL1L2Transactions,
  getDellScreeningTransactions,
  getDellEcoWorksTransactions,
  getDellObaTransactions,
  getDellRepairL3Transactions,
  getDellScrapTransactions,
  getDellHoldTransactions,
  getDellShipTransactions,
};
