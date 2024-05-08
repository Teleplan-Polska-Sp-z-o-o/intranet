import { Department } from "../../orm/entity/document/DepartmentEntity";

interface IUserInfo {
  position: string | null;
  department: Department | null;
  decisionMaker: boolean | null;
}

export { IUserInfo };
