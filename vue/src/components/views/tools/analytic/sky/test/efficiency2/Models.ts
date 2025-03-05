import moment from "moment";
import "moment-timezone";
import { EfficiencyTypes } from "./Types";
import { AnalyticRaw } from "../../transactions2/Types";

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
      const processingTimeInMinutes = processingTimePerUnit / 60; // Convert seconds to minutes
      this.processing_time += processingTimeInMinutes;
      this.processed_units += 1;
    }

    calculateEfficiency(
      workedQuarters: number | undefined = undefined,
      minutesPerQuarter: number = 15
    ) {
      const totalWorkingTime = workedQuarters
        ? workedQuarters * minutesPerQuarter
        : minutesPerQuarter;
      this.efficiency = totalWorkingTime > 0 ? (this.processing_time / totalWorkingTime) * 100 : 0;
    }
  }

  export class EfficiencyBuilder<T extends EfficiencyTypes.TTestModelObj> {
    private modelsCache: Map<string, T> = new Map();
    private processedEmployees: EfficiencyTypes.IProcessedEmployees = [];
    private ttModelsKey: keyof T;

    constructor(rawTransactions: AnalyticRaw.TTransactions, modelsObj: T[], ttModelsKey: keyof T) {
      this.buildModelsCache(modelsObj);
      this.ttModelsKey = ttModelsKey;
      const { employeeDataMap, employeeWorkedHours } = this.processTransactions(rawTransactions);

      this.calculateEmployeesBase(employeeDataMap, employeeWorkedHours);
      this.calculateEmployeesHourly(employeeDataMap);
      this.calculateEmployeesDaily(employeeDataMap, employeeWorkedHours);

      Object.values(employeeDataMap).forEach((employee) => {
        this.calculateWeightedAverages(employee);
      });
    }

    private buildModelsCache(modelsObj: T[]) {
      modelsObj.forEach((model) => {
        const { IFS_PART_NO } = model;
        if (IFS_PART_NO) {
          this.modelsCache.set(IFS_PART_NO, model);
        }
      });
    }

    private processTransactions(transactions: AnalyticRaw.TTransactions) {
      const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
      const employeeWorkedHours: Record<string, Set<string>> = {};

      transactions.forEach(
        (
          transaction
          // , index
        ) => {
          const { emp_hrid, part_no, test_date } = transaction;

          // Skip transactions without emp_name
          if (!emp_hrid) {
            // console.warn(`Skipping transaction with missing emp_name at index ${index}`);
            return;
          }

          const processingTime = { time: this.modelsCache.get(part_no) };
          if (!processingTime.time) {
            processingTime.time = this.modelsCache.get("AVERAGE");
          }
          if (!processingTime.time) return;

          const processingTimePerUnit = Number(processingTime.time[this.ttModelsKey]);
          const transactionDate = this.extractTransactionDate(test_date);
          const transactionQuarter = this.extractTransactionQuarter(test_date);
          const shift = this.getShift(test_date);

          this.initializeEmployeeData(employeeDataMap, employeeWorkedHours, emp_hrid, shift);

          // const isLastIteration = index === transactions.length - 1;

          this.update(
            emp_hrid,
            transactionDate,
            transactionQuarter,
            processingTimePerUnit,
            part_no,
            employeeDataMap,
            employeeWorkedHours
            // isLastIteration
          );
        }
      );

      return {
        employeeDataMap,
        employeeWorkedHours,
      };
    }

    private initializeEmployeeData(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedHours: Record<string, Set<string>>,
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
          processed_units: 0,
          estimated_target: {
            units: {},
            units_per_worked_hours: 0,
            difference_units_worked_time: 9,
            units_per_hr: 0,
            units_per_8hrs: 0,
          },
          efficiency: 0,
          dailyChart: {},
          quarterlyChart: {},
        };
        employeeWorkedHours[emp_name] = new Set<string>();
      }
    }

    private update(
      emp_name: string,
      transactionDate: string,
      transactionQuarter: string,
      processingTimePerUnit: number,
      part_no: string,
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedHours: Record<string, Set<string>>
      // isLastIteration: boolean
    ) {
      const processingTimeInMinutes = processingTimePerUnit / 60;

      employeeWorkedHours[emp_name].add(`${transactionDate}-${transactionQuarter}`);
      employeeDataMap[emp_name].processing_time += processingTimeInMinutes;
      employeeDataMap[emp_name].processed_units += 1;

      this.updateEstimatedTargets(employeeDataMap[emp_name].estimated_target, part_no);

      const quarterlyChart: Record<string, TimePeriodMetrics> =
        employeeDataMap[emp_name].quarterlyChart;
      if (!quarterlyChart[transactionQuarter]) {
        quarterlyChart[transactionQuarter] = new TimePeriodMetrics();
      }
      quarterlyChart[transactionQuarter].update(processingTimeInMinutes);

      const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
      if (!dailyChart[transactionDate]) {
        dailyChart[transactionDate] = new TimePeriodMetrics();
      }
      dailyChart[transactionDate].update(processingTimeInMinutes);

      // if (isLastIteration) {
      //   this.calculateEmployeesBase(employeeDataMap, employeeWorkedHours);
      //   this.calculateEmployeesHourly(employeeDataMap);
      //   this.calculateEmployeesDaily(employeeDataMap, employeeWorkedHours);

      //   Object.values(employeeDataMap).forEach((employee) => {
      //     this.calculateWeightedAverages(employee);
      //   });
      // }
    }

    private updateEstimatedTargets(
      estimated_target: EfficiencyTypes.IProcessedEmployee["estimated_target"],
      part_no: string
    ) {
      if (!estimated_target.units[part_no]) {
        estimated_target.units[part_no] = 0;
      }
      estimated_target.units[part_no] += 1;
    }

    private calculateEmployeesBase(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedHours: Record<string, Set<string>>
    ) {
      Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
        employee.worked_quarters = employeeWorkedHours[emp_name].size;
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time);
        employee.efficiency = this.roundToTwoDecimals(
          this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
        );
        this.processedEmployees.push(employee);
      });
    }

    private calculateEmployeesHourly(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
    ) {
      Object.values(employeeDataMap).forEach((employee) => {
        const quarterlyChart = employee.quarterlyChart;
        Object.values(quarterlyChart).forEach((quarter) => {
          quarter.calculateEfficiency();
        });
      });
    }

    private calculateEmployeesDaily(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedHours: Record<string, Set<string>>
    ) {
      Object.values(employeeDataMap).forEach((employee) => {
        const dailyChart = employee.dailyChart;
        // Calculate worked hours per day
        const workedHoursPerDay: Record<string, number> = {};
        Object.keys(dailyChart).forEach((date) => {
          workedHoursPerDay[date] = [...employeeWorkedHours[employee.emp_name]].filter(
            (date_hour) => {
              return date_hour.startsWith(date);
            }
          ).length;
        });
        // Calculate efficiency for each day based on that day's worked hours
        Object.entries(dailyChart).forEach(([date, daily]) => {
          const dailyWorkedHours = workedHoursPerDay[date];
          daily.calculateEfficiency(dailyWorkedHours);
        });
      });
    }

    private calculateWeightedAverages(employee: EfficiencyTypes.IProcessedEmployee) {
      const workedMinutes = employee.worked_quarters * 15;
      const { units } = employee.estimated_target;

      let totalProcessingTime = 0;
      let totalUnits = 0;

      for (const part_no in units) {
        const processingTime = { time: this.modelsCache.get(part_no) };
        if (!processingTime.time) {
          processingTime.time = this.modelsCache.get("AVERAGE");
        }
        if (!processingTime.time) continue;

        const processingTimePerUnit = Number(processingTime.time[this.ttModelsKey]);
        const unitsCount = units[part_no];

        totalProcessingTime += (processingTimePerUnit / 60) * unitsCount;
        totalUnits += unitsCount;
      }

      const averageProcessingTimePerUnit = totalUnits > 0 ? totalProcessingTime / totalUnits : 0;
      const unitsPerWorkedHours =
        averageProcessingTimePerUnit > 0 ? workedMinutes / averageProcessingTimePerUnit : 0;
      const unitsPerHour = averageProcessingTimePerUnit > 0 ? 60 / averageProcessingTimePerUnit : 0;
      const unitsPer8Hours = unitsPerHour * 7.5;

      employee.estimated_target.units_per_worked_hours = Math.round(unitsPerWorkedHours);
      employee.estimated_target.difference_units_worked_time =
        employee.processed_units - Math.round(unitsPerWorkedHours);
      employee.estimated_target.units_per_hr = Math.round(unitsPerHour);
      employee.estimated_target.units_per_8hrs =
        workedMinutes > 60 ? Math.round(unitsPer8Hours) : "n/a";
    }

    private calculateEfficiency(processingTime: number, workedQuarters: number): number {
      const totalWorkingTime = workedQuarters * 15; // 1 quarter = 15 minutes
      return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
    }

    private roundToTwoDecimals(num: number): number {
      return Math.round(num * 100) / 100;
    }

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

    private getShift(datedtz: Date): 1 | 2 | 3 {
      const hour = moment(datedtz).hour();
      if (hour >= 6 && hour < 14) return 1;
      if (hour >= 14 && hour < 22) return 2;
      return 3;
    }

    public getProcessedData(): EfficiencyTypes.IProcessedEmployees {
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
