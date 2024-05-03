// Array para almacenar los artículos
let articulos = [];

// Fetch para obtener los datos del archivo JSON
fetch("./data/articulos.json")
  .then((response) => response.json())
  .then((data) => {
   
    articulos = data;
   
    cargarArticulos(articulos);
  });

// Elementos del DOM
const boxArticulo = document.querySelector("#boxArticulo");
const botonesnav = document.querySelectorAll(".boton-nav");
const titlePages = document.querySelector("#titlePages");
let botonesAgregar = document.querySelectorAll(".agregarArticulo");
const sumarCarro = document.querySelector("#sumarCarro");

// Función para cargar los artículos en el DOM
function cargarArticulos(articulosSeleccionados) {
  boxArticulo.innerHTML = "";

  articulosSeleccionados.forEach((articulo) => {
    const div = document.createElement("div");
    div.classList.add("articulo");
    div.innerHTML = `      
                <img class="imgArticulo" src="${articulo.imagen}" alt="${articulo.titulo}">
                <div class="infoArticulo">
                    <h3 class="tituloArticulo">${articulo.titulo}</h3>
                    <p class="precioArticulo">${articulo.precio}</p>
                    <button class="agregarArticulo" id="${articulo.id}">Agregar</button>
                </div>
            `;
    boxArticulo.append(div);
  });

  // Actualizar los eventos de los botones de agregar al carrito
  actualizarBotonesAgregar();
}

// Event listener para los botones de navegación
botonesnav.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesnav.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id !== "todos") {
      const tituloCategoria = articulos.find(
        (articulo) => articulo.categoria.id === e.currentTarget.id
      );
      titlePages.innerText = tituloCategoria.categoria.nombre;

      const articulosBoton = articulos.filter(
        (articulo) => articulo.categoria.id === e.currentTarget.id
      );
      cargarArticulos(articulosBoton);
    } else {
      titlePages.innerText = "Todos los Articulos";
      cargarArticulos(articulos);
    }
  });
});

// Función para actualizar los eventos de los botones de agregar al carrito
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".agregarArticulo");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", llenarCarrito);
  });
}

// Array para almacenar los artículos en el carrito
let articulosAlCarrito;

// Obtener los artículos del carrito del almacenamiento local
const articulosAlCarritoLS = localStorage.getItem("articulosalcarrito");

if (articulosAlCarritoLS) {
  articulosAlCarrito = JSON.parse(articulosAlCarritoLS);
  actualizarSumarCarro();
} else {
  articulosAlCarrito = [];
}

// Función para agregar un artículo al carrito
function llenarCarrito(e) {
  const idAgregar = e.currentTarget.id;
  const articuloAgregado = articulos.find(
    (articulo) => articulo.id === idAgregar
  );

  if (articulosAlCarrito.some((articulo) => articulo.id === idAgregar)) {
    const index = articulosAlCarrito.findIndex(
      (articulo) => articulo.id === idAgregar
    );
    articulosAlCarrito[index].cantidad++;
  } else {
    articuloAgregado.cantidad = 1;
    articulosAlCarrito.push(articuloAgregado);
  }

  // Actualizar la cantidad total en el carrito
  actualizarSumarCarro();

  // Guardar los artículos del carrito en el almacenamiento local
  localStorage.setItem(
    "articulosalcarrito",
    JSON.stringify(articulosAlCarrito)
  );
  Toastify({
    text: "articulo en carrito",
    duration: 3000,   
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} // Callback after click
   
  }).showToast();
}

// Función para actualizar la cantidad total en el carrito
function actualizarSumarCarro() {
  let newsumarCarro = articulosAlCarrito.reduce(
    (acc, articulo) => acc + articulo.cantidad,
    0
  );
  sumarCarro.innerHTML = newsumarCarro;
}
