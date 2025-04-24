import { EstimatedEmployeeTarget } from "../models/EstimatedModels";
import { ProcessedUnit } from "../models/ModelsModels";
import { TimePeriodMetrics } from "../time/TimeModels";

export interface IProcessedEmployee {
  id: string;
  measuredRecordIds: string[];
  employeeIdentifier: string;
  employeeShift: 1 | 2 | 3;
  employeeWorkedHours: number;
  employeeWorkedQuarters: number;
  totalWorkDurationInMinutes: number;
  totalProcessingDurationOfUnitsInMinutes: number;
  totalProcessingDurationOfUnitsInHours: number;
  processedUnitsByModel: Record<string, ProcessedUnit>;
  totalProcessedUnits: number;
  estimatedEmployeeTarget: EstimatedEmployeeTarget;
  efficiencyPercentage: number;
  shiftChart: Record<string, TimePeriodMetrics>;
  dailyChart: Record<string, TimePeriodMetrics>;
}

export interface IEmployeeUnderProcessing {
  id: string;
  measuredRecordIds: string[];
  employeeIdentifier: string;
  employeeShift: 1 | 2 | 3;
  totalWorkDurationInMinutes: number;
  totalProcessingDurationOfUnitsInMinutes: number;
  processedUnitsByModel: Map<string, ProcessedUnit>;
  totalProcessedUnits: number;
  estimatedEmployeeTarget: EstimatedEmployeeTarget;
  efficiencyPercentage: number;
  shiftChart: Map<string, TimePeriodMetrics>;
  dailyChart: Map<string, TimePeriodMetrics>;
}
