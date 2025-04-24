import { ProcessedUnit } from "../models/ModelsModels";
import { NTime } from "./TimeTypes";

export abstract class TimeUnit implements NTime.NTimeUnit.ITimeUnit {
  constructor(
    public readonly type: NTime.NTimeUnit.ETimeUnitType,
    public readonly start: moment.Moment,
    public readonly end: moment.Moment
  ) {}

  getDuration(): number {
    return this.end.diff(this.start, "minutes");
  }
  getShift(): 1 | 2 | 3 {
    const hour = this.start.hour();
    if (hour >= 6 && hour < 14) return 1;
    if (hour >= 14 && hour < 22) return 2;
    return 3;
  }
  getDay(): string {
    return this.start.format("YYYY-MM-DD");
  }
  getTimeSpan(): string {
    return `${this.start.format("HH:mm")}-${this.end.format("HH:mm")}`;
  }
  isSameDay(date: moment.Moment): boolean {
    return this.start.isSame(date, "day");
  }
  toString(): string {
    return `${this.getDay()} ${this.getTimeSpan()}`;
  }
}
export class Quarter extends TimeUnit {
  constructor(date: moment.Moment, backward: boolean = false) {
    const minute = date.minute();
    const startMinute = minute - (minute % 15);
    const aligned = date.clone().minute(startMinute).second(0).millisecond(0);

    const start = backward ? aligned.clone().subtract(15, "minutes") : aligned;
    const end = backward ? aligned : aligned.clone().add(15, "minutes");

    super(NTime.NTimeUnit.ETimeUnitType.Quarter, start, end);
  }
}

export class HalfHour extends TimeUnit {
  constructor(date: moment.Moment, backward: boolean = false) {
    const minute = date.minute();
    const startMinute = minute < 30 ? 0 : 30;
    const aligned = date.clone().minute(startMinute).second(0).millisecond(0);

    const start = backward ? aligned.clone().subtract(30, "minutes") : aligned;
    const end = backward ? aligned : aligned.clone().add(30, "minutes");

    super(NTime.NTimeUnit.ETimeUnitType.HalfHour, start, end);
  }
}

export class ThreeQuarter extends TimeUnit {
  constructor(date: moment.Moment, backward: boolean = false) {
    const minute = date.minute();
    const startMinute = minute - (minute % 15);
    const aligned = date.clone().minute(startMinute).second(0).millisecond(0);

    const start = backward ? aligned.clone().subtract(45, "minutes") : aligned;
    const end = backward ? aligned : aligned.clone().add(45, "minutes");

    super(NTime.NTimeUnit.ETimeUnitType.ThreeQuarter, start, end);
  }
}

export class Hour extends TimeUnit {
  constructor(date: moment.Moment, backward: boolean = false) {
    const aligned = date.clone().minute(0).second(0).millisecond(0);

    const start = backward ? aligned.clone().subtract(1, "hour") : aligned;
    const end = backward ? aligned : aligned.clone().add(1, "hour");

    super(NTime.NTimeUnit.ETimeUnitType.Hour, start, end);
  }
}

export class TimeUnitFactory {
  /**
   * @deprecated Use createFromDuration instead for better accuracy.
   */
  static createFromQuarters(
    date: moment.Moment,
    numberOfQuarters: number,
    backward: boolean = false
  ): TimeUnit {
    switch (numberOfQuarters) {
      case 1:
        return new Quarter(date, backward);
      case 2:
        return new HalfHour(date, backward);
      case 3:
        return new ThreeQuarter(date, backward);
      case 4:
      default:
        return new Hour(date, backward);
    }
  }
  static createFromDuration(
    date: moment.Moment,
    durationInMinutes: number,
    backward: boolean = false
  ): TimeUnit {
    if (durationInMinutes <= 15) {
      return new Quarter(date, backward);
    } else if (durationInMinutes <= 30) {
      return new HalfHour(date, backward);
    } else if (durationInMinutes <= 45) {
      return new ThreeQuarter(date, backward);
    } else {
      return new Hour(date, backward);
    }
  }
}

// export class TimePeriodSorter {
//   public static sortChart(
//     chart: NTime.NTimePeriod.ITimePeriodMetricsChart
//   ): NTime.NTimePeriod.ITimePeriodMetricsChart {
//     const sortedEntries = Array.from(chart.entries()).sort(([timeUnitA], [timeUnitB]) =>
//       timeUnitA.start.diff(timeUnitB.start)
//     );

//     return new Map(sortedEntries);
//   }
// }

export class TimePeriodMetrics implements NTime.NTimePeriod.ITimePeriodMetrics {
  numberOfQuarters: number = 0;
  efficiencyPercentage: number = 0;
  processingTimeOfUnitsInMinutes: number = 0;
  processedUnits: Record<string, ProcessedUnit> = {};
  processedCountOfUnits: number = 0;

  constructor(numberOfQuarters?: number) {
    if (typeof numberOfQuarters === "number") this.numberOfQuarters = numberOfQuarters;
  }

  public calculateWorkDurationInMinutes() {
    return this.numberOfQuarters * 15;
  }

  public calculateEfficiencyOfTimePeriod(): void {
    const workDurationInMinutes = this.calculateWorkDurationInMinutes();

    this.efficiencyPercentage =
      workDurationInMinutes > 0
        ? (this.processingTimeOfUnitsInMinutes / workDurationInMinutes) * 100
        : 0;
  }

  public updateTimePeriod(partNo: string, unitTouchTime: number): this {
    this.processingTimeOfUnitsInMinutes += unitTouchTime;

    const existingProcessedUnit = this.processedUnits[partNo];
    if (existingProcessedUnit) {
      existingProcessedUnit.add();
    } else {
      this.processedUnits[partNo] = new ProcessedUnit(unitTouchTime).add();
    }

    this.processedCountOfUnits += 1;

    return this;
  }
}
