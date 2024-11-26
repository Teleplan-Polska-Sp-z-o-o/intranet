// import { Request, Response } from "express";
// import { HttpResponseMessage } from "../../enums/response";
// import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
// import { SideDataSources } from "../../config/SideDataSources";
// import { Brackets } from "typeorm";

// // const getRawRepairTransactions = async (req: Request, res: Response): Promise<Response> => {
// //   try {
// //     const body = req.body;

// //     const contracts: string[] = ["12194"]; //JSON.parse(body.contracts);

// //     const startOfDay = new Date(JSON.parse(body.startOfDay));
// //     const endOfDay = new Date(JSON.parse(body.endOfDay));

// //     startOfDay.setHours(6, 0, 0, 0);
// //     endOfDay.setHours(6, 0, 0, 0);
// //     endOfDay.setDate(endOfDay.getDate() + 1);

// //     // Convert these timestamps to ISO date strings for the query
// //     const startOfDayISO = startOfDay.toISOString();
// //     const endOfDayISO = endOfDay.toISOString();

// //     const rawTransactionsRepo = SideDataSources.postgres.getRepository(RawTransaction);

// //     const rawTransactions = await rawTransactionsRepo
// //       .createQueryBuilder("h")
// //       .select([
// //         "h.transaction_id",
// //         "h.contract",
// //         "h.order_no",
// //         "h.emp_name",
// //         "h.part_no",
// //         "h.work_center_no",
// //         "h.next_work_center_no",
// //         "h.datedtz",
// //       ])
// //       .where("h.contract IN (:...contracts)", { contracts })
// //       .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
// //       .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
// //       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
// //       .setParameters({
// //         startOfDay: startOfDayISO,
// //         endOfDay: endOfDayISO,
// //       })
// //       .getMany();

// //     return res.status(200).json({
// //       raw: rawTransactions,
// //       message: "RawTransactions retrieved successfully",
// //       statusMessage: HttpResponseMessage.GET_SUCCESS,
// //     });
// //   } catch (error) {
// //     console.error("Error retrieving RawTransactions: ", error);
// //     return res.status(500).json({
// //       raw: [],
// //       message: "Unknown error occurred. Failed to retrieve RawTransactions.",
// //       statusMessage: HttpResponseMessage.UNKNOWN,
// //     });
// //   }
// // };

// // registration
// // ---

// // vmi
// // z vmi na scrn

// // screening
// // z scrn

// // win test
// // z wint

// // repair
// /// lvl 2 z repB
// // na wfnta (data) a potem na fnta -> (activ / fdone -> activ) => pass
// // na chld% (data) => hold
// // na cri => cust rel issues
// /// lvl 3 z repC%
// // na wfnta (data) a potem na fnta -> (activ / fdone -> activ) => pass
// // na chld% (data) => hold
// // na cri => cust rel issues

// /// dodatkowo hold cri pass | eff z passów

// // final test
// // z fnta

// // activation
// // and h.work_center_no IN ('ACTOK','FRES')
// // and h.next_work_center_no in ('CLNA','QCFR','LCAPP','LCAFR')

// // customization
// // and h.work_center_no IN ('LCAPP','LCAFR')
// //       and h.next_work_center_no in ('CLNA','QCFR','KEYIN','KEYFR')

// // KEYINJECTION:
// // and h.work_center_no IN ('KEYIN','KEYFR')
// //       and h.next_work_center_no in ('CLNA','QCFR')

// // fgi
// // and (h.work_center_no not in ('ENGH1','ENGH2','AOBA','ENGH','QCHCK','KEYIN','ACTIV','ACTOK','LCAPP','PCKA','CLNA'))
// //       and h.next_work_center_no in ('RDYA','BER','UNREP','UNRFR')

// // export { getRawRepairTransactions };

// // VMI Transactions
// const getVmiTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "VMI" })
//       .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "SCRN" })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "VMI transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving VMI transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve VMI transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Screening Transactions
// const getScreeningTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "SCRN" })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Screening transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Screening transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Screening transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Win Test Transactions
// const getWinTestTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "WINT" })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Win Test transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Win Test transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Win Test transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Final Test Transactions
// const getFinalTestTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no = :workCenter", { workCenter: "FNTA" })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Final Test transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Final Test transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Final Test transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Activation Transactions
// const getActivationTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["ACTOK", "FRES"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR", "LCAPP", "LCAFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Activation transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Activation transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Activation transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Customization Transactions
// const getCustomizationTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["LCAPP", "LCAFR"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR", "KEYIN", "KEYFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Customization transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Customization transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Customization transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // Key Injection Transactions
// const getKeyInjectionTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no IN (:...workCenters)", { workCenters: ["KEYIN", "KEYFR"] })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["CLNA", "QCFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Key Injection transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Key Injection transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Key Injection transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// // FGI Transactions
// const getFgiTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.work_center_no NOT IN (:...excludedWorkCenters)", {
//         excludedWorkCenters: [
//           "ENGH1",
//           "ENGH2",
//           "AOBA",
//           "ENGH",
//           "QCHCK",
//           "KEYIN",
//           "ACTIV",
//           "ACTOK",
//           "LCAPP",
//           "PCKA",
//           "CLNA",
//         ],
//       })
//       .andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
//         nextWorkCenters: ["RDYA", "BER", "UNREP", "UNRFR"],
//       })
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "FGI transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving FGI transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve FGI transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// const getRepair2Transactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .andWhere("h.work_center_no = :repb", { repb: "REPB" })
//       .andWhere(
//         new Brackets((qb) => {
//           qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
//             nextWorkCenters: ["WFNTA", "CRI"],
//           }).orWhere("h.next_work_center_no LIKE :childPattern", { childPattern: "CHLD%" });
//         })
//       )
//       // .andWhere(
//       //   `EXISTS (
//       //     SELECT 1
//       //     FROM public.operation_history h2
//       //     WHERE h2.order_no = h.order_no
//       //       AND h2.operation_no > h.operation_no
//       //       AND h2.work_center_no = 'FNTA'
//       //       AND (
//       //         EXISTS (
//       //           -- Directly from FNTA to ACTIV
//       //           SELECT 1
//       //           FROM public.operation_history h3
//       //           WHERE h3.order_no = h.order_no
//       //             AND h3.operation_no > h2.operation_no
//       //             AND h3.work_center_no = 'ACTIV'
//       //         )
//       //         OR EXISTS (
//       //           -- FNTA to FDONE, then to ACTIV
//       //           SELECT 1
//       //           FROM public.operation_history h3
//       //           WHERE h3.order_no = h.order_no
//       //             AND h3.operation_no > h2.operation_no
//       //             AND h3.work_center_no = 'FDONE'
//       //             AND EXISTS (
//       //                 SELECT 1
//       //                 FROM public.operation_history h4
//       //                 WHERE h4.order_no = h.order_no
//       //                   AND h4.operation_no > h3.operation_no
//       //                   AND h4.work_center_no = 'ACTIV'
//       //             )
//       //         )
//       //       )
//       //   )`
//       // )
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Repair2 transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Repair2 transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Repair2 transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// const getRepair3Transactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const body = req.body;
//     const contracts: string[] = ["12194"];
//     const startOfDay = new Date(JSON.parse(body.startOfDay));
//     const endOfDay = new Date(JSON.parse(body.endOfDay));

//     startOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setHours(6, 0, 0, 0);
//     endOfDay.setDate(endOfDay.getDate() + 1);

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
//       .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", { startOfDay, endOfDay })
//       .andWhere("h.work_center_no LIKE :workcenterPattern", { workcenterPattern: "REPC%" })
//       .andWhere(
//         new Brackets((qb) => {
//           qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
//             nextWorkCenters: ["WFNTA", "CRI"],
//           }).orWhere("h.next_work_center_no LIKE :nextWorkcenterPattern", {
//             nextWorkcenterPattern: "CHLD%",
//           });
//         })
//       )
//       .getMany();

//     return res.status(200).json({
//       raw: rawTransactions,
//       message: "Repair2 transactions retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving Repair2 transactions:", error);
//     return res.status(500).json({
//       raw: [],
//       message: "Unknown error occurred. Failed to retrieve Repair2 transactions.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// export {
//   getVmiTransactions,
//   getScreeningTransactions,
//   getWinTestTransactions,
//   getFinalTestTransactions,
//   getActivationTransactions,
//   getCustomizationTransactions,
//   getKeyInjectionTransactions,
//   getFgiTransactions,
//   getRepair2Transactions,
//   getRepair3Transactions,
// };

import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../config/SideDataSources";
import { Brackets } from "typeorm";

async function fetchRawTransactions(
  req: Request,
  res: Response,
  options: {
    workCenter?: string | string[];
    likeWorkCenter?: boolean;
    nextWorkCenters?: string[];
    excludedWorkCenters?: string[];
    additionalConditions?: Brackets | string;
  }
): Promise<Response> {
  try {
    const body = req.body;
    const contracts: string[] = ["12194"];
    const startOfDay = new Date(JSON.parse(body.startOfDay));
    const endOfDay = new Date(JSON.parse(body.endOfDay));

    startOfDay.setHours(6, 0, 0, 0);
    endOfDay.setHours(6, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    const query = SideDataSources.postgres
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
        "h.datedtz",
      ])
      .where("h.contract IN (:...contracts)", { contracts })
      .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
      .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
      .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
        startOfDay: startOfDayISO,
        endOfDay: endOfDayISO,
      });

    if (options.workCenter) {
      if (Array.isArray(options.workCenter)) {
        // Handle array of work centers
        query.andWhere("h.work_center_no IN (:...workCenters)", {
          workCenters: options.workCenter,
        });
      } else if (options.likeWorkCenter) {
        // Handle LIKE condition for a single work center
        query.andWhere("h.work_center_no LIKE :workCenter", {
          workCenter: options.workCenter,
        });
      } else {
        // Handle a single work center
        query.andWhere("h.work_center_no = :workCenter", {
          workCenter: options.workCenter,
        });
      }
    }

    if (options.nextWorkCenters) {
      query.andWhere("h.next_work_center_no IN (:...nextWorkCenters)", {
        nextWorkCenters: options.nextWorkCenters,
      });
    }

    if (options.excludedWorkCenters) {
      query.andWhere("h.work_center_no NOT IN (:...excludedWorkCenters)", {
        excludedWorkCenters: options.excludedWorkCenters,
      });
    }

    if (options.additionalConditions) {
      query.andWhere(options.additionalConditions);
    }

    const rawTransactions = await query.getMany();

    return res.status(200).json({
      raw: rawTransactions,
      message: "RawTransactions retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving RawTransactions:", error);
    return res.status(500).json({
      raw: [],
      message: "Unknown error occurred. Failed to retrieve RawTransactions.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
}

const getVmiTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: "VMI",
    nextWorkCenters: ["SCRN"],
  });

const getScreeningTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: "SCRN",
  });

const getWinTestTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: "WINT",
  });

const getFinalTestTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: "FNTA",
  });

const getActivationTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: ["ACTOK", "FRES"],
    nextWorkCenters: ["CLNA", "QCFR", "LCAPP", "LCAFR"],
  });

const getCustomizationTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: ["LCAPP", "LCAFR"],
    nextWorkCenters: ["CLNA", "QCFR", "KEYIN", "KEYFR"],
  });

const getKeyInjectionTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: ["KEYIN", "KEYFR"],
    nextWorkCenters: ["CLNA", "QCFR"],
  });

const getFgiTransactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    excludedWorkCenters: [
      "ENGH1",
      "ENGH2",
      "AOBA",
      "ENGH",
      "QCHCK",
      "KEYIN",
      "ACTIV",
      "ACTOK",
      "LCAPP",
      "PCKA",
      "CLNA",
    ],
    nextWorkCenters: ["RDYA", "BER", "UNREP", "UNRFR"],
  });

const getRepair2Transactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    workCenter: "REPB",
    additionalConditions: new Brackets((qb) => {
      qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
        nextWorkCenters: ["WFNTA", "CRI"],
      }).orWhere("h.next_work_center_no LIKE :childPattern", {
        childPattern: "CHLD%",
      });
    }),
  });

const getRepair3Transactions = (req: Request, res: Response) =>
  fetchRawTransactions(req, res, {
    likeWorkCenter: true,
    workCenter: "REPC%",
    additionalConditions: new Brackets((qb) => {
      qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
        nextWorkCenters: ["WFNTA", "CRI"],
      }).orWhere("h.next_work_center_no LIKE :childPattern", {
        childPattern: "CHLD%",
      });
    }),
  });

export {
  getVmiTransactions,
  getScreeningTransactions,
  getWinTestTransactions,
  getFinalTestTransactions,
  getActivationTransactions,
  getCustomizationTransactions,
  getKeyInjectionTransactions,
  getFgiTransactions,
  getRepair2Transactions,
  getRepair3Transactions,
};
