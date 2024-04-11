document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
    });
    calendar.render();

    document.getElementById('add-end-date-btn').addEventListener('click', function () {
        document.getElementById('end-date-section').style.display = 'block';
        this.style.display = 'none';
    });

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted');

        const taskDescription = document.getElementById('task-input').value;
        const taskDate = document.getElementById('task-date').value;
        const taskEndDate = document.getElementById('task-end-date').value;
        const taskTime = document.getElementById('task-time').value;

        //console.log(taskDescription, taskDate, taskTime);

        let startDateTime = taskDate;
        if (taskTime) {
            startDateTime += "T" + taskTime;
        }

        const event = {
            title: taskDescription,
            start: startDateTime,
            end: taskEndDate,
        };
        //console.log('calendar: ', calendar)

        calendar.addEvent(event);

        document.getElementById('task-input').value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('task-end-date').value = '';
        document.getElementById('task-time').value = ''
        //document.getElementById('end-date-section').style.display = 'none';
    });
});