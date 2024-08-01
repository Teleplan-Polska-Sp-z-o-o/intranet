import { Request } from "express";
import { File } from "multer";

interface MulterRequest extends Request {
  files?: File[];
}

export { MulterRequest };
