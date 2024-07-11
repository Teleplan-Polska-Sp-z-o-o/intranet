import { Request } from "express";
import { MulterFile } from "multer";

interface MulterRequest extends Request {
  files?: MulterFile[];
}

export { MulterRequest };
