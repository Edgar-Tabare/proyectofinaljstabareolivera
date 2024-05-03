// Recuperar los artículos del carrito del almacenamiento local
let articulosAlCarrito = localStorage.getItem("articulosalcarrito");
articulosAlCarrito = JSON.parse(articulosAlCarrito);

// Variables que representan los elementos del HTML
const boxCarritoVacio = document.querySelector("#carritoVacio");
const boxCardCarritoArticulos = document.querySelector("#cardCarritoArticulos");
const boxCarritoArticulosFinal = document.querySelector(
  "#carritoArticulosFinal"
);
const boxCarritoComprado = document.querySelector("#carritoComprado");
let botonesEliminar = document.querySelectorAll(".carritoArticuloEliminar");
const botonVaciarCarrito = document.querySelector(
  ".carritoArticulosFinalLimpiar"
);
const boxtotal = document.querySelector("#total");
const botonComprado = document.querySelector("#carritoArticulosFinalComprar");

// Función para cargar los artículos en el carrito
function cargarArticulosCarrito() {
  if (articulosAlCarrito && articulosAlCarrito.length > 0) {
    // Mostrar los elementos del carrito si hay artículos
    boxCarritoVacio.classList.add("disabled");
    boxCardCarritoArticulos.classList.remove("disabled");
    boxCarritoArticulosFinal.classList.remove("disabled");
    boxCarritoComprado.classList.add("disabled");

    boxCardCarritoArticulos.innerHTML = "";

    articulosAlCarrito.forEach((articulo) => {
      const div = document.createElement("div");
      div.classList.add("carritoArticulo");
      div.innerHTML = `
               
                <div class="carritoArticuloTitulo">
                    <small>Título</small>
                    <h3>${articulo.titulo}</h3>
                </div>
                <div class="carritoArticuloCantidad">
                    <small>Cantidad</small>
                    <p>${articulo.cantidad}</p>
                </div>
                <div class="carritoArticuloPrecio">
                    <small>Precio</small>
                    <p>${articulo.precio}</p>
                </div>
                <div class="carritoArticuloEliminarContainer">
                    <button class="carritoArticuloEliminar" id="${articulo.id}"><i class="bi bi-trash-fill"></i></button>
                </div>
            `;
      boxCardCarritoArticulos.appendChild(div);

      actualizatotal();
    });
  } else {
    // Mostrar mensaje de carrito vacío si no hay artículos
    boxCardCarritoArticulos.innerHTML = "";
    boxCarritoVacio.classList.remove("disabled");
    boxCardCarritoArticulos.classList.add("disabled");
    boxCarritoArticulosFinal.classList.add("disabled");
    boxCarritoComprado.classList.add("disabled");
  }

  //  botones correspondientes
  carritoArticuloEliminar();

  actualizatotal();
}

// Cargar los artículos en el carrito al cargar la página
cargarArticulosCarrito();

// Función para asignar eventos de eliminar a los botones correspondientes
function carritoArticuloEliminar() {
  botonesEliminar = document.querySelectorAll(".carritoArticuloEliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

// Función para eliminar un artículo del carrito y actualizar localstorge
function eliminarDelCarrito(e) {
  const idBoton = e.currentTarget.id;
  const index = articulosAlCarrito.findIndex(
    (articulo) => articulo.id === idBoton
  );

  if (index !== -1) {
    articulosAlCarrito.splice(index, 1);
    cargarArticulosCarrito();

    localStorage.setItem(
      "articulosalcarrito",
      JSON.stringify(articulosAlCarrito)
    );
  }
  Toastify({
    text: "articulo eliminado",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

// Función para vaciar completamente el carrito
botonVaciarCarrito.addEventListener("click", limpiarCarrito);

function limpiarCarrito() {
  Swal.fire({
    title: "ESTA ELIMINADO LOS PRODUCTO DEL CARRO",
    icon: "question",
    html: `
         perdera sus articulos del carrito
        `,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `Si `,
    cancelButtonText: `No `,
  }).then((result) => {
    if (result.isConfirmed) {
      articulosAlCarrito = [];
      localStorage.setItem(
        "articulosalcarrito",
        JSON.stringify(articulosAlCarrito)
      );
      cargarArticulosCarrito();
    }
  });
}

// Función para actualizar el total
function actualizatotal() {
  const totalactualiza = articulosAlCarrito.reduce(
    (acc, articulo) => acc + articulo.precio * articulo.cantidad,
    0
  );
  boxtotal.innerHTML = `$${totalactualiza}`;
}

// Función para simular la compra y vaciar el carrito
botonComprado.addEventListener("click", comprar);

function comprar() {
    Swal.fire({
        title: "COMPRA EXITOSA",
        text: "su pedido esta en camino",
        imageUrl: "../img/motopedido.jpg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      });
  articulosAlCarrito = [];
  localStorage.setItem(
    "articulosalcarrito",
    JSON.stringify(articulosAlCarrito)
  );

  boxCarritoVacio.classList.add("disabled");
  boxCardCarritoArticulos.classList.add("disabled");
  boxCarritoArticulosFinal.classList.add("disabled");
  boxCarritoComprado.classList.remove("disabled");
}
