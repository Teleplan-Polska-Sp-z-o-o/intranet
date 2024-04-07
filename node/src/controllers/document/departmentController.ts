import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { HttpResponseMessage } from "../../enums/response";

const addDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const department = new Department(name);

    await dataSource.getRepository(Department).save(department);

    res.status(201).json({
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
      res.status(404).json({
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

    res.status(200).json({
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
      res.status(404).json({
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

    res.status(200).json({
      deleted: department,
      message: "Department removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing department: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to remove department.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await dataSource.getRepository(Department).find();

    res.status(200).json({
      got: departments,
      message: "Departments retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving departments: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve departments.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addDepartment, editDepartment, removeDepartment, getDepartments };
