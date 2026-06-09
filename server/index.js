const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Store expenses in memory for now
let expenses = [];
let groups = [];

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Expense Splitter API is running!' });
});

// Get all groups
app.get('/groups', (req, res) => {
  res.json(groups);
});

// Create a group
app.post('/groups', (req, res) => {
  const { name, members } = req.body;
  const group = { id: Date.now(), name, members, expenses: [] };
  groups.push(group);
  res.json(group);
});

// Add expense to a group
app.post('/groups/:id/expenses', (req, res) => {
  const { amount, description, paidBy } = req.body;
  const group = groups.find(g => g.id === parseInt(req.params.id));
  if (!group) return res.status(404).json({ error: 'Group not found' });
  const expense = { id: Date.now(), amount, description, paidBy };
  group.expenses.push(expense);
  res.json(expense);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});