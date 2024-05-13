import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ProcessChangeRequest } from "./ProcessChangeRequestEntity";
import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";
import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";
import { Helper } from "../../../models/common/Helper";

@Entity()
class ProcessChangeNotice implements IProcessChangeNotice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numberOfNotice: string | null;

  @Column()
  numberOfRequest: string;

  @Column()
  year: number;

  @Column()
  status: string;

  @Column()
  closureDate: string | null;

  @Column()
  departmentApprovals: string | null;

  // @Column()
  // requestApproveNoticeDate: string;

  // @Column()
  // requestReconextOwner: string;

  // @Column()
  // requestModelOrProcessImpacted: string;

  // @Column()
  // requestChangeReason: string;

  @Column()
  changeDescription: string | null;

  @Column()
  areDocumentationChangesRequired: boolean | null;

  @Column()
  listOfDocumentationToChange: string | null;

  @Column()
  isNewDocumentationRequired: boolean | null;

  @Column()
  listOfDocumentationToCreate: string | null;

  // @Column()
  // requestCustomerContactPerson: string;

  // @Column()
  // requestCustomerContactEmail: string;

  @Column()
  isCustomerApprovalRequired: boolean | null;

  @Column()
  departmentsRequiredForApproval: string | null;

  constructor() {}

  public build = (request: ProcessChangeRequest): ProcessChangeNotice => {
    if (this.numberOfNotice?.split("/").length !== 3) this.numberOfNotice = null;
    this.numberOfRequest = request.numberOfRequest;
    this.year = new Date().getFullYear();
    this.status = "Open";
    this.closureDate = null;
    this.departmentApprovals = null;
    // this.requestApproveNoticeDate = request.closureDate;
    // this.requestReconextOwner = request.reconextOwner;
    // this.requestModelOrProcessImpacted = request.modelOrProcessImpacted;
    // this.requestChangeReason = request.changeReason;

    this.changeDescription = null;

    this.areDocumentationChangesRequired = null;
    this.listOfDocumentationToChange = null;
    this.isNewDocumentationRequired = null;
    this.listOfDocumentationToCreate = null;

    // this.requestCustomerContactPerson = request.customerContactPerson;
    // this.requestCustomerContactEmail = request.customerContactEmail;
    this.isCustomerApprovalRequired = null;

    this.departmentsRequiredForApproval = null;

    return this;
  };

  public setNoticeNo = (countOfRequestsInYear: number): ProcessChangeNotice => {
    try {
      const paddedIndex = countOfRequestsInYear.toString().padStart(3, "0");
      const type = "PCN";
      const year = this.year;

      if (this.numberOfNotice === null) this.numberOfNotice = `${paddedIndex}/${type}/${year}`;

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public setNoticeFields = (fields: IProcessChangeNoticeFields): ProcessChangeNotice => {
    try {
      this.changeDescription = fields.changeDescription ?? null;
      this.areDocumentationChangesRequired = fields.areDocumentationChangesRequired ?? null;
      this.listOfDocumentationToChange = fields.listOfDocumentationToChange ?? null;
      this.isNewDocumentationRequired = fields.isNewDocumentationRequired ?? null;
      this.listOfDocumentationToCreate = fields.listOfDocumentationToCreate ?? null;
      this.isCustomerApprovalRequired = fields.isCustomerApprovalRequired ?? null;
      this.departmentsRequiredForApproval = fields.departmentsRequiredForApproval ?? null;

      if (this.departmentsRequiredForApproval) {
        const departmentsArray: Array<number> = JSON.parse(this.departmentsRequiredForApproval);
        const map: Map<number, null | "approve" | "rejection"> = new Map();
        departmentsArray.forEach((number) => {
          map.set(number, null);
        });
        this.departmentApprovals = JSON.stringify(map);
      }

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public close = (): ProcessChangeNotice => {
    try {
      this.status = "Closed";
      this.closureDate = Helper.formatDate(new Date(), "pcn close");

      // approve chain

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public open = (): ProcessChangeNotice => {
    try {
      this.status = "Open";
      this.departmentApprovals = null;

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public assessByDepartment = (
    department: number,
    assessment: "approve" | "rejection"
  ): ProcessChangeNotice => {
    try {
      const map: Map<number, null | "approve" | "rejection"> = JSON.parse(this.departmentApprovals);
      this.departmentApprovals = JSON.stringify(map.set(department, assessment));

      return this;
    } catch (error) {
      console.log(error);
    }
  };
}

export { ProcessChangeNotice };
