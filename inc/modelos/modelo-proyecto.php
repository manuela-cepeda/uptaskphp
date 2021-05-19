<?php
error_reporting(E_ALL ^ E_NOTICE);

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];
$id_proyecto = (int) $_POST['id'];




if($accion === 'crear'){
    
    
    //IMPORTAR LA CONECCION 
    include "../funciones/conexion.php";

    try{
        //realizar la consulta en la base de datos
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
        $respuesta = array(
            'respuesta' => 'correcto',
            'id_insertado' => $stmt->insert_id,
            'tipo' => $accion,
            'nombre_proyecto'=>$proyecto
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
        $stmt = $conn->prepare("DELETE from proyectos WHERE id = ?");
        $stmt->bind_param('i', $id_proyecto);
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

if($accion === 'actualizar'){
    
    
    //IMPORTAR LA CONECCION 
    include "../funciones/conexion.php";

    try{
        //realizar la consulta en la base de datos
        $stmt = $conn->prepare("UPDATE proyectos SET nombre = ? WHERE id = ?");
        $stmt->bind_param('si', $proyecto, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
        $respuesta = array(
            'respuesta' => 'correcto',
            'id_insertado' => $stmt->insert_id,
            'tipo' => $accion,
            'nombre_proyecto'=>$proyecto
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