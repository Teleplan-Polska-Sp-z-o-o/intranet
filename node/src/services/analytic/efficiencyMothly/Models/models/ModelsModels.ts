import { IProcessedUnit } from "./ModelsTypes";
import { SKY } from "./TouchTime";

export class Models<T extends SKY.TTS> {
  private cache: Map<string, T> = new Map();
  private ttKey: keyof T;
  private averageKey?: string;
  private missingPartNumbers: Set<string> = new Set();

  constructor(modelsObj: T[], ttKey: keyof T, averageKey?: string) {
    this.ttKey = ttKey;
    this.averageKey = averageKey;

    modelsObj.forEach((model) => {
      const { IFS_PART_NO } = model;
      if (IFS_PART_NO) {
        this.cache.set(IFS_PART_NO, model);
      }
    });
  }

  public getTT(partNo: string): number | undefined {
    const model = this.cache.get(partNo);

    if (model) {
      return Number(model[this.ttKey]);
    } else {
      // If model is not found, track it
      this.missingPartNumbers.add(partNo);
    }

    // Fallback to average model if defined
    if (this.averageKey) {
      const averageModel = this.cache.get(this.averageKey);
      return averageModel ? Number(averageModel[this.ttKey]) : undefined;
    }

    return undefined;
  }
}

export class ProcessedUnit implements IProcessedUnit {
  quantity: number = 0;

  constructor(readonly tt: number) {}

  add(): this {
    this.quantity = this.quantity + 1;
    return this;
  }
}
