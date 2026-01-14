import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "/src/includes/Groups.css";

const Groups = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const addGroup = () => {
    navigate(`/add_group`);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/groups");
        setGroups(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load groups");
        }
      } finally {
        setLoading(false);
      }
    };


    fetchGroups();
  }, []);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="groups-page">   {/* 👈 NEW */}
    <div className="groups-container">
      <div className="groups-header">
        <h2 className="page-title">My Groups</h2>
        <button onClick={addGroup}>+ Add Group</button>
      </div>

      {groups.length === 0 && (
        <p>No groups yet. Create your first group.</p>
      )}

      <div className="group-list">
        {groups.map((group) => (
          <div
            className="group-card"
            key={group._id}
            onClick={() => openGroup(group._id)}
          >
            <div className="group-left">
              <div className="group-avatar">
                {group.name.charAt(0).toUpperCase()}
              </div>

              <div className="group-info">
                <h4>{group.name}</h4>
                <p>
                  Created on{" "}
                  {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default Groups;
