/*
SELECT
  wosh.ID AS id,
  MAX(u.Username) AS username,
  MAX(woh.PartNo) AS partNo,
  MAX(woh.SerialNo) AS serialNo,
  MAX(ws.Code) AS workStationDesc,
--  MAX(nws.Code) AS nextWorkStationDesc,
  MAX(wosh.LastActivityDate) AS lastActivityDate,
  MAX(CASE WHEN ROHA.Value = 'REPAIR' THEN ROHA.Value ELSE 'REMAN' END) AS processType,
  UPPER(MAX(PNA.Value)) AS family
FROM pls.WOHeader woh
INNER JOIN pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
INNER JOIN pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
LEFT JOIN pls.CodeWorkStationCustomDescription ws 
       ON ws.CodeWorkStationID = wosh.WorkStationID 
      AND ws.RepairTypeID = woh.RepairTypeID 
      AND ws.ProgramID = woh.ProgramID
--LEFT JOIN pls.CodeWorkStationCustomDescription nws 
--       ON nws.CodeWorkStationID = wosh.ToWorkStationID 
--      AND nws.RepairTypeID = woh.RepairTypeID 
--      AND nws.ProgramID = woh.ProgramID
LEFT JOIN pls.PartSerial PS 
       ON woh.ID = PS.WOHeaderID 
      AND woh.ProgramID = PS.ProgramID
LEFT JOIN pls.ROHeaderAttribute ROHA 
       ON PS.ROHeaderID = ROHA.ROHeaderID 
      AND ROHA.AttributeID = '986'
LEFT JOIN pls.PartNoAttribute PNA 
       ON PNA.PartNo = woh.PartNo 
      AND PNA.AttributeID = '1005'
WHERE woh.ProgramID = '10058'
  AND wosh.Iteration = 1
  AND wosh.LastActivityDate >= '2025-04-20T06:00:00.000Z'
  AND wosh.LastActivityDate < '2025-04-25T06:00:00.000Z'
GROUP BY wosh.ID
*/
import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { EfficiencyService } from "../../services/analytic/efficiency/EfficiencyService";
import { BoseTypes, GenericTypes } from "../../services/transactions/sideControllers/Types";

const getCombinedTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contracts: contractsStringified,
      startOfDay: start,
      endOfDay: end,
      getProcessed: getProcessedStringified,
    } = req.body;
    const contracts: GenericTypes.ProgramContracts[GenericTypes.Program.Bose] =
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

    const opts: GenericTypes.QueryOptions<GenericTypes.Program.Bose> = {
      startOfDay,
      endOfDay,
      contracts,
    };
    transactions.raw = await BoseTypes.RawTransactionQueryHandler.getCombinedTransactions(opts);

    if (getProcessed) {
      const handler = new EfficiencyService.Handler(GenericTypes.Program.Bose, "combined");
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
      message: "Combined transactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Combined transactions:", error);
    return res.status(500).json({
      raw: [],
      processed: [],
      missingCache: [],
      message: "Unknown error occurred. Failed to retrieve Combined transactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getCombinedTransactions };
