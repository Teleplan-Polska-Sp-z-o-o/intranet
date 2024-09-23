import { Request, Response } from "express";
import ExcelReader from "../../models/xlsx/ExcelReader";
import { HttpResponseMessage } from "../../enums/response";

/**
 * Controller for reading an Excel file using the ExcelReader class.
 * Handles route parameters for file name, directory, and optional row count, column count, and worksheet name or index.
 */
const read = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const stream = JSON.parse(body.stream);
    const fileName = JSON.parse(body.fileName);
    const fileDir = JSON.parse(body.fileDir);
    const parsedWorksheetNameOrIndex = body.worksheetNameOrIndex
      ? JSON.parse(body.worksheetNameOrIndex)
      : "undefined";
    const parsedRowCount = body.rowCount ? JSON.parse(body.rowCount) : "undefined";
    const parsedColumnCount = body.columnCount ? JSON.parse(body.columnCount) : "undefined";

    // Validate that fileName and fileDir are provided
    if (!fileName || !fileDir) {
      return res.status(400).json({
        message: "fileName and fileDir are required parameters.",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const worksheetNameOrIndex =
      parsedWorksheetNameOrIndex !== "undefined"
        ? isNaN(Number(parsedWorksheetNameOrIndex))
          ? (parsedWorksheetNameOrIndex as string)
          : Number(parsedWorksheetNameOrIndex)
        : undefined;
    const rowCount = parsedRowCount !== "undefined" ? Number(parsedRowCount) : undefined;
    const columnCount = parsedColumnCount !== "undefined" ? Number(parsedColumnCount) : undefined;

    // Initialize the ExcelReader with the file name and directory
    const excelReader = new ExcelReader(fileName, fileDir);

    const result = await (stream
      ? excelReader.stream(worksheetNameOrIndex, rowCount, columnCount)
      : excelReader.read(worksheetNameOrIndex, rowCount, columnCount));

    // Return the result (either data or error)
    if (result.data) {
      return res.status(200).json({
        data: result.data,
        message: "Stream read success.",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    } else {
      return res.status(500).json({
        message: result.message || "Failed to stream Excel data.",
        statusMessage: HttpResponseMessage.UNKNOWN,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Unknown error occurred.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { read };
