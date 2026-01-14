import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getMyInvites,
  respondInvite,
} from "../controllers/groupInvite.controller.js";

const router = express.Router();

// GET pending invites
router.get("/", protect, getMyInvites);

// Accept / Reject invite
router.post("/:inviteId/respond", protect, respondInvite);

export default router;
