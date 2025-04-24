import { DataTableHeader } from "../../files/download/DataTableHeader";
export const missingCacheTableHeaders: object[] = [
  {
    title: "Id",
    align: "start",
    key: "id",
    value: "id",
  },
  {
    title: "Missing Model Cache Key",
    align: "start",
    key: "cacheKey",
    value: "cacheKey",
  },
  {
    title: "Touch Time Key",
    align: "start",
    key: "touchTimeKey",
    value: "touchTimeKey",
  },
];

export const missingCacheDownloadHeaders = missingCacheTableHeaders as DataTableHeader[];
// .filter(
//   (col: DataTableHeader) => {
//     const keyBlackList = ["id"];
//     return !keyBlackList.includes(col.value);
//   }
// );
