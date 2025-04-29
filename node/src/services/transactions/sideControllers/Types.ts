import { Brackets, SelectQueryBuilder } from "typeorm";
import { RawTransaction } from "../../../orm/sideEntity/postgres/RawTransactionsEntity";
import { SideDataSources } from "../../../config/SideDataSources";
import { ReptTitanTestRawTransaction } from "../../../orm/sideEntity/postgres/ReptTitanTestRawTransactionsEntity";
import { ProdTitanTestRawTransaction } from "../../../orm/sideEntity/postgres/ProdTitanTestRawTransactionsEntity";
import { IProcessedEmployee } from "../../analytic/efficiency/Models/employee/EmployeeTypes";
import { BoseRawTransaction } from "../../../orm/sideEntity/mssql/BoseRawTransactionEntity";

export namespace GenericTypes {
  export enum Program {
    Sky = "sky",
    Liberty = "liberty",
    Ingenico = "ingenico",
    Lenovo = "lenovo",
    Bose = "bose",
  }

  export type ProgramCategory = {
    [Program.Sky]: "packing" | "cosmetic" | "ooba" | "test";
    [Program.Lenovo]: "repair" | "registration" | "final" | "packing";
    [Program.Ingenico]:
      | "models"
      | "vmi"
      | "screening"
      | "wintest"
      | "finaltest"
      | "fgi"
      | "repair2"
      | "repair3"
      | "oba";
    [Program.Liberty]: "vmi" | "test" | "debugrepair" | "cosmetic" | "highpot" | "pack" | "ooba";
    [Program.Bose]: "combined";
  };

  export type ProgramCategoryTransaction = {
    [Program.Sky]: {
      packing: RawTransaction;
      cosmetic: RawTransaction;
      ooba: RawTransaction;
      test: ProdTitanTestRawTransaction;
    };
    [Program.Lenovo]: {
      repair: RawTransaction;
      registration: RawTransaction;
      final: RawTransaction;
      packing: RawTransaction;
    };
    [Program.Ingenico]: {
      vmi: RawTransaction;
      screening: RawTransaction;
      wintest: RawTransaction;
      finaltest: RawTransaction;
      fgi: RawTransaction;
      repair2: RawTransaction;
      repair3: RawTransaction;
      oba: RawTransaction;
    };
    [Program.Liberty]: {
      vmi: RawTransaction;
      test: RawTransaction;
      debugrepair: RawTransaction;
      cosmetic: RawTransaction;
      highpot: RawTransaction;
      pack: RawTransaction;
      ooba: RawTransaction;
    };
    [Program.Bose]: {
      combined: BoseRawTransaction;
    };
  };
  export type ProgramContracts = {
    [Program.Sky]: ["12195", "12196", "12176"];
    [Program.Lenovo]: ["12101"];
    [Program.Ingenico]: ["12194"];
    [Program.Liberty]: [
      "12192",
      "12120",
      "12188",
      "12172",
      "12136",
      "12156",
      "12178",
      "12140",
      "12139",
      "12158",
      "12141",
      "12190",
      "12148",
      "12197",
      "12198"
    ];
    [Program.Bose]: ["10058"];
  };
  export const programContracts: GenericTypes.ProgramContracts = {
    [GenericTypes.Program.Sky]: ["12195", "12196", "12176"],
    [GenericTypes.Program.Lenovo]: ["12101"],
    [GenericTypes.Program.Ingenico]: ["12194"],
    [GenericTypes.Program.Liberty]: [
      "12192",
      "12120",
      "12188",
      "12172",
      "12136",
      "12156",
      "12178",
      "12140",
      "12139",
      "12158",
      "12141",
      "12190",
      "12148",
      "12197",
      "12198",
    ],
    [GenericTypes.Program.Bose]: ["10058"],
  };
  export interface QueryOptions<P extends GenericTypes.Program> {
    startOfDay: Date;
    endOfDay: Date;
    contracts: ProgramContracts[P];
  }

  export type RawOptions<
    P extends GenericTypes.Program,
    C extends keyof GenericTypes.ProgramCategoryTransaction[P]
  > = GenericTypes.QueryOptions<P> & {
    fromCategory: C;
  };

  export interface ITransactions<Raw> {
    raw: Raw[];
    processed: IProcessedEmployee[];
    missingCache: {
      cacheKey: string;
      touchTimeKey: string;
    }[];
  }

  export class Transactions<RawTransactionType> {
    raw: RawTransactionType[];
    processed: IProcessedEmployee[];
    missingCache: {
      cacheKey: string;
      touchTimeKey: string;
    }[];
  }
}

export namespace SkyTypes {
  export class TestRawTransactionHandler {
    private static testNames = [
      "EUROMODEM::OPERATORSCAN->OPERATORBARCODE",
      "SKYMODEM::OPERATORSCAN->OPERATORBARCODE",
      "SKYQ::OPERATORSCAN->OPERATORBARCODE",
      "SKYQ::OPERATORSCAN->OPERATORSCAN",
      "SKYMODEM::OPERATORSCAN->OPERATORSCAN",
      "EUROMODEM::OPERATORSCAN->OPERATORSCAN",
    ];

    private static hostnames = [
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
    ];

    static base(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ):
      | SelectQueryBuilder<ProdTitanTestRawTransaction>
      | SelectQueryBuilder<ProdTitanTestRawTransaction>[] {
      const today = new Date();
      today.setHours(6, 0, 0, 0);

      const isTodayInRange = options.endOfDay > today && options.startOfDay <= today;

      if (isTodayInRange) {
        const prodRepo = SideDataSources.postgres.getRepository(ProdTitanTestRawTransaction);
        const reptRepo = SideDataSources.postgres.getRepository(ReptTitanTestRawTransaction);

        const prodQuery = prodRepo
          .createQueryBuilder("ial")
          .where("ial.test_date BETWEEN :todayStart AND :endOfDay", {
            todayStart: today,
            endOfDay: options.endOfDay,
          })
          .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
            testNames: TestRawTransactionHandler.testNames,
          })
          .andWhere("ial.hostname IN (:...hostnames)", {
            hostnames: TestRawTransactionHandler.hostnames,
          })
          .orderBy("ial.test_date", "ASC");
        const reptQuery = reptRepo
          .createQueryBuilder("ial")
          .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
            startOfDay: options.startOfDay,
            endOfDay: today,
          })
          .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
            testNames: TestRawTransactionHandler.testNames,
          })
          .andWhere("ial.hostname IN (:...hostnames)", {
            hostnames: TestRawTransactionHandler.hostnames,
          })
          .orderBy("ial.test_date", "ASC");

        return [prodQuery, reptQuery];
      } else {
        const repo = SideDataSources.postgres.getRepository(ReptTitanTestRawTransaction);
        const query = repo
          .createQueryBuilder("ial")
          .where("ial.test_date BETWEEN :startOfDay AND :endOfDay", {
            startOfDay: options.startOfDay,
            endOfDay: today,
          })
          .andWhere("UPPER(ial.test_name) IN (:...testNames)", {
            testNames: TestRawTransactionHandler.testNames,
          })
          .andWhere("ial.hostname IN (:...hostnames)", {
            hostnames: TestRawTransactionHandler.hostnames,
          })
          .orderBy("ial.test_date", "ASC");

        return query;
      }
    }

    static async getTestTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ): Promise<ProdTitanTestRawTransaction[]> {
      const queries:
        | SelectQueryBuilder<ProdTitanTestRawTransaction>
        | SelectQueryBuilder<ProdTitanTestRawTransaction>[] =
        TestRawTransactionHandler.base(options);
      if (Array.isArray(queries)) {
        const results: ProdTitanTestRawTransaction[][] = await Promise.all(
          queries.map((q) => q.getMany())
        );
        return results.flat();
      } else {
        return queries.getMany();
      }
    }
  }

  export class RawTransactionQueryHandler {
    static base(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ): SelectQueryBuilder<RawTransaction> {
      const repo = SideDataSources.postgres.getRepository(RawTransaction);
      const query = repo.createQueryBuilder("h");

      query
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
        .where("h.contract IN (:...contracts)", { contracts: options.contracts })
        .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
        .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
        .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
        .setParameters({
          startOfDay: options.startOfDay.toISOString(),
          endOfDay: options.endOfDay.toISOString(),
        });

      return query;
    }

    static async getPackingTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.next_work_center_no = :next", {
          next: "A1200",
        })
        .getMany();
    }

    static async getCosmeticTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", {
          wc: "A1070",
        })
        .getMany();
    }

    static async getOobaTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Sky>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", {
          wc: "OOBA",
        })
        .getMany();
    }
  }
}

export namespace IngenicoTypes {
  export class RawTransactionQueryHandler {
    static base(options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>) {
      const repo = SideDataSources.postgres.getRepository(RawTransaction);
      const query = repo.createQueryBuilder("h");

      return query
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
        .where("h.contract IN (:...contracts)", { contracts: options.contracts })
        .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
        .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
        .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay", {
          startOfDay: options.startOfDay,
          endOfDay: options.endOfDay,
        });
    }

    static getVmiTransactions(options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "VMI" })
        .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "SCRN" })
        .getMany();
    }

    static getScreeningTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>
    ) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "SCRN" })
        .getMany();
    }

    static getWinTestTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>
    ) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "WINT" })
        .getMany();
    }

    static getFinalTestTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>
    ) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "FNTA" })
        .getMany();
    }

    static getRepair2Transactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>
    ) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "REPB" })
        .andWhere(
          new Brackets((qb) => {
            qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
              nextWorkCenters: ["WFNTA", "CRI"],
            }).orWhere("h.next_work_center_no LIKE :pattern", { pattern: "CHLD%" });
          })
        )
        .getMany();
    }

    static getRepair3Transactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>
    ) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no LIKE :workCenter", { workCenter: "REPC%" })
        .andWhere(
          new Brackets((qb) => {
            qb.where("h.next_work_center_no IN (:...nextWorkCenters)", {
              nextWorkCenters: ["WFNTA", "CRI"],
            }).orWhere("h.next_work_center_no LIKE :orNextWorkCenters", {
              orNextWorkCenters: "CHLD%",
            });
          })
        )
        .getMany();
    }

    static getFgiTransactions(options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no NOT IN (:...excluded)", {
          excluded: [
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
        })
        .andWhere("h.next_work_center_no IN (:...next)", {
          next: ["RDYA", "BER", "UNREP", "UNRFR"],
        })
        .getMany();
    }

    static getObaTransactions(options: GenericTypes.QueryOptions<GenericTypes.Program.Ingenico>) {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :workCenter", { workCenter: "AOBA" })
        .andWhere("h.next_work_center_no = :nextWorkCenter", { nextWorkCenter: "RDYA" })
        .getMany();
    }
  }
}

export namespace LenovoTypes {
  export class RawTransactionQueryHandler {
    private static base(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo>
    ): SelectQueryBuilder<RawTransaction> {
      return SideDataSources.postgres
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
        .where("h.contract IN (:...contracts)", { contracts: options.contracts })
        .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
        .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
        .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
        .setParameters({
          startOfDay: options.startOfDay,
          endOfDay: options.endOfDay,
        });
    }

    static async getRegistrationTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo>
    ): Promise<RawTransaction[]> {
      return [];
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "1FNTA" })
        .getMany();
    }

    static async getFinalTestTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "1FNPA" })
        .getMany();
    }

    static async getPackingTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "1PCKA" })
        .getMany();
    }

    static async getRepairTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Lenovo>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("(h.work_center_no IN (:...repairWCs) OR h.work_center_no LIKE :repairPattern)", {
          repairWCs: ["1REPA", "1REW", "1AWRB"],
          repairPattern: "1HL%",
        })
        .andWhere(
          `(h.next_work_center_no IN (:...nextWCs) OR h.next_work_center_no LIKE :nextPattern1 OR h.next_work_center_no LIKE :nextPattern2)`,
          {
            nextWCs: ["1BRNA", "1HREW", "1SCRA", "1NFFA"],
            nextPattern1: "1B%",
            nextPattern2: "1HL%",
          }
        )
        .getMany();
    }
  }
}

export namespace LibertyTypes {
  export class RawTransactionQueryHandler {
    private static base(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): SelectQueryBuilder<RawTransaction> {
      return SideDataSources.postgres
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
        .where("h.contract IN (:...contracts)", { contracts: options.contracts })
        .andWhere("h.reversed_flag = :reversedFlag", { reversedFlag: "N" })
        .andWhere("h.transaction = :transaction", { transaction: "OP FEED" })
        .andWhere("h.dated >= :startOfDay AND h.dated < :endOfDay")
        .setParameters({
          startOfDay: options.startOfDay.toISOString(),
          endOfDay: options.endOfDay.toISOString(),
        });
    }

    static async getVmiTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "A1010" })
        .getMany();
    }

    static async getTestTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "A1020" })
        .getMany();
    }

    static async getDebugRepairTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "A1030" })
        .getMany();
    }

    static async getCosmeticTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no LIKE :wc", { wc: "A107%" })
        .andWhere("h.part_no != :excludedPart", { excludedPart: "CGA6444VF" })
        .getMany();
    }

    static async getHighPotTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "A1080" })
        .getMany();
    }

    static async getPackTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.next_work_center_no = :next", { next: "A1200" })
        .getMany();
    }

    static async getOobaTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Liberty>
    ): Promise<RawTransaction[]> {
      return RawTransactionQueryHandler.base(options)
        .andWhere("h.work_center_no = :wc", { wc: "AOBA" })
        .getMany();
    }
  }
}
export namespace BoseTypes {
  export class RawTransactionQueryHandler {
    static async getCombinedTransactions(
      options: GenericTypes.QueryOptions<GenericTypes.Program.Bose>
    ): Promise<BoseRawTransaction[]> {
      const queryRunner = SideDataSources.mssql.createQueryRunner();
      try {
        // AND wosh.Iteration = 1
        // LEFT JOIN pls.PartNoAttribute PNA
        //          ON PNA.PartNo = woh.PartNo
        //         AND PNA.AttributeID = '1005'
        const result: BoseRawTransaction[] = await queryRunner.query(
          // `
          // SELECT
          //   wosh.ID AS id,
          //   MAX(u.Username) AS username,
          //   MAX(woh.PartNo) AS partNo,
          //   MAX(woh.SerialNo) AS serialNo,
          //   MAX(ws.Code) AS workStationDesc,
          //   MAX(wosh.LastActivityDate) AS lastActivityDate,
          //   MAX(CASE WHEN ROHA.Value = 'REPAIR' THEN ROHA.Value ELSE 'REMAN' END) AS processType,
          //   ISNULL(UPPER(MAX(PNA.Value)), 'NULL') AS family
          // FROM pls.WOHeader woh
          // INNER JOIN pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
          // INNER JOIN pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
          // LEFT JOIN pls.CodeWorkStationCustomDescription ws
          //   ON ws.CodeWorkStationID = wosh.WorkStationID
          //   AND ws.RepairTypeID = woh.RepairTypeID
          //   AND ws.ProgramID = woh.ProgramID
          // LEFT JOIN pls.PartSerial PS
          //   ON woh.ID = PS.WOHeaderID
          //   AND woh.ProgramID = PS.ProgramID
          // LEFT JOIN pls.ROHeaderAttribute ROHA
          //   ON PS.ROHeaderID = ROHA.ROHeaderID
          //   AND ROHA.AttributeID = '986'
          // LEFT JOIN pls.PartNoAttribute PNA
          //   ON PNA.PartNo = woh.PartNo
          //   AND PNA.AttributeID = '1005'
          //   AND PNA.ProgramID = woh.ProgramID
          // WHERE woh.ProgramID IN ('10058')
          //   AND wosh.LastActivityDate >= @0
          //   AND wosh.LastActivityDate < @1
          // GROUP BY wosh.ID
          // ORDER BY wosh.ID ASC
          // `,
          `
          WITH RankedData AS (
    SELECT
	  woh.ID as wohid,
      wosh.ID AS id,
      u.Username,
      woh.PartNo,
      woh.SerialNo,
      CASE
        WHEN wosh.WorkStationId NOT IN (4, 5) AND wosh.WorkStationId IS NOT NULL AND wosh.toWorkstationID IS NULL THEN 'HOLD'
        ELSE ws.Code
      END AS WorkStationDesc,
      wosh.LastActivityDate,
      CASE
        WHEN ROHA.Value = 'REPAIR' THEN ROHA.Value
        ELSE 'REMAN'
      END AS processType,
      ISNULL(UPPER(PNA.Value), 'NULL') AS family,
      ROW_NUMBER() OVER (PARTITION BY wosh.ID ORDER BY wosh.LastActivityDate DESC) AS rn
    FROM pls.WOHeader woh
    INNER JOIN pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
    INNER JOIN pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
    LEFT JOIN pls.PartSerial PS
          ON woh.ID = PS.WOHeaderID
          AND woh.ProgramID = PS.ProgramID
		  AND PS.StatusID not in ('32','18', '8', '21')
	LEFT JOIN pls.CodeWorkStationCustomDescription ws
          ON ws.CodeWorkStationID = wosh.WorkStationID
          AND ws.RepairTypeID = wosh.RepairTypeID
    LEFT JOIN pls.ROHeaderAttribute ROHA
          ON PS.ROHeaderID = ROHA.ROHeaderID
          AND ROHA.AttributeID = '986'
    LEFT JOIN pls.PartNoAttribute PNA
          ON PNA.PartNo = woh.PartNo
          AND PNA.AttributeID = '1005'
          AND PNA.ProgramID = woh.ProgramID
    WHERE woh.ProgramID IN ('10058')
      AND wosh.LastActivityDate >= @0
      AND wosh.LastActivityDate < @1
  )
SELECT
  id,
  Username as username,
  PartNo as partNo,
  SerialNo as serialNo,
  WorkStationDesc as workStationDesc,
  LastActivityDate as lastActivityDate,
  processType,
  family
FROM RankedData
WHERE rn = 1
ORDER BY id ASC;
        `,
          [options.startOfDay, options.endOfDay]
        );

        return result;
      } finally {
        await queryRunner.release();
      }
    }
  }
}
