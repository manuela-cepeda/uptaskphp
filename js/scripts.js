eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');



function eventListeners() {
    // document ready
    document.addEventListener('DOMContentLoaded', function() {

        actualizarProgreso();
    });

    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    // borrar proyecto con la cruz
    document.querySelector('.lista-proyectos').addEventListener('click', borrarProyecto);
    //doble click para editar proyecto
    document.querySelector('.lista-proyectos').addEventListener('dblclick', editarProyecto);
    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    //botones para las acciones de la tarea
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();
    if (document.querySelector('#nuevo-proyecto')) {
        listaProyectos.removeChild(nuevoProyecto);
    } else {
        //crea un input para el nombre del nuevo proyecto
        var nuevoProyecto = document.createElement('li');
        nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
        listaProyectos.appendChild(nuevoProyecto);

        //seleccionar el id con el nuevoProyecto
        var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
        //al presionar enter crea el proyecto
        inputNuevoProyecto.addEventListener('keypress', function(e) {
            var tecla = e.which; // tine que ser 13 para enter o tambien usar e.keyCode ('enter')
            if (tecla === 13) {
                guardarProyectoDB(inputNuevoProyecto.value);
                listaProyectos.removeChild(nuevoProyecto);

            }

        })
    }
}

function guardarProyectoDB(nombreProyecto) {

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //en la carga
    xhr.onload = function() {
            if (this.status === 200) {
                //obtener datos de la respuesta

                var respuesta = JSON.parse(xhr.responseText),
                    proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

                //comprobar la insercion
                if (resultado === 'correcto') {
                    if (tipo === 'crear') {
                        //se creo un nuevo proyecto
                        //inyectar el html
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                         <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
                          ${nombreProyecto}
                           </a>
                            `;
                        //agregar al html
                        listaProyectos.appendChild(nuevoProyecto);
                        //enviar alerta
                        swal({
                                title: 'Proyecto Creado',
                                text: 'El Proyecto: ' + proyecto + ' se creo correctamente',
                                type: 'success'

                            })
                            .then(result => {
                                if (result.value) {
                                    //redireccionar a la nueva url
                                    window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                                }
                            })

                    } else {
                        //se actualizo o se elimino? no esta hecho todavia
                    }

                } else {
                    //hubo un error
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'

                    });
                }




            }


        }
        //enviar el Requiest
    xhr.send(datos);


}

function borrarProyecto(e) {

    if (e.target.classList.contains('fa-times')) {
        Swal.fire({
            title: '¿Seguro?',
            text: "Esta acción no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'

        }).then((result) => {
            if (result.value) {

                var proyectoEliminar = e.target.parentElement;

                //borrar de BD
                eliminarProyectoBD(proyectoEliminar);
                //borar de html
                proyectoEliminar.remove();

                //alerta
                Swal.fire(
                    'Eliminado!',
                    'Tu tarea ha sido eliminada',
                    'success'
                )
            }
        })
    }


}

function eliminarProyectoBD(proyecto) {
    var idProyecto = proyecto.firstElementChild.id;
    console.log(idProyecto);

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //crear formData
    var datos = new FormData();
    datos.append('id', idProyecto);
    datos.append('accion', 'eliminar');


    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);


            }
        }
        //enviar el Requiest
    xhr.send(datos);
}

function editarProyecto(e) {
    e.preventDefault();
    target = e.target.localName;

    var nombreProyecto = e.target.innerText;
    console.log(nombreProyecto);

    if (target === 'li') {
        var proyecto = e.target;
        var listaProyectos = document.querySelector('ul#proyectos');

        var idProyecto = e.target.firstElementChild.id;

        //crea un input para el nombre del nuevo proyecto

        proyecto.style.display = 'none';
        var editarProyecto = document.createElement('li');
        editarProyecto.innerHTML = `<input type="text" id="editar-proyecto" value=${nombreProyecto}>`;

        listaProyectos.appendChild(editarProyecto);
        document.body.addEventListener("keydown", function(e) {
                tecla = e.keyCode;
                if (tecla === 27) {
                    proyecto.style.display = 'flex';
                    listaProyectos.removeChild(editarProyecto);
                }

            })
            //al presionar enter crea el proyecto
        var inputProyectoEditado = document.querySelector('#editar-proyecto');
        inputProyectoEditado.addEventListener('keypress', function(e) {
            var tecla = e.which; // tine que ser 13 para enter o tambien usar e.keyCode ('enter')
            if (tecla === 13) {
                editarProyectoDB(inputProyectoEditado.value, idProyecto);
                listaProyectos.removeChild(editarProyecto);

            }

        })
    }
}

function editarProyectoDB(ProyectoEditado, idProyecto) {
    var idProyectoEditado = idProyecto,
        nombreproyectoEditado = ProyectoEditado;

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //crear formData
    var datos = new FormData();
    datos.append('id', idProyectoEditado);
    datos.append('accion', 'actualizar');
    datos.append('proyecto', nombreproyectoEditado);



    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                //obtener datos de la respuesta
                var respuesta = JSON.parse(xhr.responseText),

                    proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

                //comprobar la insercion
                if (resultado === 'correcto') {
                    if (tipo === 'actualizar') {
                        //se creo un nuevo proyecto
                        //inyectar el html
                        var listaProyectos = document.querySelector('ul#proyectos');
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                      <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
                       ${proyecto}
                        </a>
                         `;
                        //agregar al html
                        listaProyectos.appendChild(nuevoProyecto);
                        //enviar alerta
                        swal({
                                title: 'Proyecto Editado',
                                text: 'El Proyecto: ' + proyecto + ' se edito correctamente',
                                type: 'success'

                            })
                            .then(result => {
                                if (result.value) {
                                    //redireccionar a la nueva url
                                    window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                                }
                            })

                    } else {
                        //se actualizo o se elimino? no esta hecho todavia
                    }

                } else {
                    //hubo un error
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'

                    });
                }

            }
        }
        //enviar el Requiest
    xhr.send(datos);
}


//agregar nueva tarea al proyecto actual

function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //validar que el campo tenga algo escrito 
    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
            type: 'error'

        });
    } else {
        //la tarea tiene algo, insertar en php 


        //crear llamado a ajax
        var xhr = new XMLHttpRequest();
        //crear formData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);



        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        //ejecutarlo y respuesta
        xhr.onload = function() {
                if (this.status === 200) {

                    var respuesta = JSON.parse(xhr.responseText);



                    //asignar valores

                    let resultado = respuesta.respuesta,
                        tarea = respuesta.tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;


                    if (resultado === 'correcto') {
                        //se agrego correctamente
                        if (tipo === 'crear') {
                            swal({
                                title: 'Tarea Creada',
                                text: 'La tarea: ' + tarea + ' se creo correctamente',
                                type: 'success'

                            });
                            //seleccionar el parrafo con la lsita vacia
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }


                            //construir el template
                            var nuevaTarea = document.createElement('li');
                            //agregamos el id
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            //agregar la clas tarea
                            nuevaTarea.classList.add('tarea');
                            //construir  el html
                            nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                                </div>
                            `
                                //agregarlo al DOM
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);

                            //limpiar el formulario
                            document.querySelector('.agregar-tarea').reset();

                            //actualizar barra
                            actualizarProgreso();






                        } else {
                            //hubo un error
                            swal({
                                title: 'Error',
                                text: 'Hubo un error',
                                type: 'error'

                            });
                        }
                    }





                }
            }
            //enviar el Requiest
        xhr.send(datos);
    }

}

//cambia el estado de las tareas o las eliminas

function accionesTareas(e) {
    e.preventDefault();
    //delegation: usar e.target para saber a que se le hace click
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            e.target.parentElement.parentElement.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            e.target.parentElement.parentElement.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);

        }



    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Seguro?',
            text: "Esta acción no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'

        }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;

                //borrar de BD
                eliminarTareaBD(tareaEliminar);
                //borar de html
                tareaEliminar.remove();

                //alerta
                Swal.fire(
                    'Eliminado!',
                    'Tu tarea ha sido eliminada',
                    'success'
                )
            }
        })
    }

}

//completa o descompleta tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');


    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);



    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                actualizarProgreso();


            }
        }
        //enviar el Requiest
    xhr.send(datos);

}
//elimina tareas de la base de datos
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');

    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');




    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);


                //comprobar que haya tareas restantes

                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'> No hay tareas en este proyecto </p>";
                }

                //actualizar progreso
                actualizarProgreso();



            }
        }
        //enviar el Requiest
    xhr.send(datos);
}

//actualizar progreso
function actualizarProgreso() {
    //obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');
    //obtener las tareas ocmpletas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //determinar avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    //asignar avance
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //mostrar alerta al 100%
    if (avance === 100) {
        swal({
            title: 'Proyecto Terminado',
            text: 'Ya no tienes tareas pendientes!',
            type: 'success'

        });
    }



}