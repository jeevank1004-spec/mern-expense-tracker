import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import AddMemberModal from "../components/AddMemberModal";
import "/src/includes/GroupDetails.css";

const GroupDetails = () => {
  const { groupId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // add expense modal
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // add member modal
  const [showAddMember, setShowAddMember] = useState(false);

  // summary
  const [summary, setSummary] = useState({
    totalApproved: 0,
    perPerson: 0,
    pendingForMe: 0,
  });

  // approved / pending popup
  const [showListModal, setShowListModal] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [listUsers, setListUsers] = useState([]);

  // current user
  const token = localStorage.getItem("token");
  const currentUser = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const openUserList = (title, users) => {
    setListTitle(title);
    setListUsers(users);
    setShowListModal(true);
  };

  const calculateSummary = (data) => {
    if (!currentUser) return;

    const fullyApproved = data.filter(
      (e) => e.pendingApproval.length === 0
    );

    const totalApproved = fullyApproved.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    const members = new Set();
    data.forEach((e) =>
      e.approvedBy.forEach((u) => members.add(u._id))
    );

    const perPerson =
      members.size > 0 ? Math.round(totalApproved / members.size) : 0;

    const pendingForMe = data.filter((e) =>
      e.pendingApproval.some((u) => u._id === currentUser.id)
    ).length;

    setSummary({ totalApproved, perPerson, pendingForMe });
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses/${groupId}`);
      setExpenses(res.data);
      calculateSummary(res.data);
    } catch {
      console.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  const addExpense = async () => {
    if (!amount || !note || !date) {
      setError("All fields are required");
      return;
    }

    try {
      setSaving(true);
      await api.post(`/expenses/${groupId}`, {
        title: note,
        amount,
        date,
      });

      setShowModal(false);
      setAmount("");
      setNote("");
      setDate("");
      fetchExpenses();
    } catch {
      setError("Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  const approveExpense = async (expenseId) => {
    try {
      await api.post(`/expenses/approve/${expenseId}`);
      fetchExpenses();
    } catch {
      alert("Approval failed");
    }
  };

  if (loading) return <p>Loading expenses...</p>;

  return (
    <div className="group-details">
      {/* HEADER */}
      <div className="group-header">
        <h2>Group Expenses</h2>

        <div className="header-actions">
          <button onClick={() => setShowAddMember(true)}>
            + Add Member
          </button>
          <button onClick={() => setShowModal(true)}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="group-summary">
        <div>
          <span>Total Approved</span>
          <strong>₹{summary.totalApproved}</strong>
        </div>

        <div>
          <span>Per Person</span>
          <strong>₹{summary.perPerson}</strong>
        </div>

        <div className="pending-box">
          Pending for you: {summary.pendingForMe}
        </div>
      </div>

      {/* EXPENSE LIST */}
      <div className="expense-list">
        {expenses.map((exp) => {
          const canApprove =
            currentUser &&
            exp.pendingApproval.some(
              (u) => u._id === currentUser.id
            );

          return (
            <div className="expense-card" key={exp._id}>
              <div className="expense-top">
                <h4>{exp.note}</h4>
                <span className="amount">₹{exp.amount}</span>
              </div>

              <p className="meta">
                Added by <strong>{exp.addedBy.name}</strong> ·{" "}
                {new Date(exp.expenseDate).toLocaleDateString()}
              </p>

              <div className="status-row">
                <div>
                  ⏳ Pending ({exp.pendingApproval.length})
                  <button
                    className="view-btn"
                    onClick={() =>
                      openUserList(
                        "Pending Approvals",
                        exp.pendingApproval
                      )
                    }
                  >
                    View
                  </button>
                </div>

                <div>
                  ✅ Approved ({exp.approvedBy.length})
                  <button
                    className="view-btn"
                    onClick={() =>
                      openUserList(
                        "Approved By",
                        exp.approvedBy
                      )
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              {canApprove && (
                <button
                  className="approve-btn"
                  onClick={() => approveExpense(exp._id)}
                >
                  Approve Expense
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD EXPENSE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Expense</h3>

            {error && <p className="error-box">{error}</p>}

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button onClick={addExpense} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMember && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {/* APPROVED / PENDING LIST MODAL */}
      {showListModal && (
        <div className="modal-overlay">
          <div className="modal-card small">
            <h3>{listTitle}</h3>

            {listUsers.length === 0 ? (
              <p className="empty-text">No users</p>
            ) : (
              <ul className="user-list">
                {listUsers.map((u) => (
                  <li key={u._id}>
                    <span className="avatar">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                    {u.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowListModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
