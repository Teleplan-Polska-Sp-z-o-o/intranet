import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";

const getNoticeUpdates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const options = {
      where: { id },
      relations: ["processChangeNoticeUpdates"],
    };

    const notice: ProcessChangeNotice = await dataSource
      .getRepository(ProcessChangeNotice)
      .findOne(options);

    const noticeUpdates = notice.processChangeNoticeUpdates;

    res.status(200).json({
      got: noticeUpdates,
      message: "Notice Updates retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving notice updates: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve notice updates.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getNoticeUpdates };
