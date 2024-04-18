import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNotice } from "./ProcessChangeNoticeEntity";
import { IUser } from "../../../interfaces/user/IUser";
import { IProcessChangeRequestBase } from "../../../interfaces/change/IProcessChangeRequestBase";
import { ProcessChangeRequestUpdates } from "./ProcessChangeRequestUpdatesEntity";
import { Helper } from "../../../models/common/Helper";

@Entity()
class ProcessChangeRequest implements IProcessChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProcessChangeRequestUpdates)
  @JoinColumn()
  processChangeRequestUpdates: ProcessChangeRequestUpdates;

  @OneToOne(() => ProcessChangeNotice, { nullable: true })
  @JoinColumn()
  processChangeNotice: ProcessChangeNotice | null;

  @Column()
  year: number;

  @Column()
  updatable: boolean;

  @Column({ nullable: true })
  numberOfRequest: string | null;

  @Column()
  requestDate: string;

  @Column()
  requestedBy: string;

  @Column()
  internalOrExternal: "Internal" | "External";

  @Column()
  customerContactPerson: string;

  @Column()
  customerContactEmail: string;

  @Column()
  reconextContactPerson: string;

  @Column()
  reconextOwner: string;

  @Column()
  dateNeeded: string;

  @Column()
  costOfImplementation: string;

  @Column()
  program: string;

  @Column()
  modelOrProcessImpacted: string;

  @Column()
  changeReason: string;

  @Column()
  changeDescription: string;

  @Column()
  impacts: "Process" | "Budget" | string;

  @Column()
  dedicatedDepartment: string;

  @Column()
  riskAnalysis: string | null;

  @Column({ nullable: true })
  assessment: "Implementation" | "Rejection" | null;

  @Column({ nullable: true })
  approvedOrRejectedBy: string | null;

  @Column()
  status: "Open" | "Closed";

  @Column({ nullable: true })
  closureDate: string | null;

  public setRequestNo = (countOfRequestsInYear: number): void => {
    try {
      const paddedIndex = countOfRequestsInYear.toString().padStart(3, "0");
      const type = "PCR";
      const year = this.year;

      if (this.numberOfRequest === null) this.numberOfRequest = `${paddedIndex}/${type}/${year}`;
    } catch (error) {
      console.log(error);
    }
  };

  public setRequestInfo = (base: IProcessChangeRequestBase): void => {
    try {
      this.internalOrExternal = base.internalOrExternal;
      this.customerContactPerson = base.customerContactPerson;
      this.customerContactEmail = base.customerContactEmail;
      this.reconextContactPerson = base.reconextContactPerson;
      this.reconextOwner = base.reconextOwner;
      this.dateNeeded = Helper.formatDate(base.dateNeeded);
      this.costOfImplementation = base.costOfImplementation;
      this.program = base.program;
      // this.projectOfProgram = base.projectOfProgram;
      this.modelOrProcessImpacted = base.modelOrProcessImpacted;
      this.changeReason = base.changeReason;
      this.changeDescription = base.changeDescription;
      this.impacts = base.impacts;
      this.dedicatedDepartment = base.dedicatedDepartment;
      this.riskAnalysis = base.riskAnalysis ? base.riskAnalysis : null;
    } catch (error) {
      console.log(error);
    }
  };

  public closeRequest(
    assessment: "Implementation" | "Rejection",
    approvedOrRejectedBy: IUser,
    processChangeNotice: ProcessChangeNotice | null = null
  ): void {
    try {
      if (this.status === "Open") {
        this.updatable = true;
        this.assessment = assessment;
        this.approvedOrRejectedBy = approvedOrRejectedBy.username;
        this.status = "Closed";
        this.closureDate = Helper.formatDate(new Date());

        if (assessment === "Implementation") {
          if (!processChangeNotice)
            throw new Error(
              `Assessment is 'Implementation' but ProcessChangeNotice is null, please provide ProcessChangeNotice entity to closeRequest function`
            );
          this.processChangeNotice = processChangeNotice;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public openRequest(): void {
    try {
      if (this.status === "Closed") {
        this.updatable = true;
        this.assessment = null;
        this.approvedOrRejectedBy = null;
        this.status = "Open";
        this.closureDate = null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  public compare = (base: IProcessChangeRequestBase): Array<string> => {
    const updatedFields: Array<string> = [];

    // Iterate over the keys of the base object
    Object.keys(base).forEach((key) => {
      // Skip the updateDescription field
      if (key === "updateDescription") {
        return;
      }

      // Compare the values of the base object with the current object
      if (key === "dateNeeded" && base.dateNeeded) {
        const formattedDate = Helper.formatDate(base.dateNeeded);
        if (this.dateNeeded !== formattedDate) {
          updatedFields.push(key);
        }
      } else {
        if (this[key] !== base[key]) {
          updatedFields.push(key);
        }
      }
    });

    return updatedFields;
  };

  constructor() {}

  public build = (requestedBy: IUser, base: IProcessChangeRequestBase): ProcessChangeRequest => {
    this.processChangeNotice = null;
    this.year = new Date().getFullYear();
    this.updatable = false;
    this.numberOfRequest = null;
    this.requestDate = Helper.formatDate(new Date());
    this.requestedBy = requestedBy.username;

    this.setRequestInfo(base);

    this.assessment = null;
    this.approvedOrRejectedBy = null;
    this.status = "Open";
    this.closureDate = null;

    return this;
  };
}

export { ProcessChangeRequest };
