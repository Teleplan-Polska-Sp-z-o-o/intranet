import moment from "moment";
import "moment-timezone";
import { EfficiencyTypes } from "./_Types";
import { NRecords } from "../../Models/RecordTypes";
import { RawTransactions } from "../_Types";

export namespace EfficiencyModels {
  export class TimePeriodMetrics implements EfficiencyTypes.ITimePeriodMetrics {
    efficiency: number;
    processing_time: number;
    processed_units: number;

    constructor() {
      this.efficiency = 0;
      this.processing_time = 0;
      this.processed_units = 0;
    }

    update(processingTimePerUnit: number) {
      this.processing_time += processingTimePerUnit;
      this.processed_units += 1;
    }

    calculateEfficiency(workedQuarters: number | undefined = undefined) {
      const totalWorkingTime = (workedQuarters ?? 1) * 15; // Ensure minutes
      this.efficiency = totalWorkingTime > 0 ? (this.processing_time / totalWorkingTime) * 100 : 0;
    }
  }

  class Models<
    T extends
      | EfficiencyTypes.TPackModelObj
      | EfficiencyTypes.TCosmModelObj
      | EfficiencyTypes.TOobaModelObj
      | EfficiencyTypes.TTestModelObj
  > {
    cache: Map<string, T> = new Map();
    ttKey: keyof T;
    getTT(part_no: string): number | undefined {
      const value = this.cache.get(part_no);
      if (!value) {
        switch (this.ttKey) {
          case "TT_PACK":
            const averagePack = this.cache.get("AVERAGE");
            return averagePack ? Number(averagePack["TT_PACK"]) : undefined;
          case "TT_COSM":
            const averageCosm = this.cache.get("AVERAGE");
            return averageCosm ? Number(averageCosm["TT_COSM"]) : undefined;
          case "TT_OOBA":
            const averageOoba = this.cache.get("AVERAGE");
            return averageOoba ? Number(averageOoba["TT_OOBA"]) : undefined;
          case "TT_TEST":
            const averageTest = this.cache.get("AVERAGE");
            return averageTest ? Number(averageTest["TT_TEST"]) : undefined;

          default:
            return undefined;
        }
      } else return Number(value[this.ttKey]);
    }

    constructor(modelsObj: T[], ttKey: keyof T) {
      this.ttKey = ttKey;

      modelsObj.forEach((model) => {
        const { IFS_PART_NO } = model;
        if (IFS_PART_NO) {
          this.cache.set(IFS_PART_NO, model);
        }
      });
    }
  }

  export class EfficiencyBuilder<
    T extends
      | EfficiencyTypes.TPackModelObj
      | EfficiencyTypes.TCosmModelObj
      | EfficiencyTypes.TOobaModelObj
      | EfficiencyTypes.TTestModelObj
  > {
    private models: Models<T>; // models.cache models.ttKey
    private processedEmployees: EfficiencyTypes.IProcessedEmployee[] = []; // Processed data

    constructor(
      rawTransactions: RawTransactions.ITransactionsRecord[], // NRecords.RawRecords.TRecords
      modelsObj: T[],
      ttModelsKey: keyof T
    ) {
      this.models = new Models(modelsObj, ttModelsKey);
      const { employeeDataMap, employeeWorkedQuarters } = this.processTransactions(rawTransactions);

      this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
      this.calculateEmployeesQuarterly(employeeDataMap);
      this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

      Object.values(employeeDataMap).forEach((employee) => {
        this.calculateWeightedAverages(employee);
        this.setMostWorkedShift(employee, employeeWorkedQuarters);
      });
    }

    // --- Main method to process the raw transactions ---
    private processTransactions(transactions: RawTransactions.ITransactionsRecord[]) {
      const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
      const employeeWorkedQuarters: Record<string, Set<string>> = {};

      transactions.forEach((transaction) => {
        // const { emp_name, part_no, datedtz } = transaction;
        const { transaction_id, emp_hrid, part_no, test_date } = transaction;

        // Skip transactions without emp_name
        if (!emp_hrid) {
          // console.warn(`Skipping transaction with missing emp_name at index ${index}`);
          return;
        }
        // const modelData = this.modelsCache.get(part_no);
        const modelData = this.models.getTT(part_no);

        if (!modelData) return;

        // const processingTimePerUnit = Number(modelData[this.ttModelsKey]);
        const processingTimePerUnit = modelData;
        const transactionDate = this.extractTransactionDate(test_date);
        const transactionQuarter = this.getTransactionQuarter(test_date); // now it's quarterly

        const shift = this.getShift(test_date);

        this.initializeEmployeeData(
          employeeDataMap,
          employeeWorkedQuarters,
          emp_hrid as string,
          shift
        );

        // Determine if it's the last iteration
        // const isLastIteration = index === transactions.length - 1;

        this.update(
          transaction_id,
          emp_hrid as string,
          transactionDate,
          transactionQuarter,
          processingTimePerUnit,
          part_no,
          employeeDataMap,
          employeeWorkedQuarters
          // test_date,
          // isLastIteration
        );
      });

      return {
        employeeDataMap,
        employeeWorkedQuarters,
      };
    }

    // --- Initialize employee data structures ---
    private initializeEmployeeData(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>,
      emp_name: string,
      shift: 1 | 2 | 3
    ) {
      if (!employeeDataMap[emp_name]) {
        employeeDataMap[emp_name] = {
          id: `${emp_name}-${shift}`,
          transaction_ids: [],
          shift: shift,
          emp_name: emp_name,
          worked_quarters: 0,
          processing_time: 0,
          processed_units: 0,
          //
          estimated_target: {
            units: {},
            units_per_worked_quarters: 0,
            difference_units_worked_time: 9,
            units_per_hr: 0,
            units_per_8hrs: 0,
          },
          //
          efficiency: 0,
          dailyChart: {},
          quarterlyChart: {},
        };
        employeeWorkedQuarters[emp_name] = new Set<string>();
      }
    }

    // --- Update employee charts and processing time ---
    private update(
      transaction_id: number,
      emp_name: string,
      transactionDate: string,
      transactionQuarter: string,
      processingTimePerUnit: number,
      //
      part_no: string,
      //
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>
      // isLastIteration: boolean
    ) {
      employeeDataMap[emp_name].transaction_ids.push(transaction_id);

      // worked_quarters
      employeeWorkedQuarters[emp_name].add(`${transactionDate}-${transactionQuarter}`);

      const processingTimeInMinutes = processingTimePerUnit / 60;

      // processing_time
      employeeDataMap[emp_name].processing_time += processingTimeInMinutes;
      // processed_units
      employeeDataMap[emp_name].processed_units += 1;

      // Update estimated targets for the employee
      this.updateEstimatedTargets(employeeDataMap[emp_name].estimated_target, part_no);

      /// QUARTERLY CHART
      const quarterlyChart: Record<string, TimePeriodMetrics> =
        employeeDataMap[emp_name].quarterlyChart;
      if (!quarterlyChart[transactionQuarter]) {
        quarterlyChart[transactionQuarter] = new TimePeriodMetrics();
      }

      quarterlyChart[transactionQuarter].update(processingTimeInMinutes);

      /// DAILY CHART
      const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
      if (!dailyChart[transactionDate]) {
        dailyChart[transactionDate] = new TimePeriodMetrics();
      }
      dailyChart[transactionDate].update(processingTimeInMinutes);

      // if (isLastIteration) {
      //   this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
      //   this.calculateEmployeesQuarterly(employeeDataMap);
      //   this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

      //   // Calculate weighted averages for each employee
      //   Object.values(employeeDataMap).forEach((employee) => {
      //     this.calculateWeightedAverages(employee);
      //   });
      // }
    }

    // --- Update estimated target values ---
    private updateEstimatedTargets(
      estimated_target: EfficiencyTypes.IProcessedEmployee["estimated_target"],
      part_no: string
    ) {
      if (!estimated_target.units[part_no]) {
        estimated_target.units[part_no] = 0;
      }
      // Increment the count of the specific model (part_no)
      estimated_target.units[part_no] += 1;
    }

    // --- Calculate worked_quarters, efficiency and processing_time for each employee ---
    private calculateEmployeesBase(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>
    ) {
      Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
        employee.worked_quarters = employeeWorkedQuarters[emp_name].size;
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time);
        employee.efficiency = this.roundToTwoDecimals(
          this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
        );
        this.processedEmployees.push(employee);
      });
    }

    // --- New function to calculate quarterly efficiency for all employees ---
    private calculateEmployeesQuarterly(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
    ) {
      Object.values(employeeDataMap).forEach((employee) => {
        const quarterlyChart = employee.quarterlyChart;
        // iterate over each quarter and calculate efficiency
        Object.values(quarterlyChart).forEach((quarter) => {
          quarter.calculateEfficiency(); // Use the `calculateEfficiency` method inside the Quarter class
        });
      });
    }

    // Get the size of employeeWorkedQuarters for entries that start with the given transactionDate
    private getWorkedQuartersForDay(
      emp_name: string,
      transactionDate: string,
      employeeWorkedQuarters: Record<string, Set<string>>
    ): number {
      // Get all worked quarters that start with the transactionDate
      const dayWorkedQuarters = Array.from(employeeWorkedQuarters[emp_name]).filter((entry) =>
        entry.startsWith(`${transactionDate}-`)
      );

      // Return the number of unique worked quarters for the day
      return new Set(dayWorkedQuarters).size;
    }

    // --- Calculate weighted average target values ---
    private calculateWeightedAverages(employee: EfficiencyTypes.IProcessedEmployee) {
      const workedMinutes = employee.worked_quarters * 15;
      const { units } = employee.estimated_target;

      // Total weight for all models
      let totalProcessingTime = 0; // Total processing time across all models
      let totalUnits = 0; // Total number of units processed

      // Iterate over each unique model (part_no)
      for (const part_no in units) {
        // const modelData = this.modelsCache.get(part_no);
        const modelData = this.models.getTT(part_no);
        if (!modelData) continue;

        // const processingTimePerUnit = Number(modelData[this.ttModelsKey]);
        const processingTimePerUnit = modelData;
        const processingTimeInMinutes = processingTimePerUnit / 60;

        const unitsCount = units[part_no];

        // Add the processing time for all units of this model
        totalProcessingTime += processingTimeInMinutes * unitsCount;
        totalUnits += unitsCount; // Add the number of units for this model
      }

      // Calculate the weighted average processing time per unit
      const averageProcessingTimePerUnit = totalUnits > 0 ? totalProcessingTime / totalUnits : 0;

      // Calculate how many units can be processed in 1 hour and in 8 hours (considering breaks)
      const unitsPerWorkedQuarters =
        averageProcessingTimePerUnit > 0 ? workedMinutes / averageProcessingTimePerUnit : 0;
      const unitsPerHour = averageProcessingTimePerUnit > 0 ? 60 / averageProcessingTimePerUnit : 0;
      const unitsPer8Hours = unitsPerHour * 7.5; // For an 8-hour shift with breaks (7.5 hours of work)

      // Assign the calculated values to the employee's estimated target
      employee.estimated_target.units_per_worked_quarters = Math.round(unitsPerWorkedQuarters);
      employee.estimated_target.difference_units_worked_time =
        employee.processed_units - Math.round(unitsPerWorkedQuarters);
      employee.estimated_target.units_per_hr = Math.round(unitsPerHour);
      employee.estimated_target.units_per_8hrs =
        workedMinutes > 60 ? Math.round(unitsPer8Hours) : "n/a";
    }

    // Calculate daily efficiency for all employees
    private calculateEmployeesDaily(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>
    ) {
      Object.values(employeeDataMap).forEach((employee) => {
        const dailyChart = employee.dailyChart;
        Object.entries(dailyChart).forEach(([date, daily]) => {
          const workedQuartersForDay = this.getWorkedQuartersForDay(
            employee.emp_name,
            date,
            employeeWorkedQuarters
          );
          daily.calculateEfficiency(workedQuartersForDay);
        });
      });
    }

    // --- Helper methods ---

    // Function to calculate efficiency
    private calculateEfficiency(processingTime: number, workedQuarters: number): number {
      const totalWorkingTime = workedQuarters * 15; // 1 quarter = 15 minutes
      return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
    }

    // Function to round a number to two decimal places
    private roundToTwoDecimals(num: number): number {
      return Math.round(num * 100) / 100; // Rounds to 2 decimal places
    }

    // Extract date in YYYY-MM-DD format using moment
    private extractTransactionDate(dated: string | Date | number): string {
      return moment(dated).format("YYYY-MM-DD");
    }

    // Identify the quarter of a transaction using moment
    private getTransactionQuarter(dated: string | Date | number): string {
      const date = moment(dated);
      const startMinute = date.minute();

      function getQuarterStart(minute: number): "00" | "15" | "30" | "45" {
        if (minute < 15) return "00";
        if (minute < 30) return "15";
        if (minute < 45) return "30";
        if (minute <= 60) return "45";

        throw new Error("Invalid minute value");
      }

      const quarterStart = getQuarterStart(startMinute);

      // Calculate the start time of the quarter
      const quarterStartTime = moment(dated).startOf("hour").add(parseInt(quarterStart), "minutes");

      // Calculate the end time of the quarter, which is 15 minutes after the start time
      const quarterEndTime = quarterStartTime.clone().add(15, "minutes");

      // Format the start and end times into HH:mm format
      const formattedStart = quarterStartTime.format("HH:mm");
      const formattedEnd = quarterEndTime.format("HH:mm");

      return `${formattedStart}-${formattedEnd}`;
    }

    // Get employee shift based on time of transaction using moment
    private getShift(dated: string | Date | number): 1 | 2 | 3 {
      const hour = moment(dated).hour();
      if (hour >= 6 && hour < 14) return 1;
      if (hour >= 14 && hour < 22) return 2;
      if (hour >= 22 || hour < 6) return 3;
    }

    private setMostWorkedShift(
      employee: EfficiencyTypes.IProcessedEmployee,
      workedTimeUnits: Record<string, Set<string>>
    ): void {
      const shiftCounts = { 1: 0, 2: 0, 3: 0 };

      for (const timeUnit of workedTimeUnits[employee.emp_name]) {
        const date = timeUnit.slice(0, 10); // "2025-04-04"
        const timeInfo = timeUnit.slice(11); // "22:15-22:30" or "22:00" or "22:00-22:30"

        if (!timeInfo) continue;

        const startTime = timeInfo.includes("-") ? timeInfo.split("-")[0] : timeInfo;
        const dateTime = `${date}T${startTime}`;
        const shift = this.getShift(dateTime);

        shiftCounts[shift]++;
      }

      const entries = (Object.entries(shiftCounts) as [string, number][]).map(
        ([key, value]) => [parseInt(key, 10) as 1 | 2 | 3, value] as [1 | 2 | 3, number]
      );
      entries.sort((a, b) => b[1] - a[1]);

      employee.shift = entries[0][0];
    }

    // Expose the processed employees data
    public getProcessedData(): EfficiencyTypes.IProcessedEmployee[] {
      return this.processedEmployees.map((emp: EfficiencyTypes.IProcessedEmployee) => {
        return {
          ...emp,
          processing_time: Math.round((emp.processing_time / 60) * 10) / 10,
          worked_hours: emp.worked_quarters / 4,
        };
      });
    }
  }
}
