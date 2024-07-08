interface IPermission {
  read: boolean;
  write: boolean;
  control: boolean;
}

interface ISettings {
  id: number | null;
  theme: string;
  language: string;
}

interface ILogin {
  username: string;
  domain: string;
  password: string;
}

interface IUser {
  id: number;
  username: string;
  domain: string;
}

interface IUserInfo {
  position: string | null;
  department: string | null;
  decisionMaker: boolean | null;
}

type TPermissionStringCode = "user" | "moderator" | "admin";

type TConfidentiality = "public" | "restricted" | "secret";

enum PermissionGroup {
  DOCUMENTS = "documents",
  CHANGE = "change",
  MATRIX = "matrix",
  ADMIN = "admin",
}

type PermissionDocumentsSubgroup = "instructions" | "visuals" | "msd" | "assistant";
type PermissionChangeSubgroup = "pcr" | "pcn" | "dcn";
type PermissionMatrixSubgroup = "departments" | "documents" | "competences";
type PermissionAdminSubgroup = "user-info" | "user-permissions" | "news";

interface PermissionGroups {
  [key: string]: Array<string>;
  [PermissionGroup.DOCUMENTS]: Array<PermissionDocumentsSubgroup>;
  [PermissionGroup.CHANGE]: Array<PermissionChangeSubgroup>;
  [PermissionGroup.MATRIX]: Array<PermissionMatrixSubgroup>;
  [PermissionGroup.ADMIN]: Array<PermissionAdminSubgroup>;
}

class StaticGroups {
  public static getAdminGroups(): PermissionGroups {
    return {
      [PermissionGroup.DOCUMENTS]: ["instructions", "visuals", "msd", "assistant"],
      [PermissionGroup.CHANGE]: ["pcr", "pcn", "dcn"],
      [PermissionGroup.MATRIX]: ["departments", "documents", "competences"],
      [PermissionGroup.ADMIN]: ["user-info", "user-permissions", "news"],
    };
  }
  public static getBaseUserGroups(): Partial<PermissionGroups> {
    return {
      [PermissionGroup.DOCUMENTS]: ["instructions", "visuals", "msd", "assistant"],
    };
  }
}

export {
  StaticGroups,
  PermissionGroup,
  PermissionDocumentsSubgroup,
  PermissionChangeSubgroup,
  PermissionMatrixSubgroup,
  PermissionAdminSubgroup,
  PermissionGroups,
};

export {
  IPermission,
  ISettings,
  IUser,
  ILogin,
  IUserInfo,
  TPermissionStringCode,
  TConfidentiality,
};
