import express from "express";
import protect from "../middleware/auth.middleware.js";
import { searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

// ✅ SEARCH USER
router.get("/search", protect, searchUsers);

export default router;
