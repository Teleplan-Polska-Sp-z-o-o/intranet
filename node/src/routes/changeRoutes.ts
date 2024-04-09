import {
  addRequest,
  editRequest,
  closeRequest,
  removeRequest,
  getRequests,
} from "../controllers/change/requestController";

import express from "express";
// import multer from "multer";

const router = express.Router();
// const upload = multer({ dest: `${__dirname}/../../uploads/change/request` });

// Define routes
router.post("/request", addRequest);
router.put("/request/:id", editRequest);
router.put("/request/:id/:assessment", closeRequest);
router.delete("/request/:id", removeRequest);
router.get("/request", getRequests);

export { router as changeRoutes };
