import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
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
  modelOrProcessImpacted: string;
  changeReason: string;
  changeDescription: string;
  impacts: string;
  dedicatedDepartment: string;
  riskAnalysis: string | undefined | null;
  updateDescription: string | undefined;

  constructor() {
    this.internalOrExternal = "Internal";
    this.customerContactPerson = "";
    this.customerContactEmail = "";
    this.reconextContactPerson = "";
    this.reconextOwner = "";
    this.dateNeeded = undefined;
    this.costOfImplementation = "";
    this.program = "";
    this.modelOrProcessImpacted = "";
    this.changeReason = "";
    this.changeDescription = "";
    this.impacts = "";
    this.dedicatedDepartment = "";
    this.riskAnalysis = undefined;
    this.updateDescription = undefined;
  }

  private isDate = (data: any): Date => {
    try {
      new Date(data);
    } catch (error) {
      console.log(error);
    }
    return new Date(data);
  };

  public buildFromRequest(data: IProcessChangeRequest): ProcessChangeRequestBase {
    this.internalOrExternal = data.internalOrExternal;
    this.customerContactPerson = data.customerContactPerson;
    this.customerContactEmail = data.customerContactEmail;
    this.reconextContactPerson = data.reconextContactPerson;
    this.reconextOwner = data.reconextOwner;
    this.dateNeeded = this.isDate(data.dateNeeded);
    this.costOfImplementation = data.costOfImplementation;
    this.program = data.program;
    this.modelOrProcessImpacted = data.modelOrProcessImpacted;
    this.changeReason = data.changeReason;
    this.changeDescription = data.changeDescription;
    this.impacts = data.impacts;
    this.dedicatedDepartment = data.dedicatedDepartment;
    this.riskAnalysis = data.riskAnalysis;

    return this;
  }
}

export { ProcessChangeRequestBase };
