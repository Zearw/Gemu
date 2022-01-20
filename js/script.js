let carritoCompras = [];
let stockProductos = [];

/*AJAX*/
$.getJSON("../json/stock.json", function (dato) {
  dato.forEach((elemento) => stockProductos.push(elemento));
  mostrarProductos(stockProductos);
});

/*Muestra los productos en la pantalla principal y crea el boton de Agregar y su evento*/
function mostrarProductos(array) {
  $("#contenedor-productos").empty();
  array.forEach((juego) => {
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
    });
  });
}

/*Verifica los productos actuales del carrita y agrega nuevos productos*/

function agregarCarrito(id) {
  let agrego = carritoCompras.find((el) => el.id == id);
  if (agrego) {
    agrego.cantidadCarrito += 1;
    $(`#cantidad${agrego.id}`).html(`
    <p id="cantidad${agrego.id}" >Cantidad: ${agrego.cantidadCarrito}</p>
    `);
  } else {
    let productoAgregar = stockProductos.find((producto) => producto.id == id);
    carritoCompras.push(productoAgregar);
    mostrarCarrito(productoAgregar);
  }
  actualizarCarrito();
  localStorage.setItem("carrito", JSON.stringify(carritoCompras));
}

/*Agrega el HTML al carrito y crea el boton eliminar con su evento*/

function mostrarCarrito(productoAgregar) {
  $("#carrito-contenedor").append(`
  <div class="productoCarrito">
    <p>${productoAgregar.nombre}</p>
    <p>Precio: $${productoAgregar.precio}</p>
    <p id="cantidad${productoAgregar.id}" >Cantidad: ${productoAgregar.cantidadCarrito}</p>
    <button class="boton-eliminar" id="eliminar${productoAgregar.id}"><i class="bi bi-trash"></i></button>
  </div>
  `);

  $(`#eliminar${productoAgregar.id}`).click(function () {
    if (productoAgregar.cantidadCarrito == 1) {
      $(`#eliminar${productoAgregar.id}`).parent().remove();
      carritoCompras = carritoCompras.filter(
        (elemento) => elemento.id != productoAgregar.id
      );
    } else {
      productoAgregar.cantidadCarrito -= 1;
      $(`#cantidad${productoAgregar.id}`).html(
        `<p id="cantidad${productoAgregar.id}">Cantidad:${productoAgregar.cantidadCarrito}</p>`
      );
    }

    actualizarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carritoCompras));
  });
}

/*Recupera los datos almacenados en el localStorage*/

function recuperar() {
  let recuperar = JSON.parse(localStorage.getItem("carrito"));

  if (recuperar) {
    recuperar.forEach((objeto) => {
      mostrarCarrito(objeto);
      carritoCompras.push(objeto);
    });
  }
  actualizarCarrito();
}

/*Actualiza los calculos del carrito*/

function actualizarCarrito() {
  $("#contadorCarrito").text(
    carritoCompras.reduce((acc, el) => acc + el.cantidadCarrito, 0)
  );

  $("#precioTotal").text(
    carritoCompras.reduce((acc, el) => acc + el.precio * el.cantidadCarrito, 0)
  );
}

recuperar();

$("#finalizar").append(
  `<button id="finalCompra" class="btn btn-dark">Terminar</button>`
);

$("#finalCompra").on("click", () => {
  $.post(
    "https://jsonplaceholder.typicode.com/posts",
    JSON.stringify(carritoCompras),
    function (estado) {
      if (estado) {
        $("#carrito-contenedor").empty();
        $("#form").append(`
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Para finalizar la compra, por favor ingrese su mail.</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" required>
      </div>`);
        $("#finalizar").html(
          `<button type="submit" id="finalizarCompra" class="btn btn-dark">Finalizar Compra</button>`
        );
        $("#finalizarCompra").on("click", () => {
          $("#form").empty();
          $("#carrito-contenedor").append(
            "<h4>En breve recibiras un correo con el pedido. Gracias por elegirnos.</h4>"
          );

          $("h4").slideDown().delay(2000).slideUp();

          $("#finalizar").html(
            `<button id="finalCompra" class="btn btn-dark">Terminar</button>`
          );

          carritoCompras = [];
          localStorage.clear();
          actualizarCarrito();
        });
      }
    }
  );
});
