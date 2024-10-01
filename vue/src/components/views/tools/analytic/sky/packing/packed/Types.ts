import { AnalyticRaw } from "../../transactions/Types";

export namespace PackedTypes {
  export interface IModelObj {
    [key: string]: any;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
    TT_COSM: number;
    TT_PACK: number;
  }

  export type IModelsObj = IModelObj[];

  export interface IPlanObj {
    [key: string]: any;
    LINE: string; // "linia"
    DATE: Date; // "data"
    SHIFT: 1 | 2 | 3; // "zmiana"
    PACKING: number;
  }

  export type IPlansObj = IPlanObj[];

  export interface IPackedModelIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  export class PackedModel implements IPackedModelIndicator {
    packedUnits: number = 1;
    targetUnits: number | "-";
    targetPercent: number | "-";

    constructor(transaction: AnalyticRaw.TTransactionsPackingRow, multiplier: number) {
      this.targetUnits = this.calculateTargetUnits(transaction, multiplier);
      this.targetPercent = 0;
    }

    calculateTargetUnits(
      transaction: AnalyticRaw.TTransactionsPackingRow,
      multiplier: number
    ): number | "-" {
      if (
        typeof transaction.target_for_group_letter === "number" &&
        transaction.target_for_group_letter > 0 &&
        multiplier
      ) {
        return (transaction.target_for_group_letter / 8) * multiplier;
      }
      return "-";
    }

    addPackedUnit(): this {
      this.packedUnits++;
      return this;
    }

    calculateTargetPercentage() {
      if (typeof this.targetUnits === "number" && this.targetUnits > 0) {
        this.targetPercent = Math.round((this.packedUnits / this.targetUnits) * 100);
      } else {
        this.targetPercent = "-";
      }
    }
  }

  export interface IPackedRow {
    shift: 1 | 2 | 3;
    hour: number;
    models?: Record<string, PackedModel>;
  }

  export interface IPackedRowIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  export class PackedRow implements IPackedRow, IPackedRowIndicator {
    shift: 1 | 2 | 3;
    hour: number;
    models: Record<string, PackedModel> = {};
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";

    constructor(
      transactions: AnalyticRaw.TTransactionsPackingRows,
      shift: 1 | 2 | 3,
      hour: number,
      plansCacheMap: Map<string, number | "-">,
      transactionDatesSet: Set<string>
    ) {
      this.shift = shift;
      this.hour = hour;
      this.processTransactions(transactions, plansCacheMap, transactionDatesSet);
      this.packedUnits = this.calculatePackedUnits();
      this.targetUnits = this.calculateTargetUnits();
      this.targetPercent = this.calculateTargetPercent();
    }

    private processTransactions(
      transactions: AnalyticRaw.TTransactionsPackingRows,
      plansCacheMap: Map<string, number | "-">,
      transactionDatesSet: Set<string>
    ) {
      const multiplierMap = new Map<string, number>();
      plansCacheMap.forEach((packing, key) => {
        const groupLetter = key.split("-").at(0);
        if (
          groupLetter &&
          key.startsWith(`${groupLetter}-${this.shift}-`) &&
          typeof packing === "number" &&
          packing > 0
        ) {
          if (!multiplierMap.has(groupLetter)) {
            multiplierMap.set(groupLetter, 1);
          } else {
            multiplierMap.set(groupLetter, multiplierMap.get(groupLetter)! + 1);
          }
        }
      });

      const now: Date = new Date();
      const hour: number = now.getHours();
      const todaysDateStr: string = new Date().toISOString().split("T")[0];
      const isTodayInRange: boolean = transactionDatesSet.has(todaysDateStr);

      transactions.forEach((transaction) => {
        const groupLetter = transaction.part_no_group_letter;

        const rawMultiplier = multiplierMap.get(groupLetter);
        if (!rawMultiplier) return;

        const multiplier = isTodayInRange
          ? hour < this.hour // Check if we're still in the earlier part of the day
            ? Math.max(rawMultiplier - 1, 1) // Subtract 1, but don't let it drop below 1
            : rawMultiplier // If the current hour has passed, use the raw multiplier
          : rawMultiplier; // If it's not today, use the base multiplier

        if (this.models[groupLetter]) {
          this.models[groupLetter].addPackedUnit();
        } else {
          this.models[groupLetter] = new PackedModel(transaction, multiplier);
        }
      });

      Object.values(this.models).forEach((model) => model.calculateTargetPercentage());
    }

    private calculatePackedUnits(): number {
      return Object.values(this.models).reduce((total, model) => {
        if (typeof model.targetUnits === "number") {
          return total + model.packedUnits;
        }
        return total;
      }, 0);
    }

    private calculateTargetUnits(): number | "-" {
      const totalTargetUnits = Object.values(this.models).reduce((total, model) => {
        if (typeof model.targetUnits === "number") return total + model.targetUnits;
        return total;
      }, 0);

      // Log to debug missing target units
      if (totalTargetUnits === 0) {
        console.warn(`No target units calculated for models:`, this.models);
      }

      return totalTargetUnits > 0 ? totalTargetUnits : "-";
    }

    private calculateTargetPercent(): number | "-" {
      if (typeof this.targetUnits === "number" && this.targetUnits > 0) {
        return Math.round((this.packedUnits / this.targetUnits) * 100);
      }
      return "-";
    }
  }

  export interface IShiftsOfTransactions {
    1: AnalyticRaw.TTransactionsPackingRows;
    2: AnalyticRaw.TTransactionsPackingRows;
    3: AnalyticRaw.TTransactionsPackingRows;
  }

  export class ShiftsOfTransactions implements IShiftsOfTransactions {
    1: AnalyticRaw.TTransactionsPackingRows = [];
    2: AnalyticRaw.TTransactionsPackingRows = [];
    3: AnalyticRaw.TTransactionsPackingRows = [];
  }

  export interface IPackedRowWithModels {
    [key: string]: IPackedRowIndicator | number | string | "-";
    hour: number;
    packedUnits: number;
    shift: 1 | 2 | 3 | 4;
    targetPercent: number | "-";
    targetUnits: number | "-";
  }

  export class PackedBuilder {
    shiftsOfTransactions: ShiftsOfTransactions;
    packedRows: PackedRow[] = [];
    tablePackedRows: IPackedRowWithModels[] = [];
    private modelsCache: Map<string, { groupName: string; groupLetter: string }> = new Map();
    private plansCache: Map<string, number | "-"> = new Map(); // Cache plans for quicker access

    constructor(
      transactions: AnalyticRaw.TTransactions,
      modelsObj: IModelsObj,
      plansObj: IPlansObj
    ) {
      const transactionDatesSet = new Set(
        transactions.map((transaction) => new Date(transaction.datedtz).toISOString().split("T")[0])
      );

      this.shiftsOfTransactions = new ShiftsOfTransactions();
      this.buildModelsCache(modelsObj);
      this.buildPlansCache(plansObj, transactionDatesSet);
      this.buildPackedRows(transactions, transactionDatesSet);
      this.addSummaryRows();
    }

    private buildModelsCache(modelsObj: IModelsObj) {
      modelsObj.forEach((model) => {
        const { IFS_PART_NO, GROUP_NAME, GROUP_LETTER } = model;
        if (IFS_PART_NO && GROUP_NAME && GROUP_LETTER) {
          this.modelsCache.set(IFS_PART_NO, {
            groupName: GROUP_NAME.trim(),
            groupLetter: GROUP_LETTER.trim(),
          });
        }
      });
    }

    private buildPlansCache(plansObj: IPlansObj, transactionDatesSet: Set<string>) {
      plansObj.forEach((plan) => {
        const planDate: string = new Date(plan.DATE).toISOString().split("T")[0];
        if (transactionDatesSet.has(planDate)) {
          const key = `${plan.LINE}-${plan.SHIFT}-${planDate}`;
          this.plansCache.set(key, plan.PACKING || "-");
        }
      });
    }

    private addSummaryRows() {
      // Calculate summaries for each shift (1, 2, 3)
      [1, 2, 3].forEach((shift) => {
        this.addShiftSummary(shift as 1 | 2 | 3);
      });

      // Calculate the overall summary for all shifts combined (shift 0)
      this.addShiftSummary(4);
    }

    private addShiftSummary(shift: 1 | 2 | 3 | 4) {
      const relevantRows =
        shift === 4
          ? this.packedRows // For shift 4, include all rows
          : this.packedRows.filter((row) => row.shift === shift);

      if (relevantRows.length === 0) {
        return; // Skip if no transactions for this shift
      }

      const totalPackedUnits = relevantRows.reduce((total, row) => total + row.packedUnits, 0);
      const totalTargetUnits = relevantRows.reduce((total, row) => {
        if (typeof row.targetUnits === "number") return total + row.targetUnits;
        return total;
      }, 0);
      const totalTargetPercent =
        totalTargetUnits > 0 ? Math.round((totalPackedUnits / totalTargetUnits) * 100) : "-";

      // Now calculate model-specific summary
      const modelSummary: Record<string, PackedModel> = {};

      relevantRows.forEach((row) => {
        Object.entries(row.models || {}).forEach(([modelName, modelData]) => {
          if (!modelSummary[modelName]) {
            modelSummary[modelName] = {
              packedUnits: 0,
              targetUnits: 0,
              targetPercent: 0,
            } as PackedModel;
          }
          modelSummary[modelName].packedUnits += modelData.packedUnits;

          if (typeof modelData.targetUnits === "number") {
            modelSummary[modelName].targetUnits =
              ((modelSummary[modelName].targetUnits as number) || 0) + modelData.targetUnits;
          }

          // Calculate the target percentage for this model
          const targetUnits = modelSummary[modelName].targetUnits;
          if (typeof targetUnits === "number" && targetUnits > 0) {
            modelSummary[modelName].targetPercent = Math.round(
              (modelSummary[modelName].packedUnits / targetUnits) * 100
            );
          } else {
            modelSummary[modelName].targetPercent = "-";
          }
        });
      });

      // Prepare the summary row with model data
      const summaryRow: IPackedRowWithModels = {
        hour: 25, // Indicate this is a summary row
        packedUnits: totalPackedUnits,
        shift: shift,
        targetUnits: totalTargetUnits > 0 ? totalTargetUnits : "-",
        targetPercent: totalTargetPercent,
        ...modelSummary, // Spread model-specific data into the summary row
      };

      this.tablePackedRows.push(summaryRow);
    }

    private getTargetForGroupLetter(uniqueTargetKey: string): number | "-" {
      const baseTarget = this.plansCache.get(uniqueTargetKey) || "-";

      if (baseTarget !== "-" && typeof baseTarget === "number") {
        return baseTarget; // Multiply the base target by the number of days
      }
      return "-";
    }

    private buildPackedRows(
      transactions: AnalyticRaw.TTransactions,
      transactionDatesSet: Set<string>
    ) {
      transactions.forEach((transaction) => {
        const modelCache = this.modelsCache.get(transaction.part_no);
        if (!modelCache) return;

        const { groupName, groupLetter } = modelCache;
        const dateStr = new Date(transaction.datedtz).toISOString().split("T")[0];
        const hour = new Date(transaction.datedtz).getHours();
        const shift = this.getShift(hour);

        const uniqueTargetKey = `${groupLetter}-${shift}-${dateStr}`;

        const target_for_group_letter = this.getTargetForGroupLetter(uniqueTargetKey);
        if (target_for_group_letter === "-") return;

        this.shiftsOfTransactions[shift].push({
          hour,
          shift,
          part_no_group_name: groupName,
          part_no_group_letter: groupLetter,
          uniqueTargetKey,
          target_for_group_letter,
          ...transaction,
        });
      });

      this.generatePackedRows(transactionDatesSet);
    }

    private generatePackedRows(transactionDatesSet: Set<string>) {
      Object.keys(this.shiftsOfTransactions).forEach((shift) => {
        const transactionsByHour = this.groupByHour(
          this.shiftsOfTransactions[shift as unknown as keyof IShiftsOfTransactions]
        );
        Object.keys(transactionsByHour).forEach((hourStr) => {
          const hour = parseInt(hourStr, 10);
          const transactions = transactionsByHour[hour];
          const packedRow = new PackedRow(
            transactions,
            parseInt(shift, 10) as 1 | 2 | 3,
            hour,
            this.plansCache,
            transactionDatesSet
          );
          this.packedRows.push(packedRow);
        });
      });

      this.tablePackedRows = this.packedRows.map((row) => {
        const { models, ...restOfRow } = row;
        return { ...restOfRow, ...models } as IPackedRowWithModels;
      });
    }

    private getShift(hour: number): 1 | 2 | 3 {
      if (hour >= 6 && hour < 14) return 1;
      if (hour >= 14 && hour < 22) return 2;
      return 3;
    }

    private groupByHour(
      transactions: AnalyticRaw.TTransactionsPackingRows
    ): Record<number, AnalyticRaw.TTransactionsPackingRows> {
      return transactions.reduce((acc, transaction) => {
        const hour = transaction.hour;
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(transaction);
        return acc;
      }, {} as Record<number, AnalyticRaw.TTransactionsPackingRows>);
    }

    // private calculateNumberOfDays(transactions: AnalyticRaw.TTransactions): number {
    //   const uniqueDays = new Set<string>(); // Use a set to store unique dates
    //   transactions.forEach((transaction) => {
    //     const dateStr = new Date(transaction.datedtz).toISOString().split("T")[0]; // Extract the date part
    //     uniqueDays.add(dateStr); // Add the date to the set
    //   });
    //   return uniqueDays.size; // The size of the set gives the number of unique days
    // }
  }
}
