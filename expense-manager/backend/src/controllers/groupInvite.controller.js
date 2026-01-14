import GroupInvite from "../models/GroupInvite.js";
import Group from "../models/Group.js";

export const sendGroupInvite = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  // already member
  if (group.members.includes(userId)) {
    return res.status(400).json({ message: "User already in group" });
  }

  const exists = await GroupInvite.findOne({
    group: groupId,
    toUser: userId,
    status: "pending",
  });

  if (exists) {
    return res.status(400).json({ message: "Invite already sent" });
  }

  await GroupInvite.create({
    group: groupId,
    fromUser: req.user._id,
    toUser: userId,
  });

  res.json({ message: "Invite sent" });
};


export const getMyInvites = async (req, res) => {
  const invites = await GroupInvite.find({
    toUser: req.user._id,
    status: "pending",
  })
    .populate("group", "name")
    .populate("fromUser", "name");

  res.json(invites);
};

export const respondInvite = async (req, res) => {
  const { inviteId } = req.params;
  const { action } = req.body; // accept / reject

  const invite = await GroupInvite.findById(inviteId);
  if (!invite) return res.status(404).json({ message: "Invite not found" });

  if (action === "accept") {
    invite.status = "accepted";

    await Group.findByIdAndUpdate(invite.group, {
      $addToSet: { members: invite.toUser },
    });
  } else {
    invite.status = "rejected";
  }

  await invite.save();

  res.json({ message: `Invite ${action}ed` });
};
