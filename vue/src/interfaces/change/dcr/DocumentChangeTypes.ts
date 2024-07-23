import { IFileItem } from "../../document/DocumentTypes";

namespace DocumentChangeTypes {
  export type TStatus = "Draft" | "Complete" | "Checked" | "Approved" | "Rejected" | "Registered";

  interface IOrmBase {
    ormCreateDate: Date;
    ormUpdateDate: Date | null;
    ormVersion: number;
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
  }

  interface IDocumentChangeAssessment {
    checkerComment: string | null;
    checked: boolean | null;
    checkedDate: Date | null;
    approverComment: string | null;
    approved: boolean | null;
    approvedDate: Date | null;
    registered: boolean;
    registeredDate: Date | null;
  }

  interface IDocumentChangeTimeline {
    /**
     * JSON Object of request dialog
     */
    timeline: string;
  }

  export type TDocumentChange = IOrmBase &
    IDocumentChangeSelfProcessing &
    IDocumentChangeFields &
    IDocumentChangeAssessment &
    IDocumentChangeTimeline;

  export namespace Processing {
    export interface IAssessment {
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
  }
}

export { DocumentChangeTypes };
