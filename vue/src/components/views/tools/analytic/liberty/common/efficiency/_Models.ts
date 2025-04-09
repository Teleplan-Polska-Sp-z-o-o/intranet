// import moment from "moment";
// import "moment-timezone";
// import { EfficiencyTypes } from "./Types";
// import { AnalyticRaw } from "../transactions/Types";

// export namespace EfficiencyModels {
//   interface IEfficiencyBuilder {
//     modelsCache: Map<string, any>;
//     processedEmployees: EfficiencyTypes.IProcessedEmployees;
//   }

//   export const libertyFactory = (
//     group: AnalyticRaw.TGroups
//   ): typeof CosmeticEfficiencyBuilder | typeof BaseEfficiencyBuilder => {
//     switch (group) {
//       case "cosmetic":
//         return CosmeticEfficiencyBuilder;

//       default:
//         return BaseEfficiencyBuilder;
//     }
//   };

//   export class TimePeriodMetrics implements EfficiencyTypes.ITimePeriodMetrics {
//     efficiency: number;
//     processing_time: number;
//     processed_units: number;

//     constructor() {
//       this.efficiency = 0;
//       this.processing_time = 0;
//       this.processed_units = 0;
//     }

//     update(processingTimePerUnit: number) {
//       this.processing_time += processingTimePerUnit;
//       this.processed_units += 1;
//     }

//     // Add flexibility to calculateEfficiency for both day and quarter
//     calculateEfficiency(
//       workedQuarters: number | undefined = undefined,
//       minutesPerPeriod: number = 15,
//       processingTimeUnit: "sec" | "min" = "min"
//     ) {
//       const totalWorkingTime = workedQuarters
//         ? workedQuarters * minutesPerPeriod
//         : minutesPerPeriod;
//       const processingTime =
//         processingTimeUnit === "sec" ? this.processing_time / 60 : this.processing_time;
//       this.efficiency = totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
//     }
//   }

//   export class BaseEfficiencyBuilder implements IEfficiencyBuilder {
//     modelsCache: Map<string, number> = new Map<string, number>();
//     processedEmployees: EfficiencyTypes.IProcessedEmployees = [];

//     constructor(
//       rawTransactions: AnalyticRaw.TTransactions,
//       models: EfficiencyTypes.IModels,
//       ttKey: string
//     ) {
//       this.buildModelsCache(models, ttKey);

//       const { employeeDataMap, employeeWorkedQuarters } = this.processTransactions(rawTransactions);

//       this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
//       this.calculateEmployeesQuarterly(employeeDataMap);
//       this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

//       Object.values(employeeDataMap).forEach((employee) => {
//         this.calculateWeightedAverages(employee);
//       });
//     }

//     private buildModelsCache(models: EfficiencyTypes.IModels, ttKey: string) {
//       models.forEach((model: EfficiencyTypes.IModelRecordWithoutCosmetic) => {
//         const { IFS_PN } = model;
//         const tt = model[ttKey];
//         if (IFS_PN && tt) {
//           this.modelsCache.set(IFS_PN, parseFloat(tt));
//         }
//       });
//     }

//     private initializeEmployeeData(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>,
//       emp_name: string,
//       shift: 1 | 2 | 3
//     ) {
//       if (!employeeDataMap[emp_name]) {
//         employeeDataMap[emp_name] = {
//           id: `${emp_name}-${shift}`,
//           transaction_ids: [],
//           shift: shift,
//           emp_name: emp_name,
//           worked_quarters: 0,
//           processing_time: 0,
//           processed_units: 0,
//           estimated_target: {
//             part_no_processing: {},
//             units: {},
//             units_per_worked_quarters: 0,
//             difference_units_worked_time: 9,
//             units_per_hr: 0,
//             units_per_8hrs: 0,
//           },
//           efficiency: 0,
//           dailyChart: {},
//           quarterlyChart: {},
//         };
//         employeeWorkedQuarters[emp_name] = new Set<string>();
//       }
//     }

//     private updateEstimatedTargets(
//       estimated_target: EfficiencyTypes.IProcessedEmployee["estimated_target"],
//       part_no: string
//     ) {
//       if (!estimated_target.units[part_no]) {
//         estimated_target.units[part_no] = 0;
//       }
//       estimated_target.units[part_no] += 1;
//     }

//     private roundToTwoDecimals(num: number): number {
//       return Math.round(num * 100) / 100;
//     }

//     private calculateEfficiency(processingTime: number, workedQuarters: number): number {
//       const totalWorkingTime = workedQuarters * 15; // 1 quarter = 15 minutes
//       return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
//     }

//     private calculateEmployeesBase(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//     ) {
//       Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
//         employee.worked_quarters = employeeWorkedQuarters[emp_name].size;

//         employee.efficiency = this.roundToTwoDecimals(
//           this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
//         );

//         employee.processing_time = this.roundToTwoDecimals(employee.processing_time / 60);
//         this.processedEmployees.push(employee);
//       });
//     }

//     private calculateEmployeesQuarterly(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
//     ) {
//       Object.values(employeeDataMap).forEach((employee) => {
//         const quarterlyChart = employee.quarterlyChart;
//         Object.values(quarterlyChart).forEach((quarter) => {
//           quarter.calculateEfficiency(); // Use the `calculateEfficiency` method in each quarter
//         });
//       });
//     }

//     private calculateEmployeesDaily(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//     ) {
//       Object.values(employeeDataMap).forEach((employee) => {
//         const dailyChart = employee.dailyChart;
//         const workedQuartersPerDay: Record<string, number> = {};
//         Object.keys(dailyChart).forEach((date) => {
//           workedQuartersPerDay[date] = [...employeeWorkedQuarters[employee.emp_name]].filter(
//             (date_quarter) => {
//               return date_quarter.startsWith(date);
//             }
//           ).length;
//         });

//         Object.entries(dailyChart).forEach(([date, daily]) => {
//           const dailyWorkedHours = workedQuartersPerDay[date];
//           daily.calculateEfficiency(dailyWorkedHours);
//         });
//       });
//     }

//     private calculateWeightedAverages(employee: EfficiencyTypes.IProcessedEmployee) {
//       const workedMinutes = employee.worked_quarters * 15;
//       const { units } = employee.estimated_target;

//       // Total weight for all models
//       let totalProcessingTime = 0; // Total processing time across all models
//       let totalUnits = 0; // Total number of units processed

//       // Iterate over each unique model (part_no)
//       for (const key in units) {
//         const processingTime = { time: this.modelsCache.get(key) };
//         if (!processingTime.time) {
//           processingTime.time = this.modelsCache.get("NONE");
//         }
//         if (!processingTime.time) continue;

//         const unitsCount = units[key];

//         // Add the processing time for all units of this model
//         totalProcessingTime += processingTime.time * unitsCount;
//         totalUnits += unitsCount; // Add the number of units for this model
//       }

//       // Calculate the weighted average processing time per unit
//       const averageProcessingTimePerUnit = totalUnits > 0 ? totalProcessingTime / totalUnits : 0;
//       // Calculate how many units can be processed in 1 hour and in 8 hours (considering breaks)
//       const unitsPerWorkedQuarters =
//         averageProcessingTimePerUnit > 0 ? workedMinutes / averageProcessingTimePerUnit : 0;

//       const unitsPerHour = averageProcessingTimePerUnit > 0 ? 60 / averageProcessingTimePerUnit : 0;
//       const unitsPer8Hours = unitsPerHour * 7.5; // For an 8-hour shift with breaks (7.5 hours of work)

//       // Assign the calculated values to the employee's estimated target
//       employee.estimated_target.units_per_worked_quarters = Math.round(unitsPerWorkedQuarters);
//       employee.estimated_target.difference_units_worked_time =
//         employee.processed_units - Math.round(unitsPerWorkedQuarters);
//       employee.estimated_target.units_per_hr = Math.round(unitsPerHour);
//       employee.estimated_target.units_per_8hrs = Math.round(unitsPer8Hours);
//     }

//     private update(
//       emp_name: string,
//       transactionDate: string,
//       transactionQuarter: string,
//       processingTimeOfUnit: number,
//       //
//       part_no: string,
//       //
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//       // isLastIteration: boolean
//     ) {
//       employeeWorkedQuarters[emp_name].add(`${transactionDate}-${transactionQuarter}`);
//       employeeDataMap[emp_name].processing_time += processingTimeOfUnit;
//       employeeDataMap[emp_name].processed_units += 1;

//       this.updateEstimatedTargets(employeeDataMap[emp_name].estimated_target, part_no);

//       const quarterlyChart: Record<string, TimePeriodMetrics> =
//         employeeDataMap[emp_name].quarterlyChart;
//       if (!quarterlyChart[transactionQuarter]) {
//         quarterlyChart[transactionQuarter] = new TimePeriodMetrics();
//       }
//       quarterlyChart[transactionQuarter].update(processingTimeOfUnit);

//       const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
//       if (!dailyChart[transactionDate]) {
//         dailyChart[transactionDate] = new TimePeriodMetrics();
//       }
//       dailyChart[transactionDate].update(processingTimeOfUnit);

//       // if (isLastIteration) {
//       //   this.calculateEmployeesBase(employeeDataMap, employeeWorkedHours);
//       //   this.calculateEmployeesQuarterly(employeeDataMap);
//       //   this.calculateEmployeesDaily(employeeDataMap, employeeWorkedHours);

//       //   Object.values(employeeDataMap).forEach((employee) => {
//       //     this.calculateWeightedAverages(employee);
//       //   });
//       // }
//     }

//     private processTransactions(transactions: AnalyticRaw.TTransactions) {
//       const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
//       const employeeWorkedQuarters: Record<string, Set<string>> = {};

//       transactions.forEach(
//         (
//           transaction
//           // index
//         ) => {
//           const { emp_name, part_no, datedtz } = transaction;
//           const processingTimeOfModel = { time: this.modelsCache.get(part_no) };

//           if (!processingTimeOfModel.time) {
//             // return;
//             processingTimeOfModel.time = this.modelsCache.get("NONE");
//           }
//           if (!processingTimeOfModel.time) {
//             console.error(`No model data for part ${part_no}`);
//             return;
//           }

//           const transactionDate = this.extractTransactionDate(datedtz);
//           const transactionHour = this.extractTransactionQuarter(datedtz);
//           const shift = this.extractShift(datedtz);

//           this.initializeEmployeeData(employeeDataMap, employeeWorkedQuarters, emp_name, shift);

//           // const isLastIteration = index === transactions.length - 1;
//           this.update(
//             emp_name,
//             transactionDate,
//             transactionHour,
//             processingTimeOfModel.time,
//             //
//             part_no,
//             //
//             employeeDataMap,
//             employeeWorkedQuarters
//             // isLastIteration
//           );
//         }
//       );

//       return {
//         employeeDataMap,
//         employeeWorkedQuarters,
//       };
//     }

//     // HELPER FUNCTIONS

//     private extractTransactionDate(datedtz: Date): string {
//       return moment(datedtz).format("YYYY-MM-DD");
//     }

//     private extractTransactionQuarter(datedtz: Date): string {
//       const date = moment(datedtz);
//       const startMinute = date.minute();
//       let quarterStart;

//       if (startMinute < 15) {
//         quarterStart = "00";
//       } else if (startMinute < 30) {
//         quarterStart = "15";
//       } else if (startMinute < 45) {
//         quarterStart = "30";
//       } else {
//         quarterStart = "45";
//       }

//       // Calculate the start time of the quarter
//       const quarterStartTime = moment(datedtz)
//         .startOf("hour")
//         .add(parseInt(quarterStart), "minutes");

//       // Calculate the end time of the quarter, which is 15 minutes after the start time
//       const quarterEndTime = quarterStartTime.clone().add(15, "minutes");

//       // Format the start and end times into HH:mm format
//       const formattedStart = quarterStartTime.format("HH:mm");
//       const formattedEnd = quarterEndTime.format("HH:mm");

//       return `${formattedStart}-${formattedEnd}`;
//     }

//     private extractShift(datedtz: Date): 1 | 2 | 3 {
//       const hour = moment(datedtz).hour();
//       if (hour >= 6 && hour < 14) return 1;
//       if (hour >= 14 && hour < 22) return 2;
//       return 3;
//     }

//     public getProcessedData() {
//       return this.processedEmployees.map((emp) => {
//         return {
//           ...emp,
//           worked_hours: emp.worked_quarters / 4,
//         };
//       });
//     }
//   }

//   interface IFromTo {
//     from: string;
//     to: string;
//   }

//   interface ICosmetic {
//     GROUP: string;
//     COSMETIC_1: number;
//     COSMETIC_2: number;
//     COSMETIC_3: number;
//     COSMETIC_4: number;
//     COSMETIC_5: number;
//   }

//   export class CosmeticEfficiencyBuilder implements IEfficiencyBuilder {
//     /**
//      * [EMPLOYEE-ORDER-REV]: {from: workcenter, to: workcenter}[]
//      *
//      * EMPLOYEE - name of operator
//      * ORDER - transaction order_no
//      * REV - revision, situation where the unit went to another station and returned for the second, third .. time. Base is 0.
//      */
//     keyFromToMap: Map<string, IFromTo[]> = new Map();
//     modelsCache: Map<string, ICosmetic> = new Map();
//     processedEmployees: EfficiencyTypes.IProcessedEmployees = [];

//     constructor(
//       rawTransactions: AnalyticRaw.TTransactions,
//       models: EfficiencyTypes.IModels,
//       _modelType: string
//     ) {
//       this.buildModelsCache(models);
//       const { employeeDataMap, employeeWorkedQuarters } = this.processTransactions(rawTransactions);

//       this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
//       // this.calculateEmployeesHourly(employeeDataMap);
//       this.calculateEmployeesQuarterly(employeeDataMap);
//       this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

//       Object.values(employeeDataMap).forEach((employee) => {
//         this.calculateWeightedAverages(employee);
//       });
//     }

//     private buildModelsCache(models: EfficiencyTypes.IModels) {
//       models.forEach((model: EfficiencyTypes.IModelRecordWithCosmetic) => {
//         const { IFS_PN, GROUP, COSMETIC_1, COSMETIC_2, COSMETIC_3, COSMETIC_4, COSMETIC_5 } = model;
//         const tt: ICosmetic = {
//           GROUP,
//           COSMETIC_1: parseFloat(COSMETIC_1),
//           COSMETIC_2: parseFloat(COSMETIC_2),
//           COSMETIC_3: parseFloat(COSMETIC_3),
//           COSMETIC_4: parseFloat(COSMETIC_4),
//           COSMETIC_5: parseFloat(COSMETIC_5),
//         };

//         if (IFS_PN && tt) {
//           this.modelsCache.set(IFS_PN, tt);
//         }
//       });
//     }

//     private initializeEmployeeData(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>,
//       emp_name: string,
//       shift: 1 | 2 | 3
//     ) {
//       if (!employeeDataMap[emp_name]) {
//         employeeDataMap[emp_name] = {
//           id: `${emp_name}-${shift}`,
//           transaction_ids: [],
//           shift: shift,
//           emp_name: emp_name,
//           worked_quarters: 0,
//           processing_time: 0,
//           processed_units: 0,
//           estimated_target: {
//             part_no_processing: {},
//             units: {},
//             units_per_worked_quarters: 0,
//             difference_units_worked_time: 9,
//             units_per_hr: 0,
//             units_per_8hrs: 0,
//           },
//           efficiency: 0,
//           dailyChart: {},
//           // hourlyChart: {},
//           quarterlyChart: {},
//         };
//         employeeWorkedQuarters[emp_name] = new Set<string>();
//       }
//     }

//     private updateEstimatedTargets(
//       estimated_target: EfficiencyTypes.IProcessedEmployee["estimated_target"],
//       part_no: string,
//       processingTimeOfUnit: number
//     ) {
//       if (!estimated_target.units[part_no]) {
//         estimated_target.units[part_no] = 0;
//         estimated_target.part_no_processing[part_no] = processingTimeOfUnit;
//       }
//       estimated_target.units[part_no] += 1;
//     }

//     private calculateEfficiency(processingTime: number, workedQuarters: number): number {
//       const totalWorkingTime = workedQuarters * 15; // 1 quarter = 15 minutes
//       return totalWorkingTime > 0 ? (processingTime / totalWorkingTime) * 100 : 0;
//     }

//     private roundToTwoDecimals(num: number): number {
//       return Math.round(num * 100) / 100;
//     }

//     private calculateEmployeesBase(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//     ) {
//       Object.entries(employeeDataMap).forEach(([emp_name, employee]) => {
//         employee.worked_quarters = employeeWorkedQuarters[emp_name].size;

//         employee.efficiency = this.roundToTwoDecimals(
//           this.calculateEfficiency(employee.processing_time, employee.worked_quarters)
//         );
//         employee.processing_time = this.roundToTwoDecimals(employee.processing_time / 60);
//         this.processedEmployees.push(employee);
//       });
//     }

//     // private calculateEmployeesHourly(
//     //   employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
//     // ) {
//     //   Object.values(employeeDataMap).forEach((employee) => {
//     //     const hourlyChart = employee.hourlyChart;
//     //     Object.values(hourlyChart).forEach((hour) => {
//     //       hour.calculateEfficiency();
//     //     });
//     //   });
//     // }

//     private calculateEmployeesQuarterly(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>
//     ) {
//       Object.values(employeeDataMap).forEach((employee) => {
//         const quarterlyChart = employee.quarterlyChart;
//         // iterate over each quarter and calculate efficiency
//         Object.values(quarterlyChart).forEach((quarter) => {
//           quarter.calculateEfficiency(); // Use the `calculateEfficiency` method inside the Quarter class
//         });
//       });
//     }

//     // private calculateEmployeesDaily(
//     //   employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//     //   employeeWorkedHours: Record<string, Set<string>>
//     // ) {
//     //   Object.values(employeeDataMap).forEach((employee) => {
//     //     const dailyChart = employee.dailyChart;
//     //     // Calculate worked hours per day
//     //     const workedHoursPerDay: Record<string, number> = {};
//     //     Object.keys(dailyChart).forEach((date) => {
//     //       workedHoursPerDay[date] = [...employeeWorkedHours[employee.emp_name]].filter(
//     //         (date_hour) => {
//     //           return date_hour.startsWith(date);
//     //         }
//     //       ).length;
//     //     });
//     //     // Calculate efficiency for each day based on that day's worked hours
//     //     Object.entries(dailyChart).forEach(([date, daily]) => {
//     //       const dailyWorkedHours = workedHoursPerDay[date];
//     //       daily.calculateEfficiency(dailyWorkedHours);
//     //     });
//     //   });
//     // }

//     private getWorkedQuartersForDay(
//       emp_name: string,
//       transactionDate: string,
//       employeeWorkedQuarters: Record<string, Set<string>>
//     ): number {
//       // Get all worked quarters that start with the transactionDate
//       const dayWorkedQuarters = Array.from(employeeWorkedQuarters[emp_name]).filter((entry) =>
//         entry.startsWith(`${transactionDate}-`)
//       );

//       // Return the number of unique worked quarters for the day
//       return new Set(dayWorkedQuarters).size;
//     }

//     private calculateEmployeesDaily(
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//     ) {
//       Object.values(employeeDataMap).forEach((employee) => {
//         const dailyChart = employee.dailyChart;
//         Object.entries(dailyChart).forEach(([date, daily]) => {
//           const workedQuartersForDay = this.getWorkedQuartersForDay(
//             employee.emp_name,
//             date,
//             employeeWorkedQuarters
//           );
//           daily.calculateEfficiency(workedQuartersForDay);
//         });
//       });
//     }

//     private calcProcessingTime(
//       emp_name: string,
//       order_no: string,
//       revision: string,
//       part_no: string
//     ) {
//       const modelData = this.modelsCache.get(part_no)!;
//       // Check if part belongs to group G1-G4
//       if (/^G[1-4]$/.test(modelData?.GROUP || "")) {
//         const fromToArr: IFromTo[] = this.keyFromToMap.get(`${emp_name}-${order_no}-${revision}`)!;

//         // Iterate through each transition and apply the checks
//         for (let i = 0; i < fromToArr.length; i++) {
//           const { from, to } = fromToArr[i];

//           // COSMETIC_1: NFF - from A1070, next not starting with A107*
//           if (from === "A1070" && !/^A107/.test(to)) {
//             return modelData.COSMETIC_1;
//           }

//           // COSMETIC_2: Easy repair - next does not have A1073 for groups G1, G2, G4
//           // or next does not have A107X / A107L / A107U for group G3
//           if (
//             (["G1", "G2", "G4"].includes(modelData.GROUP) && !to.includes("A1073")) ||
//             (modelData.GROUP === "G3" && !/(A107X|A107L|A107U)/.test(to))
//           ) {
//             return modelData?.COSMETIC_2;
//           }

//           // COSMETIC_3: Hard repair - next has A1073 for G1, G2, G4; next has A107X for G3
//           if (
//             (["G1", "G2", "G4"].includes(modelData.GROUP) && to.includes("A1073")) ||
//             (modelData.GROUP === "G3" && to.includes("A107X"))
//           ) {
//             return modelData?.COSMETIC_3;
//           }

//           // COSMETIC_4: Harder repair - next does not have A107X, but has A107L or A107U for G3
//           if (modelData.GROUP === "G3" && !to.includes("A107X") && /(A107L|A107U)/.test(to)) {
//             return modelData?.COSMETIC_4;
//           }
//         }
//       }

//       // COSMETIC_5: Undefined - all remaining cases
//       const forRestAverage = { time: modelData?.COSMETIC_5 };

//       if (!forRestAverage.time) {
//         const noneModelData = this.modelsCache.get("NONE")!;
//         forRestAverage.time = noneModelData?.COSMETIC_5;
//       }

//       return forRestAverage.time;
//     }

//     private calculateWeightedAverages(employee: EfficiencyTypes.IProcessedEmployee) {
//       const workedMinutes = employee.worked_quarters * 15;
//       const { part_no_processing, units } = employee.estimated_target;

//       let totalProcessingTime = 0;
//       let totalUnits = 0;

//       for (const part_no in units) {
//         const processingTimeOfOrder = part_no_processing[part_no];
//         const unitsCount = units[part_no];

//         totalProcessingTime += processingTimeOfOrder * unitsCount;
//         totalUnits += unitsCount;
//       }

//       const averageProcessingTimePerUnit = totalUnits > 0 ? totalProcessingTime / totalUnits : 0;
//       const unitsPerWorkedQuarters =
//         averageProcessingTimePerUnit > 0 ? workedMinutes / averageProcessingTimePerUnit : 0;
//       const unitsPerHour = averageProcessingTimePerUnit > 0 ? 60 / averageProcessingTimePerUnit : 0;
//       const unitsPer8Hours = unitsPerHour * 7.5;

//       employee.estimated_target.units_per_worked_quarters = Math.round(unitsPerWorkedQuarters);
//       employee.estimated_target.difference_units_worked_time =
//         employee.processed_units - Math.round(unitsPerWorkedQuarters);
//       employee.estimated_target.units_per_hr = Math.round(unitsPerHour);
//       employee.estimated_target.units_per_8hrs = Math.round(unitsPer8Hours);
//     }

//     private update(
//       emp_name: string,
//       transactionDate: string,
//       transactionQuarter: string,
//       processingTimeOfUnit: number,
//       //
//       part_no: string,
//       //
//       employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee>,
//       employeeWorkedQuarters: Record<string, Set<string>>
//       // isLastIteration: boolean
//     ) {
//       // employeeWorkedHours[emp_name].add(`${transactionDate}-${transactionHour}`);
//       // worked_quarters
//       employeeWorkedQuarters[emp_name].add(`${transactionDate}-${transactionQuarter}`);
//       employeeDataMap[emp_name].processing_time += processingTimeOfUnit;
//       employeeDataMap[emp_name].processed_units += 1;

//       this.updateEstimatedTargets(
//         employeeDataMap[emp_name].estimated_target,
//         part_no,
//         processingTimeOfUnit
//       );

//       // const hourlyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].hourlyChart;
//       // if (!hourlyChart[transactionHour]) {
//       //   hourlyChart[transactionHour] = new TimePeriodMetrics();
//       // }
//       // hourlyChart[transactionHour].update(processingTimeOfUnit);

//       const quarterlyChart: Record<string, TimePeriodMetrics> =
//         employeeDataMap[emp_name].quarterlyChart;
//       if (!quarterlyChart[transactionQuarter]) {
//         quarterlyChart[transactionQuarter] = new TimePeriodMetrics();
//       }
//       quarterlyChart[transactionQuarter].update(processingTimeOfUnit);

//       const dailyChart: Record<string, TimePeriodMetrics> = employeeDataMap[emp_name].dailyChart;
//       if (!dailyChart[transactionDate]) {
//         dailyChart[transactionDate] = new TimePeriodMetrics();
//       }
//       dailyChart[transactionDate].update(processingTimeOfUnit);

//       // if (isLastIteration) {
//       //   this.calculateEmployeesBase(employeeDataMap, employeeWorkedQuarters);
//       //   // this.calculateEmployeesHourly(employeeDataMap);
//       //   this.calculateEmployeesQuarterly(employeeDataMap);
//       //   this.calculateEmployeesDaily(employeeDataMap, employeeWorkedQuarters);

//       //   Object.values(employeeDataMap).forEach((employee) => {
//       //     this.calculateWeightedAverages(employee);
//       //   });
//       // }
//     }

//     private processTransactions(transactions: AnalyticRaw.TTransactions) {
//       const employeeDataMap: Record<string, EfficiencyTypes.IProcessedEmployee> = {};
//       const employeeWorkedQuarters: Record<string, Set<string>> = {};

//       const transactionsWithRevision: (AnalyticRaw.ITransactionsRow & {
//         revision: string;
//       })[] = transactions
//         .sort((a, b) => Number(a.operation_no) - Number(b.operation_no))
//         .map((transaction: AnalyticRaw.ITransactionsRow) => {
//           const { emp_name, order_no, work_center_no, next_work_center_no } = transaction;

//           // Function to retrieve the next revision or create a new one if needed
//           const retrieveLastRevisionKey = () => {
//             const baseKey = `${emp_name}-${order_no}`;
//             const matchingKeys = [...this.keyFromToMap.keys()].filter((key) =>
//               key.startsWith(baseKey)
//             );

//             // If there are no matching keys, return the initial revision key
//             if (matchingKeys.length === 0) {
//               return `${baseKey}-0`;
//             }

//             // Sort keys to find the highest revision number
//             matchingKeys.sort((a, b) => {
//               const revisionA = parseInt(a.split("-").pop()!, 10);
//               const revisionB = parseInt(b.split("-").pop()!, 10);
//               return revisionB - revisionA; // Descending order
//             });

//             // Return the key with the largest revision
//             return matchingKeys[0];
//           };

//           // Retrieve the last revision key
//           const lastRevisionKey = retrieveLastRevisionKey();

//           if (work_center_no === "A1070") {
//             // Create the next revision key by incrementing the last revision number
//             const currentRevision = parseInt(lastRevisionKey.split("-").pop()!, 10);
//             const newRevision = currentRevision + 1;
//             const newKey = `${emp_name}-${order_no}-${newRevision}`;

//             // Initialize a new array in the map for the new revision if not already present
//             if (!this.keyFromToMap.has(newKey)) {
//               this.keyFromToMap.set(newKey, []);
//             }

//             // Set the key for this transition to the new revision key
//             this.keyFromToMap.get(newKey)!.push({
//               from: work_center_no,
//               to: next_work_center_no,
//             });

//             return { ...transaction, revision: String(newRevision) };
//           } else {
//             // indicates that the unit hasn't been processed at A1070 by this person (revision 0)
//             if (!this.keyFromToMap.has(lastRevisionKey)) {
//               this.keyFromToMap.set(lastRevisionKey, []);
//             }

//             this.keyFromToMap.get(lastRevisionKey)!.push({
//               from: work_center_no,
//               to: next_work_center_no,
//             });
//             return { ...transaction, revision: "" };
//           }
//         });

//       transactionsWithRevision.forEach(
//         (
//           transaction
//           //index
//         ) => {
//           const { emp_name, order_no, revision, part_no, work_center_no, datedtz } = transaction;

//           if (work_center_no === "A1070") {
//             const processingTimeOfOrder = this.calcProcessingTime(
//               emp_name,
//               order_no,
//               revision,
//               part_no
//             );
//             if (!processingTimeOfOrder) return;

//             const transactionDate = this.extractTransactionDate(datedtz);
//             const transactionQuarter = this.getTransactionQuarter(datedtz);
//             const shift = this.extractShift(datedtz);

//             this.initializeEmployeeData(employeeDataMap, employeeWorkedQuarters, emp_name, shift);

//             // const isLastIteration = index === transactions.length - 1;
//             this.update(
//               emp_name,
//               transactionDate,
//               transactionQuarter,
//               processingTimeOfOrder,
//               part_no,
//               employeeDataMap,
//               employeeWorkedQuarters
//             );
//           }
//         }
//       );

//       return {
//         employeeDataMap,
//         employeeWorkedQuarters,
//       };
//     }

//     // HELPER FUNCTIONS

//     private extractTransactionDate(datedtz: Date): string {
//       return moment(datedtz).format("YYYY-MM-DD");
//     }

//     private getTransactionQuarter(datedtz: Date): string {
//       const date = moment(datedtz);
//       const startMinute = date.minute();
//       let quarterStart;

//       if (startMinute < 15) {
//         quarterStart = "00";
//       } else if (startMinute < 30) {
//         quarterStart = "15";
//       } else if (startMinute < 45) {
//         quarterStart = "30";
//       } else {
//         quarterStart = "45";
//       }

//       // Calculate the start time of the quarter
//       const quarterStartTime = moment(datedtz)
//         .startOf("hour")
//         .add(parseInt(quarterStart), "minutes");

//       // Calculate the end time of the quarter, which is 15 minutes after the start time
//       const quarterEndTime = quarterStartTime.clone().add(15, "minutes");

//       // Format the start and end times into HH:mm format
//       const formattedStart = quarterStartTime.format("HH:mm");
//       const formattedEnd = quarterEndTime.format("HH:mm");

//       return `${formattedStart}-${formattedEnd}`;
//     }

//     private extractShift(datedtz: Date): 1 | 2 | 3 {
//       const hour = moment(datedtz).hour();
//       if (hour >= 6 && hour < 14) return 1;
//       if (hour >= 14 && hour < 22) return 2;
//       return 3;
//     }

//     public getProcessedData(): EfficiencyTypes.IProcessedEmployees {
//       return this.processedEmployees.map((emp: EfficiencyTypes.IProcessedEmployee) => {
//         return {
//           ...emp,
//           worked_hours: emp.worked_quarters / 4,
//         };
//       });
//     }
//   }
// }
