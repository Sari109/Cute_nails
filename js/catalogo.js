// Carga del catálogo de servicios usando Fetch asíncrono y filtrado con buscador
// Trae la información desde data/servicios.json y dibuja las tarjetas en pantalla

// Datos de reserva por si la página se abre directo en el navegador con doble clic (file://)
const SERVICIOS_FALLBACK = [
  {
    id: "press-on",
    nombre: "Press on",
    precio: "$50.000",
    duracion: "45 min",
    imagen: "img/press_on.jpg",
    alt: "Uñas press on decoradas",
    descripcion: "Uñas postizas reutilizables, diseñadas a tu gusto y aplicadas en minutos, sin dañar tu uña natural."
  },
  {
    id: "base-rubber",
    nombre: "Base Rubber",
    precio: "$45.000",
    duracion: "1 h",
    imagen: "img/base_rubber.jpg",
    alt: "Uñas con técnica base rubber",
    descripcion: "Base de gel flexible que nivela y fortalece tu uña natural. Incluye limado, cutícula y esmaltado de tu preferencia."
  },
  {
    id: "acrilicas-tips",
    nombre: "Acrílicas tips",
    precio: "$55.000",
    duracion: "1 h 30 min",
    imagen: "img/acrilicas_tips.jpg",
    alt: "Uñas acrílicas con tips de acabado natural",
    descripcion: "Extensión en tips con acabado natural y en el estilo que desees. Incluye limado, cutícula y esmaltado de tu preferencia."
  },
  {
    id: "dipping",
    nombre: "Dipping",
    precio: "$45.000",
    duracion: "1 h",
    imagen: "img/dipping.jpg",
    alt: "Uñas con técnica dipping",
    descripcion: "Técnica con polvo de color aplicado en capas, de acabado duradero y ligero."
  },
  {
    id: "acrilicas-esculpidas",
    nombre: "Acrílicas esculpidas",
    precio: "$60.000",
    duracion: "2 h",
    imagen: "img/acrilicas_esculpidas.jpg",
    alt: "Uñas acrílicas esculpidas",
    descripcion: "Extensión esculpida sobre molde, hecha a la medida de tu uña, sin usar tips."
  },
  {
    id: "polygel",
    nombre: "Polygel",
    precio: "$50.000",
    duracion: "1 h 30 min",
    imagen: "img/polygel.jpg",
    alt: "Uñas con técnica polygel",
    descripcion: "Mezcla de gel y acrílico, ligera y flexible, ideal para alargar o reforzar tus uñas."
  },
  {
    id: "semipermanente",
    nombre: "Semipermanente",
    precio: "$30.000",
    duracion: "50 min",
    imagen: "img/semi.jpg",
    alt: "Esmaltes para uñas semipermanentes",
    descripcion: "Esmalte en gel curado con lámpara, con brillo y color por varias semanas."
  },
  {
    id: "tradicional",
    nombre: "Tradicional",
    precio: "$15.000",
    duracion: "40 min",
    imagen: "img/tradicional.jpg",
    alt: "Uñas con esmaltado tradicional",
    descripcion: "Esmaltado tradicional con limado, cutícula y el color que prefieras."
  }
];

let listaServiciosGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
  inicializarCatalogo();
});

function inicializarCatalogo() {
  const contenedorTarjetas = document.getElementById('contenedor-servicios');
  const buscador = document.getElementById('buscador-servicios');

  if (!contenedorTarjetas) return;

  // Hacemos la petición para cargar los datos
  cargarServicios();

  // Escuchamos lo que la persona escribe en el buscador para filtrar en vivo
  if (buscador) {
    buscador.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      filtrarServicios(termino);
    });
  }
}

// Petición asíncrona con fetch y async/await para consultar data/servicios.json
async function cargarServicios() {
  const contenedorTarjetas = document.getElementById('contenedor-servicios');
  if (!contenedorTarjetas) return;

  // Mientras responde la petición, mostramos el spinner de carga
  mostrarLoader(contenedorTarjetas);

  try {
    // Pausa breve (350ms) para que la animación de carga sea perceptible
    await new Promise(resolve => setTimeout(resolve, 350));

    const respuesta = await fetch('data/servicios.json');

    // Revisamos los códigos de estado HTTP
    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error('El archivo data/servicios.json no fue encontrado (Error 404).');
      } else if (respuesta.status >= 500) {
        throw new Error(`Error en el servidor al cargar los servicios (Error ${respuesta.status}).`);
      } else {
        throw new Error(`Respuesta no exitosa del servidor (Código ${respuesta.status}).`);
      }
    }

    // Convertimos la respuesta a formato JSON
    const datos = await respuesta.json();
    listaServiciosGlobal = Array.isArray(datos) ? datos : [];

    // Mostramos las tarjetas en la página
    renderizarTarjetas(listaServiciosGlobal);

  } catch (error) {
    console.error('Error al cargar servicios:', error);

    // Si se abrió localmente con file:// y el navegador bloqueó la petición, usamos los datos de respaldo
    if (window.location.protocol === 'file:' && SERVICIOS_FALLBACK.length > 0) {
      listaServiciosGlobal = SERVICIOS_FALLBACK;
      renderizarTarjetas(listaServiciosGlobal);
    } else {
      // Si fue un error real de red o del servidor, mostramos el aviso con botón de reintentar
      mostrarErrorCarga(contenedorTarjetas, error.message);
    }
  }
}

// Muestra el spinner animado de carga
function mostrarLoader(contenedor) {
  contenedor.innerHTML = `
    <div class="loader-contenedor" role="status" aria-live="polite">
      <div class="spinner"></div>
      <p>Cargando técnicas disponibles...</p>
    </div>
  `;
}

// Mensaje cuando la petición falla, con opción para volver a intentar
function mostrarErrorCarga(contenedor, mensaje) {
  contenedor.innerHTML = `
    <div class="error-carga-servicios" role="alert">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <h3>No pudimos cargar los servicios</h3>
      <p>${mensaje || 'Ocurrió un inconveniente al cargar las técnicas.'}</p>
      <button type="button" class="boton" id="btn-reintentar-carga">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
      </button>
    </div>
  `;

  const btnReintentar = document.getElementById('btn-reintentar-carga');
  if (btnReintentar) {
    btnReintentar.addEventListener('click', () => {
      cargarServicios();
    });
  }
}

// Crea las tarjetas de cada técnica en el catálogo
function renderizarTarjetas(servicios) {
  const contenedorTarjetas = document.getElementById('contenedor-servicios');
  if (!contenedorTarjetas) return;

  contenedorTarjetas.innerHTML = '';

  // Si la búsqueda no encontró nada
  if (servicios.length === 0) {
    contenedorTarjetas.innerHTML = `
      <div class="filtro-vacio">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <p>No encontramos ninguna técnica que coincida con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  servicios.forEach(servicio => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';

    // El botón lleva a la página única pasando el id del servicio
    tarjeta.innerHTML = `
      <img src="${servicio.imagen}" alt="${servicio.alt || servicio.nombre}" loading="lazy">
      <div class="tarjeta-info">
        <h3>${servicio.nombre}</h3>
        <p class="precio">${servicio.precio}</p>
        <p class="duracion"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${servicio.duracion}</p>
        <a class="boton" href="detalle.html?servicio=${servicio.id}">Ver detalle</a>
      </div>
    `;

    contenedorTarjetas.appendChild(tarjeta);
  });
}

// Filtra las técnicas según el nombre, descripción o categoría mientras se escribe
function filtrarServicios(termino) {
  if (!termino) {
    renderizarTarjetas(listaServiciosGlobal);
    return;
  }

  const filtrados = listaServiciosGlobal.filter(s => {
    const nombreCoincide = s.nombre.toLowerCase().includes(termino);
    const descCoincide = s.descripcion && s.descripcion.toLowerCase().includes(termino);
    const catCoincide = s.categoria && s.categoria.toLowerCase().includes(termino);
    return nombreCoincide || descCoincide || catCoincide;
  });

  renderizarTarjetas(filtrados);
}
