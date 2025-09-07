 let tasks = [];
let editingId = null;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}

function renderTasks() {
    const pendingList = document.getElementById('pending-tasks');
    const completedList = document.getElementById('completed-tasks');
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';

        if (editingId === task.id) {
            // Edit mode
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = task.text;
            editInput.className = 'edit-input';
            li.appendChild(editInput);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    task.text = newText;
                    editingId = null;
                    renderTasks();
                }
            };
            li.appendChild(saveBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => {
                editingId = null;
                renderTasks();
            };
            li.appendChild(cancelBtn);
        } else {
            const span = document.createElement('span');
            span.textContent = task.text;
            if (task.completed) span.className = 'completed';
            li.appendChild(span);

            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = `Added: ${formatDate(task.addedAt)}`;
            li.appendChild(timestamp);

            if (task.completed) {
                const completedTime = document.createElement('span');
                completedTime.className = 'timestamp';
                completedTime.textContent = ` | Completed: ${formatDate(task.completedAt)}`;
                li.appendChild(completedTime);
            }

            const actions = document.createElement('span');
            actions.className = 'actions';

            if (!task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.textContent = 'Complete';
                completeBtn.onclick = () => {
                    task.completed = true;
                    task.completedAt = new Date().toISOString();
                    renderTasks();
                };
                actions.appendChild(completeBtn);
            }

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                editingId = task.id;
                renderTasks();
            };
            actions.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
            };
            actions.appendChild(deleteBtn);

            li.appendChild(actions);
        }

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });
}

document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (text) {
        tasks.push({
            id: Date.now(),
            text,
            completed: false,
            addedAt: new Date().toISOString(),
            completedAt: null
        });
        input.value = '';
        renderTasks();
    }
});