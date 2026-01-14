import Group from "../models/Group.js";

// CREATE GROUP
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name required" });
    }

    const exists = await Group.findOne({
      name: name.trim(),
      createdBy: req.user._id,
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "You already have a group with this name" });
    }

    const group = await Group.create({
      name: name.trim(),
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed to create group" });
  }
};

// GET MY GROUPS
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};
