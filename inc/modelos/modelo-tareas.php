<?php

error_reporting(E_ALL ^ E_NOTICE);

$accion = $_POST['accion'];
$id_proyecto = (int) $_POST['id_proyecto']; //con ese int nos aseguramos que lo tome como entero
$tarea = $_POST['tarea'];
$estado = $_POST['estado'];
$id_tarea =(int) $_POST['id'];




if($accion === 'crear'){
        
    //IMPORTAR LA CONECCION 
    include "../funciones/conexion.php";

    try{
        //realizar la consulta en la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
        $respuesta = array(
            'respuesta' => 'correcto',
            'id_insertado' => $stmt->insert_id,
            'tipo' => $accion,
            'tarea'=>$tarea
             );
         } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
         }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        //en caso de un errror, tomar la excepcion
        
    $respuesta = array(
        'error' => $e->getMessage()
            );
    }

    echo json_encode($respuesta);


   
}


if($accion === 'actualizar'){
    
    
    //IMPORTAR LA CONECCION 
    include "../funciones/conexion.php";

    try{
        //realizar la consulta en la base de datos
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
        $respuesta = array(
            'respuesta' => 'correcto'
            
             );
         } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
         }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        //en caso de un errror, tomar la excepcion
        
    $respuesta = array(
        'error' => $e->getMessage()
            );
    }

    echo json_encode($respuesta);


   
}

if($accion === 'eliminar'){
    
    
    //IMPORTAR LA CONECCION 
    include "../funciones/conexion.php";

    try{
        //realizar la consulta en la base de datos
        $stmt = $conn->prepare("DELETE from tareas WHERE id = ?");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
        $respuesta = array(
            'respuesta' => 'correcto'
            
             );
         } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
         }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        //en caso de un errror, tomar la excepcion
        
    $respuesta = array(
        'error' => $e->getMessage()
            );
    }

    echo json_encode($respuesta);


   
}
