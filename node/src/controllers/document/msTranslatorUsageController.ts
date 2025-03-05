import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { LessThan, Repository } from "typeorm";
import { SimpleUser } from "../../models/user/SimpleUser";
import { MSTranslatorUsage } from "../../orm/entity/document/creator/MSTranslatorUsageEntity";
import moment from "moment";

const postUsage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<MSTranslatorUsage> =
        transactionalEntityManager.getRepository(MSTranslatorUsage);

      // Step 1: Calculate the cut-off date (First day of three months ago)
      const cutoffDate = moment().startOf("month").subtract(3, "months").toDate();
      // Step 2: Remove records older than the cutoff date
      // await repo
      //   .createQueryBuilder()
      //   .delete()
      //   .where("createdAt < :cutoffDate", { cutoffDate })
      //   .execute();
      await repo.delete({
        ormCreateDate: LessThan(cutoffDate),
      });

      // Step 3: Add new usage record
      const usage = new MSTranslatorUsage()
        .build(body.charactersUsed, body.resultedInError, body.errorMessage)
        .setCreatedBy(issuer);

      await repo.save(usage);

      return res.status(201).json({
        saved: [usage],
        message: "Usage record added successfully.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding usage record: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add usage record.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getUsageLogs = async (_req: Request, res: Response) => {
  try {
    const usageLogs = await dataSource.getRepository(MSTranslatorUsage).find();

    return res.status(200).json({
      retrieved: usageLogs,
      message: "Usage logs retrieved successfully.",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving usage logs: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve usage logs.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getTotalUsage = async (_req: Request, res: Response) => {
  try {
    const repo = dataSource.getRepository(MSTranslatorUsage);

    const totalUsage = await repo
      .createQueryBuilder("usage")
      .select("SUM(usage.charactersUsed)", "totalCharactersUsed")
      .getRawOne();

    return res.status(200).json({
      totalCharactersUsed: totalUsage.totalCharactersUsed,
      message: "Total usage retrieved successfully.",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving total usage: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve total usage.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { postUsage, getUsageLogs, getTotalUsage };
