import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DocumentFolderStructure1723018481454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make subcategoryId column nullable
    await queryRunner.query(`
      ALTER TABLE document ALTER COLUMN "subcategoryId" DROP NOT NULL;
    `);

    // Add the folderStructure column
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "folderStructure",
        type: "text[]",
        isNullable: false,
        default: "'{}'",
      })
    );

    // Fetch all documents and update their folder structure
    const documents = await queryRunner.query(`
      SELECT document.id, department.name as departmentName, category.name as categoryName, subcategory.name as subcategoryName
      FROM document
      INNER JOIN subcategory ON document."subcategoryId" = subcategory.id
      INNER JOIN category ON subcategory."categoryId" = category.id
      INNER JOIN department ON category."departmentId" = department.id
    `);

    for (const doc of documents) {
      const folderStructure = [doc.departmentname, doc.categoryname, doc.subcategoryname];

      await queryRunner.query(
        `
        UPDATE document
        SET "folderStructure" = $1
        WHERE id = $2
      `,
        [folderStructure, doc.id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the folderStructure column
    await queryRunner.dropColumn("document", "folderStructure");
  }
}
