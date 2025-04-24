import moment from "moment";
import { EmployeeUnderProcessing } from "../../Models/employee/EmployeeModels";
import { IEmployeeUnderProcessing, IProcessedEmployee } from "../../Models/employee/EmployeeTypes";
import { Models, ProcessedUnit } from "../../Models/models/ModelsModels";
import { SKY, TouchTimeUnit } from "../../Models/models/TouchTime";
import { Hour, Quarter, TimePeriodMetrics, TimeUnit } from "../../Models/time/TimeModels";
import { RawTransaction } from "../../../../../orm/sideEntity/postgres/RawTransactionsEntity";
import { ProdTitanTestRawTransaction } from "../../../../../orm/sideEntity/postgres/ProdTitanTestRawTransactionsEntity";

export class SkyEfficiencyBuilder<T extends SKY.TTS> {
  private models: Models<T>;
  private modelsTouchTimeUnit: TouchTimeUnit;
  private processedEmployees: IProcessedEmployee[] = [];

  constructor(
    rawRecords: RawTransaction[] | ProdTitanTestRawTransaction[], // NRecords.RawRecords.TRecords,
    modelsMatrix: T[],
    touchTimeKey: keyof T,
    touchTimeUnit: TouchTimeUnit = TouchTimeUnit.MINUTES
  ) {
    this.models = new Models(
      modelsMatrix,
      (model: T) => model["IFS_PART_NO"],
      touchTimeKey,
      "AVERAGE"
    );
    this.modelsTouchTimeUnit = touchTimeUnit;

    const { employeeMap, employeeQuartersMap } = this.processRecords(rawRecords);

    employeeMap.forEach((employee, key) => {
      this.processedEmployees.push(employee.transform(employeeQuartersMap.get(key)));
    });
  }

  public getProcessedData(): IProcessedEmployee[] {
    return this.processedEmployees;
  }
  public getMissingCache(): {
    id: number;
    cacheKey: string;
    touchTimeKey: string;
  }[] {
    return Array.from(this.models.missingCache).map((entry, index) => {
      const [cacheKey, touchTimeKey] = entry.split("::");
      return {
        id: index,
        cacheKey,
        touchTimeKey,
      };
    });
  }

  private initEmployee(
    employeeMap: Map<string, IEmployeeUnderProcessing>,
    employeeIdentifier: string,
    shift: 1 | 2 | 3,
    employeeWorkedQuartersMap: Map<string, Set<string>>
  ) {
    const KEY = `${employeeIdentifier}-${shift}`;
    if (!employeeMap.has(KEY)) {
      employeeMap.set(KEY, new EmployeeUnderProcessing(KEY, employeeIdentifier, shift));
    }
    if (!employeeWorkedQuartersMap.has(KEY)) {
      employeeWorkedQuartersMap.set(KEY, new Set());
    }
  }

  private addEmployeeQuarters(
    employeeQuarterStrings: Set<string>,
    recordDate: moment.Moment,
    unitTouchTime: number
  ): number {
    const initialSize = employeeQuarterStrings.size;

    const startTime = recordDate.clone().subtract(unitTouchTime, "minutes");
    const alignedStart = startTime
      .clone()
      .minute(startTime.minute() - (startTime.minute() % 15))
      .second(0)
      .millisecond(0);

    let current = alignedStart.clone();

    while (current.isBefore(recordDate)) {
      const quarter = new Quarter(current);
      employeeQuarterStrings.add(quarter.toString());
      current.add(15, "minutes");
    }

    return employeeQuarterStrings.size - initialSize;
  }

  private updateCharts(
    employee: EmployeeUnderProcessing,
    partNo: string,
    unitTouchTime: number,
    recordDate: moment.Moment
  ) {
    const timeUnit: TimeUnit = new Hour(recordDate);

    const shiftCurrentKey = timeUnit.getTimeSpan();
    const shiftChart = employee.shiftChart.get(shiftCurrentKey);
    if (!shiftChart) {
      employee.shiftChart.set(
        shiftCurrentKey,
        new TimePeriodMetrics(4).updateTimePeriod(partNo, unitTouchTime)
      );
    } else {
      shiftChart.updateTimePeriod(partNo, unitTouchTime);
    }

    const dailyCurrentKey = timeUnit.getDay();
    const dailyChart = employee.dailyChart.get(dailyCurrentKey);
    if (!dailyChart) {
      employee.dailyChart.set(
        dailyCurrentKey,
        new TimePeriodMetrics().updateTimePeriod(partNo, unitTouchTime)
      );
    } else {
      dailyChart.updateTimePeriod(partNo, unitTouchTime);
    }
  }

  private updateEmployee(
    employeeMap: Map<string, EmployeeUnderProcessing>,
    employeeIdentifier: string,
    shift: 1 | 2 | 3,
    employeeQuartersMap: Map<string, Set<string>>,
    transactionId: string,
    recordDate: moment.Moment,
    partNo: string,
    unitTouchTime: number
  ) {
    const KEY = `${employeeIdentifier}-${shift}`;

    const employee: EmployeeUnderProcessing = employeeMap.get(KEY);
    employee.measuredRecordIds.push(transactionId);
    employee.totalProcessingDurationOfUnitsInMinutes += unitTouchTime;

    const existingProcessedUnit = employee.processedUnitsByModel.get(partNo);
    if (existingProcessedUnit) {
      existingProcessedUnit.add();
    } else {
      employee.processedUnitsByModel.set(partNo, new ProcessedUnit(unitTouchTime));
    }

    employee.totalProcessedUnits += 1;

    this.addEmployeeQuarters(employeeQuartersMap.get(KEY), recordDate, unitTouchTime);

    this.updateCharts(employee, partNo, unitTouchTime, recordDate);
  }

  private update(
    transactionId: string,
    employeeIdentifier: string,
    partNo: string,
    date: Date,
    employeeMap: Map<string, EmployeeUnderProcessing>,
    employeeQuartersMap: Map<string, Set<string>>
  ) {
    if (!employeeIdentifier) return;
    const modelData = this.models.getTT(partNo);
    if (!modelData) return;

    const unitTouchTime: number =
      this.modelsTouchTimeUnit === TouchTimeUnit.MINUTES ? modelData : modelData / 60;
    const recordDate: moment.Moment = moment.utc(date);
    const shift: 1 | 2 | 3 = new Quarter(recordDate).getShift();

    this.initEmployee(employeeMap, employeeIdentifier, shift, employeeQuartersMap);
    this.updateEmployee(
      employeeMap,
      employeeIdentifier,
      shift,
      employeeQuartersMap,
      transactionId,
      recordDate,
      partNo,
      unitTouchTime
    );
  }

  private processRecords(records: RawTransaction[] | ProdTitanTestRawTransaction[]) {
    const employeeMap: Map<string, EmployeeUnderProcessing> = new Map();
    const employeeQuartersMap: Map<string, Set<string>> = new Map();

    records.forEach((record) => {
      if ("emp_name" in record) {
        const {
          transaction_id: transactionId,
          emp_name: employeeIdentifier,
          part_no: partNo,
          dated: date,
        } = record;

        this.update(
          String(transactionId),
          String(employeeIdentifier),
          partNo,
          date,
          employeeMap,
          employeeQuartersMap
        );
      }

      if ("emp_hrid" in record) {
        const {
          transaction_id: transactionId,
          emp_hrid: employeeIdentifier,
          part_no: partNo,
          test_date: date,
        } = record;

        this.update(
          String(transactionId),
          String(employeeIdentifier),
          partNo,
          date,
          employeeMap,
          employeeQuartersMap
        );
      }
    });

    return {
      employeeMap,
      employeeQuartersMap,
    };
  }
}
