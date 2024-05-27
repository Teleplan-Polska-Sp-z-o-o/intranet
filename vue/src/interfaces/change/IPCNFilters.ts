interface IPCNFilters {
  [key: string]: any;
  onlyDesignated: boolean;
  status: "Open" | "Closed" | null;
  approvable: "By Me" | "By My Department" | null;
}

export type { IPCNFilters };
