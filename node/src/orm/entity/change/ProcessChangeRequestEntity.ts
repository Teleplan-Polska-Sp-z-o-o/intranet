import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  EntityManager,
} from "typeorm";
import { IProcessChangeRequest } from "../../../interfaces/change/IProcessChangeRequest";
import { ProcessChangeNotice } from "./ProcessChangeNoticeEntity";
import { IUser } from "../../../interfaces/user/IUser";
import { IProcessChangeRequestBase } from "../../../interfaces/change/IProcessChangeRequestBase";
import { ProcessChangeRequestUpdates } from "./ProcessChangeRequestUpdatesEntity";
import { Helper } from "../../../models/common/Helper";
import { NotificationBuilder } from "../user/NotificationBuilder";
import { ENotificationSource } from "../../../interfaces/user/notification/ENotificationSource";
import { ENotificationAction } from "../../../interfaces/user/notification/ENotificationAction";
import { User } from "../user/UserEntity";
import { saveNotification } from "../../../controllers/common/notificationController";
import { getWebSocketConnections } from "../../../controllers/common/websocketController";

@Entity()
class ProcessChangeRequest implements IProcessChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProcessChangeRequestUpdates, (updates) => updates.processChangeRequest, {
    nullable: true,
  })
  @JoinColumn()
  processChangeRequestUpdates: Array<ProcessChangeRequestUpdates> | null;

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

  public setRequestInfo = (
    base: IProcessChangeRequestBase
    // processChangeRequestUpdates: ProcessChangeRequestUpdates | null = null
  ): void => {
    try {
      // this.processChangeRequestUpdates = processChangeRequestUpdates;

      this.internalOrExternal = base.internalOrExternal;
      this.customerContactPerson = base.customerContactPerson;
      this.customerContactEmail = base.customerContactEmail;
      this.reconextContactPerson = base.reconextContactPerson;
      this.reconextOwner = base.reconextOwner;
      this.dateNeeded = Helper.formatDate(base.dateNeeded, "pcr set info");
      this.costOfImplementation = base.costOfImplementation;
      this.program = base.program;
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
        this.closureDate = Helper.formatDate(new Date(), "pcr close");

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
        const formattedDate = Helper.formatDate(base.dateNeeded, "pcr compare");
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
    this.requestDate = Helper.formatDate(new Date(), "pcr build");
    this.requestedBy = requestedBy.username;

    this.setRequestInfo(base);

    this.assessment = null;
    this.approvedOrRejectedBy = null;
    this.status = "Open";
    this.closureDate = null;

    return this;
  };

  public notification = async (
    entityManager: EntityManager,
    variant:
      | "reassigned"
      | "assigned"
      | "assigned completed"
      | "assigned updated"
      | "completed"
      | "updated"
      | "updated uncompleted"
      | "closed"
  ) => {
    const approver = this.reconextOwner.toLocaleLowerCase().replace(" ", ".");

    if (!approver) return;

    const userOptions = {
      where: { username: approver },
    };
    const userEntity = await entityManager.getRepository(User).findOne(userOptions);

    let body: { title?: string; subtitle?: string; link?: string } = {};

    switch (variant) {
      case "reassigned":
        body = {
          title: `PCR Ownership Change`,
          subtitle: `You are no longer the owner of request ${this.numberOfRequest}.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };

        break;
      case "assigned":
        body = {
          title: `PCR Ownership Change`,
          subtitle: `You have been assigned as the owner of request ${this.numberOfRequest}. You will be notified when it's ready for your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };

        break;
      case "assigned completed":
        body = {
          title: `PCR Ownership Change`,
          subtitle: `You have been assigned as the owner of request ${this.numberOfRequest}, which has been completed and is awaiting your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };

        break;
      case "assigned updated":
        body = {
          title: `PCR Ownership Change`,
          subtitle: `You have been assigned as the owner of request ${this.numberOfRequest}, which has been updated and is awaiting your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };

        break;
      case "completed":
        body = {
          title: `PCR Completion`,
          subtitle: `Request ${this.numberOfRequest} has been completed and is awaiting your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };
        break;
      case "updated":
        body = {
          title: `PCR Update`,
          subtitle: `Request ${this.numberOfRequest} has been updated and is awaiting your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };
        break;
      case "updated uncompleted":
        body = {
          title: `PCR Update`,
          subtitle: `Request ${this.numberOfRequest} has been updated, but some fields have been cleared. You will be notified when it's ready for your review.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };
        break;
      case "closed":
        body = {
          title: `PCR Closure`,
          subtitle: `Request ${this.numberOfRequest} has been successfully closed. The assessment has been set to '${this.assessment}'. Should any updates occur, you will be promptly notified and asked for review once more.`,
          link: `/tool/change/browse/pcr/${this.id}`,
        };
        break;
    }

    if (Object.keys(body).length === 0)
      throw new Error(`Notification body at ProcessChangeRequestEntity evaluates to empty object.`);

    const userNotification = new NotificationBuilder(
      ENotificationSource.PCR,
      ENotificationAction.AcceptOrReject
    )
      .setUser(userEntity)
      .setTitle(body.title)
      .setSubtitle(body.subtitle)
      .setLink(body.link)
      .build();

    saveNotification(userNotification);

    const websocketConnections = getWebSocketConnections();

    const foundApproverConnection = websocketConnections.find(
      (connection) => connection.user.username === approver
    );

    if (foundApproverConnection) {
      foundApproverConnection.ws.send(JSON.stringify(userNotification));
    }
  };
}

export { ProcessChangeRequest };
