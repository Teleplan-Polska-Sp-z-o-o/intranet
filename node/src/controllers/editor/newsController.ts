import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { News } from "../../orm/entity/news/NewsEntity";
import * as fs from "fs";
import * as path from "path";
import { dataSource } from "../../config/orm/dataSource";
import { serverConfig } from "../../config/server";
import { EntityManager } from "typeorm";
import he from "he";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { MulterRequest } from "../../interfaces/common/MulterRequest";
import { UPLOADS_PATH } from "../../config/routes";

const saveNewsFile = (file: any, ref: string, bg: boolean): string => {
  const param = { bg: bg.toString(), uuid: ref };
  const queryString = new URLSearchParams(param).toString();
  const { name, ext } = path.parse(file.originalname);

  let newFileName = file.originalname;
  if (!file.originalname.includes("_qs_")) {
    newFileName = `${name}_qs_${queryString}${ext}`;
  }

  fs.renameSync(file.path, path.join(UPLOADS_PATH, "news", newFileName));

  return newFileName;
};

const removeUnusedImages = async (manager: EntityManager) => {
  // init array containing used images
  const imagesInUse: Array<string> = [];

  // get all news
  const savedNews = await manager.getRepository(News).find({});

  // iterate thru all news
  for (const news of savedNews) {
    imagesInUse.push(news.bgImage);

    // get img tags from content
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    const imgTagsFromContent = news.content.match(imgRegex);

    // get src values
    imgTagsFromContent?.forEach((imgTag) => {
      const match = /src="([^"]+)"/.exec(imgTag);
      if (match && match[1]) {
        const url = new URL(match[1]);
        imagesInUse.push(path.basename(he.decode(url.pathname)));
      }
    });
  }

  // get all files from the news directory
  const uploadsDir = path.join(UPLOADS_PATH, "news");
  const files = fs.readdirSync(uploadsDir);

  // remove files that are not in the imagesInUse array
  files?.forEach((file) => {
    if (!imagesInUse.includes(file)) {
      const filePath = path.join(uploadsDir, file);
      fs.unlinkSync(filePath);
    }
  });
};

const addNews = async (req: MulterRequest, res: Response) => {
  try {
    console.log(req.headers);

    switch (req.headers.ckeditor) {
      case "true":
        // store content image
        const newFileName = saveNewsFile(req.files.at(0), req.headers.ref as string, false);

        return res.status(200).json({
          url: `${serverConfig.origin}:${serverConfig.port}/uploads/news/${newFileName}`,
        });

      default:
        const body = req.body;
        const base = JSON.parse(body.base);

        let newNews: News;

        await dataSource.transaction(async (transactionalEntityManager) => {
          // store bg image
          const newFileName = saveNewsFile(req.files.at(0), base.ref, true);

          const news = new News(
            base.ref,
            base.confidentiality,
            base.title,
            base.subtitle,
            base.content,
            newFileName
          );

          newNews = await transactionalEntityManager.getRepository(News).save(news);

          removeUnusedImages(transactionalEntityManager);
        });

        return res.status(200).json({
          added: newNews,
          message: "News added successfully.",
          statusMessage: HttpResponseMessage.PUT_SUCCESS,
        });
    }
  } catch (error) {
    console.error("Error adding news:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editNews = async (req: MulterRequest, res: Response) => {
  try {
    const body = req.body;
    const base = JSON.parse(body.base);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const newsToUpdate = await transactionalEntityManager.getRepository(News).findOne({
        where: {
          ref: base.ref,
        },
      });

      // clean old bg image
      const uploadsDir = path.join(UPLOADS_PATH, "news");

      const files = fs.readdirSync(uploadsDir);

      const fileToDelete = files.find((file) => file === newsToUpdate.bgImage);

      const filePath = path.join(uploadsDir, fileToDelete);
      fs.unlinkSync(filePath);

      // store bg image
      const newFileName = saveNewsFile(req.files.at(0), base.ref, true);

      base.bgImage = newFileName;

      // newsToUpdate.ref = base.ref;
      // newsToUpdate.confidentiality = base.confidentiality;
      // newsToUpdate.title = base.title;
      // newsToUpdate.subtitle = base.subtitle;
      // newsToUpdate.content = base.content;
      // newsToUpdate.bgImage = base.bgImage;

      newsToUpdate.editColumns(base);

      await transactionalEntityManager.getRepository(News).save(newsToUpdate);

      removeUnusedImages(transactionalEntityManager);

      return res.status(200).json({
        edited: newsToUpdate,
        message: "News edited successfully.",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error editing news:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNews = async (
  req: Request<{ confidentiality: TConfidentiality; skip: number; take: number }>,
  res: Response
) => {
  try {
    const { confidentiality, skip, take } = req.params;

    let query = dataSource.getRepository(News).createQueryBuilder("news");

    switch (confidentiality) {
      case "public":
        query = query.where("news.confidentiality = :confidentiality", {
          confidentiality: "public",
        });
        break;
      case "restricted":
        query = query.where("news.confidentiality IN (:...confidentialities)", {
          confidentialities: ["public", "restricted"],
        });
        break;
      case "secret":
        query = query.where("news.confidentiality IN (:...confidentialities)", {
          confidentialities: ["public", "restricted", "secret"],
        });
        break;
      default:
        break;
    }

    query = query.orderBy("news.id", "DESC");

    const allNews: Array<News> = await query.skip(skip).take(take).getMany();

    return res.status(200).json({
      news: allNews,
      message: "News retrieved successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving news:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeNews = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const newsToRemove = await transactionalEntityManager
        .getRepository(News)
        .findOne({ where: { id } });

      if (!newsToRemove) {
        return res.status(404).json({
          message: "News not found.",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      const newsRef = newsToRemove.ref;
      const directory = path.join(UPLOADS_PATH, "news");
      const files = fs.readdirSync(directory);
      // Filter files that contain the document's reference in their names
      const filesToDelete = files.filter((file) => file.includes(newsRef));

      // Delete each file
      filesToDelete.forEach((file) => {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
      });

      const removedNews = await transactionalEntityManager.getRepository(News).remove(newsToRemove);

      return res.status(200).json({
        deleted: removedNews,
        message: "News removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing news: ", error);
    return res.status(500).json({
      message: "Failed to remove news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addNews, editNews, getNews, removeNews };
