interface IProcessChangeNoticeFields {
  changeDescription: string | null;
  areDocumentationChangesRequired: boolean | null;
  listOfDocumentationToChange: string | null;
  isNewDocumentationRequired: boolean | null;
  listOfDocumentationToCreate: string | null;
  isCustomerApprovalRequired: boolean | null;
  engineeringDepartmentName: string | null;
  qualityDepartmentName: string | null;
}

export type { IProcessChangeNoticeFields };
