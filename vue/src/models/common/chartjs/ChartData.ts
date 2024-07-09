import { ChartHelper } from "./ChartHelper";

class ChartData {
  label: string;
  data: Array<number> = [];
  fill: boolean = false;

  borderColor: string;
  backgroundColor: string;

  tension: number = 0.4;

  constructor(label: string, data: Array<number>, chartHelper: ChartHelper) {
    this.label = label;
    this.data = data;

    const color = chartHelper.getUniqueColor();

    this.borderColor = color;
    this.backgroundColor = `${color.slice(0, -1)}, 0.2)`;
  }
}

export { ChartData };
