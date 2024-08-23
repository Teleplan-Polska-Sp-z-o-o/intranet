import { TPermissionGroup } from "../user/UserTypes";

namespace CommonTypes {
  export namespace FileTypes {
    export enum DocEndpoint {
      doc = "/documents",
      dc = "/dc_documents",
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
    export namespace OrmTypes {
      export interface IOrmBase {
        ormCreateDate: Date;
        ormUpdateDate: Date | null;
        ormVersion: number;
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
