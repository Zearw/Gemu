let carritoCompras = [];
let stockProductos = [];

/*AJAX*/
$.getJSON("../json/stock.json", function (dato) {
  dato.forEach((elemento) => stockProductos.push(elemento));
  mostrarProductos(stockProductos);
});

/*Recupera los datos almacenados en el localStorage*/

function recuperar() {
  let recuperar = JSON.parse(localStorage.getItem("carrito"));

  if (recuperar) {
    recuperar.forEach((objeto) => {
      insertarJueguitoDesdeJson(objeto);
    });
  }
  actualizarCarrito();
}

/*Muestra los productos en la pantalla principal y crea el boton de Agregar y su evento*/
function mostrarProductos(stockProductos) {
  $("#contenedor-productos").empty();
  stockProductos.forEach((juego) => {
    $("#contenedor-productos").append(`
    <div class="producto">  
      <div class="col mb-5">
        <div class="card h-100">
          <img class="card-img-top" src="${juego.img}"/>
          <div class="card-body p-4">
            <div class="text-center">
              <h5 class="fw-bolder">${juego.nombre}</h5>
              <h5> ${juego.categoria}</h5>
              <div class="d-flex justify-content-center small text-warning mb-2">
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
              </div>
              $${juego.precio}
            </div>
          </div>
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
            <button class="btn btn-outline-dark mt-auto" id="boton${juego.id}">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `);

    $(`#boton${juego.id}`).on("click", function () {
      agregarCarrito(juego.id);
      Toastify({
        text: "✔ Juego Agregado",
        className: "info",
        style: {
          background: "green",
        },
      }).showToast();
    });
  });
}

/*Verifica los productos actuales del carrito y agrega nuevos productos*/

function agregarCarrito(id) {
  let agrego = carritoCompras.find((el) => el.id == id);
  if (agrego) {
    aumentarCantCarrito(agrego);
  } else {
    let aux = stockProductos.find((producto) => producto.id == id);
    insertarJueguitoDesdeJson(aux);
  }
  actualizarCarrito();
  localStorage.setItem("carrito", JSON.stringify(carritoCompras));
}

/*Agrega el HTML al carrito y crea los botones para modificar la cant*/

function mostrarCarrito(productoClase) {
  $("#carrito-contenedor").append(`
  <div class="productoCarrito">
    <p>${productoClase.nombre}</p>
    <p>Precio: $${productoClase.precio}</p>
    <button type="button" class="btn btn-dark" id="restar${productoClase.id}"><i class="bi bi-dash-lg"></i></button>
    <div class="card">
      <div class="card-body" id="cantidad${productoClase.id}">
        ${productoClase.cantidadCarrito}
      </div>
    </div>
    <button type="button" class="btn btn-dark" id="sumar${productoClase.id}"><i class="bi bi-plus-lg"></i></button>
    <button class="boton-eliminar" id="eliminar${productoClase.id}"><i class="bi bi-trash"></i></button>
  </div>
  `);

  $(`#sumar${productoClase.id}`).click(function () {
    aumentarCantCarrito(productoClase);
    actualizarCarrito();
  });

  $(`#restar${productoClase.id}`).click(function () {
    if (productoClase.cantidadCarrito == 1) {
      eliminarJuegoCarrito(productoClase);
    } else {
      disminuirCantCarrito(productoClase);
    }
    actualizarCarrito();
  });

  $(`#eliminar${productoClase.id}`).click(function () {
    eliminarJuegoCarrito(productoClase);
    actualizarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carritoCompras));
  });
}

/*Finaliza la compra*/

$("#botonFinalizarCompra").on("click", () => {
  $.post(
    "https://jsonplaceholder.typicode.com/posts",
    JSON.stringify(carritoCompras),
    function (estado) {
      if (estado) {
        $("#carrito-contenedor").empty();
        $("#graciastexto").delay(350).fadeIn();
        carritoCompras = [];
        localStorage.clear();
        actualizarCarrito();
      }
    }
  );
});

recuperar();

if (carritoCompras.length == 0) {
  $("#comprarBoton").hide();
}
