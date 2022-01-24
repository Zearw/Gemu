/*Aumentar, disminuir, Eliminar Cant Juegos*/

function aumentarCantCarrito(productoClase) {
  productoClase.cantidadCarrito += 1;
  $(`#cantidad${productoClase.id}`).html(`
    ${productoClase.cantidadCarrito}
    `);
}

function eliminarJuegoCarrito(productoClase) {
  $(`#eliminar${productoClase.id}`).parent().remove();
  carritoCompras = carritoCompras.filter(
    (elemento) => elemento.id != productoClase.id
  );
  Toastify({
    text: "❌ Juego Eliminado",
    className: "info",
    style: {
      background: "tomato",
    },
  }).showToast();
}

function disminuirCantCarrito(productoClase) {
  productoClase.cantidadCarrito -= 1;
  $(`#cantidad${productoClase.id}`).html(`${productoClase.cantidadCarrito}`);
}

/*Actualiza los calculos del carrito*/
function actualizarCarrito() {
  $("#contadorCarrito").text(
    carritoCompras.reduce((acc, el) => acc + el.cantidadCarrito, 0)
  );

  $("#precioTotal").text(
    carritoCompras.reduce((acc, el) => acc + el.precio * el.cantidadCarrito, 0)
  );

  if (carritoCompras.length == 0) {
    $("#comprarBoton").hide();
  }
}

/*Convierte el Json en Clase*/
function insertarJueguitoDesdeJson(jsonObject) {
  let productoClase = new Juego(
    jsonObject.id,
    jsonObject.nombre,
    jsonObject.categoria,
    jsonObject.img,
    jsonObject.precio,
    jsonObject.stock,
    jsonObject.cantidadCarrito
  );

  carritoCompras.push(productoClase);
  $("#comprarBoton").show();
  mostrarCarrito(productoClase);
}
