import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNotice } from "./ProcessChangeNoticeEntity";
import { IUser } from "../../../interfaces/user/IUser";
import { IProcessChangeRequestBase } from "../../../interfaces/change/IProcessChangeRequestBase";

@Entity()
class ProcessChangeRequest implements IProcessChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProcessChangeNotice, { nullable: true })
  @JoinColumn()
  processChangeNotice: ProcessChangeNotice | null;

  @Column()
  year: number;

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

  private formatDate = (date: Date | string): string => {
    let dateObj: Date;

    const getMonthIndex = (month: string): number => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthNames.indexOf(month);
    };

    if (typeof date === "string") {
      const [, month, day, year] = date.split(" ");
      dateObj = new Date(Date.UTC(Number(year), getMonthIndex(month), Number(day)));
    } else {
      dateObj = date;
    }

    const day: string = (dateObj?.getDate() || 1).toString().padStart(2, "0");
    const month: string = (dateObj?.getMonth() + 1 || 1).toString().padStart(2, "0");
    const year: string = (dateObj?.getFullYear() || 1).toString().padStart(2, "0");

    const formattedDate: string = `${day}/${month}/${year}`;
    return formattedDate;
  };

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
      if (base) {
        this.internalOrExternal = base.internalOrExternal;
        this.customerContactPerson = base.customerContactPerson;
        this.customerContactEmail = base.customerContactEmail;
        this.reconextContactPerson = base.reconextContactPerson;
        this.reconextOwner = base.reconextOwner;
        this.dateNeeded = this.formatDate(base.dateNeeded);
        this.costOfImplementation = base.costOfImplementation;
        this.program = base.program;
        // this.projectOfProgram = base.projectOfProgram;
        this.modelOrProcessImpacted = base.modelOrProcessImpacted;
        this.changeReason = base.changeReason;
        this.changeDescription = base.changeDescription;
        this.impacts = base.impacts;
        this.dedicatedDepartment = base.dedicatedDepartment;
        this.riskAnalysis = base.riskAnalysis ? base.riskAnalysis : null;
      }
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
        this.assessment = assessment;
        this.approvedOrRejectedBy = approvedOrRejectedBy.username;
        this.status = "Closed";
        this.closureDate = this.formatDate(new Date());

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

  constructor(requestedBy: IUser, base: IProcessChangeRequestBase) {
    this.processChangeNotice = null;
    this.year = new Date().getFullYear();
    this.numberOfRequest = null;
    this.requestDate = this.formatDate(new Date());
    this.requestedBy = requestedBy?.username;

    this.setRequestInfo(base);

    this.assessment = null;
    this.approvedOrRejectedBy = null;
    this.status = "Open";
    this.closureDate = null;
  }
}

export { ProcessChangeRequest };
