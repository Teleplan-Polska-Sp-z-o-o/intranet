import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { HttpResponseMessage } from "../../enums/response";

const addDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const department = new Department(name);

    await dataSource.getRepository(Department).save(department);

    return res.status(201).json({
      added: department,
      message: "Department added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation error code
      return res.status(400).json({
        message: "Department with this name already exists",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    } else {
      console.error("Error adding department: ", error);
      return res.status(500).json({
        message: "Unknown error occurred. Failed to add department.",
        statusMessage: HttpResponseMessage.UNKNOWN,
      });
    }
  }
};

const editDepartment = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.params;

    const department = await dataSource.getRepository(Department).findOne({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    department.name = name;

    await dataSource.getRepository(Department).save(department);

    return res.status(200).json({
      edited: department,
      message: "Department updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation error code
      return res.status(400).json({
        message: "Department with this name already exists",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    } else {
      console.error("Error updating department: ", error);
      return res.status(500).json({
        message: "Unknown error occurred. Failed to update department.",
        statusMessage: HttpResponseMessage.UNKNOWN,
      });
    }
  }
};

const removeDepartment = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.params;

    const department = await dataSource.getRepository(Department).findOne({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.getRepository(Department).remove(department);

    return res.status(200).json({
      deleted: department,
      message: "Department removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing department: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove department.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDepartments = async (req: Request, res: Response) => {
  try {
    const { whereDocType } = req.params;

    const departmentsQuery = dataSource.getRepository(Department).createQueryBuilder("department");

    if (whereDocType) {
      departmentsQuery
        .leftJoinAndSelect("department.categories", "category")
        .leftJoinAndSelect("category.subcategories", "subcategory")
        .leftJoinAndSelect("subcategory.documents", "document")
        .where("document.type = :documentType", { documentType: whereDocType });
    }

    const departments = await departmentsQuery.getMany();

    return res.status(200).json({
      got: departments,
      message: "Departments retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving departments: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve departments.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addDepartment, editDepartment, removeDepartment, getDepartments };
