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
  updateDescription: string;
}

export type { IProcessChangeNoticeFields };
