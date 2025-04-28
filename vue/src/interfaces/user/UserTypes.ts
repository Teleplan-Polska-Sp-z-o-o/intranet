import { UserEntity } from "../../models/user/UserEntity";
import { CommonTypes } from "../common/CommonTypes";

interface IPermission {
  id: number;
  confidentiality: TConfidentiality;
  groups: Array<UserGroup>;
}

interface ISettings {
  id: number | null;
  theme: string;
  language: "pl" | "en" | "ua";
}

interface IUser {
  id: number;
  username: string;
  domain: string;
}

type TPermissionDocumentsSubgroup = "all" | "quick" | "assistant";
type TPermissionChangeSubgroup = "pcr" | "pcn" | "dcr" | "dcn";
type TPermissionMatrixSubgroup = "departments" | "documents" | "competences";
type TPermissionAdminSubgroup = "user-info" | "user-permissions" | "news";
type TPermissionAnalyticSubgroup = "sky" | "lenovo" | "ingenico" | "liberty" | "dell" | "bose";
// type TPermissionWarehouseSubgroup = "wip";
type TPermissionTCDSubgroup = "dashboard" | "new" | "released";
// type TPermissionSafetySubgroup = "manage-acknowledgment" | "document-acknowledged";

type TPermissionSubgroup =
  | TPermissionDocumentsSubgroup
  | TPermissionChangeSubgroup
  | TPermissionMatrixSubgroup
  | TPermissionAdminSubgroup
  | TPermissionAnalyticSubgroup
  // | TPermissionWarehouseSubgroup
  | TPermissionTCDSubgroup;
// | TPermissionSafetySubgroup;

type TPermissionSubgroupArray =
  | Array<TPermissionDocumentsSubgroup>
  | Array<TPermissionChangeSubgroup>
  | Array<TPermissionMatrixSubgroup>
  | Array<TPermissionAdminSubgroup>
  | Array<TPermissionAnalyticSubgroup>
  // | Array<TPermissionWarehouseSubgroup>
  | Array<TPermissionTCDSubgroup>;
// | Array<TPermissionSafetySubgroup>;

interface UserSubgroup {
  id: number;
  name: TPermissionSubgroup;
}

type TPermissionGroup =
  | "documents"
  | "change"
  | "matrix"
  | "admin"
  | "analytic"
  // | "warehouse"
  | "tcd";
// | "safety";

interface UserGroup {
  id: number;
  name: TPermissionGroup;
  subgroups: Array<UserSubgroup>;
}

type TConfidentiality = "public" | "restricted" | "secret";

interface IPermissionGroups {
  [key: string]: TPermissionSubgroupArray;
  documents: Array<TPermissionDocumentsSubgroup>;
  change: Array<TPermissionChangeSubgroup>;
  matrix: Array<TPermissionMatrixSubgroup>;
  admin: Array<TPermissionAdminSubgroup>;
  analytic: Array<TPermissionAnalyticSubgroup>;
  // warehouse: Array<TPermissionWarehouseSubgroup>;
  tcd: Array<TPermissionTCDSubgroup>;
  // safety: Array<TPermissionSafetySubgroup>;
}

class StaticGroups {
  public static getAdminGroups(): IPermissionGroups {
    return {
      documents: ["all", "quick", "assistant"],
      change: ["pcr", "pcn", "dcr", "dcn"],
      matrix: ["departments", "documents", "competences"],
      admin: ["user-info", "user-permissions", "news"],
      analytic: ["sky", "lenovo", "ingenico", "liberty", "dell", "bose"],
      // warehouse: ["wip"],
      tcd: ["dashboard", "new", "released"],
      // safety: ["manage-acknowledgment", "document-acknowledged"],
    };
  }
  public static getBaseUserGroups(): Partial<IPermissionGroups> {
    return {
      documents: ["all", "quick", "assistant"],
    };
  }
}

interface IUserLoginDetails {
  id: number;
  user: UserEntity;
  loginTime: string;
  logoutTime: string | null;
  duration: number;
}

export namespace UserTypes {
  export namespace ToolStatistics {
    interface IFields {
      id: number;
      toolName: string;
      enterCount: number;
    }

    export type StatisticsEntity = CommonTypes.Api.OrmTypes.IOrmBase & IFields;
    export type ToolFilteredStatistics = CommonTypes.Tools.IFilter & StatisticsEntity;
  }
}

export { type IUserLoginDetails };

export {
  type IPermission,
  type ISettings,
  type IUser,
  type UserSubgroup,
  type UserGroup,
  type TConfidentiality,
  type TPermissionGroup,
  type TPermissionSubgroupArray,
  type TPermissionSubgroup,
  type TPermissionDocumentsSubgroup,
  type TPermissionChangeSubgroup,
  type TPermissionMatrixSubgroup,
  type TPermissionAdminSubgroup,
  type IPermissionGroups,
  StaticGroups,
};
