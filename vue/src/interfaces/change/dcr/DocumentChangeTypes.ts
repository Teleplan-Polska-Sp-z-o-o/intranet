import { CommonTypes } from "../../common/CommonTypes";
import { IFileItem } from "../../document/DocumentTypes";

namespace DocumentChangeTypes {
  export type TStatus = "Draft" | "Complete" | "Checked" | "Approved" | "Rejected" | "Registered";

  export type TSourceValue =
    | "previously_uploaded"
    | "not_previously_uploaded_new"
    | "not_previously_uploaded_existing";
  // export type TSourceTitle =
  //   | "Previously uploaded"
  //   | "Not previously uploaded, new document"
  //   | "Not previously uploaded, existing document";
  export interface TSource {
    title: string;
    value: TSourceValue;
  }

  interface IDocumentChangeSelfProcessing {
    id: number;
    no: string | null;
    year: number;
    originator: string;
    /**
     * Draft: The request is being filled.
     * Complete: The request has been filled and is awaiting review.
     * Checked: The request has been checked and is awaiting approval.
     * Approved: The request has been approved and is awaiting registration.
     * Rejected: The request has been rejected during the review process.
     * Registered: The request has been registered and is now considered final.
     */
    status: TStatus;
  }

  export type TPriority = "low" | "medium" | "high";
  export type TRequireAcknowledgmentOrTraining = "acknowledgment" | "training";

  export interface IDocumentChangeFields {
    priority: TPriority;
    affected: string;
    docxNumber: string | null;
    docxRevision: number;
    docxReference: string;
    checker: string | null;
    approver: string | null;
    registerer: string | null;
    /**
     * JSON Array of competence code strings
     */
    affectedCompetences: string | null;
    requireAcknowledgmentOrTraining: TRequireAcknowledgmentOrTraining;
    trainingDetails: string | null;
    /**
     * JSON Array of request file names
     */
    fileNames: string;
    docxSource: TSourceValue;
    tags: string | null;
  }

  interface IDocumentChangeReview {
    checkerComment: string | null;
    checked: boolean | null;
    checkedDate: Date | null;
    approverComment: string | null;
    approved: boolean | null;
    approvedDate: Date | null;
    registererComment: string | null;
    registered: boolean | null;
    registeredDate: Date | null;
  }

  interface IDocumentChangeTimeline {
    /**
     * JSON Object of request dialog
     */
    timeline: string;
  }

  export type TDocumentChange = CommonTypes.OrmTypes.IOrmBase &
    IDocumentChangeSelfProcessing &
    IDocumentChangeFields &
    IDocumentChangeReview &
    IDocumentChangeTimeline & { [key: string]: any };

  export namespace Processing {
    export interface IReview {
      id: number;
      issuer: string;
      decision: boolean;
      comment?: string;
    }
    export interface ISaveData {
      dc: TDocumentChange;
      files: IFileItem[];
    }

    export interface ITimelineElement {
      id: number;
      status: TStatus;
      issuer: string;
      date: Date;
      comment: string | null | undefined;
    }
    export type TTimeline = ITimelineElement[];

    export enum ETimelineElementColor {
      Draft = "#808080", // gray
      Complete = "#0000FF", // blue
      Checked = "#008000", // green
      Rejected = "#FF0000", // red
      Approved = "#006400", // dark green
      Registered = "#FFA500", // orange
    }

    export type Role = "Checker" | "Approver" | "Registerer";

    export interface IRoleAction {
      id: number;
      no: string;
      priority: TPriority;
      username: string;
      role: Role;
      since: string | undefined;
      taken: string | undefined;
      elapsed: number | undefined;
    }
  }
}

export { DocumentChangeTypes };
