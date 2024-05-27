import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
// import { ProcessChangeRequestUpdates } from "../../orm/entity/change/ProcessChangeRequestUpdatesEntity";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
// import { FindManyOptions } from "typeorm";

const getRequestUpdates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const options = {
      where: { id },
      relations: ["processChangeRequestUpdates"],
    };

    const request: ProcessChangeRequest = await dataSource
      .getRepository(ProcessChangeRequest)
      .findOne(options);

    // const options: FindManyOptions<ProcessChangeRequestUpdates> = {
    //   where: { processChangeRequest: request },
    // };

    // const requestUpdates = await dataSource
    //   .getRepository(ProcessChangeRequestUpdates)
    //   .find(options);

    // console.log(request.processChangeRequestUpdates);

    const requestUpdates = request.processChangeRequestUpdates;

    res.status(200).json({
      got: requestUpdates,
      message: "Request Updates retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving request updates: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve request updates.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getRequestUpdates };
