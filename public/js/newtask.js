const newtaskFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('input[name="task-title"]').value;
    const description = document.querySelector('input[name="task-description"]').value; 
    const status = document.querySelector('textarea[name="task-status"]').value;

    const response = await fetch('/api/task', {
        method: 'task',
        body: JSON.stringify({
            title,
            description,
            status
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert('Something wrong!');
    }
};

document.querySelector('#newtask').addEventListener('submit', newtaskFormHandler);