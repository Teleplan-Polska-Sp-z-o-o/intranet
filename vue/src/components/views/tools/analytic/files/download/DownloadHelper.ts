import * as XLSX from "xlsx";
import { DataTableHeader } from "./DataTableHeader";

class DownloadHelper<T> {
  private headers: DataTableHeader[]; // Headers of the data table
  private rows: T[]; // Row data, generic type

  constructor(headers: DataTableHeader[], rows: T[]) {
    this.headers = headers;
    this.rows = rows;
  }

  /**
   * Export the table data as an Excel file.
   * @param {string} fileName - The name of the exported Excel file.
   */
  public exportToExcel(asName: string): void {
    // Create a new worksheet using the headers and rows
    const worksheet = this.generateWorksheet();

    // Create a new workbook and append the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const saveAs = (asName: string) => {
      return asName.includes(".xlsx") ? asName : `${asName}.xlsx`;
    };

    // Generate a binary string and trigger the download
    XLSX.writeFile(workbook, saveAs(asName));
  }

  /**
   * Flatten the headers, combining parent and child titles where applicable.
   * @param {DataTableHeader[]} headers - Array of headers.
   * @param {string} [parentTitle] - Optional title of the parent (for recursive calls).
   * @param {string} [parentValue] - Optional value of the parent (for recursive calls).
   * @returns {DataTableHeader[]} - Flattened headers.
   */
  private flattenHeaders(headers: DataTableHeader[], parentTitle: string = ""): DataTableHeader[] {
    return headers.reduce((flatHeaders: DataTableHeader[], header) => {
      const combinedTitle = parentTitle ? `${parentTitle} > ${header.title}` : header.title;

      if (header.children) {
        // Recursively process children, using the correct combined value for the parent
        flatHeaders.push(...this.flattenHeaders(header.children, combinedTitle));
      } else {
        // Push the current header with the combined title and correctly formed value
        flatHeaders.push({ ...header, title: combinedTitle, value: header.value });
      }

      return flatHeaders;
    }, []);
  }

  /**
   * Generate an Excel worksheet from the headers and row data.
   * @returns {XLSX.WorkSheet} - The generated worksheet.
   */
  private generateWorksheet(): XLSX.WorkSheet {
    // Flatten the headers to ensure we handle nested ones
    const flatHeaders = this.flattenHeaders(this.headers);

    // Prepare the header row by mapping over the header titles
    const headerLabels = flatHeaders.map((header) => header.title);

    // Create a 2D array for the worksheet data
    const worksheetData: (string | number | null)[][] = [headerLabels];

    // Map over the rows to extract data for each row, using the flattened headers
    this.rows.forEach((row: T) => {
      const rowData = flatHeaders.map((header) => {
        if (typeof header.value === "string" && header.value.includes(".")) {
          // Split the header.value into an array of keys
          const keys = (header.value as string).split(".");

          // Traverse the row object using the keys array
          let value = row as any;
          for (const key of keys) {
            if (value && typeof value === "object") {
              value = value[key]; // Access the next level of the object
            } else {
              break;
            }
          }

          // Return the found value or null if it doesn't exist
          return value !== undefined ? value : null;
        } else {
          let value = row as any;
          // If header.value doesn't contain a dot, access the property directly
          return value[header.value] !== undefined ? value[header.value] : null;
        }
      });

      // Flatten rowData in case it contains nested arrays from the object values
      const flattenedRowData = rowData.flat();
      worksheetData.push(flattenedRowData);
    });

    // Convert the 2D array to an XLSX worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    return worksheet;
  }
}

export { DownloadHelper };
