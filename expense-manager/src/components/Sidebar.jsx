import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "/src/includes/Sidebar.css";

const Sidebar = ({ open = true, onClose = () => {} }) => {
  const [inviteCount, setInviteCount] = useState(0);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get("/invites");
        setInviteCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch invites");
      }
    };

    fetchInvites();
  }, []);

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      {/* MOBILE CLOSE BUTTON (safe even on desktop) */}
      <div className="sidebar-close" onClick={onClose}>
        ✕
      </div>

      <div className="sidebar-header">
        💰 <span>ExpenseApp</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/profile" className="menu-item" onClick={onClose}>
          👤 My Profile
        </NavLink>

        <NavLink to="/expenses" className="menu-item" onClick={onClose}>
          📊 My Expenses
        </NavLink>

        <NavLink to="/groups" className="menu-item" onClick={onClose}>
          👥 Groups
        </NavLink>

        <NavLink
          to="/invites"
          className="menu-item invites-item"
          onClick={onClose}
        >
          📩 Invitations
          {inviteCount > 0 && (
            <span className="invite-badge">{inviteCount}</span>
          )}
        </NavLink>

        <NavLink to="/logout" className="menu-item logout">
          🚪 Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
