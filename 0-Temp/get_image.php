<?php
if (!isset($_GET['path'])) {
  http_response_code(400);
  exit('Missing path');
}

$path = $_GET['path'];

// Verificar que el archivo exista
if (!file_exists($path)) {
  http_response_code(404);
  exit('File not found');
}

// Verificar extensión permitida
$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($ext, $allowed)) {
  http_response_code(403);
  exit('Forbidden');
}

// Enviar imagen al navegador
header("Content-Type: image/$ext");
readfile($path);
