import { IUser } from "../user/IUser";
import { IProcessChangeNotice } from "./IProcessChangeNotice";
import { IProcessChangeRequestBase } from "./IProcessChangeRequestBase";
import { IProcessChangeRequestUpdates } from "./IProcessChangeRequestUpdates";

interface IProcessChangeRequest {
  id: number; // auto generated: identifier

  // generateRequestBase function
  processChangeRequestUpdates: IProcessChangeRequestUpdates;
  processChangeNotice: IProcessChangeNotice; // relation with pcn
  year: number; // auto generated: number year
  updatable: boolean; // trigger update section
  numberOfRequest: string | null; // auto generated (from class function): Format: e.g., "001/PCR/2024"
  requestDate: string; // auto generated: string when the request was made in format: day/month/year
  requestedBy: string; // auto generated: active directory login in format

  // setRequestInfo function
  internalOrExternal: "Internal" | "External"; // Select (options): "Internal" or "External"
  customerContactPerson: string; // Input (string): Name and surname
  customerContactEmail: string; // Input (string): Email
  reconextContactPerson: string; // Input (string): Name and surname (may be select from active directory)
  reconextOwner: string; // Input (string): Name and surname (may be select from active directory)
  dateNeeded: string; // Input (date): Date when the change is needed in format: day/month/year
  costOfImplementation: string; // Input (string): Cost of implementation (time or money)
  program: string; // Select (options): Program from tree
  // projectOfProgram: string; // Input (string): project of program from tree
  modelOrProcessImpacted: string; // Input (string): Name of the model or process impacted
  changeReason: string; // Input (string): Reason for the change
  changeDescription: string; // Input (string): Description of the change
  impacts: string; // Select (options): "Process" | "Budget" | Other as input string
  dedicatedDepartment: string; // Select (options): Name of the department responsible for implementation
  riskAnalysis: string | null; // Input (string): Risk Analysis

  // closeRequest function
  assessment: "Implementation" | "Rejection" | null; // auto generated: "Implementation" or "Rejection"
  approvedOrRejectedBy: string | null; // auto generated: active directory login in format
  status: "Open" | "Closed"; // auto generated: "Open" or "Closed" - Current status of the request
  closureDate: string | null; // auto generated: Date when the request was closed in format: day/month/year

  // private formatDate: (date: Date) => string;
  setRequestNo: (countOfRequestsInYear: number) => void;
  setRequestInfo: (base: IProcessChangeRequestBase) => void;
  closeRequest: (assessment: "Implementation" | "Rejection", approvedOrRejectedBy: IUser) => void;
}

export type { IProcessChangeRequest };
