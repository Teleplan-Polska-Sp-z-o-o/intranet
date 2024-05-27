interface IProcessChangeNoticeFields {
  changeDescription: string;
  areDocumentationChangesRequired: boolean;
  listOfDocumentationToChange: string;
  isNewDocumentationRequired: boolean;
  listOfDocumentationToCreate: string;
  isCustomerApprovalRequired: boolean;
  // departmentsRequiredForApproval: string;
  engineeringDepartmentName: string;
  qualityDepartmentName: string;
  personDesignatedForImplementation: string;
  updateDescription: string;
}

export type { IProcessChangeNoticeFields };
