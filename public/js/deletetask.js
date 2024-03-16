const delButton = document.getElementById('#del-task-btn');
const taskId = document.querySelector('input[name="task-id"]').value;

const deleteHandler = async () => {
    const response = await fetch(`/api/task/${taskId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
    document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

if(delButton!=null){
    delButton.addEventListener('click', deleteHandler);
}