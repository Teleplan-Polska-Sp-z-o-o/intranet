namespace CommonTypes {
  export namespace FileTypes {
    export enum DocEndpoint {
      doc = "/documents",
      dc = "/dc_documents",
    }

    export type AcceptedType = ".pdf" | ".ppt" | ".pptx" | ".xls" | ".xlsx" | ".doc" | ".docx";
  }
}

export { CommonTypes };
