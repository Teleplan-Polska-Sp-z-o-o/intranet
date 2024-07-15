type Color = "info" | "success" | "error";
interface Alert {
  timeout: number;
  display: boolean;
  message: string;
  color: Color;
}

export type { Color, Alert };
