import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/dataSource";
import { UserToolStatistics } from "../../orm/entity/user/UserToolStatisticsEntity";
import { User } from "../../orm/entity/user/UserEntity";

const addOrUpdateToolUsage = async (req: Request<{ toolName: string }>, res: Response) => {
  try {
    const user = req.user;
    const { toolName } = req.params;

    const options = { where: { user: { id: user.id }, toolName } };

    await dataSource.transaction(async (transactionalEntityManager) => {
      let statistics: UserToolStatistics = await transactionalEntityManager
        .getRepository(UserToolStatistics)
        .findOne(options);

      if (statistics) {
        statistics.incrementUsageCount();

        statistics = await transactionalEntityManager
          .getRepository(UserToolStatistics)
          .save(statistics);

        return res.status(200).json({
          statistics,
          message: "Successfully updated old statictics record.",
          statusMessage: HttpResponseMessage.POST_SUCCESS,
        });
      } else {
        const userEntity = await transactionalEntityManager
          .getRepository(User)
          .findOne({ where: { id: user.id } });

        if (!userEntity)
          return res.status(404).json({
            message: "User not found.",
            statusMessage: HttpResponseMessage.POST_ERROR,
          });

        statistics = new UserToolStatistics().build(toolName, userEntity);

        statistics = await transactionalEntityManager
          .getRepository(UserToolStatistics)
          .save(statistics);

        return res.status(201).json({
          statistics,
          message: "Successfully created new statictics record.",
          statusMessage: HttpResponseMessage.POST_SUCCESS,
        });
      }
    });
  } catch (error) {
    console.error("Error adding or updating statistics:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add or update statistics.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getToolUsage = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const statistics: UserToolStatistics[] = await dataSource
      .getRepository(UserToolStatistics)
      .find({
        where: { user: { id: user.id } },
      });

    return res.status(200).json({
      statistics,
      message: "Successfully retrieved tool usage statistics.",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving tool usage statistics:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve tool usage statistics.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addOrUpdateToolUsage, getToolUsage };
