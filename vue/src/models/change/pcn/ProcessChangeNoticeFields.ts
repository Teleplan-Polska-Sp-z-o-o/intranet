import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";

class ProcessChangeNoticeFields implements IProcessChangeNoticeFields {
  changeDescription: string;
  areDocumentationChangesRequired: boolean;
  listOfDocumentationToChange: string;
  isNewDocumentationRequired: boolean;
  listOfDocumentationToCreate: string;
  isCustomerApprovalRequired: boolean;
  departmentsRequiredForApproval: string;

  constructor() {
    this.changeDescription = "";
    this.areDocumentationChangesRequired = false;
    this.listOfDocumentationToChange = "";
    this.isNewDocumentationRequired = false;
    this.listOfDocumentationToCreate = "";
    this.isCustomerApprovalRequired = false;
    this.departmentsRequiredForApproval = "";
  }
}

export { ProcessChangeNoticeFields };
