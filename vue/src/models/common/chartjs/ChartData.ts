import { ChartHelper } from "./ChartHelper";

class ChartData {
  label: string;
  data: Array<number> = [];
  fill: boolean = false;

  borderColor: string;
  backgroundColor: string;

  tension: number = 0.4;

  constructor(label: string, data: Array<number>, chartHelper: ChartHelper, colors?: "chartjs") {
    this.label = label;
    this.data = data;

    const color:
      | string
      | {
          color: string;
          tColor: string;
        } =
      colors === "chartjs" ? chartHelper.getRandomChartjsColor() : chartHelper.getUniqueColor();

    if (typeof color === "string") {
      this.borderColor = color;
      this.backgroundColor = `${color.slice(0, -1)}, 0.2)`;
    } else {
      this.borderColor = color.color;
      this.backgroundColor = color.tColor;
    }
  }
}

export { ChartData };
