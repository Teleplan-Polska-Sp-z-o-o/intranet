import moment from "moment";
import { AnalyticFile } from "../../../orm/entity/analytic/AnalyticFileEntity";
import { AnalyticFileHandler, AnalyticFileHelper } from "./AnalyticFileHandler";
import { EfficiencyBuilderHandler } from "./builders/EfficiencyBuilderHandler";
import { RawTransactionFactory } from "./RawTransactionHandler";
import { EfficiencyMonthlyTypes } from "./Types";
import ExcelJS from "exceljs";

import path from "path";
import { ANALYTIC_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../../config/routeConstants";
import fs from "fs";
import { IEmailAttachment } from "../../../interfaces/Email/IEmailAttachment";
import { IEmailReportContent } from "../../../interfaces/Email/IEmailReportContent";
import { serverConfig } from "../../../config/server";
import { EmailHandler } from "../../../models/common/Email/EmailHandler";
import { EmailOptions } from "../../../models/common/Email/options/EmailOptions";
import { reportsTemplate } from "../../../models/common/Email/templates/reportsTemplate";

export namespace EfficiencyMonthlyService {
  export class PostgresHandler<P extends EfficiencyMonthlyTypes.Postgres.Program> {
    private program: P;
    private category: EfficiencyMonthlyTypes.Postgres.Category<P>;

    // 1 - raw transactions properties
    private raw: EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[];

    // 2. models, reports
    private models: AnalyticFile[];
    private modelsJsObjs: object[];
    private reports: AnalyticFile[];
    private reportsJsObjs: EfficiencyMonthlyTypes.Postgres.IReportsRecord[];

    // 3. table
    private table: EfficiencyMonthlyTypes.Postgres.IProcessedEmployeeUniversal[];

    // 4. buffer
    private buffer_1: ExcelJS.Buffer;
    private buffer_2: ExcelJS.Buffer;
    private sendAs_1: string;
    private sendAs_2: string;

    constructor(program: P, category: EfficiencyMonthlyTypes.Postgres.Category<P>) {
      this.program = program;
      this.category = category;
    }

    // 1
    async getRawTransactions_1(): Promise<this> {
      try {
        const response: EfficiencyMonthlyTypes.Postgres.ITransactionsRecord[] =
          await new RawTransactionFactory<P>(this.program, this.category).retrieve();
        this.raw = response;
        return this;
      } catch (error) {
        this.raw = [];
        console.error(
          `getRawTransactions_1 at EfficiencyMonthlyService: ${error}. Returning empty array of raw transactions.`
        );
        return this;
      }
    }
    // 2
    async getAnalyticFiles_2_1(): Promise<this> {
      try {
        const response = await new AnalyticFileHandler<P>(this.program, this.category).retrieve();

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

      this.table =
        builder.getProcessedData() as EfficiencyMonthlyTypes.Postgres.IProcessedEmployeeUniversal[];

      return this;
    }

    async createExcelBaseEfficiencyReport_4_1(): Promise<this> {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employee Report");

      // Define headers for the first report
      const headers = [
        { header: "Shift", key: "shift", width: 15 },
        { header: "Employee Name", key: "emp_name", width: 25 },
        { header: "Worked Time (hrs)", key: "worked_hours", width: 20 },
        { header: "Estimated Processing Time (hrs)", key: "processing_time", width: 25 },
        { header: "Units Processed", key: "processed_units", width: 20 },
        {
          header: "Estimated Units Processed Per Worked Time",
          key: "units_per_worked_quarters",
          width: 35,
        },
        {
          header: "Difference Between Processed and Estimated",
          key: "difference_units_worked_time",
          width: 40,
        },
        { header: "Target Per Hour", key: "units_per_hr", width: 20 },
        { header: "Target Per Shift (7.5 hrs)", key: "units_per_8hrs", width: 25 },
        { header: "Efficiency (%)", key: "efficiency", width: 15 },
      ];

      worksheet.columns = headers;

      // Add rows to the first report
      this.table.forEach((employee) => {
        worksheet.addRow({
          shift: employee.shift,
          emp_name: employee.emp_name,
          worked_hours: employee.worked_hours, // Convert quarters to hours
          processing_time: employee.processing_time, // Convert minutes to hours
          processed_units: employee.processed_units,
          units_per_worked_quarters: employee.estimated_target.units_per_worked_quarters,
          difference_units_worked_time: employee.estimated_target.difference_units_worked_time,
          units_per_hr: employee.estimated_target.units_per_hr,
          units_per_8hrs: employee.estimated_target.units_per_8hrs,
          efficiency: employee.efficiency,
        });
      });

      this.buffer_1 = await workbook.xlsx.writeBuffer();

      const now = moment().tz("Europe/Warsaw");
      const formattedDate = now.format("YYYY.MM.DD HH-mm-ss");
      this.sendAs_1 = `${this.program}-${this.category}-monthly-efficiency-report_1_${formattedDate}.xlsx`;

      // save as test
      // Rename and move file to destination folder or overwrite existing file
      //   const dir = path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER);
      //   // Ensure directory exists
      //   if (!fs.existsSync(dir)) {
      //     fs.mkdirSync(dir, { recursive: true });
      //   }
      //   // Write buffer to a file
      //   const filePath = path.join(dir, this.sendAs_1);
      //   await fs.promises.writeFile(filePath, this.buffer_1 as Buffer);
      //   console.log(`Excel file has been saved to: ${filePath}`);

      return this;
    }

    async createExcelBaseEfficiencyReport_4_2(): Promise<this> {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Monthly Employee Report");

      // Determine the number of days in the given month
      const currentMonth = moment().format("YYYY-MM");
      const daysInMonth = moment(currentMonth, "YYYY-MM").daysInMonth();

      // Create headers for the second report
      const headers = [
        { header: "Shift", key: "shift", width: 15 },
        { header: "Employee Name", key: "emp_name", width: 25 },
      ];

      // Add columns for each day of the month
      for (let i = 1; i <= daysInMonth; i++) {
        headers.push({ header: `Day ${i}`, key: `day_${i}`, width: 15 });
      }

      worksheet.columns = headers;

      // Process the data for each employee
      const groupedByEmployee = this.table.reduce((acc, employee) => {
        const key = `${employee.shift}-${employee.emp_name}`;
        if (!acc[key]) {
          acc[key] = { ...employee, dailyData: {} };
        }

        // Populate daily data
        Object.keys(employee.dailyChart).forEach((date) => {
          const day = moment(date).date(); // Extract day number from the date
          acc[key].dailyData[day] = employee.dailyChart[date].efficiency;
        });

        return acc;
      }, {});

      // Add rows for each employee
      Object.values(groupedByEmployee).forEach((employee: any) => {
        const row = {
          shift: employee.shift,
          emp_name: employee.emp_name,
        };

        // Populate daily values
        for (let i = 1; i <= daysInMonth; i++) {
          row[`day_${i}`] = employee.dailyData[i] ?? ""; // Leave blank if no data
        }

        worksheet.addRow(row);
      });

      this.buffer_2 = await workbook.xlsx.writeBuffer();

      const now = moment().tz("Europe/Warsaw");
      const formattedDate = now.format("YYYY.MM.DD HH-mm-ss");
      this.sendAs_2 = `${this.program}-${this.category}-monthly-efficiency-report_2_${formattedDate}.xlsx`;

      // save as test
      // Rename and move file to destination folder or overwrite existing file
      //   const dir = path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER);
      //   // Ensure directory exists
      //   if (!fs.existsSync(dir)) {
      //     fs.mkdirSync(dir, { recursive: true });
      //   }
      //   // Write buffer to a file
      //   const filePath = path.join(dir, this.sendAs_2);
      //   await fs.promises.writeFile(filePath, this.buffer_2 as Buffer);
      //   console.log(`Excel file has been saved to: ${filePath}`);

      return this;
    }

    sendMails_5() {
      const recipients = this.reportsJsObjs
        .filter(
          (rec) =>
            rec.CONTENT_CODES.split(",")
              .map((code: string) => code.trim()) // Trim each element
              .includes("EFF-MONTHLY") // Check if the array includes the desired value
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
      const attachment_2: IEmailAttachment = {
        filename: this.sendAs_2,
        content: this.buffer_2 as Buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };

      function sendEmails(
        recipients: string[],
        program: P,
        category: EfficiencyMonthlyTypes.Postgres.Category<P>
      ) {
        const upperCaseProgram = (program as string).toUpperCase();
        const upperCaseCategory = (category as string).toUpperCase();
        const configuration: IEmailReportContent = {
          title: "Intranet Notification",
          subtitle: `${upperCaseProgram} Efficiency Reports`,
          text: `Please find attached the monthly employee reports for the ${upperCaseProgram}`,
          button1Href: `${serverConfig.origin}/tool/analytic/browse/${program}/${category}/overview`,
          button1Text: `Go to ${upperCaseProgram} overview`,
          underButtonsText: `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`,
        };

        const subject = `${upperCaseProgram} ${upperCaseCategory} Efficiency Reports`;
        const emailHandler = EmailHandler.getInstance();
        emailHandler
          .newEmail(
            new EmailOptions(recipients, subject, reportsTemplate(configuration), undefined, [
              attachment_1,
              attachment_2,
            ])
          )
          .send();
      }

      if (recipients.length) sendEmails(recipients, this.program, this.category);
    }
  }
}
