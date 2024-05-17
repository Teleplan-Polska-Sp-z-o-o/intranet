import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";
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
  updateDescription: string | null;

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
    this.updateDescription = null;
  }

  public buildFromNotice(data: IProcessChangeNotice): ProcessChangeNoticeFields {
    this.changeDescription = data.changeDescription;
    this.areDocumentationChangesRequired = data.areDocumentationChangesRequired;
    this.listOfDocumentationToChange = data.listOfDocumentationToChange;
    this.isNewDocumentationRequired = data.isNewDocumentationRequired;
    this.listOfDocumentationToCreate = data.listOfDocumentationToCreate;
    this.isCustomerApprovalRequired = data.isCustomerApprovalRequired;
    this.departmentsRequiredForApproval = data.departmentsRequiredForApproval;
    this.engineeringDepartmentName = data.engineeringDepartmentName;
    this.qualityDepartmentName = data.qualityDepartmentName;
    this.updateDescription = data.updateDescription;

    return this;
  }
}

export { ProcessChangeNoticeFields };
