// Inicializar el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Ejecutar al cargar la página carrito.html
document.addEventListener('DOMContentLoaded', () => {
    console.log('Contenido del carrito al cargar carrito.html:', carrito); // Mostrar el carrito
    cargarCarrito();
    agregarEventoVaciarCarrito();
    agregarEventosBotones();
});

// Cargar carrito en la tabla de carrito.html
function cargarCarrito() {
    const tbody = document.querySelector('.items');
    const totalPagar = document.querySelector('#total-pagar');
    tbody.innerHTML = '';

    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.price * item.cantidad;
        total += subtotal; // Sumar al total

        const row = `
            <tr>
                <td>
                    <img src="${item.thumbnail}" alt="${item.title}" class="img-producto" />
                    ${item.title}
                </td>
                <td>
                    <button class="boton-modificar" onclick="modificarCantidad(${index}, -1)">-</button>
                    ${item.cantidad}
                    <button class="boton-modificar" onclick="modificarCantidad(${index}, 1)">+</button>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Mensaje si el carrito está vacío
    if (carrito.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">El carrito está vacío</td></tr>`;
        totalPagar.textContent = 'Total: $0.00';
    } else {
        totalPagar.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Actualizar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Modificar cantidad de producto en carrito
function modificarCantidad(indice, cambio) {
    carrito[indice].cantidad += cambio;

    // Eliminar producto si la cantidad llega a 0 o menos
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    cargarCarrito();
}

// Eliminar producto directamente (Botón "Eliminar")
function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    cargarCarrito();
}

// Vaciar todo el carrito
function agregarEventoVaciarCarrito() {
    const botonVaciar = document.querySelector('#vaciar-carrito');
    botonVaciar.addEventListener('click', () => {
        carrito = [];
        cargarCarrito();
        alert("El carrito ha sido vaciado.");
    });
}

// Agregar eventos a los botones de acción
function agregarEventosBotones() {
    // Botón de seguir comprando
    const botonSeguirComprando = document.querySelector('#seguir-comprando');
    botonSeguirComprando.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirige al index (página principal de productos)
    });

    // Botón de finalizar compra
    const botonFinalizarCompra = document.querySelector('#finalizar-compra');
    botonFinalizarCompra.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire('Tu carrito está vacío', 'Agrega productos antes de finalizar la compra.', 'error');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro de que deseas finalizar la compra?',
            text: `El total es $${carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0).toFixed(2)}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Compra finalizada!',
                    'Gracias por tu compra. Recibirás un correo de confirmación.',
                    'success'
                );
                carrito = []; // Vaciar el carrito
                cargarCarrito(); // Recargar la tabla con el carrito vacío
            }
        });
    });
}
