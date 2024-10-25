import { Request, Response } from "express";
import {
  getRawCosmeticTransactions,
  getRawOobaTransactions,
  getRawSkyPackingTransactions,
} from "../../sideControllers/sky/TransactionsRawController";
import { HttpResponseMessage } from "../../enums/response";
import { RawTransaction } from "../../orm/sideEntity/RawTransactionsEntity";
import { getByProgAndCatAndSub } from "../../controllers/analytic/AnalyticFileController";
import { AnalyticFile } from "../../orm/entity/analytic/AnalyticFileEntity";
import { PackedTypes } from "../../interfaces/analytic/overview/PackedTypes";
import { AnalyticFileHelper } from "./packed/AnalyticFileHelper";
import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { EmailHandler } from "../../models/common/Email/EmailHandler";
import { IEmailAttachment } from "../../interfaces/Email/IEmailAttachment";
import { serverConfig } from "../../config/server";
import { IEmailReportContent } from "../../interfaces/Email/IEmailReportContent";
import { reportsTemplate } from "../../models/common/Email/templates/reportsTemplate";
import { EmailOptions } from "../../models/common/Email/options/EmailOptions";
import { PackedModels } from "../../models/analytic/overview/PackedModels";

// import path from "path";
// import { ANALYTIC_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";
// import fs from "fs";

export namespace PackedService {
  type Category = "packing" | "cosmetic" | "ooba";
  type Program = "sky";

  // RawTransactionHandler interface
  type RawMethod = (req: Request, res: Response) => Promise<Response>;
  type RawBody = {
    contracts: string;
    startOfDay: string;
    endOfDay: string;
  };
  type RawResponseObject = {
    raw: RawTransaction[];
    message: string;
    statusMessage: HttpResponseMessage;
  };
  class RawTransactionHandler {
    transactionMethods: Record<Category, RawMethod> = {
      packing: getRawSkyPackingTransactions,
      cosmetic: getRawCosmeticTransactions,
      ooba: getRawOobaTransactions,
    };
    method: RawMethod;
    transactionContracts: Record<Program, string[]> = {
      sky: ["12195", "12196", "12176"],
    };
    mockRequest: Request;
    mockResponse: Response;

    constructor(program: Program, category: Category) {
      if (!this.transactionMethods[category]) {
        throw new Error(
          `RawTransactionHandler at PackedService: Invalid method type: ${category}.`
        );
      }

      this.method = this.transactionMethods[category];

      // class MockRequest {
      //   body: RawBody;
      //   constructor(transactionContracts: Record<Program, string[]>) {
      //     const startOfDay = new Date().setHours(6, 0, 0, 0);
      //     const endOfDay = new Date(startOfDay);
      //     this.body = {
      //       contracts: JSON.stringify(transactionContracts[program]),
      //       startOfDay: JSON.stringify(startOfDay),
      //       endOfDay: JSON.stringify(endOfDay.setDate(endOfDay.getDate() + 1)),
      //     };
      //   }
      // }
      class MockRequest {
        body: RawBody;
        constructor(transactionContracts: Record<Program, string[]>) {
          // Get the current time in the "Europe/Warsaw" timezone
          const now = moment().tz("Europe/Warsaw");
          // If the current time is between 00:00 and 06:00, subtract one day
          const baseDate = now.hour() >= 0 && now.hour() < 7 ? now.clone().subtract(1, "day") : now;
          // Set startOfDay to 06:00 of the baseDate (either today or the previous day)
          const startOfDay = baseDate
            .clone()
            .set({ hour: 6, minute: 0, second: 0, millisecond: 0 });
          // Set endOfDay to 06:00 of the next day
          const endOfDay = startOfDay.clone().add(1, "day");
          this.body = {
            contracts: JSON.stringify(transactionContracts[program]),
            startOfDay: JSON.stringify(startOfDay),
            endOfDay: JSON.stringify(endOfDay),
          };
        }
      }

      class MockResponse {
        statusCode?: number;
        status(code: number): this {
          this.statusCode = code;
          return this;
        }
        json(object: object) {
          return object;
        }
      }

      this.mockRequest = new MockRequest(this.transactionContracts) as Request;
      this.mockResponse = new MockResponse() as Response;
    }

    retrieve(): Promise<RawResponseObject> {
      return this.method(
        this.mockRequest,
        this.mockResponse
      ) as unknown as Promise<RawResponseObject>;
    }
  }

  type FilesParams = {
    progName: string;
    catName: string;
    subName: string;
  };
  type FilesResponseObject = {
    got: AnalyticFile[];
    message: string;
    statusMessage: HttpResponseMessage;
  };
  class AnalyticFilesHandler {
    mockRequest: Request<{ progName: string; catName: string; subName: string }>;
    mockResponse: Response;

    constructor(progName: string, catName: string, subName: string) {
      class MockRequest {
        params: FilesParams;
        constructor(progName: string, catName: string, subName: string) {
          this.params = {
            progName,
            catName,
            subName,
          };
        }
      }

      class MockResponse {
        statusCode?: number;
        status(code: number): this {
          this.statusCode = code;
          return this;
        }
        json(object: object) {
          return object;
        }
      }

      this.mockRequest = new MockRequest(progName, catName, subName) as Request<{
        progName: string;
        catName: string;
        subName: string;
      }>;
      this.mockResponse = new MockResponse() as Response;
    }

    retrieve(): Promise<FilesResponseObject> {
      return getByProgAndCatAndSub(
        this.mockRequest,
        this.mockResponse
      ) as unknown as Promise<FilesResponseObject>;
    }
  }

  export class Handler {
    private program: Program;
    private category: Category;

    // 1. raw
    private raw: PackedTypes.TTransactions;
    // 2. models, planning, reports
    private models: AnalyticFile[];
    private modelsJsObjs: PackedTypes.IModelObjs;
    private planning: AnalyticFile[];
    private planningJsObjs: PackedTypes.IPlanObjs;
    private reports: AnalyticFile[];
    private reportsJsObjs: PackedTypes.IReportsObjs;
    // 3. tablePackedRows
    private tablePackedRows: PackedTypes.ITablePackedRow[];
    private buffer: ExcelJS.Buffer;
    private sendAs: string;

    constructor(program: Program, category: Category) {
      this.program = program;
      this.category = category;
      // 1. Get raw transactions data
      // 2. Get models, planning and reports data
      // 3. Use PackingModels.PackedBuilder;
      // constructor(
      // transactions: PackedTypes.TTransactions,
      // modelsObj: PackedTypes.IModelsObj,
      // plansObj: PackedTypes.IPlansObj
      // )
      //
      // 4. Create Excel from tablePackedRows of PackingModels.PackedBuilder
      //
      // 5. Send mail to those inside reports data MAIL column with this excel
    }

    async getRawTransactions_1(): Promise<this> {
      try {
        const response: RawResponseObject = await new RawTransactionHandler(
          this.program,
          this.category
        ).retrieve();
        const raw: RawTransaction[] = response.raw;
        this.raw = raw as PackedTypes.TTransactions;

        return this;
      } catch (error) {
        this.raw = [];
        console.error(
          `getRawTransactions_1 at PackedService: ${error}. Returning empty array of raw transactions.`
        );
        return this;
      }
    }

    async getAnalyticFiles_2(): Promise<this> {
      try {
        const response = await new AnalyticFilesHandler(
          this.program,
          this.category,
          "drive"
        ).retrieve();

        const files: AnalyticFile[] = response.got;
        const consideredFiles: (AnalyticFile & { considered: boolean })[] =
          AnalyticFileHelper.addConsideredProperty(files);
        if (!consideredFiles.length) throw new Error(`No files`);

        this.models = [
          consideredFiles.find(
            (file) => file.considered && file.fileType === "models"
          ) as AnalyticFile,
        ];
        if (!this.models) throw new Error(`No file of type 'models`);

        this.planning = [
          consideredFiles.find(
            (file) => file.considered && file.fileType === "planning"
          ) as AnalyticFile,
        ];
        if (!this.planning) throw new Error(`No file of type 'planning`);

        this.reports = [
          consideredFiles.find(
            (file) => file.considered && file.fileType === "reports"
          ) as AnalyticFile,
        ];
        if (!this.reports) throw new Error(`No file of type 'reports`);

        return this;
      } catch (error) {
        this.models = [];
        this.planning = [];
        this.reports = [];

        console.error(
          `getAnalyticFiles_2 at PackedService: ${error}. Returning empty arrays of analytic files.`
        );
        return this;
      }
    }

    getJsObjects_3(): this {
      const modelsLength = this.models.length;
      if (!modelsLength) {
        console.error(
          `getJsObjects_3 at PackedService: Retrieved 'models' file array evaluate to empty array.`
        );
        return;
      }
      const planningLength = this.planning.length;
      if (!planningLength) {
        console.error(
          `getJsObjects_3 at PackedService: Retrieved 'planning' file array evaluate to empty array.`
        );
        return;
      }
      const reportsLength = this.reports.length;
      if (!reportsLength) {
        console.error(
          `getJsObjects_3 at PackedService: Retrieved 'reports' file array evaluate to empty array.`
        );
        return;
      }
      const modelsJsObjsParsed = JSON.parse(this.models.at(modelsLength - 1).jsObjectJson);
      this.modelsJsObjs = modelsJsObjsParsed[Object.keys(modelsJsObjsParsed)[0]];

      const planningJsObjsParsed = JSON.parse(this.planning.at(planningLength - 1).jsObjectJson);
      this.planningJsObjs = planningJsObjsParsed[Object.keys(planningJsObjsParsed)[0]];

      const reportsJsObjsParsed = JSON.parse(this.reports.at(reportsLength - 1).jsObjectJson);
      this.reportsJsObjs = reportsJsObjsParsed[Object.keys(reportsJsObjsParsed)[0]];

      return this;
    }

    getTablePackedRows_4(): this {
      this.tablePackedRows = new PackedModels.PackedBuilder(
        this.raw,
        this.modelsJsObjs,
        this.planningJsObjs
      ).tablePackedRows;

      return this;
    }

    async createExcelReport_5(): Promise<this> {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Packed");

      /// COLUMNS
      // Define static headers and dynamic group headers
      let columns = [
        { header: "Shift", key: "shift", width: 10 },
        { header: "Start (Hour)", key: "hourStart", width: 12 },
        { header: "End (Hour)", key: "hourEnd", width: 12 },
      ];
      // Get unique group letters from the modelsJsObjs
      const modelGroups = [
        ...new Set(this.modelsJsObjs.map((model) => model.GROUP_LETTER).filter(Boolean)),
      ];
      // Add dynamic group columns (Packed, Target, and Target % for each group)
      modelGroups.forEach((group) => {
        columns.push({
          header: `Group ${group} Packed (Units)`,
          key: `${group}packedUnits`,
          width: 23,
        });
      });
      // Add total column
      columns.push({ header: "Total Packed (Units)", key: "packedUnits", width: 21 });
      // Inject the column definitions into the worksheet
      worksheet.columns = columns;
      ///

      /// SORT
      // Step 1: Sort tablePackedRows by shift and then by hour
      this.tablePackedRows.sort((a, b) => {
        // Handle the case where shift can be "Summary"
        const shiftA = a.shift === "Summary" ? 99999 : a.shift; // Treat "Summary" as a special high value
        const shiftB = b.shift === "Summary" ? 99999 : b.shift;

        if (shiftA === shiftB) {
          // Convert hourStart from "HH:mm" to total minutes from midnight
          const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
          };

          const minutesA = timeToMinutes(a.hourEnd) - timeToMinutes(a.hourStart);
          const minutesB = timeToMinutes(b.hourEnd) - timeToMinutes(b.hourStart);

          return minutesA - minutesB; // Sort by hourStart in ascending order
        }
        return shiftA - shiftB; // Otherwise, sort by shift
      });
      ///

      // Step 2: Fill data for each packed row
      this.tablePackedRows.forEach((row) => {
        // Add dynamic group data for each group and flatten the structure
        modelGroups.forEach((group) => {
          const groupData = row[group] as PackedTypes.IPackedRowIndicator; // Access dynamic group data
          if (groupData) {
            row[`${group}packedUnits`] = groupData.packedUnits || null;
          } else {
            row[`${group}packedUnits`] = null;
          }
        });
        // Step 3: Add the row to the worksheet
        const addedRow = worksheet.addRow(row);

        // Helper function to determine color based on progress (without real-time check)
        const getDynamicFillColorForTotalTargetPercentage = (targetPercent: number): string => {
          if (targetPercent >= 100) {
            return "803366FF"; // Light Blue (50% transparency) for exceeding the target
          } else if (targetPercent >= 80) {
            return "8033FF33"; // Light Green (50% transparency) for close to the target
          } else if (targetPercent >= 50) {
            return "80FFCC66"; // Light Orange (50% transparency) for moderate progress
          } else {
            return "80FF6666"; // Light Red (50% transparency) for far behind target
          }
        };

        // Helper function to determine color based on current time and packed progress
        const getDynamicFillColorForGroupTargetPercentage = (
          groupData: PackedTypes.IPackedRowIndicator,
          currentHour: number,
          currentMinute: number,
          rowHour: number
        ): string => {
          // If current hour matches the row's hour, calculate based on real-time progress
          if (currentHour === rowHour) {
            const minutesPassed = currentMinute; // Minutes passed in this hour
            const totalMinutes = 60;
            const timePercentage = minutesPassed / totalMinutes; // % of the hour completed

            // If targetUnits is valid
            if (groupData.targetUnits && typeof groupData.targetUnits === "number") {
              const expectedUnits = groupData.targetUnits * timePercentage; // Expected units based on time passed
              const actualUnits = groupData.packedUnits; // Actual packed units so far

              // Determine the color based on real-time progress vs expected units
              if (actualUnits >= expectedUnits) {
                return "803366FF"; // Light Blue (50% transparency) - ahead or on target
              } else if (actualUnits >= expectedUnits * 0.8) {
                return "8033FF33"; // Light Green (50% transparency) - slightly behind
              } else if (actualUnits >= expectedUnits * 0.5) {
                return "80FFCC66"; // Light Orange (50% transparency) - moderately behind
              } else {
                return "80FF6666"; // Light Red (50% transparency) - significantly behind
              }
            }
          }

          // Fallback to general targetPercent-based logic for non-current rows
          if (groupData && typeof groupData.targetPercent === "number") {
            if (groupData.targetPercent >= 100) {
              return "803366FF"; // Light Blue (50% transparency)
            } else if (groupData.targetPercent >= 80) {
              return "8033FF33"; // Light Green (50% transparency)
            } else if (groupData.targetPercent >= 50) {
              return "80FFCC66"; // Light Orange (50% transparency)
            } else {
              return "80FF6666"; // Light Red (50% transparency)
            }
          }

          return "FFFFFFFF"; // Default white if no conditions match
        };

        // Step 4: Apply color to the Target (%) columns based on targetPercent and real-time progress
        modelGroups.forEach((group) => {
          const groupData = row[group] as PackedTypes.IPackedRowIndicator;

          // Ensure targetPercent is a number before comparing
          if (groupData && typeof groupData.targetPercent === "number") {
            const now = moment().tz("Europe/Warsaw"); // Get the current time using moment
            const currentHour = now.hour(); // Get the current hour
            const currentMinute = now.minute(); // Get the current minute

            // Get the appropriate color, checking if it's the current time row
            const fillColor = getDynamicFillColorForGroupTargetPercentage(
              groupData,
              currentHour,
              currentMinute,
              Number(row.hourStart.split(":").at(0))
            );

            // Apply fill color to the appropriate cell (By Target %)
            const packedUnitsCell = addedRow.getCell(`${group}packedUnits`);
            packedUnitsCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: fillColor },
            };
          }
        });

        // Apply color to the Total Target (%) column based purely on targetPercent (without real-time check)
        const totalTargetPercent = row.targetPercent;
        if (typeof totalTargetPercent === "number") {
          const totalFillColor = getDynamicFillColorForTotalTargetPercentage(totalTargetPercent);

          // Apply fill color to the Total Target (%) cell
          const totalPackedUnitsCell = addedRow.getCell("packedUnits");
          totalPackedUnitsCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: totalFillColor },
          };
        }
      });

      this.buffer = await workbook.xlsx.writeBuffer();

      function sendAs(program: Program) {
        const now = moment().tz("Europe/Warsaw");
        // Format the date and time to your desired format
        const formattedDate = now.format("YYYY.MM.DD HH-mm-ss"); // Using '-' instead of ':' for file name compatibility
        // Return the formatted file name
        return `${program} packed report ${formattedDate}.xlsx`;
      }
      this.sendAs = sendAs(this.program);
      // // save as test
      // // Rename and move file to destination folder or overwrite existing file
      // const dir = path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER);
      // // Ensure directory exists
      // if (!fs.existsSync(dir)) {
      //   fs.mkdirSync(dir, { recursive: true });
      // }
      // // Write buffer to a file
      // const filePath = path.join(dir, sendAs(this.program));
      // await fs.promises.writeFile(filePath, this.buffer as Buffer);
      // console.log(`Excel file has been saved to: ${filePath}`);

      return this;
    }

    sendMails_6() {
      const recipients = this.reportsJsObjs
        .map((rec) => {
          const mail = rec.MAIL;

          // Check if mail is not null or undefined
          if (mail) {
            // Check if mail is an object (hyperlink format) or a plain string
            if (typeof mail === "object" && mail.hyperlink) {
              // If it's a hyperlink object, check for mailto: prefix and return the trimmed email
              if (mail.hyperlink.startsWith("mailto:")) {
                return mail.hyperlink.replace("mailto:", "").trim(); // Strip 'mailto:' prefix and trim
              }
              return mail.hyperlink.trim(); // Return the trimmed hyperlink if it's not a mailto link
            } else {
              // If it's a plain string, return it as is and trim it
              return (mail as string).trim();
            }
          }

          // Return null or a fallback value if mail is null or undefined
          return null;
        })
        .filter(Boolean);

      const attachment: IEmailAttachment = {
        filename: this.sendAs,
        content: this.buffer as Buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };

      function sendEmails(recipients: string[], program: Program) {
        const upperCaseProgram = (program as string).toUpperCase();
        const configuration: IEmailReportContent = {
          title: "Intranet Notification",
          subtitle: `${upperCaseProgram} Packed Report`,
          text: `Please find attached the latest hourly report on packed units from ${upperCaseProgram}`,
          button1Href: `${serverConfig.origin}/tool/analytic/browse/${program}/packing/overview`,
          button1Text: `Go to ${upperCaseProgram} overview`,
          underButtonsText: `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`,
        };

        const subject = `${upperCaseProgram} Packed Report`;
        const emailHandler = EmailHandler.getInstance();
        emailHandler
          .newEmail(
            new EmailOptions(recipients, subject, reportsTemplate(configuration), undefined, [
              attachment,
            ])
          )
          .send();
      }

      if (recipients.length) sendEmails(recipients, this.program);
    }
  }
}
