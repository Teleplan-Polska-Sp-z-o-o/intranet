import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import { Document } from "../entity/document/DocumentEntity";
import { Department } from "../entity/document/DepartmentEntity";
import { Category } from "../entity/document/CategoryEntity";
import { Subcategory } from "../entity/document/SubcategoryEntity";

export class DocumentRelations1724397768423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'categoryId' column to 'document' table
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "categoryId",
        type: "int",
        isNullable: true,
      })
    );

    // Add 'departmentId' column to 'document' table
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "departmentId",
        type: "int",
        isNullable: true,
      })
    );

    // Create foreign key for 'categoryId'
    await queryRunner.createForeignKey(
      "document",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "SET NULL", // or "CASCADE" depending on your need
      })
    );

    // Create foreign key for 'departmentId'
    await queryRunner.createForeignKey(
      "document",
      new TableForeignKey({
        columnNames: ["departmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "department",
        onDelete: "SET NULL", // or "CASCADE" depending on your need
      })
    );

    // Fetch documents and update relations
    const documents = await queryRunner.query(`SELECT * FROM "document"`);

    for (const document of documents) {
      const [departmentName, categoryName, _subcategoryName] = document.folderStructure;

      let departmentId = null;
      let categoryId = null;

      if (departmentName) {
        const department = await queryRunner.query(`SELECT id FROM "department" WHERE name = $1`, [
          departmentName,
        ]);
        if (department.length > 0) {
          departmentId = department[0].id;
        }
      }

      if (categoryName) {
        const category = await queryRunner.query(`SELECT id FROM "category" WHERE name = $1`, [
          categoryName,
        ]);
        if (category.length > 0) {
          categoryId = category[0].id;
        }
      }

      // Update the document with the found IDs
      await queryRunner.query(
        `UPDATE "document" SET "departmentId" = $1, "categoryId" = $2 WHERE id = $3`,
        [departmentId, categoryId, document.id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Fetch the 'document' table
    const table = await queryRunner.getTable("document");
    // Find the foreign keys to 'categoryId', 'departmentId', and 'subcategoryId'
    const categoryForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("categoryId") !== -1
    );
    const departmentForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("departmentId") !== -1
    );
    // Drop the foreign keys
    if (categoryForeignKey) {
      await queryRunner.dropForeignKey("document", categoryForeignKey);
    }
    if (departmentForeignKey) {
      await queryRunner.dropForeignKey("document", departmentForeignKey);
    }

    // Drop 'departmentId' column from 'document' table
    await queryRunner.dropColumn("document", "departmentId");
    // Drop 'categoryId' column from 'document' table
    await queryRunner.dropColumn("document", "categoryId");

    await queryRunner.query(
      `UPDATE "document" SET "departmentId" = NULL, "categoryId" = NULL, "subcategoryId" = NULL`
    );
  }
}
