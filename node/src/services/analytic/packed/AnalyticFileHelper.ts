import { AnalyticFile } from "../../../orm/entity/analytic/AnalyticFileEntity";

export class AnalyticFileHelper {
  /**
   * Helper method to get the latest action date of a file (created or last updated)
   * @param file - File entity object
   * @returns - Date of the last action (either creation or update)
   */
  private static getLastActionDate(file: AnalyticFile): Date {
    const lastUpdatedBy =
      file.updatedBy && file.updatedBy.length > 0
        ? file.updatedBy[file.updatedBy.length - 1]
        : null;
    return lastUpdatedBy ? new Date(lastUpdatedBy.date) : new Date(file.createdBy.date);
  }

  /**
   * Method to modify an array of files by adding the `considered` property
   * @param files - Array of file entities to process
   * @returns - Modified array with `considered` property
   */
  public static addConsideredProperty(
    files: AnalyticFile[]
  ): (AnalyticFile & { considered: boolean })[] {
    // Track the latest file by `fileType`
    const latestFilesByType: Record<string, AnalyticFile | null> = {};

    // Find the latest file per `fileType`
    files.forEach((file) => {
      const latestFile = latestFilesByType[file.fileType];
      const lastActionDate = this.getLastActionDate(file);

      if (!latestFile || lastActionDate > this.getLastActionDate(latestFile)) {
        latestFilesByType[file.fileType] = file;
      }
    });

    // Modify the file entities by adding `considered` property
    return files.map((file) => {
      const isLatestForFileType = latestFilesByType[file.fileType]?.id === file.id;
      const isValidFileType = file.fileType !== "miscellaneous";

      return {
        ...file,
        considered: isLatestForFileType && isValidFileType,
      } as unknown as AnalyticFile & { considered: boolean };
    });
  }
}
