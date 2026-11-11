// Página de detalle: lee el parámetro de la URL (ej: detalle.html?servicio=press-on)
// y carga la información de esa técnica desde el archivo JSON

// Datos de reserva por si se abre directamente en el navegador con doble clic (file://)
const SERVICIOS_FALLBACK_DETALLE = [
  {
    id: "press-on",
    nombre: "Press on",
    precio: "$50.000",
    duracion: "45 min",
    imagen: "img/press_on.jpg",
    alt: "Uñas press on decoradas",
    descripcion: "Uñas postizas reutilizables, diseñadas a tu gusto y aplicadas en minutos, sin dañar tu uña natural.",
    recomendaciones: [
      "Duran entre una y dos semanas, según el pegamento y el cuidado.",
      "Evita golpear las yemas contra superficies duras y no las arranques.",
      "Usa guantes para limpiar y evita mantener las manos sumergidas en agua."
    ]
  },
  {
    id: "base-rubber",
    nombre: "Base Rubber",
    precio: "$45.000",
    duracion: "1 h",
    imagen: "img/base_rubber.jpg",
    alt: "Uñas con técnica base rubber",
    descripcion: "Base de gel flexible que nivela y fortalece tu uña natural. Incluye limado, cutícula y esmaltado de tu preferencia.",
    recomendaciones: [
      "Ideal si tus uñas son quebradizas o tienen estrías.",
      "Programa el mantenimiento cada 3 o 4 semanas para cuidar el crecimiento.",
      "Aplica aceite de cutícula a diario para mantener la flexibilidad."
    ]
  },
  {
    id: "acrilicas-tips",
    nombre: "Acrílicas tips",
    precio: "$55.000",
    duracion: "1 h 30 min",
    imagen: "img/acrilicas_tips.jpg",
    alt: "Uñas acrílicas con tips de acabado natural",
    descripcion: "Extensión en tips con acabado natural y en el estilo que desees. Incluye limado, cutícula y esmaltado de tu preferencia.",
    recomendaciones: [
      "Llega sin esmalte y con las cutículas hidratadas.",
      "Haz el relleno cada 2 o 3 semanas; pasar de 3 aumenta el riesgo de que se levanten.",
      "No uses las uñas como herramienta para abrir o empujar cosas."
    ]
  },
  {
    id: "dipping",
    nombre: "Dipping",
    precio: "$45.000",
    duracion: "1 h",
    imagen: "img/dipping.jpg",
    alt: "Uñas con técnica dipping",
    descripcion: "Técnica con polvo de color aplicado en capas, de acabado duradero y ligero.",
    recomendaciones: [
      "Ideal para quien busca durabilidad sin usar lámpara UV/LED.",
      "Evita el contacto prolongado con acetona o solventes fuertes.",
      "Aplica crema de manos con regularidad."
    ]
  },
  {
    id: "acrilicas-esculpidas",
    nombre: "Acrílicas esculpidas",
    precio: "$60.000",
    duracion: "2 h",
    imagen: "img/acrilicas_esculpidas.jpg",
    alt: "Uñas acrílicas esculpidas",
    descripcion: "Extensión esculpida sobre molde, hecha a la medida de tu uña, sin usar tips.",
    recomendaciones: [
      "Es la técnica que más tiempo toma: la primera cita puede durar hasta 2 horas.",
      "Programa el relleno cada 2 o 3 semanas para evitar que se levanten.",
      "Llega sin esmalte y con las cutículas hidratadas."
    ]
  },
  {
    id: "polygel",
    nombre: "Polygel",
    precio: "$50.000",
    duracion: "1 h 30 min",
    imagen: "img/polygel.jpg",
    alt: "Uñas con técnica polygel",
    descripcion: "Mezcla de gel y acrílico, ligera y flexible, ideal para alargar o reforzar tus uñas.",
    recomendaciones: [
      "Más ligera que el acrílico tradicional y sin olor fuerte.",
      "Mantenimiento recomendado cada 3 semanas.",
      "Usa guantes para tareas de limpieza doméstica."
    ]
  },
  {
    id: "semipermanente",
    nombre: "Semipermanente",
    precio: "$30.000",
    duracion: "50 min",
    imagen: "img/semi.jpg",
    alt: "Esmaltes para uñas semipermanentes",
    descripcion: "Esmalte en gel curado con lámpara, con brillo y color por varias semanas.",
    recomendaciones: [
      "Dura unas 2 semanas; retíralo entre la semana 2 y la 3.",
      "Si empieza a levantarse, retíralo pronto: la humedad se queda atrapada debajo.",
      "Deja descansar tus uñas alrededor de una semana entre aplicaciones y usa aceite de cutículas."
    ]
  },
  {
    id: "tradicional",
    nombre: "Tradicional",
    precio: "$15.000",
    duracion: "40 min",
    imagen: "img/tradicional.jpg",
    alt: "Uñas con esmaltado tradicional",
    descripcion: "Esmaltado tradicional con limado, cutícula y el color que prefieras.",
    recomendaciones: [
      "Es la opción más rápida y económica, pero dura menos que el gel.",
      "Espera a que el esmalte seque por completo antes de hacer labores manuales.",
      "Hidrata cutículas y manos a diario para que se vean cuidadas."
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  cargarDetalleServicio();
});

async function cargarDetalleServicio() {
  const contenedor = document.getElementById('contenedor-detalle');
  const migaActual = document.getElementById('miga-actual');
  if (!contenedor) return;

  // Sacamos el id de la técnica desde la URL (por defecto press-on si no viene nada)
  const parametros = new URLSearchParams(window.location.search);
  const idServicio = parametros.get('servicio') || 'press-on';

  // Spinner mientras carga
  contenedor.innerHTML = `
    <div class="loader-contenedor">
      <div class="spinner"></div>
      <p>Cargando información de la técnica...</p>
    </div>
  `;

  let servicios = [];

  try {
    const respuesta = await fetch('data/servicios.json');
    if (!respuesta.ok) throw new Error('Error al cargar data/servicios.json');
    servicios = await respuesta.json();
  } catch (error) {
    console.warn('Aviso al cargar detalle con fetch:', error);
    servicios = SERVICIOS_FALLBACK_DETALLE;
  }

  // Buscamos la técnica que coincide con el parámetro
  const servicio = servicios.find(s => s.id === idServicio);

  if (!servicio) {
    if (migaActual) migaActual.textContent = 'Servicio no encontrado';
    contenedor.innerHTML = `
      <div class="error-carga-servicios">
        <i class="fa-solid fa-circle-question" aria-hidden="true"></i>
        <h2>Técnica no encontrada</h2>
        <p>No logramos encontrar la información de la técnica seleccionada.</p>
        <a href="catalogo.html" class="boton">Volver al catálogo</a>
      </div>
    `;
    return;
  }

  // Actualizamos el título de la pestaña y la ruta de navegación (migas de pan)
  document.title = `${servicio.nombre} | Cute Nails`;
  if (migaActual) migaActual.textContent = servicio.nombre;

  // Lista con los tips de cuidado
  const recomendacionesHTML = (servicio.recomendaciones || [])
    .map(rec => `<li>${rec}</li>`)
    .join('');

  // Mostramos 3 técnicas diferentes para la sección "También te podría interesar"
  const otrasTecnicas = servicios
    .filter(s => s.id !== servicio.id)
    .slice(0, 3);

  const tarjetasRelacionadasHTML = otrasTecnicas.map(ot => `
    <article class="tarjeta">
      <img src="${ot.imagen}" alt="${ot.alt || ot.nombre}" loading="lazy">
      <div class="tarjeta-info">
        <h3>${ot.nombre}</h3>
        <p class="precio">${ot.precio}</p>
        <a class="boton" href="detalle.html?servicio=${ot.id}">Ver detalle</a>
      </div>
    </article>
  `).join('');

  const textoWhatsApp = encodeURIComponent(`Hola, quiero agendar una cita para ${servicio.nombre}`);

  // Pintamos toda la información de la uña en el HTML
  contenedor.innerHTML = `
    <article class="detalle">
      <img class="detalle-foto" src="${servicio.imagen}" alt="${servicio.alt || servicio.nombre}">

      <div class="detalle-info">
        <h1>${servicio.nombre}</h1>
        <p class="detalle-precio">${servicio.precio}</p>
        <p class="detalle-descripcion">${servicio.descripcion}</p>

        <ul class="etiquetas">
          <li><i class="fa-regular fa-clock" aria-hidden="true"></i> ${servicio.duracion}</li>
          <li><i class="fa-solid fa-house" aria-hidden="true"></i> A domicilio</li>
        </ul>

        <section class="recomendaciones" aria-labelledby="titulo-recomendaciones">
          <h2 id="titulo-recomendaciones">Recomendaciones</h2>
          <ul>${recomendacionesHTML}</ul>
        </section>

        <p class="nota-agendar">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          Vamos a tu casa en Sahagún, Córdoba. Atendemos de lunes a sábado.
        </p>

        <a class="boton boton-grande" href="https://wa.me/573147051152?text=${textoWhatsApp}" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Agendar ${servicio.nombre} por WhatsApp
        </a>
      </div>
    </article>

    <section class="tecnicas" aria-labelledby="titulo-relacionadas">
      <div class="tecnicas-encabezado">
        <h2 id="titulo-relacionadas">También te podría interesar</h2>
      </div>
      <div class="tarjetas">
        ${tarjetasRelacionadasHTML}
      </div>
    </section>
  `;
}
