<?php
if (!isset($_POST['path'])) exit;

$path = $_POST['path'];

if (!is_dir($path)) {
    echo "<p class='text-danger'>Ruta no válida</p>";
    exit;
}

function listarDirectorios($dir)
{
    $extensiones = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    $items = scandir($dir);

    // Separar carpetas y archivos
    $carpetas = [];
    $archivos = [];
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $ruta = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($ruta)) {
            $carpetas[] = $item;
        } else {
            $archivos[] = $item;
        }
    }

    // Unir carpetas primero y luego archivos
    $items = array_merge($carpetas, $archivos);

    echo "<ul class='list-unstyled ms-3' style='display:none'>"; // inicia cerrado
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $ruta = $dir . DIRECTORY_SEPARATOR . $item;

        if (is_dir($ruta)) {
            // ✅ Carpeta: el nombre ahora está dentro de un <span class='nombre-carpeta'>
            echo "<li class='carpeta' data-ruta='$ruta'>
                    <span class='folder-icon'>📁</span>
                    <span class='nombre-carpeta'>$item</span>";
            listarDirectorios($ruta);
            echo "</li>";
        } else {
            // ✅ Archivo de imagen con thumbnail
            $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($ext, $extensiones)) {
                $thumbUrl = "get_image.php?path=" . urlencode($ruta);
                echo "
                    <li class='archivo text-info ms-3 d-flex align-items-center' data-ruta='$ruta'>
                        <img src='$thumbUrl' alt='' class='thumb me-2'>
                        <span>$item</span>
                    </li>
                ";
            }
        }
    }
    echo "</ul>";
}

// ✅ Carpeta raíz (abierta inicialmente)
echo "<ul class='list-unstyled'>";
echo "<li class='carpeta abierta' data-ruta='$path'>
        <span class='folder-icon'>📂</span>
        <span class='nombre-carpeta'>$path</span>";
listarDirectorios($path);
echo "</li>";
echo "</ul>";
