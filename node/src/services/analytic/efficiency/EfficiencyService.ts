import moment from "moment";
import { AnalyticFile } from "../../../orm/entity/analytic/AnalyticFileEntity";
import { AnalyticFileHelper } from "./AnalyticFileHandler";
import { EfficiencyBuilderHandler } from "./builders/EfficiencyBuilderHandler";
// import { RawTransactionFactory } from "./_RawTransactionHandler";
import ExcelJS from "exceljs";

// import path from "path";
// import { ANALYTIC_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../../config/routeConstants";
// import fs from "fs";
import { IEmailAttachment } from "../../../interfaces/Email/IEmailAttachment";
import { IEmailReportContent } from "../../../interfaces/Email/IEmailReportContent";
import { serverConfig } from "../../../config/server";
import { EmailHandler } from "../../../models/common/Email/EmailHandler";
import { EmailOptions } from "../../../models/common/Email/options/EmailOptions";
import { reportsTemplate } from "../../../models/common/Email/templates/reportsTemplate";
import { GenericTypes } from "../../transactions/sideControllers/Types";
import {
  handlers,
  RawTransactionService,
} from "../../transactions/sideControllers/RawTransactionService";
import { dataSource } from "../../../config/dataSource";
import { IProcessedEmployee } from "./Models/employee/EmployeeTypes";
// import { RawTransaction } from "../../../orm/sideEntity/postgres/RawTransactionsEntity";

export namespace EfficiencyService {
  export class PostgresHandler<
    P extends GenericTypes.Program,
    C extends keyof GenericTypes.ProgramCategoryTransaction[P]
  > {
    private program: P;
    private category: C;

    // 1 - raw transactions properties
    public raw: GenericTypes.ProgramCategoryTransaction[P][C][];

    // 2. models, reports
    private models: AnalyticFile[];
    private modelsJsObjs: object[];
    private reports: AnalyticFile[];
    private reportsJsObjs: {
      [key: string]: any;
      NAME: string;
      SURNAME: string;
      USERNAME: string;
      MAIL: string | { text: string; hyperlink: string };
      CONTENT: string;
    };

    // 3. table
    private processed: IProcessedEmployee[];
    private missingCache: { cacheKey: string; touchTimeKey: string }[];

    // 4. buffer
    private buffer_1: ExcelJS.Buffer;
    // private buffer_2: ExcelJS.Buffer;
    private sendAs_1: string;
    // private sendAs_2: string;

    constructor(program: P, category: C) {
      this.program = program;
      this.category = category;
    }

    // 1
    async getRawTransactions_1(
      options: GenericTypes.RawOptions<P, C>,
      customF?: Function
    ): Promise<this> {
      try {
        if (customF !== undefined) {
          const response = await customF();
          this.raw = response.raw;
          return this;
        }

        const programHandlers = handlers[this.program];
        if (!programHandlers) throw new Error(`No handlers defined for program: ${this.program}`);

        const service = new RawTransactionService<P, C>(
          options,
          programHandlers as {
            [K in keyof GenericTypes.ProgramCategoryTransaction[P]]: (
              opts: GenericTypes.RawOptions<P, K>
            ) => Promise<GenericTypes.ProgramCategoryTransaction[P][K][]>;
          }
        );

        this.raw = await service.getRaw();
        return this;
      } catch (error) {
        this.raw = [];
        console.error(`getRawTransactions_1: ${error}. Returning empty array of raw transactions.`);
        return this;
      }
    }
    // 2
    async getAnalyticFiles_2_1(): Promise<this> {
      try {
        const analyticFiles: AnalyticFile[] = await dataSource.getRepository(AnalyticFile).find({
          where: { progName: this.program, catName: this.category as string, subName: "drive" },
        });

        const consideredFiles: (AnalyticFile & { considered: boolean })[] =
          AnalyticFileHelper.addConsideredProperty(analyticFiles);
        if (!consideredFiles.length) throw new Error(`No files`);

        this.models = [
          consideredFiles.find(
            (file) => file.considered && file.fileType === "models"
          ) as AnalyticFile,
        ];
        if (!this.models) throw new Error(`No file of type 'models`);

        this.reports = [
          consideredFiles.find(
            (file) => file.considered && file.fileType === "reports"
          ) as AnalyticFile,
        ];
        if (!this.reports) throw new Error(`No file of type 'reports`);

        return this;
      } catch (error) {
        this.models = [];
        this.reports = [];

        console.error(
          `getAnalyticFiles_2 at PackedService: ${error}. Returning empty arrays of analytic files.`
        );
        return this;
      }
    }

    getJsObjects_2_2(): this {
      const modelsLength = this.models.length;
      if (!modelsLength) {
        console.error(
          `getJsObjects_3 at PackedService: Retrieved 'models' file array evaluate to empty array.`
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

      const reportsJsObjsParsed = JSON.parse(this.reports.at(reportsLength - 1).jsObjectJson);
      this.reportsJsObjs = reportsJsObjsParsed[Object.keys(reportsJsObjsParsed)[0]];

      return this;
    }

    getProcessedData_3(): this {
      const builder = new EfficiencyBuilderHandler(
        this.program,
        this.category,
        this.raw,
        this.modelsJsObjs
      );

      this.processed = builder.getProcessedData();
      this.missingCache = builder.getMissingCache();
      return this;
    }

    getProcessed() {
      return this.processed;
    }

    getMissingCache() {
      return this.missingCache;
    }

    async createExcelBaseEfficiencyReport_4_1(): Promise<this> {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employee Report");

      const overviewTableHeaders = [
        { header: "Shift", key: "employeeShift", minWidth: 12 },
        { header: "Employee Name", key: "employeeIdentifier", minWidth: 25 },
        { header: "Worked Time (hrs)", key: "employeeWorkedHours", minWidth: 20 },
        {
          header: "Estimated Processing Time (hrs)",
          key: "totalProcessingDurationOfUnitsInHours",
          minWidth: 30,
        },
        { header: "Units Processed", key: "totalProcessedUnits", minWidth: 20 },
        {
          header: "Estimated Units Processed Per Worked Time",
          key: "targetUnitsPerWorkDuration",
          minWidth: 35,
        },
        {
          header: "Difference Between Processed and Estimated",
          key: "processedUnitsDelta",
          minWidth: 40,
        },
        { header: "Target Per Hour", key: "targetUnitsPerHour", minWidth: 20 },
        {
          header: "Target Per Shift (7.5 hrs)",
          key: "targetUnitsPerEightHours",
          minWidth: 30,
        },
        { header: "Efficiency (%)", key: "efficiencyPercentage", minWidth: 18 },
      ];
      worksheet.columns = overviewTableHeaders.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.minWidth ?? 20,
      }));

      this.processed.forEach((employee: IProcessedEmployee) => {
        worksheet.addRow({
          employeeShift: employee.employeeShift,
          employeeIdentifier: employee.employeeIdentifier,
          employeeWorkedHours: employee.employeeWorkedHours,
          totalProcessingDurationOfUnitsInHours: employee.totalProcessingDurationOfUnitsInHours,
          totalProcessedUnits: employee.totalProcessedUnits,
          targetUnitsPerWorkDuration: employee.estimatedEmployeeTarget.targetUnitsPerWorkDuration,
          processedUnitsDelta: employee.estimatedEmployeeTarget.processedUnitsDelta,
          targetUnitsPerHour: employee.estimatedEmployeeTarget.targetUnitsPerHour,
          targetUnitsPerEightHours: employee.estimatedEmployeeTarget.targetUnitsPerEightHours,
          efficiencyPercentage: employee.efficiencyPercentage,
        });
      });

      this.buffer_1 = await workbook.xlsx.writeBuffer();

      const now = moment.utc();
      const formattedDate = now.format("YYYY.MM.DD");
      this.sendAs_1 = `${
        this.program
      }-${this.category.toString()}-efficiency-report_1_${formattedDate}.xlsx`;

      return this;
    }

    // async createExcelBaseEfficiencyReport_4_2(): Promise<this> {
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("Monthly Employee Report");

    //   // Determine the number of days in the given month
    //   const currentMonth = moment().format("YYYY-MM");
    //   const daysInMonth = moment(currentMonth, "YYYY-MM").daysInMonth();

    //   // Create headers for the second report
    //   const headers = [
    //     { header: "Shift", key: "shift", width: 15 },
    //     { header: "Employee Name", key: "emp_name", width: 25 },
    //   ];

    //   // Add columns for each day of the month
    //   for (let i = 1; i <= daysInMonth; i++) {
    //     headers.push({ header: `Day ${i}`, key: `day_${i}`, width: 15 });
    //   }

    //   worksheet.columns = headers;

    //   // Process the data for each employee
    //   const groupedByEmployee = this.table.reduce((acc, employee) => {
    //     const key = `${employee.shift}-${employee.emp_name}`;
    //     if (!acc[key]) {
    //       acc[key] = { ...employee, dailyData: {} };
    //     }

    //     // Populate daily data
    //     Object.keys(employee.dailyChart).forEach((date) => {
    //       const day = moment(date).date(); // Extract day number from the date
    //       acc[key].dailyData[day] = employee.dailyChart[date].efficiency;
    //     });

    //     return acc;
    //   }, {});

    //   // Add rows for each employee
    //   Object.values(groupedByEmployee).forEach((employee: any) => {
    //     const row = {
    //       shift: employee.shift,
    //       emp_name: employee.emp_name,
    //     };

    //     // Populate daily values
    //     for (let i = 1; i <= daysInMonth; i++) {
    //       row[`day_${i}`] = employee.dailyData[i] ?? ""; // Leave blank if no data
    //     }

    //     worksheet.addRow(row);
    //   });

    //   this.buffer_2 = await workbook.xlsx.writeBuffer();

    //   const now = moment().tz("Europe/Warsaw");
    //   const formattedDate = now.format("YYYY.MM.DD HH-mm-ss");
    //   this.sendAs_2 = `${this.program}-${this.category}-monthly-efficiency-report_2_${formattedDate}.xlsx`;

    //   // save as test
    //   // Rename and move file to destination folder or overwrite existing file
    //   //   const dir = path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER);
    //   //   // Ensure directory exists
    //   //   if (!fs.existsSync(dir)) {
    //   //     fs.mkdirSync(dir, { recursive: true });
    //   //   }
    //   //   // Write buffer to a file
    //   //   const filePath = path.join(dir, this.sendAs_2);
    //   //   await fs.promises.writeFile(filePath, this.buffer_2 as Buffer);
    //   //   console.log(`Excel file has been saved to: ${filePath}`);

    //   return this;
    // }

    sendMails_5(filterRecipientsByReportCode?: string, customRecipients?: string[]) {
      const recipients =
        Array.isArray(customRecipients) && customRecipients.length > 0
          ? customRecipients
          : this.reportsJsObjs
              .filter(
                (rec) =>
                  rec.CONTENT_CODES.split(",")
                    .map((code: string) => code.trim()) // Trim each element
                    .includes(filterRecipientsByReportCode) // Check if the array includes the desired value eg "EFF-MONTHLY"
              )
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

      const attachment_1: IEmailAttachment = {
        filename: this.sendAs_1,
        content: this.buffer_1 as Buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      // const attachment_2: IEmailAttachment = {
      //   filename: this.sendAs_2,
      //   content: this.buffer_2 as Buffer,
      //   contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // };

      function sendEmails(recipients: string[], program: P, category: C) {
        const upperCaseProgram = (program as string).toUpperCase();
        const upperCaseCategory = (category as string).toUpperCase();
        const configuration: IEmailReportContent = {
          title: "Intranet Notification",
          subtitle: `${upperCaseProgram} Efficiency Reports`,
          text: `Please find attached the monthly employee reports for the ${upperCaseProgram}`,
          button1Href: `${
            serverConfig.origin
          }/tool/analytic/browse/${program}/${category.toString()}/overview`,
          button1Text: `Go to ${upperCaseProgram} overview`,
          underButtonsText: `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`,
        };

        const subject = `${upperCaseProgram} ${upperCaseCategory} Efficiency Reports`;
        const emailHandler = EmailHandler.getInstance();
        emailHandler
          .newEmail(
            new EmailOptions(recipients, subject, reportsTemplate(configuration), undefined, [
              attachment_1,
              // attachment_2,
            ])
          )
          .send();
      }

      if (recipients.length) sendEmails(recipients, this.program, this.category);
    }
  }
}
