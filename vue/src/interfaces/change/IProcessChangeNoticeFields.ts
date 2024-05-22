interface IProcessChangeNoticeFields {
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
}

export type { IProcessChangeNoticeFields };
