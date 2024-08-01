import { UserEntity } from "../../models/user/UserEntity";

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

type TPermissionDocumentsSubgroup = "instructions" | "visuals" | "msd" | "assistant";
type TPermissionChangeSubgroup = "pcr" | "pcn" | "dcr" | "dcn";
type TPermissionMatrixSubgroup = "departments" | "documents" | "competences";
type TPermissionAdminSubgroup = "user-info" | "user-permissions" | "news";

type TPermissionSubgroup =
  | TPermissionDocumentsSubgroup
  | TPermissionChangeSubgroup
  | TPermissionMatrixSubgroup
  | TPermissionAdminSubgroup;

type TPermissionSubgroupArray =
  | Array<TPermissionDocumentsSubgroup>
  | Array<TPermissionChangeSubgroup>
  | Array<TPermissionMatrixSubgroup>
  | Array<TPermissionAdminSubgroup>;

interface UserSubgroup {
  id: number;
  name: TPermissionSubgroup;
}

type TPermissionGroup = "documents" | "change" | "matrix" | "admin";

interface UserGroup {
  id: number;
  name: TPermissionGroup;
  subgroups: Array<UserSubgroup>;
}

type TConfidentiality = "public" | "restricted" | "secret";

// enum PermissionGroup {
//   DOCUMENTS = "documents",
//   CHANGE = "change",
//   MATRIX = "matrix",
//   ADMIN = "admin",
// }

interface IPermissionGroups {
  [key: string]: TPermissionSubgroupArray;
  documents: Array<TPermissionDocumentsSubgroup>;
  change: Array<TPermissionChangeSubgroup>;
  matrix: Array<TPermissionMatrixSubgroup>;
  admin: Array<TPermissionAdminSubgroup>;
}

class StaticGroups {
  public static getAdminGroups(): IPermissionGroups {
    return {
      documents: ["instructions", "visuals", "msd", "assistant"],
      change: ["pcr", "pcn", "dcr", "dcn"],
      matrix: ["departments", "documents", "competences"],
      admin: ["user-info", "user-permissions", "news"],
    };
  }
  public static getBaseUserGroups(): Partial<IPermissionGroups> {
    return {
      documents: ["instructions", "visuals", "msd", "assistant"],
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
