import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  addExpense,
  getGroupExpenses,
  approveExpense,
} from "../controllers/expense.controller.js";

const router = express.Router();

// ADD EXPENSE
router.post("/:groupId", protect, addExpense);

// GET GROUP EXPENSES
router.get("/:groupId", protect, getGroupExpenses);

// APPROVE EXPENSE
router.post("/approve/:expenseId", protect, approveExpense);

export default router;
