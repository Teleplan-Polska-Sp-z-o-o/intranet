import { SkyEfficiencyBuilder } from "./sky/Builder";
import { LibertyEfficiencyBuilder } from "./liberty/Builder";
import { TouchTimeUnit } from "../Models/models/TouchTime";
import { IngenicoEfficiencyBuilder } from "./ingenico/Builder";
import { LenovoEfficiencyBuilder } from "./lenovo/Builder";
import { GenericTypes } from "../../../transactions/sideControllers/Types";
import { BoseEfficiencyBuilder } from "./bose/Builder";

export class EfficiencyBuilderHandler<
  P extends GenericTypes.Program,
  C extends keyof GenericTypes.ProgramCategoryTransaction[P]
> {
  private builderInstance: any;

  constructor(
    program: P,
    category: C,
    raw: GenericTypes.ProgramCategoryTransaction[P][C][],
    models: object[]
  ) {
    const builderClass = this.getBuilderClass(program);
    if (!builderClass) {
      throw new Error(`No builder found for program: ${program}`);
    }

    this.builderInstance = new builderClass(
      raw,
      models,
      this.ttKey(program, category),
      this.ttTimeUnit(program, category)
    );
  }

  private getBuilderClass(program: P): any {
    switch (program) {
      case "liberty":
        return LibertyEfficiencyBuilder;
      case "sky":
        return SkyEfficiencyBuilder;
      case "lenovo":
        return LenovoEfficiencyBuilder;
      case "ingenico":
        return IngenicoEfficiencyBuilder;
      case "bose":
        return BoseEfficiencyBuilder;
      default:
        throw new Error(`No builder found for program: ${program}`);
    }
  }

  private ttKey(program: P, category: C): string {
    const ttKeys: {
      [P in GenericTypes.Program]?: {
        [C in keyof GenericTypes.ProgramCategoryTransaction[P]]: string;
      };
    } = {
      liberty: {
        vmi: "VMI_TT",
        test: "TEST_TT",
        debugrepair: "DEB_REP_TT",
        cosmetic: "COSMETIC_1",
        highpot: "HIPOT_TT",
        pack: "PACK_TT",
        ooba: "OBA_TT",
      },
      sky: {
        packing: "TT_PACK",
        cosmetic: "TT_COSM",
        ooba: "TT_OOBA",
        test: "TT_TEST",
      },
      lenovo: {
        repair: "TT_REPAIR",
        registration: "TT_REGISTRATION",
        final: "TT_FINAL_TEST",
        packing: "TT_PACKING",
      },
      ingenico: {
        vmi: "TT",
        screening: "TT",
        wintest: "TT",
        finaltest: "TT",
        fgi: "TT",
        repair2: "TT",
        repair3: "TT",
        oba: "TT",
      },
      bose: {
        combined: "TT",
      },
    };

    return ttKeys[program][category];
  }

  private ttTimeUnit(program: P, category: C): TouchTimeUnit {
    if (program === "sky" && category === "test") return TouchTimeUnit.SECONDS;
    if (program === "ingenico") return TouchTimeUnit.SECONDS;
    if (program === "bose") return TouchTimeUnit.SECONDS;
    else return TouchTimeUnit.MINUTES;
  }

  public getProcessedData() {
    return this.builderInstance.getProcessedData();
  }

  public getMissingCache() {
    return this.builderInstance.getMissingCache();
  }
}
