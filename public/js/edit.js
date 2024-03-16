const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

// Click on edit blog post
const editHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('input[name="task-title"]').value;
    const description = document.querySelector('input[name="task-description"]').value; 
    const status = document.querySelector('textarea[name="task-status"]').value;

    const response = await fetch(`/api/task/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            taskId: id,
            title,
            description,
            status,
        }),
        headers: {'Content-Type': 'application/json'},
    });
    if (response.ok) {
        document.location.replace('/homepage/');
    } else {
        alert("Something went wrong!");
    }
};

document.getElementById('edit-form').addEventListener('submit', editHandler);