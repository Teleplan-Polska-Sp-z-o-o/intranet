interface IProcessChangeNoticeFields {
  changeDescription: string;
  areDocumentationChangesRequired: boolean;
  listOfDocumentationToChange: string;
  isNewDocumentationRequired: boolean;
  listOfDocumentationToCreate: string;
  isCustomerApprovalRequired: boolean;
  departmentsRequiredForApproval: string;
}

export type { IProcessChangeNoticeFields };
