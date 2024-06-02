document.addEventListener("DOMContentLoaded", function() {
    const tareasDiv = document.getElementById('tareas');
    const taskForm = document.getElementById('taskForm');
    const filterForm = document.getElementById('filterForm');
    const taskIdInput = document.getElementById('taskId');
    const tituloTareaInput = document.getElementById('tituloTarea');
    const descripcionTareaInput = document.getElementById('descripcionTarea');
    const fechaEstimadaFinalizacionInput = document.getElementById('fechaEstimadaFinalizacion');
    const responsableTareaInput = document.getElementById('responsableTarea');
    const prioridadTareaInput = document.getElementById('prioridadTarea');
    const estadoTareaInput = document.getElementById('estadoTarea');
    const observacionesTareaInput = document.getElementById('observacionesTarea');
    const cancelButton = document.getElementById('cancelButton');

    function fetchTareas(filters = {}) {
        let url = new URL('http://127.0.0.1:8000/api/tareas');
        Object.keys(filters).forEach(key => url.searchParams.append(key, filters[key]));

        fetch(url)
            .then(response => response.json())
            .then(tareas => {
                tareasDiv.innerHTML = '';
                tareas.forEach(tarea => {
                    const tareaDiv = document.createElement('div');
                    tareaDiv.classList.add('tarea');
                    tareaDiv.innerHTML = `
                        <h3>${tarea.titulo}</h3>
                        <p>Descripción: ${tarea.descripcion}</p>
                        <p>Responsable: ${tarea.responsable}</p>
                        <p>Prioridad: ${tarea.prioridad}</p>
                        <p>Estado: ${tarea.estado}</p>
                        <p>Fecha estimada de finalización: ${tarea.fechaEstimadaFinalizacion}</p>
                        <p>Observaciones: ${tarea.observaciones}</p>
                        <button onclick="editTarea(${tarea.id})">Editar</button>
                        <button onclick="deleteTarea(${tarea.id})">Eliminar</button>
                    `;
                    if (tarea.estado === 'En impedimento') {
                        tareaDiv.style.backgroundColor = 'red';
                        tareaDiv.style.color = 'white';
                    }
                    tareasDiv.appendChild(tareaDiv);
                });
            })
            .catch(error => console.error('Error al obtener la lista de tareas:', error));
    }

    function resetForm() {
        taskIdInput.value = '';
        tituloTareaInput.value = '';
        descripcionTareaInput.value = '';
        fechaEstimadaFinalizacionInput.value = '';
        responsableTareaInput.value = '';
        prioridadTareaInput.value = '1';
        estadoTareaInput.value = '1';
        observacionesTareaInput.value = '';
        taskForm.querySelector('button[type="submit"]').textContent = 'Guardar';
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = taskIdInput.value;
        const titulo = tituloTareaInput.value;
        const descripcion = descripcionTareaInput.value;
        const fechaEstimadaFinalizacion = fechaEstimadaFinalizacionInput.value;
        const responsable = responsableTareaInput.value;
        const prioridad = prioridadTareaInput.value;
        const estado = estadoTareaInput.value;
        const observaciones = observacionesTareaInput.value;

        const data = { titulo, descripcion, fechaEstimadaFinalizacion, responsable, prioridad, estado, observaciones };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://127.0.0.1:8000/api/tareas/${id}` : 'http://127.0.0.1:8000/api/tareas';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            fetchTareas();
            resetForm();
        })
        .catch(error => console.error('Error al guardar la tarea:', error));
    });

    cancelButton.addEventListener('click', function() {
        resetForm();
    });

    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const filters = {
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaFin: document.getElementById('fechaFin').value,
            prioridad: document.getElementById('prioridad').value,
            responsable: document.getElementById('responsable').value,
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
        };

        fetchTareas(filters);
    });

    window.editTarea = function(id) {
        fetch(`http://127.0.0.1:8000/api/tareas/${id}`)
            .then(response => response.json())
            .then(tarea => {
                taskIdInput.value = tarea.id;
                tituloTareaInput.value = tarea.titulo;
                descripcionTareaInput.value = tarea.descripcion;
                fechaEstimadaFinalizacionInput.value = tarea.fechaEstimadaFinalizacion;
                responsableTareaInput.value = tarea.responsable;
                prioridadTareaInput.value = tarea.prioridad;
                estadoTareaInput.value = tarea.estado;
                observacionesTareaInput.value = tarea.observaciones;
                taskForm.querySelector('button[type="submit"]').textContent = 'Actualizar';
            })
            .catch(error => console.error('Error al obtener la tarea:', error));
    };

    window.deleteTarea = function(id) {
        fetch(`http://127.0.0.1:8000/api/tareas/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchTareas())
        .catch(error => console.error('Error al eliminar la tarea:', error));
    };

    fetchTareas();
});

