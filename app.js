//Variables
const taskForm = document.forms["taskForm"];
const taskList = document.getElementById("tasks");
const tasksKeyTitle = "title";
const tasksKeyDescription = "desc";
const tasksKeyDate = "date";
const tasksKeyID = "id";
const tasksKeyComplete = "complete";
const verTodosCB = document.getElementById("Vtodos");

eventListener();

function eventListener(){
    //Agregar tareas
    taskForm.addEventListener("submit", addTask);

    //Cuando la página termine de cargar
    document.addEventListener("DOMContentLoaded", showTasks);

    //Borrar tareas
    taskList.addEventListener("click", removeTask);

    //Mostrar tareas completas
    verTodosCB.addEventListener("change", showFinished);
}

//Funciones

//Agregar tareas
function addTask(e){
    //Detener el envío de formulario
    e.preventDefault();
    e.stopPropagation();

    //Obtener el texto de la tarea
    const title = taskForm["title"].value;
    const desc = taskForm["desc"].value;
    const date = taskForm["date"].value;

    //Crear el nuevo elemento
    const newTask = document.createElement("div");

    //Tomar el tiempo en milisegundos para crear una id única
    var timeID = new Date().valueOf();

    //Añadir estilo y contenido
    newTask.className = "row bg-secondary";
    newTask.setAttribute("id", timeID.toString());
    newTask.innerHTML = 
    `<div class="border-top" style="margin: 1em; padding: 0.5em; width: 100%;">
        <h5>${title}</h5>
        <div style="width: 100%; text-align: right; font-size: 0.8em; color: var(--color-secondary-darker);"> <i>${date}</i> </div>
        <p>${desc}</p>
        <div style="width: 100%; text-align: right;">
            <input type="checkbox" name="Completada" id="${timeID.toString()}check">
            <label for="Completada">Completada</label>
        </div>
    </div>`;

    //Se añade a la lista de tareas
    taskList.appendChild(newTask);

    // console.log(title);
    // console.log(date);
    // console.log(desc);

    saveTask(title, desc, date.toString(), timeID.toString(), "0");

    let completadoCheck = document.getElementById(timeID.toString().concat("check"));
    completadoCheck.addEventListener('change', function() {
        let taskComp = document.getElementById(timeID.toString());
        if (this.checked) {
            taskComp.classList.remove("bg-secondary");
            taskComp.classList.add("bg-success-pastel");
            saveTaskComplete(timeID.toString(), "1");
            taskComp.classList.add("toHide");
            if(verTodosCB.checked === false){
                taskComp.classList.add("hide");
                taskComp.classList.remove("toHide");
            }
        } else {
            taskComp.classList.add("bg-secondary");
            taskComp.classList.remove("bg-success-pastel");
            saveTaskComplete(timeID.toString(), "0");
            taskComp.classList.remove("hide");
            taskComp.classList.remove("toHide");
        }
    });
}

//Guardar tarea en Local Storage
function saveTask(title, desc, date, timeID, complete){
    saveTaskPart(tasksKeyTitle,title);
    saveTaskPart(tasksKeyDate,date);
    saveTaskPart(tasksKeyDescription,desc);
    saveTaskPart(tasksKeyID,timeID);
    saveTaskPart(tasksKeyComplete,complete);
}

//Guardar una parte de una tarea en Local Storage
function saveTaskPart(tasksKey, taskPart){
    let taskList = getTaskPart(tasksKey);

    // console.log(taskPart);

    //Se añade a la lista de tareas
    taskList.push(taskPart);

    //Guardar en LS
    localStorage.setItem(tasksKey, JSON.stringify(taskList));
}

//Obtiene parte de las tareas de local storage
function getTaskPart(tasksKey){
    //Obtiene los datos de LS
    let tasks = localStorage.getItem(tasksKey);

    //Verifica si existe almenos un task
    if(tasks === null || tasks=== "") {
        tasks = [];
    }
    else{
        tasks = JSON.parse(tasks);
    }

    // console.log(tasks);
    return tasks;
}

//Actualiza estado de completado en LS
function saveTaskComplete(id, value){
    let idList = getTaskPart(tasksKeyID);
    var index = idList.findIndex(function(item){
        return item === id   
    });
    let tcList = getTaskPart(tasksKeyComplete);
    tcList[index] = value;
    localStorage.setItem(tasksKeyComplete, JSON.stringify(tcList));
}

//Muestra las tareas guardados
function showTasks(){
    let titles = getTaskPart(tasksKeyTitle);
    let dates = getTaskPart(tasksKeyDate);
    let descs = getTaskPart(tasksKeyDescription);
    let timeIDs = getTaskPart(tasksKeyID);

    let date;
    let desc;
    let timeID;

    var i = 0;

    titles.forEach(title => {
        //Get current date and description according to the index
        date = dates[i];
        desc = descs[i];
        timeID = timeIDs[i];

        //Crear el nuevo elemento
        const newTask = document.createElement("div");

        //Añadir estilo y contenido
        newTask.className = "row bg-secondary";
        newTask.setAttribute("id", timeID);
        newTask.innerHTML = 
        `<div class="border-top" style="margin: 1em; padding: 0.5em; width: 100%;">
            <h5>${title}</h5>
            <div style="width: 100%; text-align: right; font-size: 0.8em; color: var(--color-secondary-darker);"> <i>${date}</i> </div>
            <p>${desc}</p>
            <div style="width: 100%; text-align: right;">
                <input type="checkbox" name="Completada" id="${timeID}check">
                <label for="Completada">Completada</label>
            </div>
        </div>`;

        //Se añade a la lista de tasks
        taskList.appendChild(newTask);

        let completadoCheckList = [];
        
        console.log(i);
        let completadoCheck = document.getElementById(timeID.concat("check"));
        console.log(completadoCheck);
        completadoCheckList.push(completadoCheck);
        console.log(completadoCheckList);
        completadoCheckList[0].addEventListener('change', function() {
            let taskComp = document.getElementById(timeID);
            if (this.checked) {
                taskComp.classList.remove("bg-secondary");
                taskComp.classList.add("bg-success-pastel");
                saveTaskComplete(timeID, "1");
                taskComp.classList.add("toHide");
                if(verTodosCB.checked === false){
                    taskComp.classList.add("hide");
                    taskComp.classList.remove("toHide");
                }
            } else {    
                taskComp.classList.add("bg-secondary");
                taskComp.classList.remove("bg-success-pastel");;
                saveTaskComplete(timeID, "0");
                taskComp.classList.remove("hide");
                taskComp.classList.remove("toHide");
            }
        });
        i = i+1;
    })
}

function showFinished(e){
    if (this.checked) {
        var tList = document.getElementsByClassName("hide");
        while (tList.length){
            var i = 0;
            tList[i].classList.remove("hide");
            tList[i].classList.add("toHide");
            i = i+1;
        }
    } else {
        var tList = document.getElementsByClassName("hide");
        while (tList.length){
            var i = 0;
            tList[i].classList.add("hide");
            tList[i].classList.remove("toHide");
            i = i+1;
        }
    }
}

//Borrar la tarea
function removeTask(e){
    //Comparar que el click sea sobre el botón
    if(e.target.className.includes("button-close")){
        //Obtener todo el DIV del task
        var item = e.target.parentElement.parentElement;

        //obtener texto de tarea
        var task = item.innerText.substring(0, item.innerText.length    - 2);

        //Elimina de LocalStorage
        removeTaskLS(task);

        //Eliminar del DOM
        item.remove();
    }
}

function removeTaskLS(task){
    let tasks = getTasks();

    // tasks = tasks.filter(t => t !== task);

    for (var i = 0; i < tasks.length; i++){
        if(tasks[i] === task){
            tasks.splice(i, 1);
            break;
        }
    }

    localStorage.setItem(tasksKey, JSON.stringify(tasks));
}