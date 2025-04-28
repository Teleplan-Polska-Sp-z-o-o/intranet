import {
  BoseTypes,
  GenericTypes,
  IngenicoTypes,
  LenovoTypes,
  LibertyTypes,
  SkyTypes,
} from "./Types";

export const handlers: {
  [P in GenericTypes.Program]?: {
    [C in keyof GenericTypes.ProgramCategoryTransaction[P]]: (
      options: GenericTypes.RawOptions<P, C>
    ) => Promise<GenericTypes.ProgramCategoryTransaction[P][C][]>;
  };
} = {
  [GenericTypes.Program.Sky]: {
    packing: SkyTypes.RawTransactionQueryHandler.getPackingTransactions,
    cosmetic: SkyTypes.RawTransactionQueryHandler.getCosmeticTransactions,
    ooba: SkyTypes.RawTransactionQueryHandler.getOobaTransactions,
    test: SkyTypes.TestRawTransactionHandler.getTestTransactions,
  },
  [GenericTypes.Program.Lenovo]: {
    registration: LenovoTypes.RawTransactionQueryHandler.getRegistrationTransactions,
    final: LenovoTypes.RawTransactionQueryHandler.getFinalTestTransactions,
    packing: LenovoTypes.RawTransactionQueryHandler.getPackingTransactions,
    repair: LenovoTypes.RawTransactionQueryHandler.getRepairTransactions,
  },
  [GenericTypes.Program.Ingenico]: {
    vmi: IngenicoTypes.RawTransactionQueryHandler.getVmiTransactions,
    screening: IngenicoTypes.RawTransactionQueryHandler.getScreeningTransactions,
    wintest: IngenicoTypes.RawTransactionQueryHandler.getWinTestTransactions,
    finaltest: IngenicoTypes.RawTransactionQueryHandler.getFinalTestTransactions,
    repair2: IngenicoTypes.RawTransactionQueryHandler.getRepair2Transactions,
    repair3: IngenicoTypes.RawTransactionQueryHandler.getRepair3Transactions,
    fgi: IngenicoTypes.RawTransactionQueryHandler.getFgiTransactions,
    oba: IngenicoTypes.RawTransactionQueryHandler.getObaTransactions,
  },
  [GenericTypes.Program.Liberty]: {
    vmi: LibertyTypes.RawTransactionQueryHandler.getVmiTransactions,
    test: LibertyTypes.RawTransactionQueryHandler.getTestTransactions,
    debugrepair: LibertyTypes.RawTransactionQueryHandler.getDebugRepairTransactions,
    cosmetic: LibertyTypes.RawTransactionQueryHandler.getCosmeticTransactions,
    highpot: LibertyTypes.RawTransactionQueryHandler.getHighPotTransactions,
    pack: LibertyTypes.RawTransactionQueryHandler.getPackTransactions,
    ooba: LibertyTypes.RawTransactionQueryHandler.getOobaTransactions,
  },
  [GenericTypes.Program.Bose]: {
    combined: BoseTypes.RawTransactionQueryHandler.getCombinedTransactions,
  },
};

export class RawTransactionService<
  P extends GenericTypes.Program,
  C extends keyof GenericTypes.ProgramCategoryTransaction[P]
> {
  constructor(
    private options: GenericTypes.RawOptions<P, C>,
    private handlers: {
      [K in keyof GenericTypes.ProgramCategoryTransaction[P]]: (
        opts: GenericTypes.RawOptions<P, K>
      ) => Promise<GenericTypes.ProgramCategoryTransaction[P][K][]>;
    }
  ) {}

  public getRaw(): Promise<GenericTypes.ProgramCategoryTransaction[P][C][]> {
    return this.handlers[this.options.fromCategory](this.options);
  }
}
