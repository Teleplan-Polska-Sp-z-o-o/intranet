import { Request, Response } from "express";
import { DocumentChange } from "../../../orm/entity/change/documents/DocumentChangeEntity";
import { MulterRequest } from "../../../interfaces/common/MulterRequest";
import { HttpResponseMessage } from "../../../enums/response";
import { dataSource } from "../../../config/dataSource";
import { DocumentChangeFields } from "../../../models/change/dc/DocumentChangeFields";
import { User } from "../../../orm/entity/user/UserEntity";
import { EDCNotificationVariant } from "../../../interfaces/user/notification/ENotificationVariant";
import {
  TDocumentChange,
  IReview,
} from "../../../interfaces/change/document/request/DocumentChangeTypes";
import { Not } from "typeorm";

const enableMailAndNotification = true;

const addDCR = async (req: MulterRequest, res: Response) => {
  try {
    const body = req.body;
    const issuer: string = JSON.parse(body.issuer);
    const obj: TDocumentChange = JSON.parse(body.obj);
    const langs: Array<{
      langs: Array<string>;
    }> = JSON.parse(body.files_langs);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const dcrRepository = transactionalEntityManager.getRepository(DocumentChange);
      let dcr = new DocumentChange().build(obj, issuer);
      dcr = await dcrRepository.save(dcr);

      if (req.files) {
        const resultOfSavingFiles = dcr.saveFiles(langs, req.files);
        if (!resultOfSavingFiles) {
          throw new Error("Error saving files.");
        }
      }

      const count = await dcrRepository.count({ where: { year: dcr.year } });
      await dcrRepository.save(dcr.setNo(count).setStatus(issuer));

      if (dcr.status === "Complete" && enableMailAndNotification) {
        const recipients: {
          to: User;
          cc: Array<User>;
        } = await dcr.notification(
          transactionalEntityManager,
          "checker",
          EDCNotificationVariant.Completed
        );
        if (recipients) dcr.sendEmails(recipients, EDCNotificationVariant.Completed);
      }

      return res.status(201).json({
        added: dcr,
        message: "DCR added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding DCR: ", error);
    switch (error.message) {
      case "Error saving files.":
        return res.status(400).json({
          message: error.message,
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      case "Reference value is of invalid format.":
        return res.status(400).json({
          message: error.message,
          statusMessage: HttpResponseMessage.REFERENCE_FORMAT_ERROR,
        });
      case "Primary recipient is not a decision maker.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.DECISION_MAKER_ERROR,
        });
      case "Primary recipient has no access to dcr.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.TOOL_ACCESS_ERROR,
        });
      default:
        return res.status(500).json({
          message: "Unknown error occurred. Failed to add DCR.",
          statusMessage: HttpResponseMessage.UNKNOWN,
        });
    }
  }
};

const editDCR = async (req: MulterRequest, res: Response) => {
  try {
    const body = req.body;
    const issuer: string = JSON.parse(body.issuer);
    const obj: TDocumentChange = JSON.parse(body.obj);
    const fields: DocumentChangeFields = new DocumentChangeFields(obj);
    const langs: Array<{
      langs: Array<string>;
    }> = JSON.parse(body.files_langs);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const dcrRepository = transactionalEntityManager.getRepository(DocumentChange);
      const dcr = await dcrRepository.findOne({ where: { id: obj.id } });
      const ref = dcr.docxReference;

      if (!dcr) {
        return res.status(404).json({
          message: "DCR not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const preEditStatus = dcr.status;
      const isTheSame = dcr.compareWithFields(fields);
      if (!isTheSame) {
        dcr.editEntity(obj).unassess();
      }

      if (req.files) {
        dcr.deleteFiles(ref);
        const resultOfSavingFiles = dcr.saveFiles(langs, req.files);
        if (!resultOfSavingFiles) {
          throw new Error("Error saving files.");
        }
      }

      await dcrRepository.save(dcr.setStatus(issuer));

      if (dcr.status !== "Draft" && enableMailAndNotification) {
        let notificationVariant = EDCNotificationVariant.Updated;
        if (dcr.status === "Complete" && preEditStatus !== "Complete")
          notificationVariant = EDCNotificationVariant.Completed;

        const recipients: {
          to: User;
          cc: Array<User>;
        } = await dcr.notification(transactionalEntityManager, "checker", notificationVariant);
        if (recipients) dcr.sendEmails(recipients, notificationVariant);
      }

      return res.status(200).json({
        edited: dcr,
        message: "DCR updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating DCR: ", error);
    switch (error.message) {
      case "Error saving files.":
        return res.status(400).json({
          message: error.message,
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      case "Primary recipient is not a decision maker.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.DECISION_MAKER_ERROR,
        });
      case "Primary recipient has no access to dcr.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.TOOL_ACCESS_ERROR,
        });
      default:
        return res.status(500).json({
          message: "Unknown error occurred. Failed to update DCR.",
          statusMessage: HttpResponseMessage.UNKNOWN,
        });
    }
  }
};

const assessDCR = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const body = req.body;
    const assessment: IReview = JSON.parse(body.assessment);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const dcrRepository = transactionalEntityManager.getRepository(DocumentChange);
      const dcr = await dcrRepository.findOne({ where: { id: assessment.id } });

      const assessResult = dcr.assess(assessment.issuer, assessment.decision, assessment.comment);

      if (enableMailAndNotification) {
        const recipients: {
          to: User;
          cc: Array<User>;
        } = await dcr.notification(
          transactionalEntityManager,
          assessResult.usernameVariant,
          assessResult.notificationVariant
        );
        if (recipients) dcr.sendEmails(recipients, assessResult.notificationVariant);
      }

      await dcrRepository.save(dcr.setStatus(assessment.issuer));

      return res.status(200).json({
        assessed: dcr,
        message: "DCR assessed successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error assessing DCR: ", error);
    switch (error.message) {
      case "Primary recipient is not a decision maker.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.DECISION_MAKER_ERROR,
        });
      case "Primary recipient has no access to dcr.":
        return res.status(403).json({
          message: error.message,
          statusMessage: HttpResponseMessage.TOOL_ACCESS_ERROR,
        });
      default:
        return res.status(500).json({
          message: "Unknown error occurred. Failed to assess DCR.",
          statusMessage: HttpResponseMessage.UNKNOWN,
        });
    }
  }
};

const registration = async (req: Request<{ id: number }>, res: Response) => {
  try {
    console.log("registration");
    const body = req.body;
    const registration: IReview = JSON.parse(body.registration);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const dcrRepository = transactionalEntityManager.getRepository(DocumentChange);
      const dcr = await dcrRepository.findOne({ where: { id: registration.id } });

      if (!dcr) {
        return res.status(404).json({
          message: "DCR not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      let registrationResult = {
        usernameVariant: "originator" as "originator",
        notificationVariant: EDCNotificationVariant.Unregistered,
        this: dcr,
      };

      if (registration.decision)
        registrationResult = dcr.register(
          registration.issuer,
          registration.decision,
          registration.comment
        );
      else dcr.unregister();

      if (enableMailAndNotification) {
        const recipients: {
          to: User;
          cc: Array<User>;
        } = await dcr.notification(
          transactionalEntityManager,
          registrationResult.usernameVariant,
          registrationResult.notificationVariant
        );
        if (recipients) dcr.sendEmails(recipients, registrationResult.notificationVariant);
      }
      await dcrRepository.save(dcr.setStatus(registration.issuer).changeNo());

      return res.status(200).json({
        registered: dcr,
        message: "DCR registering confirmed successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error confirming registration of DCR: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to confirm registration of DCR.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeDCR = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const dcrRepository = transactionalEntityManager.getRepository(DocumentChange);
      const dcr = await dcrRepository.findOne({ where: { id } });
      const ref = dcr.docxReference;

      if (!dcr) {
        return res.status(404).json({
          message: "DCR not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      dcr.deleteFiles(ref);
      await dcrRepository.remove(dcr);

      return res.status(200).json({
        deleted: dcr,
        message: "DCR removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing DCR: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove DCR.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getUnregisteredDCRs = async (_req: Request, res: Response) => {
  try {
    let dcrs = await dataSource.getRepository(DocumentChange).find({
      where: { status: Not("Registered") },
      order: {
        ormCreateDate: "DESC",
      },
    });

    dcrs = dcrs.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return res.status(200).json({
      got: dcrs,
      message: "DCRs retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving DCRs: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve DCRs.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRegisteredDCRs = async (_req: Request, res: Response) => {
  try {
    let dcrs = await dataSource.getRepository(DocumentChange).find({
      where: { status: "Registered" },
      order: {
        ormCreateDate: "DESC",
      },
    });

    return res.status(200).json({
      got: dcrs,
      message: "DCRs retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving DCRs: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve DCRs.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  addDCR,
  editDCR,
  assessDCR,
  registration,
  removeDCR,
  getUnregisteredDCRs,
  getRegisteredDCRs,
};
