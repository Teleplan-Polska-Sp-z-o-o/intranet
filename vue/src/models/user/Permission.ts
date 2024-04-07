import { IPermission } from "../../interfaces/user/IPermission";

class Permission implements IPermission {
  read: boolean;
  write: boolean;
  control: boolean;

  constructor(permission: "User" | "Moderator" | "Admin" | IPermission = "User") {
    let write: boolean = false;
    let control: boolean = false;

    if (!(permission instanceof Object)) {
      switch (permission) {
        case "User":
          break;
        case "Moderator":
          write = true;
          break;
        case "Admin":
          write = true;
          control = true;
          break;
        default:
          throw new Error("Invalid permission type");
      }
    } else {
      write = permission.write;
      control = permission.control;
    }

    this.read = true;
    this.write = write;
    this.control = control;
  }
}

export { Permission };
