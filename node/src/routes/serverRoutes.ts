import express from "express";
import { ping } from "../controllers/common/serverController";

const router = express.Router();

// Define routes

router.get("/ping", ping);

export { router as serverRoutes };
