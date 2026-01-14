import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  const users = await User.find({
    $or: [
      { email: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
    ],
  }).select("_id name email");

  res.json(users);
};
