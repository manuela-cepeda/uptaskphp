eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}

function validarRegistro(e) {
    e.preventDefault(); //hace que el formulario no se envia por defecto
    let usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        //la validacion fallo 
        // alert('los dos campos son obligatorios'); en vez de usar un alert normal uso esta alerta de sweetalert:
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios',

        })
    } else {
        //ambos campos son corrrectos, manda a ejecutar ajax
        //datos que se van a enviar al servidor:
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //crear llamado a ajax
        var xhr = new XMLHttpRequest();
        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //retorno de datos
        xhr.onload = function() {
                if (this.status === 200) {
                    var respuesta = JSON.parse(xhr.responseText);

                    console.log(respuesta);

                    if (respuesta.respuesta === 'correcto') {
                        //si es un nuevo usuario
                        if (respuesta.tipo === 'crear') {
                            swal({
                                title: 'Usuario Creado',
                                text: 'El usuario se creo correctamente',
                                type: 'success'

                            });
                        } else if (respuesta.tipo === 'login') {
                            swal({
                                    title: 'Login correcto',
                                    text: 'Presiona OK para ir al dashboard',
                                    type: 'success'

                                })
                                .then(result => {
                                    if (result.value) {
                                        window.location.href = 'index.php';
                                    }
                                })
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
            //enviar la peticion
        xhr.send(datos);

    }

}