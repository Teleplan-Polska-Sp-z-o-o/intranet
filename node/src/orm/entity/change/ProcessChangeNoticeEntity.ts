import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  EntityManager,
} from "typeorm";
import { ProcessChangeRequest } from "./ProcessChangeRequestEntity";
import { IProcessChangeNotice } from "../../../interfaces/change/IProcessChangeNotice";
import { IProcessChangeNoticeFields } from "../../../interfaces/change/IProcessChangeNoticeFields";
import { Helper } from "../../../models/common/Helper";
import { ProcessChangeNoticeUpdates } from "./ProcessChangeNoticeUpdatesEntity";
import { User, User as UserEntity } from "../user/UserEntity";
import { NotificationBuilder } from "../user/NotificationBuilder";
import { ENotificationSource } from "../../../interfaces/user/notification/ENotificationSource";
import { ENotificationAction } from "../../../interfaces/user/notification/ENotificationAction";
import { saveNotification } from "../../../controllers/common/notificationController";
import { getWebSocketConnections } from "../../../models/websocket/WebsocketManager";
import { ProcessChangeNoticeFields } from "../../../models/change/pcn/ProcessChangeNoticeFields";
import { EmailHandler } from "../../../models/common/Email/EmailHandler";
import { PCNEmailOptions } from "../../../models/common/Email/options/PCNEmailOptions";
import { ENotificationVariant } from "../../../interfaces/user/notification/ENotificationVariant";

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
    departmentName: string,
    username: User["username"],
    assessment: "approve" | "rejection"
  ): {
    notice: ProcessChangeNotice;
    assessments: { eng: boolean; qua: boolean; ded: boolean };
  } => {
    try {
      const decision: boolean = assessment === "approve";

      const decisionDateString = Helper.formatDate(new Date(), "pcn assessment");

      let flags: { eng: boolean; qua: boolean; ded: boolean } = {
        eng: false,
        qua: false,
        ded: false,
      };

      const assessmentOf = (departmentVariant: "engineering" | "quality" | "dedicated") => {
        this[`${departmentVariant}DepartmentApproval`] = decision;
        this[`${departmentVariant}DepartmentApproverUsername`] = username;
        this[`${departmentVariant}DepartmentApprovalDate`] = decisionDateString;
      };

      if (
        !this.engineeringDepartmentApproval &&
        this.engineeringDepartmentName === departmentName
      ) {
        assessmentOf("engineering");
        flags.eng = true;

        if (request.dedicatedDepartment === departmentName) {
          assessmentOf("dedicated");
          flags.ded = true;
        }
      } else if (
        this.engineeringDepartmentApproval &&
        !this.qualityDepartmentApproval &&
        this.qualityDepartmentName === departmentName
      ) {
        assessmentOf("quality");
        flags.qua = true;

        if (request.dedicatedDepartment === departmentName) {
          assessmentOf("dedicated");
          flags.ded = true;
        }
      } else if (
        this.engineeringDepartmentApproval &&
        this.qualityDepartmentApproval &&
        request.dedicatedDepartment === departmentName
      ) {
        assessmentOf("dedicated");
        flags.ded = true;
      }

      return { notice: this, assessments: flags };
    } catch (error) {
      console.error(`ProcesChangeNotice at assess, ${error}`);
    }
  };

  public notification = async (
    entityManager: EntityManager,
    request: ProcessChangeRequest,
    variant: ENotificationVariant
  ): Promise<UserEntity | Array<UserEntity> | null> => {
    let recipients: UserEntity | Array<UserEntity> | null = null;

    const recipientDbFormat = (userNormalized: string): string => {
      try {
        return userNormalized.toLocaleLowerCase().replace(" ", ".");
      } catch (error) {
        console.error(
          `ProcessChangeNoticeEntity at recipientDbFormat, recipient given: ${this.personDesignatedForImplementation}, ${error}`
        );
        return "";
      }
    };

    const nextDepartmentToApprove = (): string => {
      try {
        if (!this.engineeringDepartmentApproval) return this.engineeringDepartmentName;
        if (this.engineeringDepartmentApproval && !this.qualityDepartmentApproval)
          return this.qualityDepartmentName;
        if (this.qualityDepartmentApproval && !this.dedicatedDepartmentApproval)
          return request.dedicatedDepartment;
      } catch (error) {
        console.error(`ProcessChangeNoticeEntity at nextDepartmentToApprove, ${error}`);
        return "";
      }
    };

    switch (variant) {
      case ENotificationVariant.Reassigned:
      case ENotificationVariant.Assigned:
        const userOptions = {
          where: { username: recipientDbFormat(this.personDesignatedForImplementation) },
        };
        recipients = await entityManager.getRepository(UserEntity).findOne(userOptions);

        break;

      default:
        const queryBuilder = entityManager
          .getRepository(UserEntity)
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.permission", "permission")
          .leftJoinAndSelect("user.info", "info")
          .andWhere("permission.write = :write", { write: true });

        let users: Array<UserEntity> = await queryBuilder.getMany();

        users = users.filter((user) => {
          return user.info.decisionMaker && user.info.department === nextDepartmentToApprove();
        });

        recipients = users;

        break;
    }

    if (recipients === null) {
      console.error(
        `ProcessChangeNoticeEntity at if (recipients === null), recipients evaluate to null`
      );
      return;
    }

    let body: { title?: string; subtitle?: string; link?: string } = {};
    switch (variant) {
      case ENotificationVariant.Reassigned:
        body = {
          title: `PCN Person Designated Change`,
          subtitle: `You are no longer the person designated of notice ${this.numberOfNotice}.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.Assigned:
        body = {
          title: `PCN Person Designated Change`,
          subtitle: `You have been assigned as the person designated of notice ${this.numberOfNotice}.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      //
      //
      case ENotificationVariant.Completed:
        body = {
          title: `PCN Completion`,
          subtitle: `Notice ${this.numberOfNotice} has been completed and is awaiting your review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.EngineeringApproval:
        body = {
          title: `PCN Engineering Approval`,
          subtitle: `Notice ${this.numberOfNotice} has been approved by the engineering department and is awaiting further review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.QualityApproval:
        body = {
          title: `PCN Quality Approval`,
          subtitle: `Notice ${this.numberOfNotice} has been approved by the quality department and is awaiting further review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.UpdatedCompleted:
        body = {
          title: `PCN Updated and Completed`,
          subtitle: `Notice ${this.numberOfNotice} has been updated and completed. Please review the changes.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.UpdatedUncompleted:
        body = {
          title: `PCN Update`,
          subtitle: `Notice ${this.numberOfNotice} has been updated, but some fields remain incomplete. You will be notified when it's ready for review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.UpdatedEngineeringApproval:
        body = {
          title: `PCN Updated and Engineering Approved`,
          subtitle: `Notice ${this.numberOfNotice} has been updated and approved by engineering department. It is now awaiting further review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
      case ENotificationVariant.UpdatedQualityApproval:
        body = {
          title: `PCN Updated and Quality Approved`,
          subtitle: `Notice ${this.numberOfNotice} has been updated and approved by quality department. It is now awaiting further review.`,
          link: `/tool/change/browse/pcn/${this.id}`,
        };
        break;
    }

    if (Object.keys(body).length === 0)
      throw new Error(`Notification body at ProcessChangeNoticeEntity evaluates to empty object.`);

    if (Array.isArray(recipients)) {
      for (const recipient of recipients) {
        const userNotification = new NotificationBuilder(
          ENotificationSource.PCN,
          ENotificationAction.AcceptOrReject
        )
          .setUser(recipient)
          .setTitle(body.title)
          .setSubtitle(body.subtitle)
          .setLink(body.link)
          .build();

        saveNotification(userNotification);

        const websocketConnections = getWebSocketConnections();

        const foundRecipientConnection = websocketConnections.find(
          (connection) => connection.user.username === (recipient as User).username
        );

        if (foundRecipientConnection) {
          foundRecipientConnection.ws.send(JSON.stringify(userNotification));
        }
      }
    } else {
      const userNotification = new NotificationBuilder(
        ENotificationSource.PCN,
        ENotificationAction.AcceptOrReject
      )
        .setUser(recipients)
        .setTitle(body.title)
        .setSubtitle(body.subtitle)
        .setLink(body.link)
        .build();

      saveNotification(userNotification);

      const websocketConnections = getWebSocketConnections();

      const foundRecipientConnection = websocketConnections.find(
        (connection) => connection.user.username === (recipients as User).username
      );

      if (foundRecipientConnection) {
        foundRecipientConnection.ws.send(JSON.stringify(userNotification));
      }
    }

    return recipients;
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

  public assignation = (
    fields: IProcessChangeNoticeFields
  ): {
    oldPerson: string | null;
    newPerson: string | null;
    reassigned: boolean;
    assigned: boolean;
  } => {
    const oldPerson: string | null = this.personDesignatedForImplementation;
    const newPerson: string | null = fields.personDesignatedForImplementation;
    //
    const reassigned: boolean = !!oldPerson && oldPerson !== newPerson;
    const assigned: boolean = !!!oldPerson && !!newPerson;

    return { oldPerson, newPerson, reassigned, assigned };
  };

  public isFilled = (): boolean => {
    const isNotNullOrUndefined = (value: any): boolean => {
      return value !== undefined && value !== null;
    };

    const fields: ProcessChangeNoticeFields = new ProcessChangeNoticeFields().build(this);

    const filled = Object.entries(fields)
      .filter(([key]) => key !== "updateDescription")
      .every(([key, value]) => {
        switch (key) {
          case "listOfDocumentationToChange":
            console.log(
              "return",
              fields.areDocumentationChangesRequired ? isNotNullOrUndefined(value) : true
            );
            return fields.areDocumentationChangesRequired ? isNotNullOrUndefined(value) : true;
          case "listOfDocumentationToCreate":
            console.log(
              "return",
              fields.isNewDocumentationRequired ? isNotNullOrUndefined(value) : true
            );
            return fields.isNewDocumentationRequired ? isNotNullOrUndefined(value) : true;

          default:
            console.log("return", isNotNullOrUndefined(value));
            return isNotNullOrUndefined(value);
        }
      });

    return filled;
  };

  public sendEmails = (recipients: User | Array<User>, variant: ENotificationVariant) => {
    const emailHandler = EmailHandler.getInstance();

    if (Array.isArray(recipients)) {
      for (const recipient of recipients) {
        emailHandler.newEmail(new PCNEmailOptions(variant, this, recipient)).send();
      }
    } else emailHandler.newEmail(new PCNEmailOptions(variant, this, recipients)).send();
  };
}

export { ProcessChangeNotice };
