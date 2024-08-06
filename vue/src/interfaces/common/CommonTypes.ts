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
}

export { CommonTypes };
