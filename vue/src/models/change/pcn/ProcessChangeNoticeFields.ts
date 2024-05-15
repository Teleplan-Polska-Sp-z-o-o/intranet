import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";

class ProcessChangeNoticeFields implements IProcessChangeNoticeFields {
  changeDescription: string | null;
  areDocumentationChangesRequired: boolean | null;
  listOfDocumentationToChange: string | null;
  isNewDocumentationRequired: boolean | null;
  listOfDocumentationToCreate: string | null;
  isCustomerApprovalRequired: boolean | null;
  departmentsRequiredForApproval: string | null;
  engineeringDepartmentName: string | null;
  qualityDepartmentName: string | null;

  constructor() {
    this.changeDescription = null;
    this.areDocumentationChangesRequired = null;
    this.listOfDocumentationToChange = null;
    this.isNewDocumentationRequired = null;
    this.listOfDocumentationToCreate = null;
    this.isCustomerApprovalRequired = null;
    this.departmentsRequiredForApproval = null;
    this.engineeringDepartmentName = null;
    this.qualityDepartmentName = null;
  }
}

export { ProcessChangeNoticeFields };
