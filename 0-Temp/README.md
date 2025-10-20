# 🖼️ Editor de Recorte de Imágenes Web

![Licencia](https://img.shields.io/badge/license-MIT-green)
![Estado](https://img.shields.io/badge/status-Activo-brightgreen)

Un editor web interactivo que permite **seleccionar, recortar y descargar imágenes** directamente desde un explorador de archivos en la página.

---

## 🔹 Características

- Explorador de carpetas y archivos de imágenes.
- Selección de imagen y resaltado visual.
- Área de recorte interactiva:
  - Mover y redimensionar dentro de los límites de la imagen.
  - Mantiene ajustes al cambiar de imagen si se ha modificado.
  - Evita que se salga del área de la imagen.
- Descarga de la imagen recortada en formato PNG, JPG u otros.
- Visualización en tiempo real del tamaño del recorte.

---

## 🛠 Tecnologías

- **HTML / CSS / JS**
- **jQuery**
- **Canvas API**
- **PHP** (`get_image.php`, `explorer.php`)

---

## ⚡ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/TU_USUARIO/tu-repo.git
cd tu-repo

2. Abrir el proyecto en un servidor local (XAMPP, WAMP, etc.).
3. Escribe cualquier ruta del disco con imagenes.
4. Abrir index.php desde el servidor y comenzar a usarlo.


🚀 Uso

1. Ingresa la ruta del directorio de imágenes y haz clic en Cargar.
2. Explora carpetas y archivos de imágenes.
3. Haz clic en una imagen para mostrarla en el editor.
4. Ajusta el área de recorte (opcional).
5. Haz clic en Recortar para descargar la imagen resultante.


📂 Estructura del Proyecto

/proyecto
│
├─ index.php
├─ script.js
├─ style.css
├─ explorer.php
├─ get_image.php
└─ img/ (carpeta con imágenes)

Licencia

MIT License © Ricardo Corral
