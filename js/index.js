// Inicializar el carrito con localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Ejecutar después de cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarritoUI();
    agregarEventoVaciarCarrito();
});
// Productos locales
const productosLocales = [
    { id: 1, title: "cooler cpu", description: "Id Cooling.", price: 30000, thumbnail: "./Imagenes/cooler cpu.jpg" },
    { id: 2, title: "memoria ram", description: "Memoria ram 8GB", price: 28000, thumbnail: "./Imagenes/memoria ram.jpg" },
    { id: 4, title: "procesador", description: "AMD ryzen 5 5600G", price: 155000, thumbnail: "./Imagenes/procesador.jpg" },
    { id: 5, title: "gabinete", description: "Gabinete Saikano tx 3.", price: 80000, thumbnail: "./Imagenes/gabinete.jpg" },
];

// Obtener productos de la API y combinarlos con los locales
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        const productosCombinados = [...productosLocales, ...data.products];
        console.log('Productos combinados:', productosCombinados); // Mostrar en consola
        mostrarProductos(productosCombinados); // Mostrar todos los productos en la página
    })
    .catch(error => console.error('Error al obtener productos de la API:', error));

// Función para mostrar productos en la página
function mostrarProductos(productos) {
    const contenedorProductos = document.querySelector('.productos-container');

    // Limpiar el contenedor antes de agregar nuevos productos
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const cardHTML = `
            <div class="card">
                <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text">${producto.description}</p>
                    <p>$${producto.price}</p>
                    <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
                </div>
            </div>
        `;
        contenedorProductos.innerHTML += cardHTML;
    });
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find(item => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar mensaje de carrito
    const mensajeCarrito = document.querySelector('#mensaje-carrito');
    mensajeCarrito.textContent = `Se ha añadido "${producto.title}" al carrito.`;
    mensajeCarrito.style.display = 'block';

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        mensajeCarrito.style.display = 'none';
    }, 3000);
}


// Actualizar UI de la sección "Tu Carrito"
function actualizarCarritoUI() {
    const carritoSeccion = document.querySelector('#carrito');
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);

    carritoSeccion.textContent = totalProductos > 0
        ? `Has añadido ${totalProductos} productos al carrito.`
        : "Aún no has añadido productos a tu carrito.";
}
