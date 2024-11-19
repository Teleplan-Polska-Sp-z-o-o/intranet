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
    liberty: {
      vmi: { drive: ["models", "miscellaneous"] },
      test: { drive: ["models", "miscellaneous"] },
      debugrepair: { drive: ["models", "miscellaneous"] },
      cosmetic: { drive: ["models", "miscellaneous"] },
      highpot: { drive: ["models", "miscellaneous"] },
      pack: { drive: ["models", "miscellaneous"] },
      ship: { drive: ["models", "miscellaneous"] },
      ooba: { drive: ["models", "miscellaneous"] },
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
      reports: ["NAME", "SURNAME", "USERNAME", "MAIL"],
    },
    "sky-cosmetic-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_COSM"],
    },
    "sky-ooba-drive": {
      models: ["GROUP_NAME", "GROUP_LETTER", "IFS_PART_NO", "TT_OOBA"],
    },
    // LENOVO
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
    // INGENICO
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
    // LIBERTY
    "liberty-vmi-drive": {
      models: ["IFS_PN", "VMI_TT"],
    },
    "liberty-test-drive": {
      models: ["IFS_PN", "TEST_TT"],
    },
    "liberty-debugrepair-drive": {
      models: ["IFS_PN", "DEB_REP_TT"],
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
    },
    "liberty-highpot-drive": {
      models: ["IFS_PN", "HIPOT_TT"],
    },
    "liberty-pack-drive": {
      models: ["IFS_PN", "PACK_TT"],
    },
    "liberty-ship-drive": {
      models: ["IFS_PN", "SHIP_TT"],
    },
    "liberty-ooba-drive": {
      models: ["IFS_PN", "OBA_TT"],
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
