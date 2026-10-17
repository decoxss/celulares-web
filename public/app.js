const contenedor = document.getElementById('productos');
const estado = document.getElementById('estado');
const listaCarrito = document.getElementById('lista-carrito');
const totalTexto = document.getElementById('total');
const cantidadTexto = document.getElementById('cantidad-carrito');

let celulares = [];
let carrito = [];

function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

function obtenerImagen(celular) {
    const marca = String(celular.marca).toLowerCase();
    const modelo = String(celular.modelo).toLowerCase();

    if (marca.includes('samsung')) {
        return 'img/samsung.jpg';
    }

    if (marca.includes('apple') || modelo.includes('iphone')) {
        return 'img/iphone.jpg';
    }

    if (marca.includes('xiaomi')) {
        return 'img/xiaomi.jpg';
    }

    if (marca.includes('motorola')) {
        return 'img/motorola.jpg';
    }

    return 'img/samsung.jpg';
}

async function cargarCelulares() {
    try {
        const respuesta = await fetch('/api/celulares');

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los celulares');
        }

        celulares = await respuesta.json();

        estado.textContent = celulares.length
            ? ''
            : 'No hay celulares registrados.';

        mostrarCelulares();
    } catch (error) {
        estado.textContent = 'No se pudieron cargar los celulares. Revisa el servidor.';
        console.error(error);
    }
}

function mostrarCelulares() {
    contenedor.innerHTML = celulares.map(celular => `
        <article class="producto">
            <div class="imagen">
                <img
                    src="${obtenerImagen(celular)}"
                    alt="${escapar(celular.marca)} ${escapar(celular.modelo)}"
                    onerror="this.style.display='none'"
                >
            </div>

            <div class="contenido">
                <span class="marca">${escapar(celular.marca)}</span>
                <h3>${escapar(celular.modelo)}</h3>

                <p class="precio">
                    $${Number(celular.precio).toLocaleString('es-MX', {
                        minimumFractionDigits: 2
                    })}
                </p>

                <p class="stock">${celular.stock} disponibles</p>

                <button class="boton"
                    onclick="agregarAlCarrito(${Number(celular.id)})"
                    ${celular.stock <= 0 ? 'disabled' : ''}>
                    Agregar al carrito
                </button>
            </div>
        </article>
    `).join('');
}

function agregarAlCarrito(id) {
    const celular = celulares.find(item => item.id === id);

    if (!celular) return;

    const elemento = carrito.find(item => item.id === id);
    const cantidadActual = elemento ? elemento.cantidad : 0;

    if (cantidadActual >= celular.stock) {
        alert('No hay más existencias disponibles.');
        return;
    }

    if (elemento) {
        elemento.cantidad++;
    } else {
        carrito.push({ ...celular, cantidad: 1 });
    }

    mostrarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    mostrarCarrito();
}

function mostrarCarrito() {
    listaCarrito.innerHTML = carrito.length
        ? carrito.map(item => `
            <div class="item-carrito">
                <div>
                    <strong>${escapar(item.marca)} ${escapar(item.modelo)}</strong>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>
                        Subtotal: $${(Number(item.precio) * item.cantidad)
                            .toLocaleString('es-MX', {
                                minimumFractionDigits: 2
                            })}
                    </p>
                </div>

                <button class="quitar"
                    onclick="quitarDelCarrito(${Number(item.id)})">
                    Quitar
                </button>
            </div>
        `).join('')
        : '<p>Tu carrito está vacío.</p>';

    const cantidad = carrito.reduce(
        (suma, item) => suma + item.cantidad, 0
    );

    const total = carrito.reduce(
        (suma, item) => suma + Number(item.precio) * item.cantidad, 0
    );

    cantidadTexto.textContent = cantidad;

    totalTexto.textContent = `Total: $${total.toLocaleString('es-MX', {
        minimumFractionDigits: 2
    })} MXN`;
}

cargarCelulares();
