import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Change1712662752635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "process_change_request",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "processChangeNoticeId",
            type: "int",
            isNullable: true,
          },
          {
            name: "year",
            type: "int",
          },
          {
            name: "updatable",
            type: "boolean",
          },
          {
            name: "numberOfRequest",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "requestDate",
            type: "varchar",
          },
          {
            name: "requestedBy",
            type: "varchar",
          },
          {
            name: "internalOrExternal",
            type: "enum",
            enum: ["Internal", "External"],
          },
          {
            name: "customerContactPerson",
            type: "varchar",
          },
          {
            name: "customerContactEmail",
            type: "varchar",
          },
          {
            name: "reconextContactPerson",
            type: "varchar",
          },
          {
            name: "reconextOwner",
            type: "varchar",
          },
          {
            name: "dateNeeded",
            type: "varchar",
          },
          {
            name: "costOfImplementation",
            type: "varchar",
          },
          {
            name: "program",
            type: "varchar",
          },
          {
            name: "modelOrProcessImpacted",
            type: "varchar",
          },
          {
            name: "changeReason",
            type: "varchar",
          },
          {
            name: "changeDescription",
            type: "varchar",
          },
          {
            name: "impacts",
            type: "varchar",
          },
          {
            name: "dedicatedDepartment",
            type: "varchar",
          },
          {
            name: "riskAnalysis",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "assessment",
            type: "enum",
            enum: ["Implementation", "Rejection"],
            isNullable: true,
          },
          {
            name: "approvedOrRejectedBy",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["Open", "Closed"],
          },
          {
            name: "closureDate",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "process_change_request_updates",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "processChangeRequestId",
            type: "int",
          },
          {
            name: "updateBy",
            type: "varchar",
          },
          {
            name: "updateDate",
            type: "varchar",
          },
          {
            name: "updateFields",
            type: "varchar",
          },
          {
            name: "updateDescription",
            type: "varchar",
          },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "process_change_notice",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "numberOfNotice",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "numberOfRequest",
            type: "varchar",
          },
          {
            name: "year",
            type: "int",
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "closureDate",
            type: "varchar",
            isNullable: true,
          },

          {
            name: "changeDescription",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "areDocumentationChangesRequired",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "engineeringDepartmentName",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "engineeringDepartmentApproval",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "engineeringDepartmentApprovalDate",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "qualityDepartmentName",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "qualityDepartmentApproval",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "qualityDepartmentApprovalDate",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "dedicatedDepartmentApproval",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "dedicatedDepartmentApprovalDate",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "personDesignatedForImplementation",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "listOfDocumentationToChange",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "isNewDocumentationRequired",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "listOfDocumentationToCreate",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "isCustomerApprovalRequired",
            type: "boolean",
            isNullable: true,
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      "process_change_request",
      new TableForeignKey({
        columnNames: ["processChangeNoticeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "process_change_notice",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "process_change_request_updates",
      new TableForeignKey({
        columnNames: ["processChangeRequestId"],
        referencedColumnNames: ["id"],
        referencedTableName: "process_change_request",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("process_change_request_updates");
    await queryRunner.dropTable("process_change_request");
    await queryRunner.dropTable("process_change_notice");
  }
}
