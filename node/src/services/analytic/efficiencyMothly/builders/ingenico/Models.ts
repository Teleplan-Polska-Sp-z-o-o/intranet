import moment from "moment";
import "moment-timezone";
import { EfficiencyTypes } from "./Types";
import { RawTransactions } from "../Types";

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

    // Add flexibility to calculateEfficiency for both day and quarter
    calculateEfficiency(
      workedQuarters: number | undefined = undefined,
      minutesPerPeriod: number = 15,
      processingTimeUnit: "sec" | "min" = "sec"
    ) {
      const totalWorkingTime = workedQuarters
        ? workedQuarters * minutesPerPeriod
        : minutesPerPeriod;
      const processingTime =
        processingTimeUnit === "sec" ? this.processing_time / 60 : this.processing_time;
      this.efficiency = totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
    }
  }

  export class EfficiencyBuilder {
    private models: Map<string, number> = new Map<string, number>();
    private processedEmployees: EfficiencyTypes.IProcessedEmployee[] = []; // Processed data
    constructor(
      rawTransactions: RawTransactions.TTransactions,
      models: EfficiencyTypes.IModelMatrix[],
      _ttModelsKey: string
    ) {
      this.buildModelsCache(models);

      const { employeeDataMap, employeeWorkedQuarters } = this.processTransactions(rawTransactions);

      this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
      this.calculateEmployeesQuarterly(employeeDataMap);
      this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

      // Calculate weighted averages for each employee
      Object.values(employeeDataMap).forEach((employee) => {
        this.calculateWeightedAverages(employee);
      });
    }

    private buildModelsCache(models: EfficiencyTypes.IModelMatrix[]) {
      models.forEach((model) => {
        const key = `${model.PART_NO}-${model.WORKSTATION}-${model.NEXT_WORKSTATION}`;
        const value = parseInt(model.TT, 10);
        this.models.set(key, value);
      });
    }

    // --- Main method to process the raw transactions ---
    private processTransactions(transactions: RawTransactions.TTransactions) {
      const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
      const employeeWorkedQuarters: Record<string, Set<string>> = {};

      transactions.forEach(
        (
          transaction
          // index
        ) => {
          const { emp_name, part_no, order_no, work_center_no, next_work_center_no, datedtz } =
            transaction;
          const key = `${part_no}-${work_center_no}-${next_work_center_no}`;
          const processingTime = this.models.get(key);
          if (!processingTime) {
            console.error(`No model data for part ${part_no} and work center ${work_center_no}`);
            return;
          }

          const transactionDate = this.extractTransactionDate(datedtz);
          const transactionQuarter = this.extractTransactionQuarter(datedtz);
          const shift = this.extractShift(datedtz);

          this.initializeEmployeeData(employeeDataMap, employeeWorkedQuarters, emp_name, shift);

          // Determine if it's the last iteration
          // const isLastIteration = index === transactions.length - 1;

          this.update(
            emp_name,
            transactionDate,
            transactionQuarter,
            processingTime,
            //
            part_no,
            order_no,
            work_center_no,
            next_work_center_no,
            //
            employeeDataMap,
            employeeWorkedQuarters,
            datedtz
            // isLastIteration
          );
        }
      );

      return {
        employeeDataMap,
        employeeWorkedQuarters,
      };
    }

    // --- Calculate worked_quarters, efficiency and processing_time for each employee ---
    private calculateEmployeesBase(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>
    ) {
      Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
        employee.worked_quarters = employeeWorkedQuarters[emp_name].size;
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time / 60);

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

    // --- Update estimated target values ---
    private updateEstimatedTargets(
      estimated_target: EfficiencyTypes.IProcessedEmployee["estimated_target"],
      part_no: string,
      work_center_no: string,
      next_work_center_no: string
    ) {
      const key = `${part_no}-${work_center_no}-${next_work_center_no}`;
      if (!estimated_target.units[key]) {
        estimated_target.units[key] = 0;
      }
      // Increment the count of the specific model (part_no)
      estimated_target.units[key] += 1;
    }

    // --- Calculate weighted average target values ---
    private calculateWeightedAverages(employee: EfficiencyTypes.IProcessedEmployee) {
      const workedMinutes = employee.worked_quarters * 15;
      const { units } = employee.estimated_target;

      // Total weight for all models
      let totalProcessingTime = 0; // Total processing time across all models
      let totalUnits = 0; // Total number of units processed

      // Iterate over each unique model (part_no)
      for (const key in units) {
        const processingTime = this.models.get(key);
        if (!processingTime) {
          continue;
        }

        const unitsCount = units[key];

        // Add the processing time for all units of this model
        totalProcessingTime += (processingTime / 60) * unitsCount;
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
        employee.processed_units.size - Math.round(unitsPerWorkedQuarters);
      employee.estimated_target.units_per_hr = Math.round(unitsPerHour);
      employee.estimated_target.units_per_8hrs = Math.round(unitsPer8Hours);
    }

    // --- Update employee charts and processing time ---
    private update(
      emp_name: string,
      transactionDate: string,
      transactionQuarter: string,
      processingTime: number,
      //
      part_no: string,
      order_no: string,
      work_center_no: string,
      next_work_center_no: string,
      //
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedQuarters: Record<string, Set<string>>,
      datedtz: Date
      // isLastIteration: boolean
    ) {
      // worked_quarters
      employeeWorkedQuarters[emp_name].add(
        `${transactionDate}-${this.extractTransactionQuarter(datedtz)}`
      );
      // processing_time
      employeeDataMap[emp_name].processing_time += processingTime;
      // processed_units
      employeeDataMap[emp_name].processed_units.add(order_no);

      // Update estimated targets for the employee
      this.updateEstimatedTargets(
        employeeDataMap[emp_name].estimated_target,
        part_no,
        work_center_no,
        next_work_center_no
      );

      /// QUARTERLY CHART
      const quarterlyChart: Record<string, TimePeriodMetrics> =
        employeeDataMap[emp_name].quarterlyChart;
      if (!quarterlyChart[transactionQuarter]) {
        quarterlyChart[transactionQuarter] = new TimePeriodMetrics();
      }
      quarterlyChart[transactionQuarter].update(processingTime);

      /// DAILY CHART
      const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
      if (!dailyChart[transactionDate]) {
        dailyChart[transactionDate] = new TimePeriodMetrics();
      }
      dailyChart[transactionDate].update(processingTime);
      // if (isLastIteration) {
      //   console.log("last iteration");
      //   this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
      //   this.calculateEmployeesQuarterly(employeeDataMap);
      //   this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

      //   // Calculate weighted averages for each employee
      //   Object.values(employeeDataMap).forEach((employee) => {
      //     this.calculateWeightedAverages(employee);
      //   });
      // }
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
          shift: shift,
          emp_name: emp_name,
          worked_quarters: 0,
          processing_time: 0,
          processed_units: new Set(),
          //
          estimated_target: {
            units: {},
            units_per_worked_quarters: 0,
            difference_units_worked_time: 0,
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

    // HELPERS

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
    private extractTransactionDate(datedtz: Date): string {
      return moment(datedtz).format("YYYY-MM-DD");
    }

    // Identify the quarter of a transaction using moment
    private extractTransactionQuarter(datedtz: Date): string {
      const date = moment(datedtz);
      const startMinute = date.minute();
      let quarterStart;

      if (startMinute < 15) {
        quarterStart = "00";
      } else if (startMinute < 30) {
        quarterStart = "15";
      } else if (startMinute < 45) {
        quarterStart = "30";
      } else {
        quarterStart = "45";
      }

      // Calculate the start time of the quarter
      const quarterStartTime = moment(datedtz)
        .startOf("hour")
        .add(parseInt(quarterStart), "minutes");

      // Calculate the end time of the quarter, which is 15 minutes after the start time
      const quarterEndTime = quarterStartTime.clone().add(15, "minutes");

      // Format the start and end times into HH:mm format
      const formattedStart = quarterStartTime.format("HH:mm");
      const formattedEnd = quarterEndTime.format("HH:mm");

      return `${formattedStart}-${formattedEnd}`;
    }

    // Get employee shift based on time of transaction using moment
    private extractShift(datedtz: Date): 1 | 2 | 3 {
      const hour = moment(datedtz).hour();
      if (hour >= 6 && hour < 14) return 1;
      if (hour >= 14 && hour < 22) return 2;
      return 3;
    }

    // Expose the processed employees data
    public getProcessedData() {
      return this.processedEmployees.map((emp) => {
        return {
          ...emp,
          processed_units: emp.processed_units.size,
          processing_time: Math.round((emp.processing_time / 60) * 10) / 10,
          worked_hours: emp.worked_quarters / 4,
        };
      });
    }
  }
}
