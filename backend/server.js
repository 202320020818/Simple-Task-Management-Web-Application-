require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedPriorities = ['Low', 'Medium', 'High'];
const allowedStatuses = ['Pending', 'In Progress', 'Completed'];

app.use(cors());
app.use(express.json());

function validateTask(body) {
  const errors = [];
  if (!body.title || !body.title.trim()) errors.push('Title is required.');
  if (!body.description || !body.description.trim()) errors.push('Description is required.');
  if (!allowedPriorities.includes(body.priority)) errors.push('Please select a valid priority.');
  if (!body.dueDate || Number.isNaN(new Date(body.dueDate).getTime())) errors.push('Please provide a valid due date.');
  if (body.status && !allowedStatuses.includes(body.status)) errors.push('Please select a valid status.');
  return errors;
}

app.get('/api/health', (req, res) => res.json({ message: 'Task Manager API is running.' }));

app.get('/api/tasks', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.priority && allowedPriorities.includes(req.query.priority)) filter.priority = req.query.priority;
    if (req.query.status && allowedStatuses.includes(req.query.status)) filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) { next(error); }
});

app.post('/api/tasks', async (req, res, next) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const task = await Task.create({ ...req.body, status: req.body.status || 'Pending' });
    res.status(201).json(task);
  } catch (error) { next(error); }
});

app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
});

app.patch('/api/tasks/:id/status', async (req, res, next) => {
  try {
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status.' });
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
});

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.status(204).send();
  } catch (error) { next(error); }
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid task id.' });
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
