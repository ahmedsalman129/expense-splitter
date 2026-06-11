import React, { useState } from "react";

function App() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const createGroup = async () => {
    if (!groupName || !members) return;
    const response = await fetch("http://localhost:5000/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        members: members.split(",").map(m => m.trim())
      })
    });
    const newGroup = await response.json();
    setGroups([...groups, newGroup]);
    setGroupName("");
    setMembers("");
  };

  const addExpense = async () => {
    if (!description || !amount || !paidBy) return;
    const response = await fetch(`http://localhost:5000/groups/${selectedGroup.id}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount: parseFloat(amount), paidBy })
    });
    const newExpense = await response.json();
    const updatedGroup = {
      ...selectedGroup,
      expenses: [...selectedGroup.expenses, newExpense]
    };
    setSelectedGroup(updatedGroup);
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setDescription("");
    setAmount("");
    setPaidBy("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Expense Splitter</h1>

      {!selectedGroup && (
        <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2>Create a Group</h2>
          <input
            placeholder="Group name (e.g. Trip to Lahore)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <input
            placeholder="Members (comma separated: Ahmed, Ali, Sara)"
            value={members}
            onChange={e => setMembers(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <button
            onClick={createGroup}
            style={{ background: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Create Group
          </button>
        </div>
      )}

      <div>
        {selectedGroup ? (
          <div>
            <button
              onClick={() => setSelectedGroup(null)}
              style={{ marginBottom: "15px", padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ddd" }}>
              Back to Groups
            </button>
            <h2>{selectedGroup.name}</h2>
            <p>Members: {selectedGroup.members.join(", ")}</p>

            <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
              <h3>Add Expense</h3>
              <input
                placeholder="Description (e.g. Dinner)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
              />
              <input
                placeholder="Amount (e.g. 3000)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
              />
              <select
                value={paidBy}
                onChange={e => setPaidBy(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}>
                <option value="">Who paid?</option>
                {selectedGroup.members.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
              <button
                onClick={addExpense}
                style={{ background: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Add Expense
              </button>
            </div>

            <h3>Expenses</h3>
            {selectedGroup.expenses.length === 0 && <p style={{ color: "#888" }}>No expenses yet.</p>}
            {selectedGroup.expenses.map(expense => (
              <div key={expense.id} style={{ background: "#fff", border: "1px solid #ddd", padding: "12px", borderRadius: "8px", marginBottom: "8px" }}>
                <strong>{expense.description}</strong>
                <p>Amount: {expense.amount}</p>
                <p>Paid by: {expense.paidBy}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2>Your Groups</h2>
            {groups.length === 0 && <p style={{ color: "#888" }}>No groups yet. Create one above!</p>}
            {groups.map(group => (
              <div key={group.id}
                onClick={() => setSelectedGroup(group)}
                style={{ background: "#fff", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" }}>
                <h3>{group.name}</h3>
                <p>Members: {group.members.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
