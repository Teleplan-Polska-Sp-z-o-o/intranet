import { IProcessedUnit } from "./ModelsTypes";
import { Bose, Ingenico, Lenovo, Liberty, SKY } from "./TouchTime";

/**
 * A generic model cache and processor that provides time tracking (TT) data for parts.
 * It supports either accessing a direct property on the model or using a custom function
 * to determine TT based on part number.
 */
export class Models<T extends SKY.TTS | Liberty.TTS | Ingenico.TTS | Lenovo.TTS | Bose.TTS> {
  cache: Map<string, T> = new Map();
  ttKey: keyof T;
  averageKey?: string;
  missingCache: Set<string> = new Set();

  // pnKey: keyof T replaces getKeyFn
  constructor(modelsObj: T[], getKeyFn: (model: T) => string, ttKey: keyof T, averageKey?: string) {
    this.ttKey = ttKey;
    this.averageKey = averageKey;

    modelsObj.forEach((model) => {
      const key = getKeyFn(model);
      if (key) {
        this.cache.set(key, model);
      }
    });
  }

  /**
   * Returns the TT value for a given part number.
   * Falls back to the average model if the part is missing.
   *
   * @param cacheKey The part number to retrieve TT for.
   * @returns The TT value or undefined if not found.
   */
  public getTT(cacheKey: string): number | undefined {
    const model = this.cache.get(cacheKey);

    if (model && Number(model[this.ttKey]) > 0) {
      return Number(model[this.ttKey]);
    } else {
      // If model is not found, track it
      this.missingCache.add(`${cacheKey}::${this.ttKey.toString()}`);
    }

    // Fallback to average model if defined
    if (this.averageKey) {
      const averageModel = this.cache.get(this.averageKey);
      return averageModel ? Number(averageModel[this.ttKey]) : undefined;
    }

    return undefined;
  }
}

/**
 * A class representing a unit that has been processed with touch time,
 * keeping track of its quantity.
 */
export class ProcessedUnit implements IProcessedUnit {
  quantity: number = 0;

  constructor(readonly tt: number) {}

  add(): this {
    this.quantity = this.quantity + 1;
    return this;
  }
}
