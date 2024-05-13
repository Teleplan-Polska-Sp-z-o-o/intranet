interface IUserInput {
  id: number;
  variant: "select" | "text";
  label: string;
  items?: Array<string>;
  val: string;
}

export type { IUserInput };
