let currentModal = 'add';
let currentEditingEventId = null;

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',

        eventClick: function (info) {
            const eventId = info.event.id;
            showEditDeleteOptions(eventId, info.event);
        },
    });
    calendar.render();

    function fetchTasks() {
        fetch('http://localhost:3000/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                console.log("Tasks fetched:", tasks);
                tasks.forEach(task => {
                    calendar.addEvent({
                        id: task._id,
                        title: task.description,
                        start: new Date(task.startDate),
                        end: new Date(task.endDate) || new Date(task.startDate),  // Use start as end if end is not provided
                    });
                });
            })
            .catch(err => console.error('Error fetching tasks:', err));
    }

    // Fetch tasks when the application loads
    fetchTasks();

    // Function to show the modal with edit and delete options
    function showEditDeleteOptions(eventId, event) {
        document.getElementById('eventDesc').textContent = event.title;
        const modal = document.getElementById('eventModal');
        modal.style.display = 'block';

        document.getElementById('editEvent').onclick = function () {
            editEvent(eventId, event);
        };

        document.getElementById('deleteEvent').onclick = function () {
            deleteEvent(eventId, event);
        };
    }

    // Function to edit a task
    function editEvent(eventId, event) {
        document.getElementById('task-input').value = event.title;
        document.getElementById('task-date').value = event.start.toISOString().substring(0, 10);
        document.getElementById('task-time').value = event.start.toISOString().substring(11, 16);
        if (event.end) {
            document.getElementById('end-date-section').style.display = 'block';
            document.getElementById('task-end-date').value = event.end.toISOString().substring(0, 10);
        } else {
            document.getElementById('end-date-section').style.display = 'none';
        }
        document.getElementById('add-task').textContent = 'Save Changes';
        currentMode = 'edit';
        currentEditingEventId = eventId;
        document.getElementById('eventModal').style.display = 'none';
    }

    // Function to delete a task
    function deleteEvent(eventId, event) {
        const isConfirmed = confirm("Are you sure you want to delete this task?");
        if (isConfirmed) {
            // Make a fetch DELETE request to your backend
            fetch(`http://localhost:3000/api/tasks/${eventId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        event.remove();
                        // Hide the modal if visible
                        document.getElementById('eventModal').style.display = 'none';
                    }
                })
                .catch(err => console.error('Error deleting task:', err));
        }
    }

    document.getElementById('add-end-date-btn').addEventListener('click', function () {
        document.getElementById('end-date-section').style.display = 'block';
        this.style.display = 'none';
    });

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted');

        const newTask = {
            description: document.getElementById('task-input').value,
            startDate: document.getElementById('task-date').value + 'T' + document.getElementById('task-time').value,
            endDate: document.getElementById('task-end-date').value,
        };

        if (currentMode === 'add') {
            // Post the new task to the backend
            fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask)
            })
                .then(response => response.json())
                .then(task => {
                    calendar.addEvent({
                        id: task._id,
                        title: task.description,
                        start: task.startDate,
                        end: task.endDate || task.startDate,
                    });

                    // Reset the form
                    document.getElementById('task-form').reset();
                    document.getElementById('end-date-section').style.display = 'none';
                    document.getElementById('add-end-date-btn').style.display = 'block';
                    currentEditingEventId = null;
                    currentMode = 'add';
                })
                .catch(err => console.error('Error creating task:', err));
        } else if (currentMode === 'edit' && currentEditingEventId) {
            // Update the task in the backend
            fetch(`http://localhost:3000/api/tasks/${currentEditingEventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask)
            })
                .then(response => response.json())
                .then(task => {
                    const event = calendar.getEventById(currentEditingEventId);
                    event.setProp('title', task.description);
                    event.setStart(task.startDate);
                    event.setEnd(task.endDate || task.startDate);

                    // Reset the form
                    document.getElementById('task-form').reset();
                    document.getElementById('end-date-section').style.display = 'none';
                    document.getElementById('add-end-date-btn').style.display = 'block';
                    currentEditingEventId = null;
                    currentMode = 'add';
                })
                .catch(err => console.error('Error updating task:', err));
        }
    });
});
