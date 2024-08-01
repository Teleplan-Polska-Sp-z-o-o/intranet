import { File } from "multer";
import { DocumentChangeFields } from "../../../../models/change/dc/DocumentChangeFields";
import { DocumentChange } from "../../../../orm/entity/change/documents/DocumentChangeEntity";
import { EDCNotificationVariant } from "../../../user/notification/ENotificationVariant";
import { EntityManager } from "typeorm";
import { User } from "../../../../orm/entity/user/UserEntity";

type TStatus = "Draft" | "Complete" | "Checked" | "Approved" | "Rejected" | "Registered";

type TSourceTitle =
  | "previously_uploaded"
  | "not_previously_uploaded_new"
  | "not_previously_uploaded_existing";

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

interface IDocumentChangeFields {
  tags: string | null;
  priority: "low" | "medium" | "high";
  affected: string;
  docxNumber: string | null;
  docxRevision: number;
  docxReference?: string;
  checker: string | null;
  approver: string | null;
  registerer: string | null;
  /**
   * JSON Array of competence code strings
   */
  affectedCompetences: string | null;
  requireAcknowledgmentOrTraining: "acknowledgment" | "training";
  trainingDetails: string | null;
  /**
   * JSON Array of request file names
   */
  fileNames: string;
  docxSource: TSourceTitle;
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

interface IDocumentChangeFunctions {
  setNo(countOfRequestsInYear: number): this;
  changeNo(): this;
  saveFiles(
    langs: Array<{
      langs: Array<string>;
    }>,
    files: File[]
  ): boolean;
  deleteFiles(ref: string): boolean;
  assess(
    by: string,
    decision: boolean,
    comment: string | null
  ): {
    usernameVariant: "checker" | "approver";
    notificationVariant: EDCNotificationVariant;
    this: DocumentChange;
  };
  unassess(): this;
  register(
    by: string,
    decision: boolean,
    comment: string | null
  ): {
    usernameVariant: "originator";
    notificationVariant: EDCNotificationVariant;
    this: DocumentChange;
  };
  unregister(): this;
  compareWithFields(fields: DocumentChangeFields): boolean;
  editEntity(from: TDocumentChange): this;
  notification(
    entityManager: EntityManager,
    usernameVariant: "originator" | "checker" | "approver" | "registerer",
    variant: EDCNotificationVariant
  ): Promise<{ to: User; cc: Array<User> }>;
  sendEmails(recipients: { to: User; cc: Array<User> }, variant: EDCNotificationVariant): this;
  updateTimeline(issuer: string): void;
  setStatus(issuer: string): this;
  isUUIDv4(value: string): boolean;
}

type TDocumentChange = IDocumentChangeSelfProcessing &
  IDocumentChangeFields &
  IDocumentChangeReview &
  IDocumentChangeTimeline;

interface IReview {
  id: number;
  issuer: string;
  decision: boolean;
  comment?: string;
}

interface ITimelineElement {
  id: number;
  status: TStatus;
  issuer: string;
  date: Date;
  comment: string | null | undefined;
}
type TTimeline = ITimelineElement[];

export {
  TDocumentChange,
  IDocumentChangeFields,
  IDocumentChangeFunctions,
  IReview,
  TStatus,
  ITimelineElement,
  TTimeline,
  TSourceTitle,
};
