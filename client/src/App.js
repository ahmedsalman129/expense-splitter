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
    const response = await fetch("https://expense-splitter-production-3398.up.railway.app/groups", {
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
    const response = await fetch(`https://expense-splitter-production-3398.up.railway.app/groups/${selectedGroup.id}/expenses`, {
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

  const calculateDebts = () => {
    const totalExpenses = selectedGroup.expenses.reduce((sum, e) => sum + e.amount, 0);
    const fairShare = totalExpenses / selectedGroup.members.length;
    const balances = {};
    selectedGroup.members.forEach(member => { balances[member] = 0; });
    selectedGroup.expenses.forEach(expense => { balances[expense.paidBy] += expense.amount; });
    selectedGroup.members.forEach(member => { balances[member] -= fairShare; });
    const debts = [];
    const debtors = Object.keys(balances).filter(m => balances[m] < 0);
    const creditors = Object.keys(balances).filter(m => balances[m] > 0);
    debtors.forEach(debtor => {
      creditors.forEach(creditor => {
        if (balances[debtor] < 0 && balances[creditor] > 0) {
          const amount = Math.min(Math.abs(balances[debtor]), balances[creditor]);
          debts.push({ from: debtor, to: creditor, amount: Math.round(amount) });
          balances[debtor] += amount;
          balances[creditor] -= amount;
        }
      });
    });
    return debts;
  };

  const styles = {
    app: { maxWidth: "620px", margin: "40px auto", fontFamily: "'Segoe UI', sans-serif", padding: "0 16px", color: "#1a1a1a" },
    header: { fontSize: "28px", fontWeight: "700", marginBottom: "24px", color: "#2563eb" },
    card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    label: { fontSize: "13px", fontWeight: "500", color: "#6b7280", marginBottom: "16px", display: "block" },
    input: { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", outline: "none" },
    select: { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", background: "#fff" },
    btnGreen: { background: "#16a34a", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
    btnGray: { background: "#f3f4f6", color: "#374151", padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", cursor: "pointer", marginBottom: "20px" },
    groupCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" },
    groupName: { fontSize: "16px", fontWeight: "600", margin: "0 0 4px", color: "#111827" },
    groupMembers: { fontSize: "13px", color: "#6b7280", margin: "0" },
    sectionTitle: { fontSize: "16px", fontWeight: "600", margin: "0 0 12px", color: "#111827" },
    expenseCard: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px 16px", marginBottom: "8px" },
    expenseDesc: { fontWeight: "600", fontSize: "14px", margin: "0 0 4px" },
    expenseMeta: { fontSize: "13px", color: "#6b7280", margin: "2px 0" },
    debtCard: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginTop: "20px" },
    debtRow: { display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #bfdbfe", fontSize: "14px" },
    badge: { background: "#2563eb", color: "#fff", borderRadius: "6px", padding: "2px 8px", fontSize: "12px", fontWeight: "500", margin: "0 4px" },
    emptyText: { color: "#9ca3af", fontSize: "14px" },
    pageTitle: { fontSize: "20px", fontWeight: "600", margin: "0 0 16px", color: "#111827" },
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>SplitEasy</h1>

      {!selectedGroup && (
        <div style={styles.card}>
          <h2 style={styles.pageTitle}>Create a Group</h2>
          <input
            style={styles.input}
            placeholder="Group name (e.g. Trip to Lahore)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Members — comma separated (Ahmed, Ali, Sara)"
            value={members}
            onChange={e => setMembers(e.target.value)}
          />
          <button style={styles.btnGreen} onClick={createGroup}>Create Group</button>
        </div>
      )}

      {!selectedGroup && (
        <div>
          <h2 style={styles.pageTitle}>Your Groups</h2>
          {groups.length === 0 && <p style={styles.emptyText}>No groups yet. Create one above!</p>}
          {groups.map(group => (
            <div key={group.id} style={styles.groupCard} onClick={() => setSelectedGroup(group)}>
              <p style={styles.groupName}>{group.name}</p>
              <p style={styles.groupMembers}>{group.members.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <div>
          <button style={styles.btnGray} onClick={() => setSelectedGroup(null)}>Back to Groups</button>

          <div style={styles.card}>
            <h2 style={styles.pageTitle}>{selectedGroup.name}</h2>
            <p style={styles.groupMembers}>Members: {selectedGroup.members.join(", ")}</p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Add Expense</h3>
            <input
              style={styles.input}
              placeholder="Description (e.g. Dinner)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Amount in PKR (e.g. 3000)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <select style={styles.select} value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              <option value="">Who paid?</option>
              {selectedGroup.members.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
            <button style={styles.btnGreen} onClick={addExpense}>Add Expense</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Expenses</h3>
            {selectedGroup.expenses.length === 0 && <p style={styles.emptyText}>No expenses yet.</p>}
            {selectedGroup.expenses.map(expense => (
              <div key={expense.id} style={styles.expenseCard}>
                <p style={styles.expenseDesc}>{expense.description}</p>
                <p style={styles.expenseMeta}>PKR {expense.amount}</p>
                <p style={styles.expenseMeta}>Paid by {expense.paidBy}</p>
              </div>
            ))}
          </div>

          {selectedGroup.expenses.length > 0 && (
            <div style={styles.debtCard}>
              <h3 style={styles.sectionTitle}>Who owes who?</h3>
              {calculateDebts().length === 0 && <p style={styles.emptyText}>Everyone is settled up!</p>}
              {calculateDebts().map((debt, index) => (
                <div key={index} style={styles.debtRow}>
                  <span style={styles.badge}>{debt.from}</span>
                  owes
                  <span style={styles.badge}>{debt.to}</span>
                  <strong style={{ marginLeft: "auto" }}>PKR {debt.amount}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

