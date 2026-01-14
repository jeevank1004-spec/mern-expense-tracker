import { useEffect, useState } from "react";
import api from "../api/axios";
import "/src/includes/Invitations.css";

const Invitations = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvites = async () => {
    try {
      const res = await api.get("/invites");
      setInvites(res.data);
    } catch (err) {
      setError("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const respondInvite = async (inviteId, action) => {
    try {
      await api.post(`/invites/${inviteId}/respond`, { action });
      fetchInvites(); // refresh list
    } catch (err) {
      alert("Failed to update invitation");
    }
  };

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="invites-container">
      <h2 className="page-title">Group Invitations</h2>

      {invites.length === 0 && (
        <p className="empty-text">No pending invitations 🎉</p>
      )}

      <div className="invite-list">
        {invites.map((inv) => (
          <div className="invite-card" key={inv._id}>
            <div className="invite-info">
              <h4>{inv.group.name}</h4>
              <p>
                Invited by <strong>{inv.fromUser.name}</strong>
              </p>
            </div>

            <div className="invite-actions">
              <button
                className="accept-btn"
                onClick={() =>
                  respondInvite(inv._id, "accept")
                }
              >
                Accept
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  respondInvite(inv._id, "reject")
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invitations;
