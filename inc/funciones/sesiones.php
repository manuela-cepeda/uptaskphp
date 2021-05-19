<?php

function usuario_autenticado(){
    if(!revisar_usuario()){
        //redireccionar a la pagina de login
        header('Location:login.php');
        exit();
    }

}

function revisar_usuario(){
    return isset($_SESSION['nombre']);
    //isset etermina si una variable está definida y no es null. 
}
//seciones-> informacion que se almacena dentro del servidor
session_start();
usuario_autenticado();


