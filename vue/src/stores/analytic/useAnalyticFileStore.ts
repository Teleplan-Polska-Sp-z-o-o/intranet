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
      registration: {
        drive: ["models", "miscellaneous"],
      },
      cleaning: {
        drive: ["models", "miscellaneous"],
      },
      final: {
        drive: ["models", "miscellaneous"],
      },
      packing: {
        drive: ["models", "miscellaneous"],
      },
    },
    ingenico: {
      vmi: { drive: ["models", "miscellaneous"] },
      screening: { drive: ["models", "miscellaneous"] },
      wintest: { drive: ["models", "miscellaneous"] },
      finaltest: { drive: ["models", "miscellaneous"] },
      activation: { drive: ["models", "miscellaneous"] },
      customization: { drive: ["models", "miscellaneous"] },
      keyinjection: { drive: ["models", "miscellaneous"] },
      fgi: { drive: ["models", "miscellaneous"] },
      repair2: { drive: ["models", "miscellaneous"] },
      repair3: { drive: ["models", "miscellaneous"] },
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
    "lenovo-registration-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_REGISTRATION"],
    },
    "lenovo-cleaning-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_CLEANING"],
    },
    "lenovo-final-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_FINAL_TEST"],
    },
    "lenovo-packing-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_PACKING"],
    },
    "ingenico-vmi-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-screening-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-wintest-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-finaltest-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-activation-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-customization-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-keyinjection-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-fgi-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-repair2-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
    },
    "ingenico-repair3-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
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
