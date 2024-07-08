import express from "express";
import multer from "multer";

import { addNews, editNews, getNews, removeNews } from "../controllers/editor/newsController";

const router = express.Router();
const upload = multer({ dest: `${__dirname}/../../uploads/news` });
// Define routes

router.post("/news", upload.any(), addNews);
router.put("/news", upload.any(), editNews);
router.get("/news/:confidentiality/:skip/:take", getNews);
router.delete("/news/:id", removeNews);

export { router as editorRoutes };
