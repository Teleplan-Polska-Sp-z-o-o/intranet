interface IPCRFilters {
  [key: string]: any;
  onlyOwned: boolean;
  status: "Open" | "Closed" | null;
}

export type { IPCRFilters };
