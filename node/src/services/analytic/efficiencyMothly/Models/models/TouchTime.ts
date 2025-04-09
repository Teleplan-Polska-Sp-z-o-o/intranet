export namespace SKY {
  interface IBaseModelObj {
    [key: string]: string;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }
  interface TTPack {
    [key: string]: number;
    TT_PACK: number; // Time required to pack a unit, in minutes
  }
  interface TTCosm {
    [key: string]: number;
    TT_COSM: number; // Time required to pack a unit, in minutes
  }
  interface TTOoba {
    [key: string]: number;
    TT_OOBA: number; // Time required to pack a unit, in minutes
  }
  interface TTTest {
    [key: string]: number;
    TT_TEST: number; // Time required to pack a unit, in minutes
  }

  type TPackModelTTObj = IBaseModelObj & TTPack;
  type TCosmModelTTObj = IBaseModelObj & TTCosm;
  type TOobaModelTTObj = IBaseModelObj & TTOoba;
  type TTestModelTTObj = IBaseModelObj & TTTest;

  export type TTS = TPackModelTTObj | TCosmModelTTObj | TOobaModelTTObj | TTestModelTTObj;
}

export enum TouchTimeUnit {
  MINUTES,
  SECONDS,
}
