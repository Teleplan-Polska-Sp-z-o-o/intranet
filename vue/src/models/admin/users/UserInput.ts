import { IUserInput } from "../../../interfaces/admin/users/IUserInput";

class UserInput implements IUserInput {
  id: number;
  variant: "select" | "text";
  label: string;
  val: string;
  items?: Array<string>;

  constructor(input: IUserInput) {
    this.id = input.id;
    this.variant = input.variant;
    this.label = input.label;
    this.val = input.val;
    this.items = input?.items;
  }
}

export { UserInput };
