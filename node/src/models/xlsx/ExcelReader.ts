import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

// Define an interface for the returned data structure
interface ExcelData {
  [sheetName: string]: (string | number | boolean | null)[][];
}

interface ExcelReadResult {
  data?: ExcelData;
  message?: string;
}

/**
 * ExcelReader class for reading Excel files either fully or using streaming with ExcelJS.
 */
class ExcelReader {
  private fileName: string;
  private fileDir: string;

  /**
   * Constructor for ExcelReader.
   * @param {string} fileName - The name of the Excel file.
   * @param {string} fileDir - The directory where the Excel file is located.
   */
  constructor(fileName: string, fileDir: string) {
    this.fileName = fileName;
    this.fileDir = fileDir;
  }

  /**
   * Processes a worksheet and retrieves its data based on row and column limits.
   * Handles the conversion of different Excel cell types.
   * @param {ExcelJS.Worksheet} worksheet - The worksheet to process.
   * @param {number | undefined} rowCount - Optional row limit.
   * @param {number | undefined} columnCount - Optional column limit.
   * @returns {(string | number | boolean | null)[][]} - Processed worksheet data.
   */
  private processWorksheet(
    worksheet: ExcelJS.Worksheet,
    rowCount?: number,
    columnCount?: number
  ): (string | number | boolean | null)[][] {
    const extractedData: (string | number | boolean | null)[][] = [];
    let currentRowCount = 0;

    worksheet.eachRow((row, _rowNumber) => {
      if (rowCount && currentRowCount >= rowCount) {
        return; // Stop if row limit is reached
      }

      const rowData: (string | number | boolean | null)[] = [];

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (!columnCount || colNumber <= columnCount) {
          let cellValue: string | number | boolean | null;

          switch (typeof cell.value) {
            case "string":
            case "number":
            case "boolean":
              cellValue = cell.value; // Already in the correct type
              break;
            case "object":
              if (cell.value instanceof Date) {
                cellValue = cell.value.toISOString(); // Convert Date to ISO string
              } else if (cell.value === null) {
                cellValue = null; // Handle null value
              } else {
                cellValue = JSON.stringify(cell.value); // Convert objects like RichText/Hyperlink to string
              }
              break;
            default:
              cellValue = null; // Handle undefined or other unexpected values
          }

          rowData.push(cellValue);
        }
      });

      extractedData.push(rowData);
      currentRowCount++;
    });

    return extractedData;
  }

  /**
   * Reads the entire Excel file into memory and retrieves data from the specified worksheet or all worksheets.
   * @param {number | string} [worksheetNameOrIndex] - Optional name or index of the worksheet to retrieve. If not provided, all worksheets will be retrieved.
   * @param {number} [rowCount] - Optional number of rows to retrieve.
   * @param {number} [columnCount] - Optional number of columns to retrieve.
   * @returns {Promise<ExcelReadResult>} - A promise resolving to the Excel data or an error message.
   */
  async read(
    worksheetNameOrIndex?: number | string,
    rowCount?: number,
    columnCount?: number
  ): Promise<ExcelReadResult> {
    try {
      const filePath = path.join(this.fileDir, this.fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const result: ExcelData = {};

      if (worksheetNameOrIndex !== undefined) {
        let worksheet: ExcelJS.Worksheet | undefined;

        if (typeof worksheetNameOrIndex === "number") {
          worksheet = workbook.getWorksheet(worksheetNameOrIndex);
        } else {
          worksheet = workbook.getWorksheet(worksheetNameOrIndex);
        }

        if (!worksheet) {
          throw new Error(`Worksheet "${worksheetNameOrIndex}" not found`);
        }

        result[worksheet.name] = this.processWorksheet(worksheet, rowCount, columnCount);
      } else {
        workbook.eachSheet((worksheet) => {
          result[worksheet.name] = this.processWorksheet(worksheet, rowCount, columnCount);
        });
      }

      return {
        data: result,
        message: "Extracted data successfully.",
      };
    } catch (error: any) {
      return {
        data: undefined,
        message: error.message,
      };
    }
  }

  /**
   * Streams the Excel file row by row without loading the entire file into memory.
   * Processes the file using streaming for memory efficiency.
   * @param {number | string} [worksheetNameOrIndex] - Optional name or index of the worksheet to retrieve. If not provided, all worksheets will be retrieved.
   * @param {number} [rowCount] - Optional number of rows to retrieve.
   * @param {number} [columnCount] - Optional number of columns to retrieve.
   * @returns {Promise<ExcelReadResult>} - A promise resolving to the streamed Excel data or an error message.
   */
  async stream(
    worksheetNameOrIndex?: number | string,
    rowCount?: number,
    columnCount?: number
  ): Promise<ExcelReadResult> {
    try {
      const filePath = path.join(this.fileDir, this.fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }

      // Create the file stream with options
      const fileStream = fs.createReadStream(filePath);

      // Create the workbook reader for streaming
      const workbook = new ExcelJS.stream.xlsx.WorkbookReader(fileStream, {});

      const result: ExcelData = {};
      let currentSheetIndex = 0; // Manually track the sheet index

      for await (const worksheet of workbook) {
        currentSheetIndex++;

        // If filtering by worksheet index, check if this is the target sheet
        const match =
          typeof worksheetNameOrIndex === "number"
            ? currentSheetIndex === worksheetNameOrIndex
            : true;

        if (!match) continue; // Skip if not the matching sheet

        result[`Sheet${currentSheetIndex}`] = [];
        let currentRowCount = 0;

        // Stream rows of the worksheet
        for await (const row of worksheet) {
          if (rowCount && currentRowCount >= rowCount) break;

          // Ensure row.values is an array before processing
          if (Array.isArray(row.values)) {
            // Process row values and convert to string | number | boolean | null
            const rowData = row.values
              .slice(1, columnCount ? columnCount + 1 : undefined)
              .map((cell) => {
                if (cell === null || cell === undefined) {
                  return null; // Handle empty cells
                } else if (
                  typeof cell === "string" ||
                  typeof cell === "number" ||
                  typeof cell === "boolean"
                ) {
                  return cell; // Already correct type
                } else if (cell instanceof Date) {
                  return cell.toISOString(); // Convert Date to ISO string
                } else {
                  return String(cell); // Convert anything else to string (e.g., objects)
                }
              });

            result[`Sheet${currentSheetIndex}`].push(rowData);
          }

          currentRowCount++;
        }

        // If a specific sheet is requested by index, break after processing
        if (typeof worksheetNameOrIndex === "number") break;
      }

      return {
        data: result,
        message: "Streamed data successfully.",
      };
    } catch (error: any) {
      return {
        data: undefined,
        message: error.message,
      };
    }
  }

  /**
   * Transforms a single sheet's data (an array of arrays) into an array of objects.
   * Uses the first row of the sheet as headers and subsequent rows as the data.
   *
   * @private
   * @param {(string | number | boolean | null)[][]} sheetData - The raw sheet data as an array of arrays.
   * Each inner array represents a row in the sheet.
   * The first inner array (row) will be used as the header, and subsequent rows will be transformed into objects.
   *
   * @returns {Record<string, string | number | boolean | null>[]} - An array of objects, where each object represents a row of data.
   * The keys of each object correspond to the values in the header row, and the values come from the respective data rows.
   *
   * @example
   * // Input:
   * // [
   * //   ['INFO', 'PART_NO', 'SERIAL_NO'],
   * //   ['Auto', 'ESD-160S', '21153399295258'],
   * //   ['Auto', 'ESD-160S', '21153381704462']
   * // ]
   * //
   * // Output:
   * // [
   * //   { INFO: 'Auto', PART_NO: 'ESD-160S', SERIAL_NO: '21153399295258' },
   * //   { INFO: 'Auto', PART_NO: 'ESD-160S', SERIAL_NO: '21153381704462' }
   * // ]
   */
  public transformSheetToObjects(
    sheetData: (string | number | boolean | null)[][]
  ): Record<string, string | number | boolean | null>[] {
    const headers = sheetData[0]; // First row as headers
    const dataRows = sheetData.slice(1); // The rest of the rows

    return dataRows.map((row) => {
      const rowObject: Record<string, string | number | boolean | null> = {};
      headers.forEach((header, index) => {
        rowObject[String(header)] = row[index];
      });
      return rowObject;
    });
  }

  /**
   * Transforms the data of all sheets in the Excel workbook into an object format.
   * Each sheet is transformed into an array of objects, where the first row of the sheet is used as headers
   * and the subsequent rows are the data. Each object represents a row, with the keys corresponding to the header values.
   *
   * @param {ExcelData} excelData - The raw data from all sheets, where each sheet is represented as an array of arrays.
   * Each inner array represents a row of data in the sheet. The first array in each sheet's data represents the header.
   *
   * @returns {Record<string, Record<string, string | number | boolean | null>[]>} - The transformed data for all sheets.
   * The returned object has sheet names as keys and arrays of objects as values. Each object represents a row from the sheet,
   * with the keys corresponding to the header values in the first row of the sheet.
   *
   * @example
   * // Input:
   * // {
   * //   Sheet1: [
   * //     ['INFO', 'PART_NO', 'SERIAL_NO'],
   * //     ['Auto', 'ESD-160S', '21153399295258'],
   * //     ['Auto', 'ESD-160S', '21153381704462']
   * //   ],
   * //   Sheet2: [
   * //     ['ID', 'NAME', 'AGE'],
   * //     [1, 'John Doe', 30],
   * //     [2, 'Jane Smith', 25]
   * //   ]
   * // }
   * //
   * // Output:
   * // {
   * //   Sheet1: [
   * //     { INFO: 'Auto', PART_NO: 'ESD-160S', SERIAL_NO: '21153399295258' },
   * //     { INFO: 'Auto', PART_NO: 'ESD-160S', SERIAL_NO: '21153381704462' }
   * //   ],
   * //   Sheet2: [
   * //     { ID: 1, NAME: 'John Doe', AGE: 30 },
   * //     { ID: 2, NAME: 'Jane Smith', AGE: 25 }
   * //   ]
   * // }
   *
   * @throws {Error} If the data for any sheet is missing or not in the expected format.
   */
  public transformAllSheetsToObjects(
    excelData: ExcelData
  ): Record<string, Record<string, string | number | boolean | null>[]> {
    const transformedSheets: Record<string, Record<string, string | number | boolean | null>[]> =
      {};

    // Iterate over each sheet in the raw Excel data
    for (const [sheetName, sheetData] of Object.entries(excelData)) {
      transformedSheets[sheetName] = this.transformSheetToObjects(sheetData); // Transform the sheet
    }

    return transformedSheets;
  }
}

export default ExcelReader;
