import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";

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

const getSubcategories = async (req: Request, res: Response) => {
  try {
    // const { departmentName, categoryName } = req.params;

    // const department = await dataSource
    //   .getRepository(Department)
    //   .findOne({ where: { name: departmentName }, relations: ["categories"] });

    // if (!department) {
    //   return res.status(404).json({
    //     message: "Department not found",
    //   });
    // }

    // const category = department.categories.find((category) => category.name === categoryName);

    // if (!category) {
    //   return res.status(404).json({
    //     message: "Category not found within the department",
    //   });
    // }

    // const subcategories = await dataSource.getRepository(Subcategory).find({ where: { category } });

    const { departmentName, categoryName, whereDocType } = req.params;

    let subcategories: Array<Subcategory>;
    await dataSource.transaction(async (transactionalEntityManager) => {
      const department = await transactionalEntityManager
        .getRepository(Department)
        .findOne({ where: { name: departmentName }, relations: ["categories"] });
      if (!department) {
        return res.status(404).json({
          message: "Department not found",
        });
      }

      const category = department.categories.find((category) => category.name === categoryName);
      if (!category) {
        return res.status(404).json({
          message: "Category not found within the department",
        });
      }

      const subcategoriesQuery = transactionalEntityManager
        .getRepository(Subcategory)
        .createQueryBuilder("subcategory");

      if (whereDocType) {
        subcategoriesQuery.leftJoinAndSelect("subcategory.documents", "document");
      }

      subcategoriesQuery.where("subcategory.categoryId = :categoryId", {
        categoryId: category.id,
      });

      if (whereDocType) {
        subcategoriesQuery.andWhere("document.type = :documentType", {
          documentType: whereDocType,
        });
      }

      subcategories = await subcategoriesQuery.getMany();
    });

    return res.status(200).json({
      got: subcategories,
      message: "Subcategories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
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
