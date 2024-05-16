interface IProcessChangeNotice {
  id: number; // auto
  numberOfNotice: string | null; // auto
  numberOfRequest: string; // pull
  year: number; // auto
  status: string;
  closureDate: string;

  engineeringDepartmentName: string | null; // added
  engineeringDepartmentApproval: boolean | null; // added
  engineeringDepartmentApproverUsername: string | null;
  engineeringDepartmentApprovalDate: string | null; // added
  qualityDepartmentName: string | null;
  qualityDepartmentApproval: boolean | null; // added
  qualityDepartmentApproverUsername: string | null;
  qualityDepartmentApprovalDate: string | null; // added
  dedicatedDepartmentApproval: boolean | null; // added
  dedicatedDepartmentApproverUsername: string | null;
  dedicatedDepartmentApprovalDate: string | null; // added
  personDesignatedForImplementation: string | null; // added

  //X departmentApprovals: string | null;

  // requestApproveNoticeDate: string; // pull
  // requestReconextOwner: string; // pull
  // requestModelOrProcessImpacted: string; // pull
  // requestChangeReason: string; // pull
  // first window item (Description)
  changeDescription: string | null; // new
  // second window item (Documentation)
  areDocumentationChangesRequired: boolean | null; // new
  listOfDocumentationToChange: string | null; // new
  isNewDocumentationRequired: boolean | null; // new
  listOfDocumentationToCreate: string | null; // new
  // third window item (Customer)
  // requestCustomerContactPerson: string; // pull
  // requestCustomerContactEmail: string; // pull
  isCustomerApprovalRequired: boolean | null; // new => add Customer Approve section in ViewPCN
  // fourth window item (Approval)

  //X departmentsRequiredForApproval: string | null;

  // fifth window item (Verify)
}

export type { IProcessChangeNotice };
