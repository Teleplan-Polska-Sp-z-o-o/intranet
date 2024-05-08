import { IUserInfo } from "../../interfaces/user/IUserInfo";
import { Department } from "../../orm/entity/document/DepartmentEntity";

class UserInformation implements IUserInfo {
  position: string;
  department: Department;
  decisionMaker: boolean;

  constructor(info: IUserInfo = undefined) {
    this.position = info?.position ?? null;
    this.department = info?.department ?? null;
    this.decisionMaker = info?.decisionMaker ?? null;
  }
}

export { UserInformation };
