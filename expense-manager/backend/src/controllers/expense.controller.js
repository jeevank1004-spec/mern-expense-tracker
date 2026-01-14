import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

/**
 * ADD EXPENSE
 * POST /api/expenses/:groupId
 */
export const addExpense = async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    const { groupId } = req.params;

    if (!amount || !title || !date) {
      return res.status(400).json({
        message: "Amount, note and date are required",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const pendingApproval = group.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    const expense = await Expense.create({
      group: groupId,
      note: title,
      amount: Number(amount),
      expenseDate: new Date(date),
      addedBy: req.user._id,
      approvedBy: [req.user._id],
      pendingApproval,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense" });
  }
};

/**
 * GET GROUP EXPENSES
 * GET /api/expenses/:groupId
 */
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("addedBy", "name")
      .populate("approvedBy", "name")
      .populate("pendingApproval", "name")
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

/**
 * APPROVE EXPENSE
 * POST /api/expenses/approve/:expenseId
 */
export const approveExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // already approved?
    if (expense.approvedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Already approved" });
    }

    expense.approvedBy.push(req.user._id);
    expense.pendingApproval = expense.pendingApproval.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await expense.save();

    res.json({ message: "Expense approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve expense" });
  }
};
