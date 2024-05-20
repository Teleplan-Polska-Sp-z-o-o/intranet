import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { ProcessChangeRequest } from "./ProcessChangeRequestEntity";
import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";
import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";
import { Helper } from "../../../models/common/Helper";
import { ProcessChangeNoticeUpdates } from "./ProcessChangeNoticeUpdatesEntity";
import { Department } from "../document/DepartmentEntity";
import { IUser } from "../../../interfaces/user/IUser";

@Entity()
class ProcessChangeNotice implements IProcessChangeNotice {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProcessChangeNoticeUpdates, (updates) => updates.processChangeNotice)
  @JoinColumn()
  processChangeNoticeUpdates: Array<ProcessChangeNoticeUpdates> | null;

  @Column()
  numberOfNotice: string | null;

  @Column()
  numberOfRequest: string | null;

  @Column()
  year: number | null;

  @Column()
  updatable: boolean | null;

  @Column()
  status: "Open" | "Closed" | null;

  @Column()
  closureDate: string | null;

  @Column()
  engineeringDepartmentName: string | null;

  @Column()
  engineeringDepartmentApproval: boolean | null; // added

  @Column()
  engineeringDepartmentApproverUsername: string | null;

  @Column()
  engineeringDepartmentApprovalDate: string | null; // added

  @Column()
  qualityDepartmentName: string | null; // added

  @Column()
  qualityDepartmentApproval: boolean | null; // added

  @Column()
  qualityDepartmentApprovalDate: string | null; // added

  @Column()
  qualityDepartmentApproverUsername: string | null; // added

  @Column()
  dedicatedDepartmentApproval: boolean | null; // added

  @Column()
  dedicatedDepartmentApproverUsername: string | null; // added

  @Column()
  dedicatedDepartmentApprovalDate: string | null; // added

  @Column()
  personDesignatedForImplementation: string | null; // added

  // @Column()
  // departmentApprovals: string | null;

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

  // @Column()
  // departmentsRequiredForApproval: string | null;

  constructor() {}

  public build = (request: ProcessChangeRequest): ProcessChangeNotice => {
    if (this.numberOfNotice?.split("/").length !== 3) this.numberOfNotice = null;
    this.numberOfRequest = request.numberOfRequest;
    this.year = new Date().getFullYear();
    this.status = "Open";
    this.updatable = false;
    this.closureDate = null;

    this.engineeringDepartmentName = null;
    this.engineeringDepartmentApproval = null;
    this.engineeringDepartmentApproverUsername = null;
    this.engineeringDepartmentApprovalDate = null;
    this.qualityDepartmentName = null;
    this.qualityDepartmentApproval = null;
    this.qualityDepartmentApproverUsername = null;
    this.qualityDepartmentApprovalDate = null;
    this.dedicatedDepartmentApproval = null;
    this.dedicatedDepartmentApproverUsername = null;
    this.dedicatedDepartmentApprovalDate = null;
    this.personDesignatedForImplementation = null;

    // this.departmentApprovals = null;
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

    // this.departmentsRequiredForApproval = null;

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
      this.engineeringDepartmentName = fields.engineeringDepartmentName ?? null;
      this.qualityDepartmentName = fields.qualityDepartmentName ?? null;
      this.personDesignatedForImplementation = fields.personDesignatedForImplementation ?? null;
      // this.departmentsRequiredForApproval = fields.departmentsRequiredForApproval ?? null;

      // if (this.departmentsRequiredForApproval) {
      //   const departmentsArray: Array<number> = JSON.parse(this.departmentsRequiredForApproval);
      //   const map: Map<number, null | "approve" | "rejection"> = new Map();
      //   departmentsArray.forEach((number) => {
      //     map.set(number, null);
      //   });
      //   this.departmentApprovals = JSON.stringify(map);
      // }

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public close = (): ProcessChangeNotice => {
    try {
      if (this.status === "Closed")
        throw new Error(
          `Cannot close Notice that is already closed at ProcessChangeNotice at open.`
        );

      this.status = "Closed";
      this.closureDate = Helper.formatDate(new Date(), "pcn close");
      this.updatable = true;

      // approve chain

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public open = (): ProcessChangeNotice => {
    try {
      if (this.status === "Open")
        throw new Error(`Cannot open Notice that is already open at ProcessChangeNotice at open.`);
      this.status = "Open";

      this.engineeringDepartmentApproval = null;
      this.engineeringDepartmentApprovalDate = null;
      this.engineeringDepartmentApproverUsername = null;
      this.qualityDepartmentApproval = null;
      this.qualityDepartmentApprovalDate = null;
      this.qualityDepartmentApproverUsername = null;
      this.dedicatedDepartmentApproval = null;
      this.dedicatedDepartmentApprovalDate = null;
      this.dedicatedDepartmentApproverUsername = null;

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public assess = (
    request: ProcessChangeRequest,
    department: Department,
    user: IUser,
    assessment: "approve" | "rejection"
  ): ProcessChangeNotice => {
    try {
      const decision = assessment === "approve" ? true : false;
      const decisionDateString = Helper.formatDate(new Date(), "pcn assessment");

      // switch (department.name) {
      //   case this.engineeringDepartmentName:
      //     this.engineeringDepartmentApproval = decision;
      //     this.engineeringDepartmentApproverUsername = user.username;
      //     this.engineeringDepartmentApprovalDate = decisionDateString;
      //   case this.qualityDepartmentName:
      //     this.qualityDepartmentApproval = decision;
      //     this.qualityDepartmentApproverUsername = user.username;
      //     this.qualityDepartmentApprovalDate = decisionDateString;
      //   case request.dedicatedDepartment:
      //     this.dedicatedDepartmentApproval = decision;
      //     this.dedicatedDepartmentApproverUsername = user.username;
      //     this.dedicatedDepartmentApprovalDate = decisionDateString;
      //     break;

      //   default:
      //     throw new Error(
      //       `'department' doesn't match any of available switch cases at ProcessChangeNotice at assessByDepartment.`
      //     );
      // }

      if (this.engineeringDepartmentName === department.name) {
        this.engineeringDepartmentApproval = decision;
        this.engineeringDepartmentApproverUsername = user.username;
        this.engineeringDepartmentApprovalDate = decisionDateString;
      } else if (this.qualityDepartmentName) {
        this.qualityDepartmentApproval = decision;
        this.qualityDepartmentApproverUsername = user.username;
        this.qualityDepartmentApprovalDate = decisionDateString;
      } else if (request.dedicatedDepartment === department.name) {
        this.dedicatedDepartmentApproval = decision;
        this.dedicatedDepartmentApproverUsername = user.username;
        this.dedicatedDepartmentApprovalDate = decisionDateString;
      } else {
        throw new Error(
          `'department' doesn't match any of available switch cases at ProcessChangeNotice at assessByDepartment.`
        );
      }
      // const map: Map<number, null | "approve" | "rejection"> = JSON.parse(this.departmentApprovals);
      // this.departmentApprovals = JSON.stringify(map.set(department, assessment));

      return this;
    } catch (error) {
      console.log(error);
    }
  };

  public compare = (fields: IProcessChangeNoticeFields): Array<string> => {
    try {
      const updatedFields: Array<string> = [];

      // Iterate over the keys of the base object
      Object.keys(fields).forEach((key) => {
        // Skip the updateDescription field
        if (key === "updateDescription") {
          return;
        }

        // Compare the values of the base object with the current object

        if (this[key] !== fields[key]) {
          updatedFields.push(key);
        }
      });

      return updatedFields;
    } catch (error) {
      console.log(error);
    }
  };
}

export { ProcessChangeNotice };
