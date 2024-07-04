import {
  IPermission,
  TConfidentiality,
  TPermissionStringCode,
  UserGroup,
} from "../../interfaces/user/UserTypes";

class Permission implements IPermission {
  id: number;
  read: boolean;
  write: boolean;
  control: boolean;
  confidentiality: TConfidentiality;
  groups: UserGroup[];

  constructor(
    permission: TPermissionStringCode | IPermission = "user",
    confidentiality: TConfidentiality = "public",
    groups: UserGroup[] = []
  ) {
    let write: boolean = false;
    let control: boolean = false;
    let id: number = 0;

    if (typeof permission === "object") {
      id = permission.id;
      write = permission.write;
      control = permission.control;
    } else {
      switch (permission) {
        case "user":
          break;
        case "moderator":
          write = true;
          break;
        case "admin":
          write = true;
          control = true;
          break;
        default:
          throw new Error("Invalid permission type");
      }
    }

    this.id = id;
    this.read = true;
    this.write = write;
    this.control = control;
    this.confidentiality = confidentiality;
    this.groups = groups;
  }

  getPermissionStringType(): TPermissionStringCode {
    if (this.control) {
      return "admin";
    } else if (this.write) {
      return "moderator";
    } else {
      return "user";
    }
  }
}

export { Permission };
