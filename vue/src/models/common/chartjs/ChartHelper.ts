class ChartHelper {
  private predefinedColors: string[];
  chartjsColors: {
    color: string;
    tColor: string;
  }[] = [];

  constructor() {
    this.predefinedColors = [
      "rgb(54, 162, 235)", // Blue
      "rgb(75, 192, 192)", // Cyan
      "rgb(153, 102, 255)", // Purple
      "rgb(255, 159, 64)", // Orange
      "rgb(255, 205, 86)", // Yellow
      "rgb(255, 99, 132)", // Red
      "rgb(255, 159, 64)", // Light Orange
      "rgb(54, 162, 235)", // Light Blue
      "rgb(153, 102, 255)", // Light Purple
      "rgb(75, 192, 192)", // Light Cyan
      "rgb(255, 205, 86)", // Light Yellow
      "rgb(54, 162, 235)", // Medium Blue
      "rgb(255, 99, 132)", // Light Red
      "rgb(75, 192, 192)", // Cyan
      "rgb(255, 205, 86)", // Medium Yellow
      "rgb(153, 102, 255)", // Medium Purple
      "rgb(255, 159, 64)", // Medium Orange
    ];

    const chartjsPredefinedColors: string[] = [
      "rgb(255, 99, 132)",
      "rgb(255, 159, 64)",
      "rgb(255, 205, 86)",
      "rgb(75, 192, 192)",
      "rgb(54, 162, 235)",
      "rgb(153, 102, 255)",
    ];
    this.chartjsColors = chartjsPredefinedColors.map((color) => {
      return {
        color,
        tColor: color.replace(")", ", 0.2)"),
      };
    });
  }

  // Function to get a unique color that is not in the excludeColors list
  getUniqueChartjsColor(excludeColors: string[]): { color: string; tColor: string } {
    // Filter out the colors that are in the excludeColors list
    const availableColors = this.chartjsColors.filter(
      (color) => !excludeColors.includes(color.color)
    );

    // If all colors are excluded, return a random color from the full list
    if (availableColors.length === 0) {
      return this.getRandomChartjsColor();
    }

    // Otherwise, randomly select one of the available colors
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  }

  public getRandomChartjsColor = () => {
    const randomIndex = Math.floor(Math.random() * this.chartjsColors.length);
    const color = this.chartjsColors[randomIndex];
    return color;
  };

  public getUniqueColor = (): string => {
    if (this.predefinedColors.length === 0) {
      throw new Error("No more unique colors available.");
    }
    const randomIndex = Math.floor(Math.random() * this.predefinedColors.length);
    const color = this.predefinedColors[randomIndex];
    this.predefinedColors.splice(randomIndex, 1);
    return color;
  };
}

export { ChartHelper };
