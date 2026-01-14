import api from "./axios";

export const sendGroupInvite = async (groupId, userId) => {
  return api.post(`/groups/${groupId}/invite`, { userId });
};
