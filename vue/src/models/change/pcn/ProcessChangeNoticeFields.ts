import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";
import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";

class ProcessChangeNoticeFields implements IProcessChangeNoticeFields {
  [key: string]: any;
  changeDescription: string | null | undefined;
  areDocumentationChangesRequired: boolean | null;
  listOfDocumentationToChange: string | null;
  isNewDocumentationRequired: boolean | null;
  listOfDocumentationToCreate: string | null;
  isCustomerApprovalRequired: boolean | null;
  engineeringDepartmentName: string | null;
  qualityDepartmentName: string | null;
  personDesignatedForImplementation: string | null;
  updateDescription: string | null;

  constructor() {
    this.changeDescription = null;
    this.areDocumentationChangesRequired = null;
    this.listOfDocumentationToChange = null;
    this.isNewDocumentationRequired = null;
    this.listOfDocumentationToCreate = null;
    this.isCustomerApprovalRequired = null;
    this.engineeringDepartmentName = null;
    this.qualityDepartmentName = null;
    this.personDesignatedForImplementation = null;
    this.updateDescription = null;
  }

  public buildFromNotice(data: IProcessChangeNotice): ProcessChangeNoticeFields {
    this.changeDescription = data.changeDescription === undefined ? null : data.changeDescription;
    this.areDocumentationChangesRequired = data.areDocumentationChangesRequired;
    this.listOfDocumentationToChange = data.listOfDocumentationToChange;
    this.isNewDocumentationRequired = data.isNewDocumentationRequired;
    this.listOfDocumentationToCreate = data.listOfDocumentationToCreate;
    this.isCustomerApprovalRequired = data.isCustomerApprovalRequired;
    this.engineeringDepartmentName = data.engineeringDepartmentName;
    this.qualityDepartmentName = data.qualityDepartmentName;
    this.personDesignatedForImplementation = data.personDesignatedForImplementation;
    this.updateDescription = data.updateDescription;

    return this;
  }
}

export { ProcessChangeNoticeFields };
