import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { HttpResponseMessage } from "../../enums/response";
import { Department } from "../../orm/entity/document/DepartmentEntity";

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

    res.status(201).json({
      added: category,
      message: "Category added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editCategory = async (req: Request, res: Response) => {
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
    res.status(200).json({
      edited: category,
      message: "Category updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to update category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeCategory = async (req: Request, res: Response) => {
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

    res.status(200).json({
      deleted: category,
      message: "Category removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to remove category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const { departmentName } = req.params;

    const department = await dataSource
      .getRepository(Department)
      .findOne({ where: { name: departmentName }, relations: ["categories"] });
    if (!department) {
      return res.status(404).json({
        message: "Categories not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    const categories = department.categories;

    res.status(200).json({
      got: categories,
      message: "Categories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving categories: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve categories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addCategory, editCategory, removeCategory, getCategories };
