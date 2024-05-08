interface IProcessChangeNotice {
  id: number; // auto
  numberOfNotice: string | null; // auto
  numberOfRequest: string; // pull
  year: number; // auto
  status: string;
  departmentApprovals: string | null;
  requestApproveNoticeDate: string; // pull
  requestReconextOwner: string; // pull
  requestModelOrProcessImpacted: string; // pull
  requestChangeReason: string; // pull
  // first window item (Description)
  changeDescription: string | null; // new
  // second window item (Documentation)
  areDocumentationChangesRequired: boolean | null; // new
  listOfDocumentationToChange: string | null; // new
  isNewDocumentationRequired: boolean | null; // new
  listOfDocumentationToCreate: string | null; // new
  // third window item (Customer)
  requestCustomerContactPerson: string; // pull
  requestCustomerContactEmail: string; // pull
  isCustomerApprovalRequired: boolean | null; // new => add Customer Approve section in ViewPCN
  // fourth window item (Approval)
  departmentsRequiredForApproval: string | null; // new
  // fifth window item (Verify)
}

export type { IProcessChangeNotice };
