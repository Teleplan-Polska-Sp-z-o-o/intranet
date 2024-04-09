import { IProcessChangeRequestBase } from "../../../interfaces/change/IProcessChangeRequestBase";

class ProcessChangeRequestBase implements IProcessChangeRequestBase {
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

  constructor() {
    this.internalOrExternal = "Internal";
    this.customerContactPerson = "";
    this.customerContactEmail = "";
    this.reconextContactPerson = "";
    this.reconextOwner = "";
    this.dateNeeded = undefined;
    this.costOfImplementation = "";
    this.program = "";
    this.projectOfProgram = "";
    this.modelOrProcessImpacted = "";
    this.changeReason = "";
    this.changeDescription = "";
    this.impacts = "";
    this.dedicatedDepartment = "";
    this.riskAnalysis = undefined;
  }
}

export { ProcessChangeRequestBase };
