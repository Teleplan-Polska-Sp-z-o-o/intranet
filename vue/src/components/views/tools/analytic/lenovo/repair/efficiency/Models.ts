import moment from "moment";
import "moment-timezone";
import { EfficiencyTypes } from "./Types";
import { AnalyticRaw } from "../../transactions/Types";

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

    calculateEfficiency(workedHours: number | undefined = undefined, minutesPerHour: number = 60) {
      const totalWorkingTime = workedHours ? workedHours * minutesPerHour : minutesPerHour;
      this.efficiency = totalWorkingTime > 0 ? (this.processing_time / totalWorkingTime) * 100 : 0;
    }
  }

  export class EfficiencyBuilder<T extends EfficiencyTypes.TRepairModelObj> {
    private modelsCache: Map<string, T> = new Map();
    private processedEmployees: EfficiencyTypes.IProcessedEmployees = [];
    private ttModelsKey: keyof T;

    constructor(rawTransactions: AnalyticRaw.TTransactions, modelsObj: T[], ttModelsKey: keyof T) {
      this.buildModelsCache(modelsObj);
      this.ttModelsKey = ttModelsKey;
      this.processTransactions(rawTransactions);
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

      transactions.forEach((transaction, index) => {
        const { emp_name, part_no, datedtz } = transaction;
        const modelData = this.modelsCache.get(part_no);
        if (!modelData) return;

        const processingTimePerUnit = Number(modelData[this.ttModelsKey]);
        const transactionDate = this.extractTransactionDate(datedtz);
        const transactionHour = this.getTransactionHour(datedtz);
        const shift = this.getShift(datedtz);

        this.initializeEmployeeData(employeeDataMap, employeeWorkedHours, emp_name, shift);

        const isLastIteration = index === transactions.length - 1;

        this.update(
          emp_name,
          transactionDate,
          transactionHour,
          processingTimePerUnit,
          part_no,
          employeeDataMap,
          employeeWorkedHours,
          isLastIteration
        );
      });
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
          worked_hours: 0,
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
          hourlyChart: {},
        };
        employeeWorkedHours[emp_name] = new Set<string>();
      }
    }

    private update(
      emp_name: string,
      transactionDate: string,
      transactionHour: string,
      processingTimePerUnit: number,
      part_no: string,
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
      employeeWorkedHours: Record<string, Set<string>>,
      isLastIteration: boolean
    ) {
      employeeWorkedHours[emp_name].add(`${transactionDate}-${transactionHour}`);
      employeeDataMap[emp_name].processing_time += processingTimePerUnit;
      employeeDataMap[emp_name].processed_units += 1;

      this.updateEstimatedTargets(employeeDataMap[emp_name].estimated_target, part_no);

      const hourlyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].hourlyChart;
      if (!hourlyChart[transactionHour]) {
        hourlyChart[transactionHour] = new TimePeriodMetrics();
      }
      hourlyChart[transactionHour].update(processingTimePerUnit);

      const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
      if (!dailyChart[transactionDate]) {
        dailyChart[transactionDate] = new TimePeriodMetrics();
      }
      dailyChart[transactionDate].update(processingTimePerUnit);

      if (isLastIteration) {
        this.calculateEmployeesBase(employeeDataMap, employeeWorkedHours);
        this.calculateEmployeesHourly(employeeDataMap);
        this.calculateEmployeesDaily(employeeDataMap, employeeWorkedHours);

        Object.values(employeeDataMap).forEach((employee) => {
          this.calculateWeightedAverages(employee);
        });
      }
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
        employee.worked_hours = employeeWorkedHours[emp_name].size;
        employee.processing_time = this.roundToTwoDecimals(employee.processing_time);
        employee.efficiency = this.roundToTwoDecimals(
          this.calculateEfficiency(employee.processing_time, employee.worked_hours)
        );
        this.processedEmployees.push(employee);
      });
    }

    private calculateEmployeesHourly(
      employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
    ) {
      Object.values(employeeDataMap).forEach((employee) => {
        const hourlyChart = employee.hourlyChart;
        Object.values(hourlyChart).forEach((hour) => {
          hour.calculateEfficiency();
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
      const workedMinutes = employee.worked_hours * 60;
      const { units } = employee.estimated_target;

      let totalProcessingTime = 0;
      let totalUnits = 0;

      for (const part_no in units) {
        const modelData = this.modelsCache.get(part_no);
        if (!modelData) continue;

        const processingTimePerUnit = Number(modelData[this.ttModelsKey]);
        const unitsCount = units[part_no];

        totalProcessingTime += processingTimePerUnit * unitsCount;
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
      employee.estimated_target.units_per_8hrs = Math.round(unitsPer8Hours);
    }

    private calculateEfficiency(processingTime: number, workedHours: number): number {
      const totalWorkingTime = workedHours * 60;
      return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
    }

    private roundToTwoDecimals(num: number): number {
      return Math.round(num * 100) / 100;
    }

    private extractTransactionDate(datedtz: Date): string {
      return moment(datedtz).format("YYYY-MM-DD");
    }

    private getTransactionHour(datedtz: Date): string {
      return moment(datedtz).format("HH:00");
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
          worked_hours: emp.worked_hours,
        };
      });
    }
  }
}
