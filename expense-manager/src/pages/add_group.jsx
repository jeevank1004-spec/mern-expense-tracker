import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "/src/includes/Login.css"; // reuse same card UI

const AddGroup = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/groups", {
        name: groupName,
      });

      navigate("/groups"); // go back to groups list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Create Group 👥</h2>
        <p className="subtitle">Create a new expense group</p>

        {error && <div className="error-box">{error}</div>}

        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
};

export default AddGroup;
