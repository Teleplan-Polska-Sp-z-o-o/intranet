import { DocumentChangeTypes } from "../../../interfaces/change/dcr/DocumentChangeTypes";

class DocumentChange implements DocumentChangeTypes.TDocumentChange {
  ormCreateDate: Date;
  ormUpdateDate: Date | null;
  ormVersion: number;

  id: number;
  no: string;
  year: number;
  originator: string;
  priority: DocumentChangeTypes.TPriority;
  affected: string;
  docxNumber: string | null;
  docxRevision: number;
  docxReference: string;
  checker: string | null;
  checkerComment: string | null;
  checked: boolean;
  checkedDate: Date | null;
  approver: string | null;
  approverComment: string | null;
  approved: boolean;
  approvedDate: Date | null;
  registerer: string | null;
  registered: boolean;
  registeredDate: Date | null;
  timeline: string;
  affectedCompetences: string | null;
  requireAcknowledgmentOrTraining: DocumentChangeTypes.TRequireAcknowledgmentOrTraining;
  trainingDetails: string | null;
  status: DocumentChangeTypes.TStatus;
  fileNames: string;

  constructor() {
    this.id = 0;
    this.ormCreateDate = new Date();
    this.ormUpdateDate = null;
    this.ormVersion = 1;

    this.no = "";
    this.year = new Date().getFullYear();
    this.originator = "";
    this.priority = "low";
    this.affected = "";
    this.docxNumber = null;
    this.docxRevision = 1;
    this.docxReference = "";
    this.checker = null;
    this.checkerComment = null;
    this.checked = false;
    this.checkedDate = null;
    this.approver = null;
    this.approverComment = null;
    this.approved = false;
    this.approvedDate = null;
    this.registerer = null;
    this.registered = false;
    this.registeredDate = null;
    this.timeline = "[]";
    this.affectedCompetences = null;
    this.requireAcknowledgmentOrTraining = "acknowledgment";
    this.trainingDetails = null;
    this.status = "Draft";
    this.fileNames = "[]";
  }
}
export { DocumentChange };
