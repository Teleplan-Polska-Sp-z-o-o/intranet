import { v4 as uuidv4 } from "uuid"; // Import UUID generator

class ChartHelper {
  private static colorPools: Map<string, { available: string[]; used: string[] }> = new Map();
  private static predefinedColors: string[] = [
    "rgb(255, 99, 132)", // Red
    "rgb(255, 159, 64)", // Orange
    "rgb(255, 205, 86)", // Yellow
    "rgb(75, 192, 192)", // Cyan
    "rgb(54, 162, 235)", // Blue
    "rgb(153, 102, 255)", // Purple
  ];

  private chartUuid: string;

  constructor() {
    this.chartUuid = uuidv4(); // Assign or generate a unique UUID for the chart

    // Initialize a separate color pool for each UUID if it doesn't exist
    if (!ChartHelper.colorPools.has(this.chartUuid)) {
      ChartHelper.colorPools.set(this.chartUuid, {
        available: [...ChartHelper.predefinedColors],
        used: [],
      });
    }
  }

  // 🔹 Get a unique color for this specific chart UUID
  getUniqueChartjsColor(): { color: string; tColor: string } {
    const pool = ChartHelper.colorPools.get(this.chartUuid);

    if (!pool) throw new Error("Color pool not found for this chart instance.");

    if (pool.available.length === 0) {
      // If all colors are used, reset the pool
      pool.available = [...pool.used];
      pool.used = [];
    }

    // Pick a random color
    const randomIndex = Math.floor(Math.random() * pool.available.length);
    const color = pool.available.splice(randomIndex, 1)[0]; // Remove from available
    pool.used.push(color); // Track used colors

    return {
      color,
      tColor: color.replace(")", ", 0.2)"), // Create transparent version
    };
  }

  // 🔹 Reset colors for this specific chart UUID
  resetColors(): void {
    const pool = ChartHelper.colorPools.get(this.chartUuid);
    if (pool) {
      pool.available = [...pool.used];
      pool.used = [];
    }
  }
}

export { ChartHelper };
