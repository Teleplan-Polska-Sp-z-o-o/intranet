import * as XLSX from "xlsx";
import { LoadedXLSXHelper } from "./LoadedXLSXHelper";

/**
 * Main XLSXHelper class for loading an XLSX workbook.
 */
export class XLSXHelper {
  private workbook: XLSX.WorkBook | null = null;

  /**
   * Loads the provided Excel file (Blob or File) into a workbook.
   * @param {Blob | File | null} blob - The Excel file as a Blob or File.
   * @returns {Promise<LoadedXLSXHelper>} - A promise that resolves to an instance of LoadedXLSXHelper.
   * @throws {Error} If the blob is null or undefined.
   */
  async loadWorkbook(blob: Blob | File | null): Promise<LoadedXLSXHelper> {
    if (!blob) throw Error(`${typeof blob} evaluates to ${blob}`);
    const arrayBuffer = await blob.arrayBuffer();
    this.workbook = XLSX.read(arrayBuffer, {
      type: "array",
      cellFormula: false, // Skip formula parsing
      cellStyles: false, // Skip style parsing
      cellDates: false, // Skip date parsing
      sheetStubs: true, // Handle sparse sheets more efficiently
    });

    // Return the LoadedWorkbookHelper, which allows access to sheet methods
    return new LoadedXLSXHelper(this.workbook);
  }
}
