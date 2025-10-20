<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Explorador de Imágenes</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>

<body class="bg-dark text-light">
    <div class="container-fluid vh-100 d-flex">
        <!-- Panel izquierdo: Explorador -->
        <div class="col-3 border-end p-2">
            <h5>Explorador</h5>
            <div class="input-group mb-2">
                <input type="text" id="ruta" class="form-control form-control-sm" placeholder="Ej: C:/imagenes" value="D:\3- Coches & Motos">
                <button id="btnCargar" class="btn btn-primary btn-sm">Cargar</button>
            </div>
            <div id="explorador" class="scrollable"></div>
        </div>

        <!-- Panel central: Editor -->
        <div class="col-6 p-2 text-center">
            <h5>Editor de Imágenes</h5>
            <div id="editor" class="editor-area position-relative">
                <img id="imagenSeleccionada" src="" alt="Selecciona una imagen" class="img-fluid d-none">
                <div id="cropBox" class="crop-box d-none">
                    <div class="handle top"></div>
                    <div class="handle right"></div>
                    <div class="handle bottom"></div>
                    <div class="handle left"></div>
                </div>
            </div>

        </div>

        <!-- Panel derecho: Opciones -->
        <div class="col-3 border-start p-2">
            <h5>Opciones</h5>

            <div class="mb-2">
                <label>Tamaño del recorte (px):</label>
                <div id="cropSize">— x —</div>
            </div>

            <div class="mb-2">
                <label>Formato de exportación:</label>
                <select id="formato" class="form-select form-select-sm">
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                </select>
            </div>
            <div class="text-center">
                <button id="btnRecortar" class="btn btn-warning btn-sm mt-2" disabled>Recortar y Guardar Imagen</button>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>

</html>