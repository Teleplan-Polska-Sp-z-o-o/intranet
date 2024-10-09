import { User } from "../../orm/entity/user/UserEntity";

interface ISettings {
  id: number | null;
  theme: string;
  language: string;
}

interface Passport {
  username: string;
  domain: string;
}

type ILogin = Passport & {
  password: string;
};

interface IUser {
  id: number;
  uuid?: string;
  username: string;
  domain?: string;
}

interface IUserInfo {
  position: string | null;
  department: string | null;
  decisionMaker: boolean | null;
}

type TConfidentiality = "public" | "restricted" | "secret";

enum PermissionGroup {
  DOCUMENTS = "documents",
  CHANGE = "change",
  MATRIX = "matrix",
  ADMIN = "admin",
  ANALYTIC = "analytic",
  // SAFETY = "safety",
}

type PermissionDocumentsSubgroup = "all" | "quick" | "assistant";
type PermissionChangeSubgroup = "pcr" | "pcn" | "dcr" | "dcn";
type PermissionMatrixSubgroup = "departments" | "documents" | "competences";
type PermissionAdminSubgroup = "user-info" | "user-permissions" | "news";
type PermissionAnalyticSubgroup = "sky";
// type PermissionSafetySubgroup = "manage-acknowledgment" | "document-acknowledged";

interface PermissionGroups {
  [key: string]: Array<string>;
  [PermissionGroup.DOCUMENTS]: Array<PermissionDocumentsSubgroup>;
  [PermissionGroup.CHANGE]: Array<PermissionChangeSubgroup>;
  [PermissionGroup.MATRIX]: Array<PermissionMatrixSubgroup>;
  [PermissionGroup.ADMIN]: Array<PermissionAdminSubgroup>;
  [PermissionGroup.ANALYTIC]: Array<PermissionAnalyticSubgroup>;
  // [PermissionGroup.SAFETY]: Array<PermissionSafetySubgroup>;
}

class StaticGroups {
  public static getAdminGroups(): PermissionGroups {
    return {
      [PermissionGroup.DOCUMENTS]: ["all", "quick", "assistant"],
      [PermissionGroup.CHANGE]: ["pcr", "pcn", "dcr"],
      [PermissionGroup.MATRIX]: ["departments", "documents", "competences"],
      [PermissionGroup.ADMIN]: ["user-info", "user-permissions", "news"],
      [PermissionGroup.ANALYTIC]: ["sky"],
      // [PermissionGroup.SAFETY]: ["manage-acknowledgment", "document-acknowledged"],
    };
  }
  public static getBaseUserGroups(): Partial<PermissionGroups> {
    return {
      [PermissionGroup.DOCUMENTS]: ["all", "quick", "assistant"],
    };
  }
}

interface IUserLoginDetails {
  id: number;
  user: User;
  loginTime: Date;
  logoutTime: Date | null;
  duration: number;
}

export { IUserLoginDetails };

export {
  StaticGroups,
  PermissionGroup,
  PermissionDocumentsSubgroup,
  PermissionChangeSubgroup,
  PermissionMatrixSubgroup,
  PermissionAdminSubgroup,
  PermissionGroups,
};
export { ISettings, IUser, ILogin, IUserInfo, TConfidentiality };

export namespace UserTypes {
  export namespace ToolStatistics {
    export interface IFields {
      id: number;
      toolName: string;
      enterCount: number;
    }
  }
}
