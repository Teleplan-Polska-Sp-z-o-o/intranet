import { DocumentChangeTypes } from "../../../interfaces/change/dcr/DocumentChangeTypes";
import { TimeHelper } from "../../common/TimeHelper";

class RoleAction implements DocumentChangeTypes.Processing.IRoleAction {
  id: number;
  no: string;
  priority: DocumentChangeTypes.TPriority;
  username: string;
  role: DocumentChangeTypes.Processing.Role;
  since: string | undefined;
  taken: string | undefined;
  hasTaken: boolean;
  elapsed: number | undefined;

  constructor(
    index: number,
    role: DocumentChangeTypes.Processing.Role,
    record: DocumentChangeTypes.TDocumentChange,
    since: string | undefined = undefined
  ) {
    this.id = index;
    this.no = record.no as string;
    this.priority = record.priority;

    this.username = record[role.toLocaleLowerCase()];
    this.role = role;

    enum previousTakenIsoDate {
      "approver" = "checker",
      "registerer" = "approver",
    }

    this.since = since
      ? TimeHelper.convertToLocalTime(since)
      : TimeHelper.convertToLocalTime(
          record[
            previousTakenIsoDate[
              role.toLocaleLowerCase() as keyof typeof previousTakenIsoDate
            ].replace(/r(?=[^r]*$)/, "dDate")
          ]
        );

    this.taken = record[role.toLocaleLowerCase().replace(/r(?=[^r]*$)/, "dDate")];
    this.hasTaken = this.taken ? true : false;
    this.elapsed = TimeHelper.timePassedSince(this.since, "days", this.taken);
  }

  public isValid(): boolean {
    return !!this.since && !!this.elapsed;
  }

  public static priorityColor(priority: DocumentChangeTypes.TPriority, daysPassed: number): string {
    switch (priority) {
      case "low":
        if (daysPassed < 7) return "#28a745"; // Green for less than 7 days
        if (daysPassed < 14) return "#ffc107"; // Yellow for 7-14 days
        return "#dc3545"; // Red for more than 14 days
      case "medium":
        if (daysPassed < 3) return "#28a745"; // Green for less than 3 days
        if (daysPassed < 7) return "#ffc107"; // Yellow for 3-7 days
        return "#dc3545"; // Red for more than 7 days
      case "high":
        if (daysPassed < 1) return "#28a745"; // Green for less than 1 day
        if (daysPassed < 3) return "#ffc107"; // Yellow for 1-3 days
        return "#dc3545"; // Red for more than 3 days
      default:
        return "#6c757d"; // Default gray color if priority is not recognized
    }
  }
}

export { RoleAction };
