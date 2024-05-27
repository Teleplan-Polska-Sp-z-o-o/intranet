import { IUserInfo } from "../../interfaces/user/IUserInfo";

class UserInformation implements IUserInfo {
  position: string;
  department: string;
  decisionMaker: boolean;

  constructor(info: IUserInfo = undefined) {
    this.position = info?.position ?? null;
    this.department = info?.department ?? null;
    this.decisionMaker = info?.decisionMaker ?? null;
  }
}

export { UserInformation };
