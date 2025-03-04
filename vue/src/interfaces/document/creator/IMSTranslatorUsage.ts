interface IMSTranslatorUsage {
  id: number;
  charactersUsed: number;
  resultedInError: boolean;
  errorMessage?: string | null;
  ormCreateDate: string; // ISO timestamp
  ormUpdateDate?: string | null; // ISO timestamp
  ormVersion: number;
  createdBy: {
    userId: string;
    username: string;
    timestamp: string; // ISO timestamp
  };
  updatedBy?:
    | {
        userId: string;
        username: string;
        timestamp: string; // ISO timestamp
      }[]
    | null;
}

export { type IMSTranslatorUsage };
