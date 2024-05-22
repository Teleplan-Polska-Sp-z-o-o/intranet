import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";
import { ProcessChangeNotice } from "../../../orm/entity/change/ProcessChangeNoticeEntity";

class ProcessChangeNoticeFields implements IProcessChangeNoticeFields {
  [key: string]: any;
  changeDescription: string | null;
  areDocumentationChangesRequired: boolean | null;
  listOfDocumentationToChange: string | null;
  isNewDocumentationRequired: boolean | null;
  listOfDocumentationToCreate: string | null;
  isCustomerApprovalRequired: boolean | null;
  departmentsRequiredForApproval: string | null;
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
    this.departmentsRequiredForApproval = null;
    this.engineeringDepartmentName = null;
    this.qualityDepartmentName = null;
    this.personDesignatedForImplementation = null;
    this.updateDescription = null;
  }

  public build(data: ProcessChangeNotice | IProcessChangeNoticeFields): ProcessChangeNoticeFields {
    this.changeDescription = data.changeDescription;
    this.areDocumentationChangesRequired = data.areDocumentationChangesRequired;
    this.listOfDocumentationToChange = data.listOfDocumentationToChange;
    this.isNewDocumentationRequired = data.isNewDocumentationRequired;
    this.listOfDocumentationToCreate = data.listOfDocumentationToCreate;
    this.isCustomerApprovalRequired = data.isCustomerApprovalRequired;
    this.engineeringDepartmentName = data.engineeringDepartmentName;
    this.qualityDepartmentName = data.qualityDepartmentName;
    this.personDesignatedForImplementation = data.personDesignatedForImplementation;

    if (data.hasOwnProperty("updateDescription")) {
      this.updateDescription = (data as any).updateDescription;
    }

    return this;
  }
}

export { ProcessChangeNoticeFields };
