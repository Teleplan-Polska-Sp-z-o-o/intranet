import { defineStore } from "pinia";

export const useAnalyticFileStore = defineStore("analytic-file", () => {
  const fileTypes: Record<string, Record<string, Record<"drive", string[]>>> = {
    sky: {
      packing: {
        drive: ["models", "planning", "reports", "miscellaneous"],
      },
      cosmetic: {
        drive: ["models", "reports", "miscellaneous"],
      },
      ooba: {
        drive: ["models", "reports", "miscellaneous"],
      },
      test: {
        drive: ["models", "reports", "miscellaneous"],
      },
    },
    lenovo: {
      repair: {
        drive: ["models", "reports", "miscellaneous"],
      },
      registration: {
        drive: ["models", "reports", "miscellaneous"],
      },
      cleaning: {
        drive: ["models", "reports", "miscellaneous"],
      },
      final: {
        drive: ["models", "reports", "miscellaneous"],
      },
      packing: {
        drive: ["models", "reports", "miscellaneous"],
      },
    },
    ingenico: {
      vmi: { drive: ["models", "reports", "miscellaneous"] },
      screening: { drive: ["models", "reports", "miscellaneous"] },
      wintest: { drive: ["models", "reports", "miscellaneous"] },
      finaltest: { drive: ["models", "reports", "miscellaneous"] },
      activation: { drive: ["models", "reports", "miscellaneous"] },
      customization: { drive: ["models", "reports", "miscellaneous"] },
      keyinjection: { drive: ["models", "reports", "miscellaneous"] },
      fgi: { drive: ["models", "reports", "miscellaneous"] },
      repair2: { drive: ["models", "reports", "miscellaneous"] },
      repair3: { drive: ["models", "reports", "miscellaneous"] },
    },
    liberty: {
      vmi: { drive: ["models", "reports", "miscellaneous"] },
      test: { drive: ["models", "reports", "miscellaneous"] },
      debugrepair: { drive: ["models", "reports", "miscellaneous"] },
      cosmetic: { drive: ["models", "reports", "miscellaneous"] },
      highpot: { drive: ["models", "reports", "miscellaneous"] },
      pack: { drive: ["models", "reports", "miscellaneous"] },
      ship: { drive: ["models", "reports", "miscellaneous"] },
      ooba: { drive: ["models", "reports", "miscellaneous"] },
    },
    dell: {
      vmi: { drive: ["models", "miscellaneous"] },
      wffa: { drive: ["models", "miscellaneous"] },
      pack: { drive: ["models", "miscellaneous"] },
      finaltest: { drive: ["models", "miscellaneous"] },
      ecocheck: { drive: ["models", "miscellaneous"] },
      fch: { drive: ["models", "miscellaneous"] },
      repairl1l2: { drive: ["models", "miscellaneous"] },
      screening: { drive: ["models", "miscellaneous"] },
      ecoworks: { drive: ["models", "miscellaneous"] },
      oba: { drive: ["models", "miscellaneous"] },
      repairl3: { drive: ["models", "miscellaneous"] },
      scrap: { drive: ["models", "miscellaneous"] },
      hold: { drive: ["models", "miscellaneous"] },
      ship: { drive: ["models", "miscellaneous"] },
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
    // SKY
    "sky-packing-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_PACK"],
      planning: ["LINE", "DATE", "SHIFT", "PACKING"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "sky-cosmetic-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_COSM"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "sky-ooba-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_OOBA"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "sky-test-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_TEST"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    // LENOVO
    "lenovo-repair-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_REPAIR"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "lenovo-registration-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_REGISTRATION"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "lenovo-cleaning-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_CLEANING"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "lenovo-final-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_FINAL_TEST"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "lenovo-packing-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_PACKING"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    // INGENICO
    "ingenico-vmi-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-screening-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-wintest-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-finaltest-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-activation-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-customization-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-keyinjection-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-fgi-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-repair2-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "ingenico-repair3-drive": {
      models: ["PART_NO", "WORKSTATION", "NEXT_WORKSTATION", "TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    // LIBERTY
    "liberty-vmi-drive": {
      models: ["IFS_PN", "VMI_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-test-drive": {
      models: ["IFS_PN", "TEST_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-debugrepair-drive": {
      models: ["IFS_PN", "DEB_REP_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-cosmetic-drive": {
      models: [
        "IFS_PN",
        "GROUP",
        "COSMETIC_1",
        "COSMETIC_2",
        "COSMETIC_3",
        "COSMETIC_4",
        "COSMETIC_5",
      ],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-highpot-drive": {
      models: ["IFS_PN", "HIPOT_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-pack-drive": {
      models: ["IFS_PN", "PACK_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-ship-drive": {
      models: ["IFS_PN", "SHIP_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },
    "liberty-ooba-drive": {
      models: ["IFS_PN", "OBA_TT"],
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL", "CONTENT_CODES"],
    },

    // DELL
    "dell-vmi-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-wffa-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-pack-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-finaltest-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-ecocheck-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-fch-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-repairl1l2-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-screening-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-ecoworks-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-oba-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-repairl3-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-scrap-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-hold-drive": {
      models: ["WORKSTATION_DESC", "TT"],
    },
    "dell-ship-drive": {
      models: ["WORKSTATION_DESC", "TT"],
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
