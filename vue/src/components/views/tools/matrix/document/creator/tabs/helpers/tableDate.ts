import moment from "moment";
import "moment-timezone";
import { IDraftEntity } from "../../../../../../../../interfaces/document/creator/IDraftEntity";
import { deepSafeParse } from "./deepSaveParse";

function tableDate(item: IDraftEntity, variant: "createdBy" | "lastUpdate") {
  const tz = deepSafeParse<IDraftEntity>(item).stepper.tz;
  if (variant === "createdBy") {
    const utcDate = item.createdBy.date;
    const tzDate = moment(utcDate).tz(tz).format("DD-MMM-YYYY");
    return tzDate || "- - -";
  } else if (variant === "lastUpdate") {
    const utcDate = item.updatedBy.at(-1)?.date;
    const tzDate = utcDate !== undefined ? moment(utcDate).tz(tz).format("DD-MMM-YYYY") : false;
    return tzDate || "- - -";
  }
}

export { tableDate };
