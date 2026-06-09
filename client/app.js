import React, { useState } from 'react';

function App() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');

  const createGroup = async () => {
    if (!groupName || !members) return;
    const response = await fetch('http://localhost:5000/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: groupName,
        members: members.split(',').map(m => m.trim())
      })
    });
    const newGroup = await response.json();
    setGroups([...groups, newGroup]);
    setGroupName('');
    setMembers('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>💸 Expense Splitter</h1>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Create a Group</h2>
        <input
          placeholder="Group name (e.g. Trip to Lahore)"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Members (comma separated: Ahmed, Ali, Sara)"
          value={members}
          onChange={e => setMembers(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <button
          onClick={createGroup}
          style={{ background: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Create Group
        </button>
      </div>

      <div>
        <h2>Your Groups</h2>
        {groups.length === 0 && <p style={{ color: '#888' }}>No groups yet. Create one above!</p>}
        {groups.map(group => (
          <div key={group.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
            <h3>{group.name}</h3>
            <p>Members: {group.members.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;