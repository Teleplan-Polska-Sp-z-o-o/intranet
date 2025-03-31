import { EfficiencyModels as LibertyModels } from "./liberty/Models";
import { EfficiencyModels as SkyModels } from "./sky/Models";
import { EfficiencyModels as SkyModelsForTest } from "./sky/Models_test";
import { EfficiencyModels as LenovoModels } from "./lenovo/Models";
import { EfficiencyModels as LenovoModelsForRepair } from "./lenovo/Models_repair";
import { EfficiencyModels as IngenicoModels } from "./ingenico/Models";
import { RawTransactions } from "./Types";
import { EfficiencyMonthlyTypes } from "../Types";

interface IEfficiencyBuilder {
  getProcessedData(): any;
}

type EfficiencyBuilderConstructor = new (
  rawTransactions: RawTransactions.TTransactions,
  models: any,
  ttKey: any
) => IEfficiencyBuilder;

export class EfficiencyBuilderHandler<P extends EfficiencyMonthlyTypes.Postgres.Program> {
  private category: EfficiencyMonthlyTypes.Postgres.Category<P>;
  private static builders = {
    liberty: LibertyModels.libertyFactory,
    sky: SkyModels.EfficiencyBuilder,
    lenovo: LenovoModels.EfficiencyBuilder,
    ingenico: IngenicoModels.EfficiencyBuilder,
  };

  private builderInstance: any;

  constructor(
    program: P,
    category: EfficiencyMonthlyTypes.Postgres.Category<P>,
    rawTransactions: RawTransactions.TTransactions,
    models: object[]
  ) {
    this.category = category;
    const builderClass = this.getBuilderClass(program);
    if (!builderClass) {
      throw new Error(`No builder found for program: ${program}`);
    }
    this.builderInstance = new builderClass(
      rawTransactions,
      models,
      this.getTT(program, this.category)
    );
  }

  private getBuilderClass(program: P): EfficiencyBuilderConstructor {
    switch (program) {
      case "liberty":
        return EfficiencyBuilderHandler.builders.liberty(this.category);
      case "sky":
        if (this.category === "test") return SkyModelsForTest.EfficiencyBuilder;
        return EfficiencyBuilderHandler.builders.sky;
      case "lenovo":
        if (this.category === "repair") return LenovoModelsForRepair.EfficiencyBuilder;
        return EfficiencyBuilderHandler.builders.lenovo;
      case "ingenico":
        return EfficiencyBuilderHandler.builders.ingenico;
      default:
        throw new Error(`No builder found for program: ${program}`);
    }
  }

  private getTT<P extends EfficiencyMonthlyTypes.Postgres.Program>(
    program: P,
    category: EfficiencyMonthlyTypes.Postgres.Category<P>
  ): EfficiencyMonthlyTypes.Postgres.TT[P] {
    const ttsMap: EfficiencyMonthlyTypes.Postgres.TTSMap = {
      liberty: {
        vmi: "VMI_TT",
        test: "TEST_TT",
        debugrepair: "DEB_REP_TT",
        cosmetic: "COSMETIC_1",
        highpot: "HIPOT_TT",
        pack: "PACK_TT",
        ship: "SHIP_TT",
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
        cleaning: "TT_CLEANING",
        final: "TT_FINAL_TEST",
        packing: "TT_PACKING",
      },
      ingenico: {
        models: "TT",
        vmi: "TT",
        screening: "TT",
        wintest: "TT",
        finaltest: "TT",
        activation: "TT",
        customization: "TT",
        keyinjection: "TT",
        fgi: "TT",
        repair2: "TT",
        repair3: "TT",
      },
    };

    return ttsMap[program][category];
  }

  public getProcessedData() {
    return this.builderInstance.getProcessedData();
  }
}
