// import { IPermission } from "../../interfaces/user/IPermission";

// class Permission implements IPermission {
//   read: boolean;
//   write: boolean;
//   control: boolean;

//   constructor(permission: IPermission | null = null) {
//     this.read = permission?.read ?? true;
//     this.write = permission?.write ?? false;
//     this.control = permission?.control ?? false;
//   }
// }

// export { Permission };

import { IPermission, TPermissionStringCode } from "../../interfaces/user/UserTypes";

class Permission implements IPermission {
  read: boolean;
  write: boolean;
  control: boolean;

  constructor(permission: TPermissionStringCode | IPermission = "user") {
    let write: boolean = false;
    let control: boolean = false;

    if (!(permission instanceof Object)) {
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
