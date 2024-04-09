interface IProcessChangeRequestBase {
  internalOrExternal: "Internal" | "External";
  customerContactPerson: string;
  customerContactEmail: string;
  reconextContactPerson: string;
  reconextOwner: string;
  dateNeeded: Date | undefined;
  costOfImplementation: string;
  program: string;
  projectOfProgram: string;
  modelOrProcessImpacted: string;
  changeReason: string;
  changeDescription: string;
  impacts: string;
  dedicatedDepartment: string;
  riskAnalysis: string | undefined;
}

export type { IProcessChangeRequestBase };
