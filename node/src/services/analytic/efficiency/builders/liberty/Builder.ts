import moment from "moment";
import { EmployeeUnderProcessing } from "../../Models/employee/EmployeeModels";
import { IEmployeeUnderProcessing, IProcessedEmployee } from "../../Models/employee/EmployeeTypes";
import { Models, ProcessedUnit } from "../../Models/models/ModelsModels";
import { Liberty, TouchTimeUnit } from "../../Models/models/TouchTime";
import { NRecords } from "../../Models/RecordTypes";
import { Hour, Quarter, TimePeriodMetrics, TimeUnit } from "../../Models/time/TimeModels";

export class LibertyEfficiencyBuilder<T extends Liberty.TTS> {
  private models: Models<T>;
  private modelsTouchTimeUnit: TouchTimeUnit;
  private processedEmployees: IProcessedEmployee[] = [];

  constructor(
    rawRecords: NRecords.RawRecords.IRecord[],
    modelsMatrix: T[],
    touchTimeKey: keyof T,
    touchTimeUnit: TouchTimeUnit = TouchTimeUnit.MINUTES
  ) {
    this.models = new Models(modelsMatrix, (model: T) => model["IFS_PN"], touchTimeKey, "NONE");
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
    employeeQuartersMap: Map<string, Set<string>>,
    fromToMap: Map<string, { from: string; to: string }[]>
  ) {
    if (!employeeIdentifier) return;

    const cosmeticGetTT = (
      transactionId: string,
      date: Date,
      partNo: string
    ): number | undefined => {
      const CLICKING_ADDITIONAL_TIME =
        this.modelsTouchTimeUnit === TouchTimeUnit.MINUTES ? 0.2 : 12;

      const model = this.models.cache.get(partNo);

      if (model && /^G[1-4]$/.test(model.GROUP || "")) {
        const fromToArr = fromToMap.get(`${transactionId} ${moment.utc(date).toISOString()}`);
        if (!fromToArr) return undefined;

        const toValues = fromToArr.map(({ to }) => to);

        // === COSMETIC_1: NFF ===
        if (toValues.some((to) => to && (/^(?!A107)/.test(to) || /(H1997|H1999)/.test(to)))) {
          return model.COSMETIC_1 + CLICKING_ADDITIONAL_TIME;
        }

        // === COSMETIC_2: Easy repair ===
        if (
          (["G1", "G2", "G4"].includes(model.GROUP) &&
            toValues.every((to) => !to.includes("A1073"))) ||
          (model.GROUP === "G3" && toValues.every((to) => !/(A107X|A107L|A107U)/.test(to)))
        ) {
          return model.COSMETIC_2 + CLICKING_ADDITIONAL_TIME;
        }

        // === COSMETIC_3: Hard repair ===
        if (
          (["G1", "G2", "G4"].includes(model.GROUP) &&
            toValues.some((to) => to.includes("A1073"))) ||
          (model.GROUP === "G3" && toValues.some((to) => /A107X/.test(to)))
        ) {
          return model.COSMETIC_3 + CLICKING_ADDITIONAL_TIME;
        }

        // === COSMETIC_4: Harder repair ===
        if (
          model.GROUP === "G3" &&
          toValues.every((to) => !/A107X/.test(to)) &&
          toValues.some((to) => /(A107L|A107U)/.test(to))
        ) {
          return model.COSMETIC_4 + CLICKING_ADDITIONAL_TIME;
        }
      } else {
        // === COSMETIC_5: fallback ===
        const fallbackModel = this.models.cache.get(this.models.averageKey);
        const fallbackTT = fallbackModel?.COSMETIC_5;
        if (!fallbackTT) return undefined;

        return fallbackTT + CLICKING_ADDITIONAL_TIME;
      }
    };

    const modelData =
      fromToMap.size > 0 ? cosmeticGetTT(transactionId, date, partNo) : this.models.getTT(partNo);

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

  private processRecords(records: NRecords.RawRecords.IRecord[]) {
    const employeeMap: Map<string, EmployeeUnderProcessing> = new Map();
    const employeeQuartersMap: Map<string, Set<string>> = new Map();

    const cosmeticRecords: {
      main: NRecords.RawRecords.IRecord[];
      sub: NRecords.RawRecords.IRecord[];
      fromTo: Map<string, { from: string; to: string }[]>;
    } = {
      main: [],
      sub: [],
      fromTo: new Map(),
    };

    const isCosmetics = this.models.ttKey === "COSMETIC_1";
    if (isCosmetics) {
      cosmeticRecords.main = records.filter((r) => {
        if (r.work_center_no === "A1070") {
          cosmeticRecords.fromTo.set(`${r.transaction_id} ${moment.utc(r.dated).toISOString()}`, [
            { from: r.work_center_no, to: r.next_work_center_no },
          ]);
          return true;
        } else return false;
      });
      cosmeticRecords.sub = records.filter((r) => r.work_center_no !== "A1070");

      // Step 1: Group main records by order_no
      const mainByOrderNo = new Map<string, NRecords.RawRecords.IRecord[]>();

      for (const main of cosmeticRecords.main) {
        if (!mainByOrderNo.has(main.order_no)) {
          mainByOrderNo.set(main.order_no, []);
        }
        mainByOrderNo.get(main.order_no)!.push(main);
      }

      // Step 2: Sort each group of main records by date
      for (const list of mainByOrderNo.values()) {
        list.sort((a, b) => moment.utc(a.dated).diff(moment.utc(b.dated)));
      }

      // Step 3: Match sub-records to their correct main
      for (const sub of cosmeticRecords.sub) {
        const subDate = moment.utc(sub.dated);
        const orderNo = sub.order_no;

        const mainList = mainByOrderNo.get(orderNo);
        if (!mainList) continue;

        for (let i = 0; i < mainList.length; i++) {
          const main = mainList[i];
          const mainDate = moment.utc(main.dated);
          const nextMain = mainList[i + 1];
          const nextMainDate = nextMain ? moment.utc(nextMain.dated) : null;

          if (subDate.isAfter(mainDate) && (!nextMainDate || subDate.isBefore(nextMainDate))) {
            const key = `${main.transaction_id} ${moment.utc(main.dated).toISOString()}`;
            const entry = cosmeticRecords.fromTo.get(key);
            if (entry) {
              entry.push({ from: sub.work_center_no, to: sub.next_work_center_no });
            }
            break; // match found
          }
        }
      }
    }

    // console.log("---");
    // console.log("Total transactions", records.length);
    // console.log("cosmeticRecords.main.length", cosmeticRecords.main.length);
    // console.log("Total assigned main transactions", cosmeticRecords.fromTo.size);
    // const subCount = Array.from(cosmeticRecords.fromTo.values()).reduce((total, arr) => {
    //   return total + arr.length;
    // }, 0);
    // console.log("Total assigned sub transactions:", subCount);
    // console.log("Total assigned transactions", subCount + cosmeticRecords.fromTo.size);
    // console.log(
    //   "Total missing transactions",
    //   records.length - (subCount + cosmeticRecords.fromTo.size)
    // );

    (isCosmetics ? cosmeticRecords.main : records).forEach(
      (record: NRecords.RawRecords.IRecord) => {
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
          employeeQuartersMap,
          cosmeticRecords.fromTo
        );
      }
    );

    return {
      employeeMap,
      employeeQuartersMap,
    };
  }
}
