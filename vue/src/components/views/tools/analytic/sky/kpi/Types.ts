import { AnalyticRaw } from "../transactions/Types";

export namespace KPITypes {
  export interface IModelObj {
    [key: string]: any;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }
  export type IModelsObj = IModelObj[];

  export interface IPlanObj {
    [key: string]: any;
    // linia: string; // Group letter
    // data: Date;
    // zmiana: 1 | 2 | 3;
    // pakowanie: number;
    LINE: string; // "linia",
    DATE: Date; // "data",
    SHIFT: 1 | 2 | 3; // "zmiana",
    PACKING: number;
  }
  export type IPlansObj = IPlanObj[];

  export interface IPackedModelIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  class PackedModel implements IPackedModelIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";

    constructor(transaction: AnalyticRaw.TTransactionsPackingRow) {
      this.packedUnits = 1;
      this.targetUnits =
        typeof transaction.target_for_group_letter === "number"
          ? transaction.target_for_group_letter > 0
            ? transaction.target_for_group_letter / 8
            : "-"
          : transaction.target_for_group_letter;
      this.targetPercent = 0;
    }

    addPackedUnit() {
      this.packedUnits += 1;
    }
    calculateTargetPercentage() {
      if (typeof this.targetUnits === "number" && this.targetUnits > 0) {
        this.targetPercent = Math.round((this.packedUnits / this.targetUnits) * 100);
      } else {
        this.targetPercent = "-";
      }
    }
  }

  interface IPackedRow {
    shift: 1 | 2 | 3;
    hour: number;
    models?: Record<string, PackedModel>;
  }

  interface IPackedRowIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  class PackedRow implements IPackedRow, IPackedRowIndicator {
    shift: 1 | 2 | 3;
    hour: number;
    //
    models?: Record<string, PackedModel>;
    //
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";

    private calculateRowPercentage(): number | "-" {
      return typeof this.targetUnits === "number" && this.targetUnits > 0
        ? Math.round((this.packedUnits / this.targetUnits) * 100)
        : "-";
    }

    constructor(
      transactions: AnalyticRaw.TTransactionsPackingRows,
      shift: 1 | 2 | 3,
      hour: number
    ) {
      this.shift = shift;
      this.hour = hour;
      //
      this.models = {};
      transactions.forEach((transaction: AnalyticRaw.TTransactionsPackingRow) => {
        const model = this.models![transaction.part_no_group_name];
        if (model) model.addPackedUnit();
        else this.models![transaction.part_no_group_name] = new PackedModel(transaction);
      });
      transactions.forEach((transaction: AnalyticRaw.TTransactionsPackingRow) => {
        const model = this.models![transaction.part_no_group_name];
        model.calculateTargetPercentage();
      });

      //
      this.packedUnits = Object.values(this.models).reduce((total, model) => {
        if (typeof model.targetUnits === "number" && model.targetUnits > 0) {
          return total + model.packedUnits;
        }
        return total;
      }, 0);
      const targetUnits = Object.values(this.models).reduce((total, model) => {
        if (typeof model.targetUnits === "number" && model.targetUnits > 0)
          return total + model.targetUnits;
        return total;
      }, 0);
      this.targetUnits = typeof targetUnits === "number" && targetUnits > 0 ? targetUnits : "-";

      this.targetPercent = this.calculateRowPercentage();
    }
  }

  interface IShiftsOfTransactions {
    1: AnalyticRaw.TTransactionsPackingRows;
    2: AnalyticRaw.TTransactionsPackingRows;
    3: AnalyticRaw.TTransactionsPackingRows;
  }

  class ShiftsOfTransactions implements IShiftsOfTransactions {
    1: AnalyticRaw.TTransactionsPackingRows;
    2: AnalyticRaw.TTransactionsPackingRows;
    3: AnalyticRaw.TTransactionsPackingRows;
    constructor() {
      this[1] = [];
      this[2] = [];
      this[3] = [];
    }
  }

  export interface IPackedRowWithModels {
    [key: string]: IPackedRowIndicator | number | string | "-"; // Dynamically generated properties (like AMIDALA DE (B3), etc.)
    hour: number;
    packedUnits: number;
    shift: 1 | 2 | 3;
    targetPercent: number | "-";
    targetUnits: number | "-";
  }

  export class PackedBuilder {
    shiftsOfTransactions: ShiftsOfTransactions;
    packedRows: PackedRow[];
    tablePackedRows: IPackedRowWithModels[];

    private getShift(hour: number): 1 | 2 | 3 {
      if (hour >= 6 && hour < 14) {
        return 1; // Shift 1: 6 AM - 2 PM
      } else if (hour >= 14 && hour < 22) {
        return 2; // Shift 2: 2 PM - 10 PM
      } else {
        return 3; // Shift 3: 10 PM - 6 AM
      }
    }

    private groupByHour(
      transactions: AnalyticRaw.TTransactionsPackingRows
    ): Record<number, AnalyticRaw.TTransactionsPackingRows> {
      return transactions.reduce(
        (acc: Record<number, AnalyticRaw.TTransactionsPackingRows>, transaction) => {
          const hour = transaction.hour;
          if (!acc[hour]) {
            acc[hour] = [];
          }
          acc[hour].push(transaction);
          return acc;
        },
        {}
      );
    }

    private generatePackedRows() {
      for (const shift in this.shiftsOfTransactions) {
        const shiftKey = shift as unknown as keyof IShiftsOfTransactions; // Cast 'shift' to the correct key type
        const shiftTransactions = this.shiftsOfTransactions[shiftKey];
        const transactionsByHour = this.groupByHour(shiftTransactions);

        // For each hour, create a PackedRow
        Object.keys(transactionsByHour).forEach((hourStr) => {
          const hour = parseInt(hourStr, 10);
          const transactions = transactionsByHour[hour];
          const packedRow = new PackedRow(transactions, shiftKey, hour);
          this.packedRows.push(packedRow);
        });
      }

      this.tablePackedRows = this.packedRows.map((row) => {
        const newRow = {
          ...row,
          ...row.models,
        };
        delete newRow.models;
        return newRow as IPackedRowWithModels;
      });
    }

    private getModelGroupNameOfPartNo(modelsObj: IModelsObj, part_no: string): string | undefined {
      try {
        const groupName = modelsObj.find(
          (model: IModelObj) => model.IFS_PART_NO === part_no
        )?.GROUP_NAME;

        if (groupName) {
          // Remove all line breaks and trim any extra spaces
          return groupName.replace(/[\r\n]+/g, "").trim();
        }

        return undefined;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }
    private getModelGroupLetterOfPartNo(
      modelsObj: IModelsObj,
      part_no: string
    ): string | undefined {
      try {
        const groupName = modelsObj.find(
          (model: IModelObj) => model.IFS_PART_NO === part_no
        )?.GROUP_LETTER;

        if (groupName) {
          // Remove all line breaks and trim any extra spaces
          return groupName.replace(/[\r\n]+/g, "").trim();
        }

        return undefined;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }

    private getTargetForGroupLetter(
      planArray: IPlansObj,
      transaction: AnalyticRaw.ITransactionsRow,
      partNoGroupLetter: string,
      shift: number
    ): number | "-" | undefined {
      try {
        const transactionDate = new Date(transaction.datedtz).toISOString().split("T")[0];

        // Filter the plan array to get only plans matching the transaction date and shift
        const validPlanArray = planArray.filter((planItem) => {
          if (!planItem.DATE || !planItem.SHIFT) return false;
          const planDate = new Date(planItem.DATE).toISOString().split("T")[0];
          return planDate === transactionDate && planItem.SHIFT === shift;
        });

        // Find the matching plan for the partNoGroupLetter
        const matchingPlan = validPlanArray.find((planItem) => {
          return planItem.LINE === partNoGroupLetter && planItem.SHIFT === shift;
        });

        // Return the target value mapped to the date
        const target = matchingPlan?.PACKING;
        return target ? target : "-";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }

    constructor(
      transactions: AnalyticRaw.TTransactions,
      modelsObj: IModelsObj,
      plansObj: IPlansObj
    ) {
      this.shiftsOfTransactions = new ShiftsOfTransactions();
      const part_noCache = new Map();
      // partNoGroupCache

      // Create a Set of IFS_PART_NO from modelsObj for O(1) lookups
      const availableModelsSet = new Set(modelsObj.map((m) => m.IFS_PART_NO));

      // Filter the transactions where part_no exists in the availableModelsSet
      const filteredTransactions = transactions.filter((t) => {
        return availableModelsSet.has(t.part_no);
      });

      filteredTransactions.forEach((transaction: AnalyticRaw.ITransactionsRow) => {
        const hour = new Date(transaction.datedtz).getHours();
        const shift = this.getShift(hour);
        // const transactionDate = new Date(transaction.datedtz).toISOString().split("T")[0];
        const part_no_group_name = this.getModelGroupNameOfPartNo(modelsObj, transaction.part_no);

        // Check if we have already processed this part_no for this date
        const cacheKey = `${part_no_group_name}-${shift}`;
        if (part_noCache.has(cacheKey)) {
          const cachedData = part_noCache.get(cacheKey);

          this.shiftsOfTransactions[shift].push({
            ...transaction,
            hour,
            shift,
            part_no_group_name: cachedData.part_no_group_name,
            part_no_group_letter: cachedData.part_no_group_letter,
            target_for_group_letter: cachedData.target_for_group_letter,
          });

          return; // Skip to the next transaction since we have the cached data
        }

        // If the part_no and date are not cached, calculate the values
        // const part_no_group_name = this.getModelGroupNameOfPartNo(modelsObj, transaction.part_no);
        const part_no_group_letter = this.getModelGroupLetterOfPartNo(
          modelsObj,
          transaction.part_no
        );

        if (!part_no_group_name || !part_no_group_letter) {
          console.error(`Could not find transaction (part_no) in models (IFS_PART_NO).`);
          return;
        }

        const target_for_group_letter = this.getTargetForGroupLetter(
          plansObj,
          transaction,
          part_no_group_letter,
          shift
        );

        if (!target_for_group_letter) {
          console.error(`Could not get target for part_no_group_letter.`); // probably no plan for that day
          return;
        }

        // Cache the processed data for future use
        part_noCache.set(cacheKey, {
          part_no_group_name,
          part_no_group_letter,
          target_for_group_letter,
        });

        // Now add to shiftsOfTransactions
        this.shiftsOfTransactions[shift].push({
          ...transaction,
          hour,
          shift,
          part_no_group_name,
          part_no_group_letter,
          target_for_group_letter,
        });
      });

      this.packedRows = [];
      this.tablePackedRows = [];
      this.generatePackedRows();
    }
  }
}
