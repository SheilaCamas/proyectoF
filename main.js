
/**
 * array de los helados, que contiene los tipos, nombre, precio e imagen.
 */
const helados = [
    {
        id: 1,
        nombre: 'Vainilla',
        precio: 8.0,
        imagen: 'img/naranja.jpg'
    },
    {
        id: 2,
        nombre: 'Pistache',
        precio: 20.0,
        imagen: 'img/menta.jpg'
    },
    {
        id: 3,
        nombre: 'Uva',
        precio: 30.0,
        imagen: 'img/uva.jpg'
    },
    {
        id: 4,
        nombre: 'Coco',
        precio: 15.0,
        imagen: 'img/coco.jpg'
    },
    {
        id: 5,
        nombre: 'Oreo',
        precio: 20.0,
        imagen: 'img/oreo.jpg'
    },
    {
        id: 6,
        nombre: 'Chocolate',
        precio: 25.0,
        imagen: 'img/chocolate.jpg'
    }
]

/**
 * Array vacio, pero que contendrá los helados seleccionados
 */
let carrito = [];

/**
 * Agregamos una divisa constante MXN para indicar que los precios son en peso mexicano
*/
const divisa = 'MXN';

/**
 * Se definen varias constantes y variables que hacen referencia a elementos del DOM, como contenedores, botones e imágenes.
 * */
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMsubtotal = document.querySelector('#subtotal');
const DOMimpuestos = document.querySelector('#iva');
const DOMbotonComprar = document.querySelector('#boton-comprar');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMImages = document.querySelectorAll('img');

/**
 * Se crea una instancia de IntersectionObserver llamada obsevador, que se utilizará para cargar las imágenes de forma diferida cuando sean visibles en la ventana del navegador.
 */
const obsevador = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const imagen = entry.target;
            observer.unobserve(imagen);
        }
    });
});

/**
 * Se recorre la lista de imágenes obtenidas a través de DOMImages y se configura cada imagen con su atributo src correspondiente. Luego, se observa cada imagen utilizando el observador obsevador.
 */
DOMImages.forEach((imagen) => {
    imagen.src = imagen.dataset.src;
    observer.observer(imagen);
});


/**
 * Esta función recorre el array de helados y crea dinámicamente elementos HTML para cada helado, como una tarjeta con su imagen, nombre, precio y un botón para agregarlo al carrito.
 */
function renderizarProductos() {
    helados.forEach((info) => {
        const helados = document.createElement('div');
        helados.classList.add('helados');

        const card = document.createElement('div');
        card.classList.add('card');

        const imagenes = document.createElement('img');
        imagenes.classList.add('images');
        imagenes.setAttribute('src', info.imagen);

        const titulo = document.createElement('h2');
        titulo.classList.add('titulo');
        titulo.textContent = info.nombre;

        const cardPrecio = document.createElement('div');
        cardPrecio.classList.add('precio');

        const precio = document.createElement('p');
        precio.classList.add('texto-precio');
        precio.textContent = '$' + info.precio + ' ' + divisa;

        const boton = document.createElement('button');
        /**
         * Esta función se ejecuta cuando se hace clic en el botón de agregar de un helado.
         */
        boton.classList.add('btn-agregar');
        boton.textContent = 'Agregar';
        boton.setAttribute('marcador', info.id);
        /**
         * Esta función se ejecuta cuando se hace clic en el botón de agregar de un helado.
         */
        boton.addEventListener('click', agregarCarritoClick);

        card.appendChild(imagenes);
        card.appendChild(titulo);
        cardPrecio.appendChild(precio);
        cardPrecio.appendChild(boton);
        card.appendChild(cardPrecio);
        helados.appendChild(card);
        DOMitems.appendChild(helados);

    });
}

/**
 * Obtiene el ID del helado seleccionado a través del atributo marcador del botón y lo agrega al array carrito.
 */
function agregarCarritoClick(evento) {
    carrito.push(evento.target.getAttribute('marcador'));
    renderizarCarrito();
}

/**
 * Esta función actualiza la visualización del carrito en el DOM.
 */
function renderizarCarrito() {
    /**
     * Comienza limpiando el contenido anterior del elemento DOMcarrito.
     */
    DOMcarrito.textContent = '';

    const carritoSinDuplicados = [...new Set(carrito)];

    carritoSinDuplicados.forEach((item) => {
        const producto = helados.filter((itemHelado) => {
            return itemHelado.id === parseInt(item);
        });

        /**
         * Para cada producto, calcula el número de elementos y busca la información del producto correspondiente en el array helados.
         */
        const numeroItems = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);

        /**
         * Crea una lista de elementos de carrito (<li>) para cada producto en el carrito.
         */
        const carritohelados = document.createElement('li');
        carritohelados.classList.add('carrito-item');

        /**
         * Para cada producto, calcula el número de elementos y busca la información del producto correspondiente en el array helados.
         */
        carritohelados.textContent = `${numeroItems} x ${producto[0].nombre} - ${producto[0].precio} ${divisa}`;

        DOMcarrito.appendChild(carritohelados);
    });

    /**
     * Al final, se calcula el total, los impuestos y el subtotal del carrito, y se actualizan los elementos correspondientes en el DOM.
     */
    const total = parseFloat(calcularTotal());
    const impuesto = calcularImpuesto(total);
    const totalImpuesto = total + impuesto;

    DOMimpuestos.textContent = impuesto.toFixed(2);
    DOMsubtotal.textContent = total.toFixed(2);
    DOMtotal.textContent = totalImpuesto.toFixed(2);

}


/**
 * Esta función se ejecuta cuando se hace clic en el botón "Vaciar carrito".
 */
function vaciarCarrito() {

    /**
     * Restablece el array carrito a un estado vacío y actualiza la visualización del carrito llamando a renderizarCarrito.
     */
    carrito = [];
    renderizarCarrito();
}

/**
 * Esta función recibe el total de la compra y calcula el impuesto (IVA) basado en un porcentaje fijo.
 */
function calcularImpuesto(total) {
    const porcentajeIVA = 16; // Porcentaje del impuesto IVA
    const impuesto = (total * porcentajeIVA) / 100;

    /**
     * Retorna el valor del impuesto calculado.
     */
    return impuesto;
}


/**
 *  Esta función calcula el total de la compra sumando los precios de los productos en el carrito.
 */
function calcularTotal() {

    /**
     * Utiliza el array carrito para buscar los productos correspondientes en el array helados y obtener sus precios
     */
    return carrito.reduce((total, item) => {
        const producto = helados.filter((itemHelado) => {
            return itemHelado.id === parseInt(item);
        });

        return total + producto[0].precio;
    }, 0).toFixed(2);
}

/**
 * Se agregan dos event listeners a los botones de compra y vaciado del carrito.
 */


/**
 * Cuando se hace clic en el botón de comprar (DOMbotonComprar), se verifica si el carrito está vacío. Si es así, se detiene la ejecución. De lo contrario, se muestra un mensaje de agradecimiento con el resumen de la compra, se vacía el carrito llamando a vaciarCarrito y se muestra una alerta con el mensaje.
 */
DOMbotonComprar.addEventListener('click', () => {

    if (carrito.length === 0) return;

    const msj = `
    **** Gracias por su preferencia *** \n
    IVA: ${DOMimpuestos.textContent} ${divisa} \n
    Subtotal: ${DOMsubtotal.textContent} ${divisa} \n
    Total a pagar: ${DOMtotal.textContent} ${divisa} 
    `;
    vaciarCarrito();
    alert(msj);
});

/**
 * Cuando se hace clic en el botón de vaciar el carrito (DOMbotonVaciar), se llama a la función vaciarCarrito para eliminar todos los elementos del carrito y actualizar la visualización.
 */
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

/**
 * Después de definir todas las funciones, se llaman a las funciones renderizarProductos y renderizarCarrito para inicializar la visualización de los productos y el carrito en el momento de la carga de la página.
 */
renderizarProductos();
renderizarCarrito();