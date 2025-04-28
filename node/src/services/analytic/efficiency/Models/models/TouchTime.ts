export namespace SKY {
  interface IBaseModelObj {
    [key: string]: string;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }
  interface ITTPack {
    [key: string]: number;
    TT_PACK: number; // Time required to pack a unit, in minutes
  }
  interface ITTCosm {
    [key: string]: number;
    TT_COSM: number; // Time required to pack a unit, in minutes
  }
  interface ITTOoba {
    [key: string]: number;
    TT_OOBA: number; // Time required to pack a unit, in minutes
  }
  interface ITTTest {
    [key: string]: number;
    TT_TEST: number; // Time required to pack a unit, in seconds
  }

  export type TPackModelTTObj = IBaseModelObj & ITTPack;
  export type TCosmModelTTObj = IBaseModelObj & ITTCosm;
  export type TOobaModelTTObj = IBaseModelObj & ITTOoba;
  export type TTestModelTTObj = IBaseModelObj & ITTTest;

  export type TTS = TPackModelTTObj | TCosmModelTTObj | TOobaModelTTObj | TTestModelTTObj;
}

export namespace Liberty {
  interface IBaseModelObj {
    [key: string]: string;
    IFS_PN: string;
    GROUP: string;
  }

  interface ITTVmi {
    [key: string]: number;
    VMI_TT: number; // Time required to pack a unit, in minutes
  }
  interface ITTTest {
    [key: string]: number;
    TEST_TT: number; // Time required to pack a unit, in minutes
  }
  interface ITTDebRep {
    [key: string]: number;
    DEB_REP_TT: number; // Time required to pack a unit, in minutes
  }
  interface ITTHPot {
    [key: string]: number;
    HIPOT_TT: number; // Time required to pack a unit, in minutes
  }
  interface ITTPack {
    [key: string]: number;
    PACK_TT: number; // Time required to pack a unit, in minutes
  }
  interface ITTOoba {
    [key: string]: number;
    OBA_TT: number; // Time required to pack a unit, in minutes
  }

  type TVmiModelTTObj = IBaseModelObj & ITTVmi;
  type TTestModelTTObj = IBaseModelObj & ITTTest;
  type TDebRepModelTTObj = IBaseModelObj & ITTDebRep;
  type THPotModelTTObj = IBaseModelObj & ITTHPot;
  type TPackModelTTObj = IBaseModelObj & ITTPack;
  type TOobaModelTTObj = IBaseModelObj & ITTOoba;

  interface ITTCosm {
    [key: string]: number;
    COSMETIC_1: number; // NFF
    COSMETIC_2: number; // Łatwa naprawa
    COSMETIC_3: number; // Trudna
    COSMETIC_4: number; // Trudniejsza
    COSMETIC_5: number; // Niezdefiniowane
  }

  type TCosmModelTTObj = IBaseModelObj & ITTCosm;

  export type TTS =
    | TVmiModelTTObj
    | TTestModelTTObj
    | TDebRepModelTTObj
    | THPotModelTTObj
    | TPackModelTTObj
    | TOobaModelTTObj
    | TCosmModelTTObj;
}

export namespace Ingenico {
  export interface IBaseModelObj {
    [key: string]: string;
    PART_NO: string;
    WORKSTATION: string;
    NEXT_WORKSTATION: string;
    TT: string;
  }

  export type TTS = IBaseModelObj;
}

export namespace Lenovo {
  export interface IBaseModelObj {
    [key: string]: string;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }

  interface ITTRepair {
    [key: string]: number;
    TT_REPAIR: number;
  }
  interface ITTRegistration {
    [key: string]: number;
    TT_REGISTRATION: number;
  }
  interface TTFinalTest {
    [key: string]: number;
    TT_FINAL_TEST: number;
  }
  interface TTPacking {
    [key: string]: number;
    TT_PACKING: number;
  }

  type TRepairModelTTObj = IBaseModelObj & ITTRepair;
  type TRegistrationModelTTObj = IBaseModelObj & ITTRegistration;
  type TFinalTestModelTTObj = IBaseModelObj & TTFinalTest;
  type TPackingModelTTObj = IBaseModelObj & TTPacking;

  export type TTS =
    | TRepairModelTTObj
    | TRegistrationModelTTObj
    | TFinalTestModelTTObj
    | TPackingModelTTObj;
}

export namespace Bose {
  export interface IBaseModelObj {
    [key: string]: string;
    WORK_CENTER: string;
    PROCESS_TYPE: string;
    FAMILY: string;
    TT: string;
  }

  export type TTS = IBaseModelObj;
}

export enum TouchTimeUnit {
  MINUTES,
  SECONDS,
}
