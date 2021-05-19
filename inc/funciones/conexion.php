<?php

$conn = new mysqli('sql203.epizy.com','epiz_28651052','WDWA9m5aH42HBg','epiz_28651052_uptask');


//hay dos formas de ocnectarte a una base de datos
//con mysqli: te permite conectarte a mysql
//con pdo te permite conectarte a 12 bases de datos distintas

//comprobar si se conecto correctamente
// echo '<pre>' ;
// var_dump($conn->ping()); //si dice null no se conecto si dice true si
// echo '</pre>';

//avisa si hay un error
if($conn->connect_error){
        echo $conn->connect_error;
}

$conn->set_charset('utf8');
