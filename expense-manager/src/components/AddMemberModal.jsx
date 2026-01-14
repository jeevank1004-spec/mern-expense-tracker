import { useEffect, useState } from "react";
import { searchUsers } from "../api/user.api";
import { sendGroupInvite } from "../api/group.api";

const AddMemberModal = ({ groupId, onClose }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ✅ minimum 3 characters
    if (query.length < 3) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchUsers(query);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // ✅ debounce

    return () => clearTimeout(timer);
  }, [query]);

  const inviteUser = async (userId) => {
    try {
      await sendGroupInvite(groupId, userId);
      setMessage("Invite sent ✅");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send invite"
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Member</h3>

        {message && <p>{message}</p>}

        <input
          placeholder="Type name or email (min 3 chars)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Searching...</p>}

        <ul>
          {users.map((u) => (
            <li key={u._id} style={{ marginTop: 8 }}>
              {u.name} ({u.email})
              <button
                style={{ marginLeft: 10 }}
                onClick={() => inviteUser(u._id)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onClose} style={{ marginTop: 15 }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddMemberModal;
