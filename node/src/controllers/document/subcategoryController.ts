import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Document } from "../../orm/entity/document/DocumentEntity";

const addSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryName, departmentName } = req.body;

    const category = await dataSource
      .getRepository(Category)
      .findOne({ where: { name: categoryName, department: { name: departmentName } } });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    const subcategory = new Subcategory(name, category);

    await dataSource.getRepository(Subcategory).save(subcategory);

    return res.status(201).json({
      added: subcategory,
      message: "Subcategory added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding subcategory: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editSubcategory = async (req: Request<{ id: number; name: string }>, res: Response) => {
  try {
    const { id, name } = req.params;

    const subcategory = await dataSource.getRepository(Subcategory).findOne({ where: { id } });

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    subcategory.name = name;

    await dataSource.getRepository(Subcategory).save(subcategory);

    return res.status(200).json({
      edited: subcategory,
      message: "Subcategory updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating subcategory: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeSubcategory = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    const subcategory = await dataSource.getRepository(Subcategory).findOne({ where: { id } });

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.getRepository(Subcategory).remove(subcategory);

    return res.status(200).json({
      deleted: subcategory,
      message: "Subcategory removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing subcategory: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getSubcategories = async (
  req: Request<{ departmentName: string; categoryName: string; whereDocType: string }>,
  res: Response
) => {
  try {
    const { departmentName, categoryName, whereDocType } = req.params;

    const parsedWhereDocType: string[] | false = JSON.parse(whereDocType);

    if (Array.isArray(parsedWhereDocType) && !parsedWhereDocType.length) {
      return res.status(200).json({
        got: [],
        message: "No subcategories found matching the criteria.",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      // Step 1: Retrieve relevant documents and extract subcategory names based on departmentName and categoryName
      let subcategoryNameList: string[] = [];

      if (Array.isArray(parsedWhereDocType) && parsedWhereDocType.length) {
        const documentQuery = transactionalEntityManager
          .getRepository(Document)
          .createQueryBuilder("document")
          .select(`"document"."folderStructure"[3]`, "subcategoryName")
          .where("document.type IN (:...documentTypes)", { documentTypes: parsedWhereDocType })
          .andWhere(`"document"."folderStructure"[1] = :departmentName`, { departmentName })
          .andWhere(`"document"."folderStructure"[2] = :categoryName`, { categoryName });

        const subcategoryNames = await documentQuery.getRawMany();
        subcategoryNameList = subcategoryNames.map(
          (row: { subcategoryName: string }) => row.subcategoryName
        );
      }

      // Step 2: Query the subcategories based on extracted names and category
      const subcategoriesQuery = transactionalEntityManager
        .getRepository(Subcategory)
        .createQueryBuilder("subcategory");

      // if (departmentName && categoryName)
      //   subcategoriesQuery
      //     .innerJoin("subcategory.category", "category")
      //     .innerJoin("category.department", "department")
      //     .where("department.name = :departmentName", { departmentName })
      //     .andWhere("category.name = :categoryName", { categoryName });

      // if (subcategoryNameList.length) {
      //   subcategoriesQuery.where("subcategory.name IN (:...subcategoryNames)", {
      //     subcategoryNames: subcategoryNameList,
      //   });
      // }

      // Building the WHERE clause dynamically
      const conditions: string[] = [];
      const parameters: any = {};

      if (departmentName) {
        conditions.push("department.name = :departmentName");
        parameters.departmentName = departmentName;
      }

      if (categoryName) {
        conditions.push("category.name = :categoryName");
        parameters.categoryName = categoryName;
      }

      if (subcategoryNameList.length) {
        conditions.push("subcategory.name IN (:...subcategoryNames)");
        parameters.subcategoryNames = subcategoryNameList;
      }

      // Apply conditions to the query
      if (conditions.length) {
        subcategoriesQuery
          .innerJoin("subcategory.category", "category")
          .innerJoin("category.department", "department")
          .where(conditions.join(" AND "), parameters);
      }

      const subcategories = await subcategoriesQuery.getMany();

      return res.status(200).json({
        got: subcategories,
        message: "Subcategories retrieved successfully",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error retrieving subcategories: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve subcategories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addSubcategory, editSubcategory, removeSubcategory, getSubcategories };
