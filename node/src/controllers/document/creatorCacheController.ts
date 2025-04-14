import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { SimpleUser } from "../../models/user/SimpleUser";
import { TStepper } from "../../interfaces/document/creatorTypes";
import { Repository } from "typeorm";
import { DraftCache } from "../../orm/entity/document/creator/DraftCacheEntity";

const upsertDraftCache = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const stepper: TStepper = JSON.parse(body.stepper);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<DraftCache> = transactionalEntityManager.getRepository(DraftCache);
      const draftCache: DraftCache = await repo.findOne({ where: { userId: issuer.id } });

      let statusMessage = HttpResponseMessage.POST_SUCCESS;
      if (!draftCache) {
        const draftCache = new DraftCache().build(issuer.id, stepper);
        draftCache.setCreatedBy(issuer);
        await repo.save(draftCache);
      } else {
        statusMessage = HttpResponseMessage.PUT_SUCCESS;
        draftCache.stepper = stepper;
        draftCache.addUpdatedBy(issuer);
        await repo.save(draftCache);
      }

      return res.status(200).json({
        cache: [draftCache],
        message: "Draft Cache upsert successfully",
        statusMessage,
      });
    });
  } catch (error) {
    console.error("Error upsert draft: ", error);

    return res.status(500).json({
      cache: [],
      message: "Unknown error occurred. Failed to upsert draft.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDraftCache = async (req: Request, res: Response) => {
  try {
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<DraftCache> = transactionalEntityManager.getRepository(DraftCache);
      const draftCache: DraftCache = await repo.findOne({ where: { userId: issuer.id } });

      if (!draftCache) {
        return res.status(200).json({
          cache: [],
          message: `Draft Cache not found`,
          statusMessage: HttpResponseMessage.GET_SUCCESS,
        });
      } else {
        return res.status(200).json({
          cache: [draftCache],
          message: `Draft Cache retrieved successfully`,
          statusMessage: HttpResponseMessage.GET_SUCCESS,
        });
      }
    });
  } catch (error) {
    console.error("Error retrieving Draft Cache: ", error);
    return res.status(500).json({
      cache: [],
      message: `Unknown error occurred. Failed to retrieve Draft Cache.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { upsertDraftCache, getDraftCache };
