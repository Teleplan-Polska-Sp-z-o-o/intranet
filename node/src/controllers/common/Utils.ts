import { IPost, IPut } from "../../interfaces/common/Utils";
import { Helper } from "../../models/common/Helper";

export class Utils {
  constructor() {}

  public addRecordPostInfo = <T extends IPost>(issuer: string, entity: T): T => {
    const postEntity: T = entity;

    if (
      postEntity &&
      (!postEntity.hasOwnProperty("postBy") || !postEntity.hasOwnProperty("postByDate"))
    ) {
      throw new Error("Given Type property postBy and/or postByDate evaluates to false value");
    }

    postEntity.postBy = issuer;
    postEntity.postByDate = Helper.formatDate(new Date(), `addRecordPostInfo`);

    return postEntity;
  };

  public addRecordPutInfo = <T extends IPut>(issuer: string, entity: T): T => {
    try {
      const putEntity: T = entity;

      if (
        putEntity &&
        (!putEntity.hasOwnProperty("putBy") || !putEntity.hasOwnProperty("putByDate"))
      ) {
        throw new Error("Given Type property putBy and/or putByDate evaluates to false value");
      }

      let putBy: Array<string>;
      let putByDate: Array<string>;

      try {
        putBy = JSON.parse(putEntity.putBy);
        putByDate = JSON.parse(putEntity.putByDate);
      } catch (error) {
        putBy = [putEntity.putBy];
        putByDate = [putEntity.putByDate];
      }

      if (Array.isArray(putBy)) {
        putBy.push(issuer);
      }

      if (Array.isArray(putByDate)) {
        const newDate = Helper.formatDate(new Date(), `addRecordPutInfo`);
        putByDate.push(newDate);
      }

      putEntity.putBy = JSON.stringify(putBy);
      putEntity.putByDate = JSON.stringify(putByDate);

      return putEntity;
    } catch (error) {
      throw new Error(
        `Failed to update put record info at addRecordPutInfo at Utils, entity: ${entity}, error: ${error}`
      );
    }
  };
}
