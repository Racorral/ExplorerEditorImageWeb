$(document).ready(function () {
  $("#btnCargar").on("click", function () {
    const ruta = $("#ruta").val();
    if (!ruta) return alert("Ingrese una ruta válida");
    $.post("explorer.php", { path: ruta }, function (data) {
      $("#explorador").html(data);
    });
  });

  // Alternar carpetas (abrir/cerrar)
  $(document).on("click", ".carpeta > .folder-icon, .carpeta > .nombre-carpeta", function (e) {
    e.stopPropagation();
    const li = $(this).closest("li");
    const ul = li.children("ul").first();
    const icon = li.find(".folder-icon").first();

    if (ul.is(":visible")) {
      ul.slideUp(150);
      icon.text("📁"); // cerrado
    } else {
      ul.slideDown(150);
      icon.text("📂"); // abierto
    }
  });

  // Mostrar imagen
  $(document).on("click", ".archivo", function (e) {
    e.stopPropagation();

    // 🔹 Quitar la selección anterior
    $(".archivo").removeClass("seleccionado");

    // 🔹 Marcar la imagen clickeada como seleccionada
    $(this).addClass("seleccionado");

    const ruta = $(this).data("ruta");
    const src = "get_image.php?path=" + encodeURIComponent(ruta);
    $("#imagenSeleccionada").attr("src", src).removeClass("d-none");
  });
});


// === Lógica de recorte ===
let cropBox = $("#cropBox");
let imagen = $("#imagenSeleccionada");
let isDragging = false;
let currentHandle = null;
let startX, startY, startWidth, startHeight, startTop, startLeft;

let cropState = {
  top: "20%",
  left: "20%",
  width: "60%",
  height: "60%"
};

$(document).on("click", ".archivo", function () {
  const src = $(this).data("ruta");

  $("#imagenSeleccionada")
    .attr("src", "get_image.php?path=" + encodeURIComponent(src))
    .removeClass("d-none")
    .off("load")
    .on("load", function () {
      const imgOffset = imagen.position();
      const imgWidth = imagen.width();
      const imgHeight = imagen.height();
      const padding = 5; // margen interno

      let cropLeft, cropTop, cropWidth, cropHeight;

      if (!cropState || !$("#cropBox").is(":visible")) {
        // Primera imagen o cropBox oculto: inicializamos dentro de la imagen
        cropWidth = imgWidth * 0.9;
        cropHeight = imgHeight * 0.9;
        cropLeft = imgOffset.left + (imgWidth - cropWidth) / 2;
        cropTop = imgOffset.top + (imgHeight - cropHeight) / 2;
      } else {
        // Restaurar cropState previo pero limitado a la nueva imagen
        cropWidth = Math.min(parseFloat(cropState.width), imgWidth - padding);
        cropHeight = Math.min(parseFloat(cropState.height), imgHeight - padding);

        cropLeft = Math.min(Math.max(parseFloat(cropState.left), imgOffset.left + padding), imgOffset.left + imgWidth - cropWidth - padding);
        cropTop = Math.min(Math.max(parseFloat(cropState.top), imgOffset.top + padding), imgOffset.top + imgHeight - cropHeight - padding);
      }

      cropBox.css({
        width: cropWidth,
        height: cropHeight,
        left: cropLeft,
        top: cropTop
      });

      // Guardar cropState actualizado
      cropState = {
        width: cropWidth,
        height: cropHeight,
        left: cropLeft,
        top: cropTop
      };

      cropBox.removeClass("d-none").show();
      $("#btnRecortar").prop("disabled", false);
      actualizarCropSize();
    });

});


// Mover o redimensionar el recuadro
cropBox.on("mousedown", function (e) {
  e.preventDefault();
  currentHandle = $(e.target).hasClass("handle") ? e.target.classList[1] : "move";
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = cropBox.width();
  startHeight = cropBox.height();
  startTop = cropBox.position().top;
  startLeft = cropBox.position().left;
  $(document).on("mousemove", onMouseMove);
  $(document).on("mouseup", stopDragging);
});

function onMouseMove(e) {
  if (!isDragging) return;

  const editorOffset = cropBox.parent().offset();
  const imgOffset = imagen.offset();
  const imgWidth = imagen.width();
  const imgHeight = imagen.height();

  const relativeLeft = imgOffset.left - editorOffset.left;
  const relativeTop = imgOffset.top - editorOffset.top;

  const padding = 3; // píxeles de margen interno

  if (currentHandle === "move") {
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);

    newLeft = Math.max(relativeLeft, Math.min(newLeft, relativeLeft + imgWidth - cropBox.outerWidth() - padding));
    newTop = Math.max(relativeTop, Math.min(newTop, relativeTop + imgHeight - cropBox.outerHeight() - padding));

    cropBox.css({ left: newLeft, top: newTop });

  } else if (currentHandle === "right") {
    let newWidth = startWidth + (e.clientX - startX);
    newWidth = Math.max(10, Math.min(newWidth, relativeLeft + imgWidth - startLeft - padding));
    cropBox.css({ width: newWidth });

  } else if (currentHandle === "left") {
    let newLeft = startLeft + (e.clientX - startX);
    let newWidth = startWidth - (e.clientX - startX);

    if (newLeft < relativeLeft) {
      newWidth -= (relativeLeft - newLeft);
      newLeft = relativeLeft;
    }
    newWidth = Math.max(10, newWidth);
    cropBox.css({ left: newLeft, width: newWidth });

  } else if (currentHandle === "bottom") {
    let newHeight = startHeight + (e.clientY - startY);
    newHeight = Math.max(10, Math.min(newHeight, relativeTop + imgHeight - startTop - padding));
    cropBox.css({ height: newHeight });

  } else if (currentHandle === "top") {
    let newTop = startTop + (e.clientY - startY);
    let newHeight = startHeight - (e.clientY - startY);

    if (newTop < relativeTop) {
      newHeight -= (relativeTop - newTop);
      newTop = relativeTop;
    }
    newHeight = Math.max(10, newHeight);
    cropBox.css({ top: newTop, height: newHeight });
  }

  actualizarCropSize();

  // 🔹 Guardar estado actual del crop en tiempo real
  cropState = {
    top: cropBox.css("top"),
    left: cropBox.css("left"),
    width: cropBox.css("width"),
    height: cropBox.css("height")
  };
}

function actualizarCropSize() {
  const img = imagen[0];
  const box = cropBox[0];

  const imgRect = img.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();

  const scaleX = img.naturalWidth / imgRect.width;
  const scaleY = img.naturalHeight / imgRect.height;

  const width = Math.round(boxRect.width * scaleX);
  const height = Math.round(boxRect.height * scaleY);

  $("#cropSize").text(width + " x " + height);
}

function stopDragging() {
  isDragging = false;
  $(document).off("mousemove", onMouseMove);
  $(document).off("mouseup", stopDragging);
}

// === Recortar imagen al hacer clic ===
$("#btnRecortar").on("click", function () {
  const img = imagen[0];
  const box = cropBox[0];

  const imgRect = img.getBoundingClientRect();
  const cropRect = box.getBoundingClientRect();

  const scaleX = img.naturalWidth / imgRect.width;
  const scaleY = img.naturalHeight / imgRect.height;

  const cropX = (cropRect.left - imgRect.left) * scaleX;
  const cropY = (cropRect.top - imgRect.top) * scaleY;
  const cropW = cropRect.width * scaleX;
  const cropH = cropRect.height * scaleY;

  const canvas = document.createElement("canvas");
  canvas.width = cropW;
  canvas.height = cropH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  const formato = $("#formato").val();
  const dataURL = canvas.toDataURL(`image/${formato}`);
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = generarNombreWA(formato);
  link.click();
});

// Generar nombre estilo WhatsApp
function generarNombreWA(formato) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  // Formato: IMG-YYYYMMDD-WAHHMMSSmmm.png
  return `IMG-${yyyy}${mm}${dd}-WA${hh}${min}${ss}${ms}.${formato}`;
}