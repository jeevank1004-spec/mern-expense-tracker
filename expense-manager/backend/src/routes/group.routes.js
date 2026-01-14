import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
} from "../controllers/group.controller.js";
import { sendGroupInvite } from "../controllers/groupInvite.controller.js";

const router = express.Router();

// GET my groups
router.get("/", protect, getMyGroups);

// CREATE group  ✅ (FIXED)
router.post("/", protect, createGroup);

// SEND GROUP INVITE
router.post("/:groupId/invite", protect, sendGroupInvite);

export default router;
