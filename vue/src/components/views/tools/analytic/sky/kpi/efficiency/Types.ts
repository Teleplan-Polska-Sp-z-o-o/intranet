import { AnalyticRaw } from "../../transactions/Types";

export namespace EfficiencyTypes {
  export interface IModelObj {
    [key: string]: any;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
    TT_COSM: number; // Time required for COSM process, in minutes
    TT_PACK: number; // Time required to pack a unit, in minutes
  }

  export type IModelsObj = IModelObj[];

  // Processed result per employee
  export interface IProcessedEmployee {
    shift: 1 | 2 | 3;
    emp_name: string;
    worked_quarters: number;
    processing_time: number; // in minutes
    efficiency: number;
  }

  export type IProcessedEmployees = IProcessedEmployee[];

  export class EfficiencyBuilder {
    private modelsCache: Map<string, EfficiencyTypes.IModelObj> = new Map(); // Cache for model data
    private processedEmployees: EfficiencyTypes.IProcessedEmployees = []; // Processed data

    constructor(rawTransactions: AnalyticRaw.TTransactions, modelsObj: EfficiencyTypes.IModelsObj) {
      this.buildModelsCache(modelsObj);
      this.processTransactions(rawTransactions);
    }

    // Preprocess the modelsObj to build a cache for faster lookup
    private buildModelsCache(modelsObj: EfficiencyTypes.IModelsObj) {
      modelsObj.forEach((model) => {
        const { IFS_PART_NO } = model;
        if (IFS_PART_NO) {
          this.modelsCache.set(IFS_PART_NO, model);
        }
      });
    }

    // Process the raw transactions
    private processTransactions(transactions: AnalyticRaw.TTransactions) {
      const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
      const employeeWorkedQuarters: Record<string, Set<string>> = {}; // To store unique quarters worked for each employee

      transactions.forEach((transaction) => {
        const { emp_name, part_no, datedtz } = transaction;
        const modelData = this.modelsCache.get(part_no);

        // If we can't find model data for the part number, skip the transaction
        if (!modelData) {
          // console.warn(`Model data not found for part_no: ${part_no}`);
          return;
        }

        // Cache the processing time required for this part_no
        const processingTimePerUnit = Number(modelData.TT_PACK); // Get processing time from TT_PACK in minutes

        // Identify the quarter in which the transaction occurred
        const transactionQuarter = this.getTransactionQuarter(datedtz);

        // Determine the shift based on the time of the transaction
        const shift = this.getShift(new Date(datedtz));

        // Initialize employee data if not already present
        if (!employeeDataMap[emp_name]) {
          employeeDataMap[emp_name] = {
            shift: shift,
            emp_name: emp_name,
            worked_quarters: 0,
            processing_time: 0,
            efficiency: 0,
          };
          employeeWorkedQuarters[emp_name] = new Set(); // Set to track unique quarters
        }

        // Add the current transaction's quarter to the set of worked quarters for this employee
        employeeWorkedQuarters[emp_name].add(transactionQuarter);

        // Update processing time for the employee
        employeeDataMap[emp_name].processing_time += processingTimePerUnit;
      });

      // Calculate the worked quarters and efficiency for each employee
      Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
        const uniqueQuartersWorked = employeeWorkedQuarters[emp_name].size;
        employee.worked_quarters = uniqueQuartersWorked;

        // Round processing time to two decimal places
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time);

        // Calculate and round efficiency to two decimal places
        employee.efficiency = this.roundToTwoDecimals(
          this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
        );

        this.processedEmployees.push(employee);
      });
    }

    // Function to calculate efficiency
    private calculateEfficiency(processingTime: number, workedQuarters: number): number {
      // Ensure processingTime and workedQuarters are numbers
      if (isNaN(processingTime) || isNaN(workedQuarters)) {
        return 0;
      }

      const totalWorkingTime = workedQuarters * 15; // 1 quarter = 15 minutes
      return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
    }

    // Function to round a number to two decimal places
    private roundToTwoDecimals(num: number): number {
      return Math.round(num * 100) / 100; // Rounds to 2 decimal places
    }

    // Function to identify the quarter of a transaction (e.g., "06:00-06:15", "06:15-06:30")
    private getTransactionQuarter(datedtz: Date): string {
      const hour = new Date(datedtz).getHours();
      const minutes = new Date(datedtz).getMinutes();

      // Determine the quarter within the hour (e.g., 00-15, 15-30, 30-45, 45-00)
      let quarterStart;
      if (minutes < 15) {
        quarterStart = "00";
      } else if (minutes < 30) {
        quarterStart = "15";
      } else if (minutes < 45) {
        quarterStart = "30";
      } else {
        quarterStart = "45";
      }

      // Return a string representing the quarter (e.g., "06:00-06:15")
      return `${String(hour).padStart(2, "0")}:${quarterStart}-${String(hour).padStart(
        2,
        "0"
      )}:${String((parseInt(quarterStart, 10) + 15) % 60).padStart(2, "0")}`;
    }

    private getShift(datedtz: Date): 1 | 2 | 3 {
      const hour = datedtz.getHours();
      if (hour >= 6 && hour < 14) return 1; // Shift 1: 6 AM to 2 PM
      if (hour >= 14 && hour < 22) return 2; // Shift 2: 2 PM to 10 PM
      return 3; // Shift 3: 10 PM to 6 AM
    }

    // Expose the processed employees data
    public getProcessedData(): EfficiencyTypes.IProcessedEmployees {
      return this.processedEmployees;
    }
  }
}
