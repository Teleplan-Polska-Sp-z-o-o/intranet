import { Entity, Column, EntityManager, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { File } from "multer";
import { AbstractBaseOrmEntity } from "../../../../interfaces/common/AbstractBaseOrmEntity";
import { DC_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../../../config/routeConstants";
import * as fs from "fs";
import path from "path";
import { DocumentChangeFields } from "../../../../models/change/dc/DocumentChangeFields";
import { EDCNotificationVariant } from "../../../../interfaces/user/notification/ENotificationVariant";
import { User } from "../../user/UserEntity";
import { NotificationBuilder } from "../../user/NotificationBuilder";
import { ENotificationSource } from "../../../../interfaces/user/notification/ENotificationSource";
import { ENotificationAction } from "../../../../interfaces/user/notification/ENotificationAction";
import { saveNotification } from "../../../../controllers/common/notificationController";
import { getWebSocketConnections } from "../../../../models/websocket/WebsocketManager";
import { EmailHandler } from "../../../../models/common/Email/EmailHandler";
import { DCREmailOptions } from "../../../../models/common/Email/options/DCEmailOptions";
import {
  TDocumentChange,
  IDocumentChangeFunctions,
  TTimeline,
  TStatus,
  TSourceTitle,
} from "../../../../interfaces/change/document/request/DocumentChangeTypes";
import { TimelineElement } from "../../../../models/change/dc/TimelineElement";
import { TimeHelper } from "../../../../models/common/TimeHelper";

@Entity()
class DocumentChange
  extends AbstractBaseOrmEntity
  implements TDocumentChange, IDocumentChangeFunctions
{
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @Column({ type: "varchar", nullable: true })
  no: string | null; ///

  @Column({ type: "int", nullable: false })
  year: number; ///

  @Column({ type: "varchar", nullable: false })
  originator: string; ///

  @Column({ type: "varchar", nullable: false })
  priority: "low" | "medium" | "high"; //

  @Column({ type: "text", nullable: false })
  affected: string; //

  @Column({ type: "varchar", nullable: false })
  docxNumber: string | null; //

  @Column({ type: "int", nullable: false })
  docxRevision: number; //

  @Column({ type: "varchar", nullable: false })
  docxReference: string;

  @Column({ type: "varchar", nullable: false })
  checker: string; //

  @Column({ type: "varchar", nullable: true })
  checkerComment: string | null; //

  @Column({ type: "boolean", nullable: true })
  checked: boolean | null; ///

  @Column({ type: "timestamp", nullable: true })
  checkedDate: Date | null; ///

  @Column({ type: "varchar", nullable: false })
  approver: string; //

  @Column({ type: "varchar", nullable: true })
  approverComment: string | null; //

  @Column({ type: "boolean", nullable: true })
  approved: boolean | null; ///

  @Column({ type: "timestamp", nullable: true })
  approvedDate: Date | null; ///

  @Column({ type: "varchar", nullable: false })
  registerer: string; //

  @Column({ type: "varchar", nullable: true })
  registererComment: string | null; //

  @Column({ type: "boolean", nullable: false })
  registered: boolean | null; ///

  @Column({ type: "timestamp", nullable: true })
  registeredDate: Date | null; ///

  @Column({ type: "jsonb", nullable: false })
  timeline: string; ///

  @Column({ type: "jsonb", nullable: true })
  affectedCompetences: string | null; //

  @Column({ type: "varchar", nullable: false })
  requireAcknowledgmentOrTraining: "acknowledgment" | "training"; //

  @Column({ type: "varchar", nullable: true })
  trainingDetails: string | null; //

  @Column({ type: "varchar", nullable: false })
  status: TStatus; ///

  @Column({ type: "jsonb", nullable: false })
  fileNames: string;

  @Column({ type: "varchar", nullable: false })
  docxSource: TSourceTitle;

  @Column({ type: "varchar", nullable: true })
  tags: string | null;

  isUUIDv4(value: string): boolean {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const testResult = uuidv4Regex.test(value);
    // if (!testResult) {
    //   throw new Error(`Reference value is of invalid format.`);
    // }
    return testResult;
  }

  constructor() {
    super();
  }

  build(from: TDocumentChange, issuer: string): this {
    this.no = null;
    this.year = new Date().getFullYear();
    this.originator = issuer;
    this.priority = from.priority;
    this.affected = from.affected;
    this.docxNumber = from.docxNumber;
    this.docxRevision = from.docxRevision;
    this.docxReference = this.isUUIDv4(from.docxReference) ? from.docxReference : uuidv4();
    this.status = from.status;
    this.checker = from.checker;
    this.approver = from.approver;
    this.registerer = from.registerer;
    this.registered = from.registered;
    this.timeline = from.timeline;
    this.affectedCompetences = from.affectedCompetences;
    this.requireAcknowledgmentOrTraining = from.requireAcknowledgmentOrTraining;
    this.trainingDetails = from.trainingDetails;
    this.fileNames = from.fileNames;
    this.docxSource = from.docxSource;
    this.tags = from.tags;

    return this;
  }

  setNo(countOfRequestsInYear: number): this {
    try {
      const paddedIndex = countOfRequestsInYear.toString().padStart(3, "0");
      const type = "DCR";
      const year = this.year;

      if (this.no === null) this.no = `${paddedIndex}/${type}/${year}`;

      return this;
    } catch (error) {
      console.log(error);
    }
  }

  changeNo(): this {
    if (this.registered === true) this.no.replace("DCR", "DCN");
    if (this.registered === false) this.no.replace("DCN", "DCR");
    return this;
  }

  saveFiles(
    langs: Array<{
      langs: Array<string>;
    }>,
    files: File[]
  ): boolean {
    try {
      function getFileName(file: File) {
        const originalName = file.originalname;
        const parsedName = path.parse(originalName).name;
        const index = parsedName.indexOf("_qs_");
        if (index !== -1) {
          // Remove _qs_ and everything after it
          return parsedName.substring(0, index);
        }
        return parsedName;
      }

      const fileNames: string[] = JSON.parse(this.fileNames);
      for (const [index, file] of Object.entries(files)) {
        const name = getFileName(file);
        const languages = langs[index].langs.join("_");
        const params = { langs: languages, uuid: this.docxReference };
        const queryString = new URLSearchParams(params).toString();
        const extension = path.extname(file.originalname);
        const saveAs = `${name}_qs_${queryString}${extension}`;
        fs.renameSync(file.path, path.join(UPLOADS_PATH, DC_DOCUMENTS_FOLDER, saveAs));
        fileNames.push(saveAs);
      }
      this.fileNames = JSON.stringify(fileNames);
      return true;
    } catch (error) {
      console.error("Error saving files: ", error);
      return false;
    }
  }

  deleteFiles(ref: string): boolean {
    try {
      const directory = path.join(UPLOADS_PATH, DC_DOCUMENTS_FOLDER);
      const files = fs.readdirSync(directory);
      const filesToDelete = files.filter((file) => file.includes(ref));
      for (const file of filesToDelete) {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
      }
      this.fileNames = "[]";

      return true;
    } catch (error) {
      console.error("Error deleting files: ", error);
      return false;
    }
  }

  assess(
    by: string,
    decision: boolean,
    comment: string | null
  ): {
    usernameVariant: "checker" | "approver";
    notificationVariant: EDCNotificationVariant;
    this: DocumentChange;
  } {
    let usernameVariant: "checker" | "approver" = "checker";
    let notificationVariant:
      | EDCNotificationVariant.Checked
      | EDCNotificationVariant.CheckFailed
      | EDCNotificationVariant.Approved
      | EDCNotificationVariant.ApprovalFailed;
    if (by === this.checker && !this.checked) {
      this.checkerComment = comment;
      this.checked = decision;
      this.checkedDate = new Date();

      notificationVariant = decision
        ? EDCNotificationVariant.Checked
        : EDCNotificationVariant.CheckFailed;
    } else if (by === this.approver && this.checked) {
      this.approverComment = comment;
      this.approved = decision;
      this.approvedDate = new Date();

      usernameVariant = "approver";
      notificationVariant = decision
        ? EDCNotificationVariant.Approved
        : EDCNotificationVariant.ApprovalFailed;
    } else {
      throw new Error("Unauthorized");
    }
    return { usernameVariant, notificationVariant, this: this };
  }

  unassess(): this {
    this.checkerComment = null;
    this.checked = null;
    this.checkedDate = null;
    this.approverComment = null;
    this.approved = null;
    this.approvedDate = null;
    return this;
  }

  register(
    by: string,
    decision: boolean,
    comment: string | null
  ): {
    usernameVariant: "originator";
    notificationVariant: EDCNotificationVariant;
    this: DocumentChange;
  } {
    const checked = this.checked === true;
    const approved = this.approved === true;

    let notificationVariant:
      | EDCNotificationVariant.Registered
      | EDCNotificationVariant.RegisterFailed;
    if (by === this.registerer && checked && approved) {
      this.registered = decision;
      this.registererComment = comment;
      this.registeredDate = new Date();

      notificationVariant = decision
        ? EDCNotificationVariant.Registered
        : EDCNotificationVariant.RegisterFailed;
    } else throw new Error("In order to register, dcr has to be checked and approved.");

    return { usernameVariant: "originator", notificationVariant, this: this };
  }

  unregister(): this {
    this.registered = null;
    this.registeredDate = null;
    return this;
  }

  compareWithFields(fields: DocumentChangeFields): boolean {
    // console.log("fields", fields);
    // console.log("this", this);
    // const omitProperties = [];
    // const thisKeys = Object.keys(this).filter((key) => omitProperties.includes(key));
    // const fieldsKeys = Object.keys(fields).filter((key) => omitProperties.includes(key));
    // for (const key of thisKeys) {
    //   if (!fieldsKeys.includes(key) || this[key] !== fields[key]) {
    //     return false;
    //   }
    // }
    const fieldsKeys: string[] = Object.keys(fields);
    for (const key of fieldsKeys) {
      if (this[key] !== fields[key]) {
        return false;
      }
    }
    return true;
  }

  updateTimeline(issuer: string): void {
    const timeline: TTimeline = JSON.parse(this.timeline);
    const highestId = timeline.reduce((maxId, item) => (item.id > maxId ? item.id : maxId), 0);
    const status: TStatus = this.status;
    let comment: string | null;
    switch (status) {
      case "Checked":
        comment = this.checkerComment;
        break;
      case "Approved":
        comment = this.approverComment;
        break;
      case "Rejected":
        if (this.checked === false) {
          comment = this.checkerComment;
        }
        if (this.approved === false) {
          comment = this.approverComment;
        }
        break;
      case "Registered":
        comment = this.registererComment;
        break;

      default:
        comment = undefined;
        break;
    }

    const timelineElement: TimelineElement = new TimelineElement(
      highestId === 0 ? 0 : highestId + 1,
      status,
      issuer,
      comment
    );
    timeline.push(timelineElement);
    this.timeline = JSON.stringify(timeline);
  }

  setStatus(issuer: string): this {
    const fields = new DocumentChangeFields(this);
    const fieldsFilled = fields.areFieldsFilled();
    const checked = this.checked === true;
    const approved = this.approved === true;
    const isRejected =
      this.checked === false || this.approved === false || this.registered === false;
    const isRegistered = this.registered === true;

    if (!fieldsFilled) {
      this.status = "Draft";
    } else if (isRejected) {
      this.status = "Rejected";
    } else if (approved && !isRegistered) {
      this.status = "Approved";
    } else if (checked && !approved) {
      this.status = "Checked";
    } else if (isRegistered) {
      this.status = "Registered";
    } else if (fieldsFilled && !checked && !approved && !isRegistered) {
      this.status = "Complete";
    }

    this.updateTimeline(issuer);

    return this;
  }

  editEntity(from: TDocumentChange): this {
    // this.originator = from.originator;
    this.priority = from.priority;
    this.affected = from.affected;
    this.docxNumber = from.docxNumber;
    this.docxRevision = from.docxRevision;
    this.docxReference = this.isUUIDv4(from.docxReference) ? from.docxReference : uuidv4();
    this.checker = from.checker;
    this.approver = from.approver;
    this.registerer = from.registerer;
    // this.timeline = from.timeline;
    this.affectedCompetences = from.affectedCompetences;
    this.requireAcknowledgmentOrTraining = from.requireAcknowledgmentOrTraining;
    this.trainingDetails = from.trainingDetails;
    this.docxSource = from.docxSource;
    this.tags = from.tags;

    return this;
  }
  // add info above dcr about mailing requirements

  remindReview(minHoursPassed: number = 24): {
    usernameVariant: "originator" | "checker" | "approver" | "registerer";
    notificationVariant: EDCNotificationVariant;
  } | null {
    const request: DocumentChange = this;
    const date = request.ormUpdateDate;
    const isoLocalTime = TimeHelper.convertToLocalTime(date);
    const hoursPassed = TimeHelper.timePassedSince(isoLocalTime, "hours");

    if (hoursPassed <= minHoursPassed) return null;

    switch (request.status) {
      case "Complete":
        return {
          usernameVariant: "checker",
          notificationVariant: EDCNotificationVariant.Completed,
        };

      case "Checked":
        return {
          usernameVariant: "approver",
          notificationVariant: EDCNotificationVariant.Checked,
        };
      case "Approved":
        return {
          usernameVariant: "registerer",
          notificationVariant: EDCNotificationVariant.Approved,
        };
      case "Rejected":
        if (request.checked === false) {
          return {
            usernameVariant: "originator",
            notificationVariant: EDCNotificationVariant.CheckFailed,
          };
        } else if (request.approved === false) {
          return {
            usernameVariant: "originator",
            notificationVariant: EDCNotificationVariant.ApprovalFailed,
          };
        } else if (request.registered === false) {
          return {
            usernameVariant: "originator",
            notificationVariant: EDCNotificationVariant.RegisterFailed,
          };
        }
      default:
        break;
    }
  }

  /**
   * Sends a notification to the primary recipient and CCs based on the given variant.
   *
   * @param entityManager - The EntityManager instance used for database operations.
   * @param username - The username of the primary recipient.
   * @param variant - The notification variant which determines the content of the notification.
   * @returns A promise that resolves to the list of recipients (primary and CC).
   *
   */
  async notification(
    entityManager: EntityManager,
    usernameVariant: "originator" | "checker" | "approver" | "registerer",
    variant: EDCNotificationVariant
  ): Promise<{ to: User; cc: Array<User> } | null> {
    const username = this[usernameVariant];

    if (!username) return null;

    const formatUsername = (username: string) => {
      if (/^[a-z]+\.[a-z]+$/.test(username)) return username;
      return username.split(" ").join(".").toLowerCase();
    };
    const dbUsername = formatUsername(username);

    const toOptions = {
      where: {
        username: dbUsername,
      },
      relations: ["info", "permission", "permission.groups", "permission.groups.subgroups"],
    };

    const to: User[] = await entityManager.getRepository(User).find(toOptions);

    if (to.length === 0) throw new Error("Primary recipient not found.");

    if (dbUsername === this.approver && !to.at(0).info.decisionMaker)
      throw new Error("Primary recipient is not a decision maker.");

    if (
      !to
        .at(0)
        .permission.groups.some(
          (group) =>
            group.name === "change" && group.subgroups.some((subgroup) => subgroup.name === "dcr")
        )
    )
      throw new Error("Primary recipient has no access to dcr.");

    const ccOptions = {
      where: {
        info: {
          department: to.at(0).info.department,
          decisionMaker: true,
        },
      },
      relations: toOptions.relations,
    };

    const cc: User[] = (await entityManager.getRepository(User).find(ccOptions))
      .filter((user) => {
        return user.permission.groups.some((group) => {
          return (
            group.name === "change" &&
            group.subgroups.some((subgroup) => {
              return subgroup.name === "dcr";
            })
          );
        });
      })
      .filter((user) => user.username !== to.at(0).username);

    const recipients = to.concat(cc);

    let notificationAction: ENotificationAction = ENotificationAction.AcceptOrReject;
    let body: { title?: string; subtitle?: string; link?: string } = {};
    switch (variant) {
      case EDCNotificationVariant.Completed:
        body = {
          title: `DCR Completed`,
          subtitle: `DCR ${this.no} has been completed. ${username}, please review.`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.Updated:
        body = {
          title: `DCR Updated`,
          subtitle: `DCR ${this.no} has been updated. ${username}, please review the changes.`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.Checked:
        body = {
          title: `DCR Checked`,
          subtitle: `DCR ${this.no} has been checked. ${username}, it is now awaiting your approval.`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.Approved:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Approved`,
          subtitle: `DCR ${this.no} has been approved. ${username}, it is now awaiting registration.`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.Registered:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Registered`,
          subtitle: `DCR ${this.no} has been registered. Comment: ${
            this.registererComment || "N/A"
          }`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.Unregistered:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Unregistered`,
          subtitle: `DCR ${this.no} has been unregistered. Comment: ${
            this.registererComment || "N/A"
          }`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.CheckFailed:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Check Failed`,
          subtitle: `DCR ${this.no} check has failed. ${username}, please review the issues. Comment: ${this.checkerComment}`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.ApprovalFailed:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Approval Failed`,
          subtitle: `DCR ${this.no} approval has failed. ${username}, please review the issues. Comment: ${this.approverComment}`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
      case EDCNotificationVariant.RegisterFailed:
        notificationAction = ENotificationAction.ViewDetails;
        body = {
          title: `DCR Register Failed`,
          subtitle: `DCR ${
            this.no
          } register has failed. ${username}, please review the issues. Comment: ${
            this.approverComment || "N/A"
          }`,
          link: `/tool/change/browse/dcr/${this.id}`,
        };
        break;
    }

    if (Object.keys(body).length === 0)
      throw new Error(
        `Notification body at DocumentChangeRequestEntity evaluates to empty object.`
      );

    for (const recipient of recipients) {
      const userNotification = new NotificationBuilder(ENotificationSource.DCR, notificationAction)
        .setUser(recipient)
        .setTitle(body.title)
        .setSubtitle(body.subtitle)
        .setLink(body.link)
        .build();

      saveNotification(userNotification);

      const websocketConnections = getWebSocketConnections();

      const foundRecipientConnection = websocketConnections.find(
        (connection) => connection.user.username === recipient.username
      );

      if (foundRecipientConnection) {
        foundRecipientConnection.ws.send(JSON.stringify(userNotification));
      }
    }

    return { to: to.at(0), cc };
  }

  sendEmails(recipients: { to: User; cc: Array<User> }, variant: EDCNotificationVariant): this {
    const emailHandler = EmailHandler.getInstance();
    emailHandler.newEmail(new DCREmailOptions(variant, this, recipients.to, recipients.cc)).send();
    return this;
  }
}

export { DocumentChange };
