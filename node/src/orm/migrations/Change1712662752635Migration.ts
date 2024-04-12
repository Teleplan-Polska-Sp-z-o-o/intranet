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
        name: "process_change_notice",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          // Add other columns based on the ProcessChangeNotice entity
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("process_change_request");
    await queryRunner.dropTable("process_change_notice");
  }
}
