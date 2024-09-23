import { IUser, TPermissionGroup } from "../user/UserTypes";

namespace CommonTypes {
  export namespace FileTypes {
    export enum DocEndpoint {
      doc = "/documents",
      dc = "/dc_documents",
      analytic = "/analytic_documents",
    }

    export type AcceptedType = ".pdf" | ".ppt" | ".pptx" | ".xls" | ".xlsx" | ".doc" | ".docx";
  }

  export namespace LanguageTypes {
    export const LANGUAGES = {
      EN: "en",
      PL: "pl",
      UA: "ua",
    } as const;

    export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
  }

  export namespace Api {
    export interface GetManager {
      get(specificGetValue?: any): any;
    }
    export interface CreateFormDataManager {
      createFormData(specificFormDataValue?: any): any;
    }

    export namespace OrmTypes {
      export interface IOrmBase {
        ormCreateDate: Date;
        ormUpdateDate: Date | null;
        ormVersion: number;
      }

      export interface IOrmUserAction {
        user: IUser;
        date: Date;
      }

      export interface ICreatedBy {
        /**
         * The user and date when the record was created.
         */
        createdBy: IOrmUserAction;
      }

      export interface IUpdatedBy {
        /**
         * The users and dates when the record was updated.
         */
        updatedBy: IOrmUserAction[];
      }
    }
  }

  export namespace Tools {
    export interface IFilter {
      href: string;
      meta: {
        group: TPermissionGroup;
        baseHref: string;
      };
    }
  }
}

export { CommonTypes };
