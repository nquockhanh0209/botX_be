import { Express } from "express";
import { Request } from "express";


export interface FileMapper {
  file: Express.Multer.File;
  req: Request;
}
