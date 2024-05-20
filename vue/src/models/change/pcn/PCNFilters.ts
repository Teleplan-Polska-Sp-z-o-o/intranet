import { IPCNFilters } from "../../../interfaces/change/IPCNFilters";

class PCNFilters implements IPCNFilters {
  onlyDesignated: boolean = false;
  status: "Open" | "Closed" | null = null;
  approvable: "By Me" | "By My Department" | null = null;

  constructor() {}
}

export { PCNFilters };
