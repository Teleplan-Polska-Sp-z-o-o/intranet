import * as XLSX from "xlsx";

/**
 * Class representing a loaded XLSX workbook, providing access to sheet names and data.
 */
export class LoadedXLSXHelper {
  private workbook: XLSX.WorkBook;

  /**
   * Constructs the LoadedXLSXHelper class.
   * @param {XLSX.WorkBook} workbook - The loaded workbook object.
   */
  constructor(workbook: XLSX.WorkBook) {
    this.workbook = workbook;
  }

  /**
   * Retrieves the sheet names from the loaded workbook.
   * @param {number} [sheetIndex] - Optional index of the sheet to return.
   * @returns {string | string[]} - The name of the sheet at the specified index or all sheet names.
   * @throws {Error} If the sheet at the specified index does not exist.
   */
  getSheetNames(sheetIndex?: number): string | string[] {
    if (sheetIndex !== undefined) {
      const sheetName = this.workbook.SheetNames.at(sheetIndex);
      if (!sheetName) {
        throw new Error(
          `SheetName at index "${sheetIndex}" does not exist. Returning empty string`
        );
      }
      return sheetName;
    }

    // Return all sheet names if no sheet index is provided
    return this.workbook.SheetNames;
  }

  /**
   * Retrieves the worksheet(s) from the loaded workbook.
   * @param {string} [sheetName] - Optional name of the sheet to return.
   * @returns { XLSX.WorkSheet | { [sheet: string]: XLSX.WorkSheet } } - The worksheet at the specified name or all worksheets.
   * @throws {Error} If the sheet with the specified name does not exist.
   */
  getWorksheets(sheetName?: string):
    | XLSX.WorkSheet
    | {
        [sheet: string]: XLSX.WorkSheet;
      } {
    if (sheetName !== undefined) {
      const sheet = this.workbook.Sheets[sheetName];
      if (!sheet) {
        throw new Error(`Sheet with name "${sheetName}" does not exist.`);
      }
      return sheet;
    }

    // Return all sheets if no sheet name is provided
    return this.workbook.Sheets;
  }

  /**
   * Extracts a value from a specific cell in a worksheet.
   * @param {XLSX.WorkSheet} worksheet - The worksheet object.
   * @param {number} row - The row number.
   * @param {number} col - The column number.
   * @returns {string | number | null} - The value from the cell or null if empty.
   */
  extractCellValue(worksheet: XLSX.WorkSheet, row: number, col: number): string | number | null {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = worksheet[cellAddress];
    return cell ? cell.v : null;
  }

  /**
   * Decodes the range of a worksheet to determine available rows and columns.
   * @param {XLSX.WorkSheet} worksheet - The worksheet object.
   * @returns {XLSX.Range} - The decoded range of the worksheet.
   */
  getDecodedRange(worksheet: XLSX.WorkSheet): XLSX.Range {
    const range = worksheet["!ref"];
    if (!range) {
      throw new Error("Worksheet has no valid range");
    }
    return XLSX.utils.decode_range(range);
  }

  // /**
  //  * Generates a preview of the sheet data based on the specified number of rows and columns.
  //  * @param {XLSX.WorkSheet} worksheet - The worksheet object.
  //  * @param {number} rowCount - The number of rows to preview.
  //  * @param {number} columnCount - The number of columns to preview.
  //  * @returns {(string | number | null)[][]} - 2D array of preview data from the worksheet.
  //  */
  // getPreviewData(
  //   worksheet: XLSX.WorkSheet,
  //   rowCount: number,
  //   columnCount: number
  // ): (string | number | null)[][] {
  //   const decodedRange = this.getDecodedRange(worksheet);
  //   const maxRows = Math.min(rowCount || decodedRange.e.r + 1, decodedRange.e.r + 1);
  //   const maxColumns = Math.min(columnCount || decodedRange.e.c + 1, decodedRange.e.c + 1);

  //   const previewData: (string | number | null)[][] = [];

  //   for (let row = 0; row < maxRows; row++) {
  //     const rowData: (string | number | null)[] = [];
  //     for (let col = 0; col < maxColumns; col++) {
  //       const cellValue = this.extractCellValue(worksheet, row, col);
  //       rowData.push(cellValue);
  //     }
  //     previewData.push(rowData);
  //   }

  //   return previewData;
  // }

  /**
   * Generates a preview of the sheet data based on the specified number of rows and columns.
   * If rowCount or columnCount is undefined or not provided, it will default to the worksheet's dimensions.
   * @param {XLSX.WorkSheet} worksheet - The worksheet object.
   * @param {number} [rowCount] - The number of rows to preview (optional).
   * @param {number} [columnCount] - The number of columns to preview (optional).
   * @returns {(string | number | null)[][]} - 2D array of preview data from the worksheet.
   */
  getPreviewData(
    worksheet: XLSX.WorkSheet,
    rowCount?: number, // Optional parameter
    columnCount?: number // Optional parameter
  ): (string | number | null)[][] {
    const decodedRange = this.getDecodedRange(worksheet);

    // Default to full worksheet range if rowCount or columnCount is undefined
    const maxRows =
      rowCount !== undefined ? Math.min(rowCount, decodedRange.e.r + 1) : decodedRange.e.r + 1;

    const maxColumns =
      columnCount !== undefined
        ? Math.min(columnCount, decodedRange.e.c + 1)
        : decodedRange.e.c + 1;

    const previewData: (string | number | null)[][] = [];

    for (let row = 0; row < maxRows; row++) {
      const rowData: (string | number | null)[] = [];
      for (let col = 0; col < maxColumns; col++) {
        const cellValue = this.extractCellValue(worksheet, row, col);
        rowData.push(cellValue);
      }
      previewData.push(rowData);
    }

    return previewData;
  }
}
