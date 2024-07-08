import { IUserInfo } from "../../interfaces/user/UserTypes";

class UserInformation implements IUserInfo {
  position: string | null;
  department: string | null;
  decisionMaker: boolean | null;

  constructor(info: IUserInfo = undefined) {
    this.position = info?.position ?? null;
    this.department = info?.department ?? null;
    this.decisionMaker = info?.decisionMaker ?? null;
  }
}

export { UserInformation };
