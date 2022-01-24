class Juego {
  constructor(id, nombre, categoria, img, precio, stock, cantidadCarrito) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.img = img;
    this.precio = precio;
    this.stock = stock;
    this.cantidadCarrito = cantidadCarrito == undefined ? 1 : cantidadCarrito;
    console.log(this.cantidadCarrito);
  }
}
