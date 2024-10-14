import { defineStore } from "pinia";

export const useAnalyticFileStore = defineStore("analytic-file", () => {
  const fileTypes: Record<string, Record<string, Record<"drive", string[]>>> = {
    sky: {
      packing: {
        drive: ["models", "planning", "reports", "miscellaneous"],
      },
      cosmetic: {
        drive: ["models", "miscellaneous"],
      },
      ooba: {
        drive: ["models", "miscellaneous"],
      },
    },
    lenovo: {
      repair: {
        drive: ["models", "miscellaneous"],
      },
    },
  };

  const getFileTypes = (
    prog?: string,
    group?: string
  ):
    | Record<string, Record<string, Record<"drive", string[]>>>
    | Record<string, Record<"drive", string[]>>
    | Record<"drive", string[]>
    | string[]
    | undefined => {
    if (prog && group) {
      return fileTypes[prog][group]["drive"]; // returns string[]
    } else if (prog && !group) {
      return fileTypes[prog]; // returns Record<string, Record<"drive", string[]>>
    } else if (!prog && !group) {
      return fileTypes; // returns the whole fileTypes object
    }
  };

  const requiredFiles: Record<string, Record<string, string[]>> = {
    "sky-packing-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_PACK"],
      planning: ["LINE", "DATE", "SHIFT", "PACKING"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL"],
    },
    "sky-cosmetic-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_COSM"],
    },
    "sky-ooba-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_OOBA"],
    },
    "lenovo-repair-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_REPAIR"],
    },
  };

  const getRequiredFiles = (
    prog: string,
    group: string
  ): Record<string, string[]> | string[] | undefined => {
    // Create a key to match with requiredFiles
    const key = `${prog}-${group}-drive`;
    return requiredFiles[key];
  };

  return { getFileTypes, getRequiredFiles };
});
