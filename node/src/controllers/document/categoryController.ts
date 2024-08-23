import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { HttpResponseMessage } from "../../enums/response";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Document } from "../../orm/entity/document/DocumentEntity";

const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, departmentName } = req.body;

    const department = await dataSource
      .getRepository(Department)
      .findOne({ where: { name: departmentName } });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    const category = new Category(name, department);

    await dataSource.getRepository(Category).save(category);

    return res.status(201).json({
      added: category,
      message: "Category added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding category: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editCategory = async (req: Request<{ id: number; name: string }>, res: Response) => {
  try {
    const { id, name } = req.params;

    const category = await dataSource.getRepository(Category).findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    category.name = name;

    // Save the updated category
    await dataSource.getRepository(Category).save(category);

    // Send success response
    return res.status(200).json({
      edited: category,
      message: "Category updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating category: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeCategory = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    const category = await dataSource.getRepository(Category).findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.getRepository(Category).remove(category);

    return res.status(200).json({
      deleted: category,
      message: "Category removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing category: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getCategories = async (req: Request, res: Response) => {
//   try {
//     const { departmentName, whereDocType } = req.params;

//     await dataSource.transaction(async (transactionalEntityManager) => {
//       const department = await transactionalEntityManager
//         .getRepository(Department)
//         .findOne({ where: { name: departmentName }, relations: ["categories"] });
//       if (!department) {
//         return res.status(200).json({
//           got: [],
//           message: "Department not specified",
//           statusMessage: HttpResponseMessage.GET_ERROR,
//         });
//       }

//       const categoriesQuery = transactionalEntityManager
//         .getRepository(Category)
//         .createQueryBuilder("category");

//       const parsedWhereDocType: string[] | false = JSON.parse(whereDocType);
//       if (Array.isArray(parsedWhereDocType) && !parsedWhereDocType.length) {
//         return res.status(200).json({
//           got: [],
//           message: "Categories retrieved successfully",
//           statusMessage: HttpResponseMessage.GET_SUCCESS,
//         });
//       } else if (Array.isArray(parsedWhereDocType) && parsedWhereDocType.length) {
//         categoriesQuery
//           .leftJoinAndSelect("category.subcategories", "subcategory")
//           .leftJoinAndSelect("subcategory.documents", "document")
//           .where("document.type IN (:...documentTypes)", {
//             documentTypes: parsedWhereDocType,
//           });
//       }

//       categoriesQuery.andWhere("category.departmentId = :departmentId", {
//         departmentId: department.id,
//       });

//       const categories: Array<Category> = await categoriesQuery.getMany();

//       return res.status(200).json({
//         got: categories,
//         message: "Categories retrieved successfully",
//         statusMessage: HttpResponseMessage.GET_SUCCESS,
//       });
//     });
//   } catch (error) {
//     console.error("Error retrieving categories: ", error);
//     return res.status(500).json({
//       message: "Unknown error occurred. Failed to retrieve categories.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getCategories = async (
  req: Request<{ departmentName: string; whereDocType: string }>,
  res: Response
) => {
  try {
    const { departmentName, whereDocType } = req.params;

    const parsedWhereDocType: string[] | false = JSON.parse(whereDocType);

    if (Array.isArray(parsedWhereDocType) && !parsedWhereDocType.length) {
      return res.status(200).json({
        got: [],
        message: "No categories found matching the criteria.",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      // Step 1: Retrieve relevant documents and extract category names based on departmentName
      let categoryNameArray: string[] = [];

      if (Array.isArray(parsedWhereDocType) && parsedWhereDocType.length) {
        const documentQuery = transactionalEntityManager
          .getRepository(Document)
          .createQueryBuilder("document")
          .select(`"document"."folderStructure"[2]`, "categoryName")
          .where("document.type IN (:...documentTypes)", { documentTypes: parsedWhereDocType })
          .andWhere(`"document"."folderStructure"[1] = :departmentName`, { departmentName });

        const categoryNames = await documentQuery.getRawMany();
        categoryNameArray = categoryNames.map((row: { categoryName: string }) => row.categoryName);
      }

      // Step 2: Query the categories based on extracted names and department
      const categoriesQuery = transactionalEntityManager
        .getRepository(Category)
        .createQueryBuilder("category");

      if (departmentName)
        categoriesQuery
          .innerJoin("category.department", "department")
          .where("department.name = :departmentName", { departmentName });

      if (categoryNameArray.length) {
        categoriesQuery.andWhere("category.name IN (:...categoryNames)", {
          categoryNames: categoryNameArray,
        });
      }

      const categories = await categoriesQuery.getMany();

      return res.status(200).json({
        got: categories,
        message: "Categories retrieved successfully",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error retrieving categories: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve categories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addCategory, editCategory, removeCategory, getCategories };
