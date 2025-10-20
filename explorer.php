<?php
header("Content-Type: text/html; charset=utf-8");

$extensiones = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

function listarUnidades()
{
    $unidades = [];
    foreach (range('C', 'Z') as $letra) {
        $unidad = $letra . ':\\';
        if (is_dir($unidad)) $unidades[] = $unidad;
    }

    if (empty($unidades)) {
        echo "<p class='text-danger'>No se encontraron unidades disponibles.</p>";
        return;
    }

    // 🔹 Obtener nombres de volumen mediante WMIC
    $output = [];
    exec('wmic logicaldisk get VolumeName,Name', $output);
    $nombres = [];

    foreach ($output as $line) {
        if (preg_match('/([A-Z]:)\s+(.+)/', $line, $matches)) {
            $nombres[$matches[1] . '\\'] = trim($matches[2]);
        }
    }

    // 🔹 Ordenar unidades por letra (naturalmente)
    natcasesort($unidades);

    echo "<ul class='list-unstyled'>";
    foreach ($unidades as $unidad) {
        $nombre = isset($nombres[$unidad]) && $nombres[$unidad] !== '' ? " {$nombres[$unidad]}" : '';
        echo "<li class='carpeta unidad' data-ruta='$unidad'>
                <span class='folder-icon'>💽</span>
                <span class='nombre-carpeta'>$unidad$nombre</span>
              </li>";
    }
    echo "</ul>";
}

function listarContenido($path)
{
    global $extensiones;

    if (!is_dir($path)) {
        echo "<p class='text-danger'>Ruta no válida</p>";
        return;
    }

    $items = @scandir($path);
    if ($items === false) {
        echo "<ul class='list-unstyled ms-3'><li class='text-danger'>Carpeta inaccesible</li></ul>";
        return;
    }

    $carpetas = [];
    $archivos = [];
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $ruta = $path . DIRECTORY_SEPARATOR . $item;
        if (is_dir($ruta)) {
            $carpetas[] = $item;
        } else {
            $archivos[] = $item;
        }
    }

    // 🔹 Ordenar naturalmente como Windows
    natcasesort($carpetas);
    natcasesort($archivos);

    echo "<ul class='list-unstyled ms-3' style='display:none'>";

    // 🔸 Carpetas primero
    foreach ($carpetas as $carpeta) {
        $rutaCarpeta = $path . DIRECTORY_SEPARATOR . $carpeta;
        echo "<li class='carpeta' data-ruta='$rutaCarpeta'>
                <span class='folder-icon'>📁</span>
                <span class='nombre-carpeta'>$carpeta</span>
              </li>";
    }

    // 🔸 Archivos de imagen después
    foreach ($archivos as $archivo) {
        $ext = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
        if (in_array($ext, $extensiones)) {
            $rutaArchivo = $path . DIRECTORY_SEPARATOR . $archivo;
            $thumbUrl = "get_image.php?path=" . urlencode($rutaArchivo);
            echo "<li class='archivo text-info ms-3 d-flex align-items-center' data-ruta='$rutaArchivo'>
                    <img src='$thumbUrl' alt='' class='thumb me-2'>
                    <span>$archivo</span>
                  </li>";
        }
    }

    echo "</ul>";
}

// --- Control principal ---
if (!isset($_POST['path']) || empty($_POST['path'])) {
    listarUnidades();
} else {
    listarContenido($_POST['path']);
}
?>
