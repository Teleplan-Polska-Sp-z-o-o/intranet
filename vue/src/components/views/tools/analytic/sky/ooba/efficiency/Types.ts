import { AnalyticRaw } from "../../transactions/Types";

export namespace EfficiencyTypes {
  export interface IModelObj {
    [key: string]: any;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
    TT_COSM?: number; // Time required for COSM process, in minutes
    TT_OOBA: number; // / Time required for OOBA process, in minutes
  }

  export type IModelsObj = IModelObj[];

  // Processed result per employee
  export interface IProcessedEmployee {
    id: string;
    shift: 1 | 2 | 3;
    emp_name: string;
    worked_quarters: number;
    processing_time: number; // in minutes
    efficiency: number;
    dailyChart: Record<string, number>; // Date as string (YYYY-MM-DD), daily efficiency as number
    hourlyChart: Record<string, Record<string, number>>; // Date as string (YYYY-MM-DD), hour as string (HH), efficiency as number
  }

  export type IProcessedEmployees = IProcessedEmployee[];

  export class EfficiencyBuilder {
    private modelsCache: Map<string, EfficiencyTypes.IModelObj> = new Map(); // Cache for model data
    private processedEmployees: EfficiencyTypes.IProcessedEmployees = []; // Processed data
    private employeeCharts: Record<string, Record<string, number>> = {}; // To track efficiency per employee and date

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
      const employeeWorkedQuarters: Record<string, Record<string, Set<string>>> = {}; // Track unique quarters worked for each employee per date

      transactions.forEach((transaction) => {
        const { emp_name, part_no, datedtz } = transaction;
        const modelData = this.modelsCache.get(part_no);

        // If we can't find model data for the part number, skip the transaction
        if (!modelData) return;

        // Cache the processing time required for this part_no
        const processingTimePerUnit = Number(modelData.TT_OOBA); // Get processing time from TT_PACK in minutes

        const transactionDate = new Date(datedtz).toISOString().split("T")[0]; // Extract the date
        const transactionHour = new Date(datedtz).getHours().toString().padStart(2, "0"); // Extract the hour (00-23)

        // Determine the shift based on the time of the transaction
        const shift = this.getShift(new Date(datedtz));

        // Initialize employee data if not already present
        if (!employeeDataMap[emp_name]) {
          employeeDataMap[emp_name] = {
            id: `${emp_name}-${shift}`,
            shift: shift,
            emp_name: emp_name,
            worked_quarters: 0,
            processing_time: 0,
            efficiency: 0,
            dailyChart: {},
            hourlyChart: {},
          };
          employeeWorkedQuarters[emp_name] = {}; // Track worked quarters per date
          this.employeeCharts[emp_name] = {}; // Track daily processing time for each employee
        }

        // Initialize worked quarters for this employee on the transaction date
        if (!employeeWorkedQuarters[emp_name][transactionDate]) {
          employeeWorkedQuarters[emp_name][transactionDate] = new Set(); // Set to track unique quarters worked on this date
        }

        // Initialize daily chart entry for this employee for the transaction date
        if (!this.employeeCharts[emp_name][transactionDate]) {
          this.employeeCharts[emp_name][transactionDate] = 0; // Initialize daily processing time for the day
        }

        // Initialize hourly chart entry for this employee for the transaction hour
        if (!employeeDataMap[emp_name].hourlyChart[transactionDate]) {
          employeeDataMap[emp_name].hourlyChart[transactionDate] = {}; // Initialize hourly data per date
        }
        if (!employeeDataMap[emp_name].hourlyChart[transactionDate][transactionHour]) {
          employeeDataMap[emp_name].hourlyChart[transactionDate][transactionHour] = 0; // Initialize hourly processing time for the hour
        }

        // Add the current transaction's quarter to the set of worked quarters for this employee on the transaction date
        employeeWorkedQuarters[emp_name][transactionDate].add(this.getTransactionQuarter(datedtz));

        // Update processing time for the employee
        employeeDataMap[emp_name].processing_time += processingTimePerUnit;

        // Increment the daily and hourly processing time
        this.employeeCharts[emp_name][transactionDate] += processingTimePerUnit;
        employeeDataMap[emp_name].hourlyChart[transactionDate][transactionHour] +=
          processingTimePerUnit;
      });

      // Calculate worked quarters and efficiency for each employee
      Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
        // Calculate total worked quarters across all days
        employee.worked_quarters = Object.values(employeeWorkedQuarters[emp_name]).reduce(
          (total, quartersSet) => total + quartersSet.size,
          0
        );

        // Round processing time to two decimal places
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time);

        // Calculate overall efficiency
        employee.efficiency = this.roundToTwoDecimals(
          this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
        );

        // Update daily efficiency chart
        Object.keys(this.employeeCharts[emp_name]).forEach((date) => {
          const dailyProcessingTime = this.employeeCharts[emp_name][date];
          const dailyWorkedQuarters = employeeWorkedQuarters[emp_name][date]?.size || 0; // Get worked quarters for this date
          const dailyEfficiency = this.calculateEfficiency(
            dailyProcessingTime,
            dailyWorkedQuarters
          );
          employee.dailyChart[date] = this.roundToTwoDecimals(dailyEfficiency);
        });

        // Calculate hourly efficiency for each hour
        Object.keys(employee.hourlyChart).forEach((date) => {
          Object.keys(employee.hourlyChart[date]).forEach((hour) => {
            const hourlyProcessingTime = employee.hourlyChart[date][hour];
            const hourlyWorkedQuarters = Math.ceil(hourlyProcessingTime / 15); // 1 quarter = 15 minutes
            const hourlyEfficiency = this.calculateEfficiency(
              hourlyProcessingTime,
              hourlyWorkedQuarters
            );
            employee.hourlyChart[date][hour] = this.roundToTwoDecimals(hourlyEfficiency);
          });
        });

        // Add to processed employees
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

    // Function to identify the quarter of a transaction, including the date (e.g., "2024-09-26 06:00-06:15")
    private getTransactionQuarter(datedtz: Date): string {
      const date = new Date(datedtz);
      const hour = date.getHours();
      const minutes = date.getMinutes();

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

      // Return a string representing the full quarter for this transaction,
      // including the date and quarter window (e.g., "2024-09-26 06:00-06:15")
      return `${date.toISOString().split("T")[0]} ${String(hour).padStart(
        2,
        "0"
      )}:${quarterStart}-${String(hour).padStart(2, "0")}:${String(
        (parseInt(quarterStart, 10) + 15) % 60
      ).padStart(2, "0")}`;
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
