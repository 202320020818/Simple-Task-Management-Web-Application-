const API_URL = 'http://localhost:5000/api/tasks';
const form = document.querySelector('#taskForm');
const taskList = document.querySelector('#taskList');
const formError = document.querySelector('#formError');
const taskCount = document.querySelector('#taskCount');
const completedCount = document.querySelector('#completedCount');
const fields = ['title', 'description', 'priority', 'dueDate', 'status'];

const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
const escapeHTML = (value) => value.replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));

async function request(url = API_URL, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.errors?.join(' ') || data.message || 'Unable to complete this action.'); }
  return response.status === 204 ? null : response.json();
}

async function loadTasks() {
  const query = new URLSearchParams();
  if (priorityFilter.value) query.set('priority', priorityFilter.value);
  if (statusFilter.value) query.set('status', statusFilter.value);
  try {
    const tasks = await request(`${API_URL}${query.size ? `?${query}` : ''}`);
    renderTasks(tasks);
    const allTasks = await request(API_URL);
    completedCount.textContent = allTasks.filter(task => task.status === 'Completed').length;
  } catch (error) { taskList.innerHTML = `<div class="empty-state"><strong>Could not load tasks</strong>${escapeHTML(error.message)}</div>`; taskCount.textContent = 'Connection problem'; }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'} shown`;
  if (!tasks.length) { taskList.innerHTML = '<div class="empty-state"><strong>No tasks found</strong>Create a task or change the filters.</div>'; return; }
  const template = document.querySelector('#taskTemplate');
  tasks.forEach(task => {
    const item = template.content.cloneNode(true);
    item.querySelector('h3').textContent = task.title;
    item.querySelector('.task-description').textContent = task.description;
    const priority = item.querySelector('.priority-badge'); priority.textContent = task.priority; priority.classList.add(task.priority.toLowerCase());
    item.querySelector('.due-date').textContent = `Due ${formatDate(task.dueDate)}`;
    item.querySelector('.created-date').textContent = `Added ${formatDate(task.createdAt)}`;
    const status = item.querySelector('.status-select'); status.value = task.status;
    status.addEventListener('change', async () => { try { await request(`${API_URL}/${task._id}/status`, { method:'PATCH', body:JSON.stringify({ status:status.value }) }); loadTasks(); } catch (error) { alert(error.message); } });
    item.querySelector('.edit-button').addEventListener('click', () => startEdit(task));
    item.querySelector('.delete-button').addEventListener('click', async () => { if (!confirm(`Delete “${task.title}”?`)) return; try { await request(`${API_URL}/${task._id}`, { method:'DELETE' }); loadTasks(); } catch (error) { alert(error.message); } });
    taskList.append(item);
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault(); formError.textContent = '';
  const payload = Object.fromEntries(fields.map(name => [name, document.querySelector(`#${name}`).value.trim()]));
  if (!payload.title || !payload.description || !payload.priority || !payload.dueDate) { formError.textContent = 'Please fill in every required field.'; return; }
  const id = taskId.value;
  try { await request(id ? `${API_URL}/${id}` : API_URL, { method:id ? 'PUT' : 'POST', body:JSON.stringify(payload) }); resetForm(); loadTasks(); } catch (error) { formError.textContent = error.message; }
});

function startEdit(task) { fields.forEach(name => document.querySelector(`#${name}`).value = name === 'dueDate' ? task.dueDate.slice(0, 10) : task[name]); taskId.value = task._id; formHeading.textContent = 'Edit task'; submitButton.innerHTML = 'Save changes <span>→</span>'; cancelEdit.classList.remove('hidden'); window.scrollTo({ top:0, behavior:'smooth' }); }
function resetForm() { form.reset(); taskId.value = ''; formHeading.textContent = 'Add a task'; submitButton.innerHTML = 'Add task <span>→</span>'; cancelEdit.classList.add('hidden'); formError.textContent = ''; }
cancelEdit.addEventListener('click', resetForm);
priorityFilter.addEventListener('change', loadTasks); statusFilter.addEventListener('change', loadTasks);
loadTasks();
