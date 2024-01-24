import express from "express";

import {
  getAllRecords,
  getRecordById,
} from "../controllers/recordsController.js";

const router = express.Router();

router.route("/").get(getAllRecords);

router.route("/:id").get(getRecordById);

export default router;
