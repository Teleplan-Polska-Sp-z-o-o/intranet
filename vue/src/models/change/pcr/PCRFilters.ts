import { IPCRFilters } from "../../../interfaces/change/IPCRFilters";

class PCRFilters implements IPCRFilters {
  onlyOwned: boolean = false;
  status: "Open" | "Closed" | null = null;

  constructor() {}
}

export { PCRFilters };
