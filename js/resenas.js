// Manejo de reseñas: guardado en localStorage y actualización de la lista en pantalla
// Permite agregar nuevas opiniones y borrar las existentes sin recargar la página

const CLAVE_LOCALSTORAGE_RESENAS = 'cutenails_resenas_v1';

// Opiniones de ejemplo para que la sección no se vea vacía la primera vez que se abre la página
const RESENAS_SEMILLA = [
  {
    id: 1731000001,
    nombre: 'Valentina Ruiz',
    servicio: 'Base Rubber',
    servicioValor: 'base-rubber',
    fecha: '2026-10-18',
    calificacion: 5,
    comentario: 'Excelente servicio a domicilio en Sahagún. Me encantó el acabado y la dedicación con mis uñas naturales, ¡quedaron súper resistentes!'
  },
  {
    id: 1731000002,
    nombre: 'Camila Gómez',
    servicio: 'Press on',
    servicioValor: 'press-on',
    fecha: '2026-10-24',
    calificacion: 5,
    comentario: 'Hermoso diseño press on, duradero y cómodo. La atención fue puntual y muy profesional. ¡Recomendadísima al 100%!'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  inicializarModuloResenas();
});

function inicializarModuloResenas() {
  const formResenas = document.querySelector('form[action="resenas.html"]');
  const contenedorLista = document.getElementById('contenedor-resenas');

  if (!contenedorLista) return;

  if (formResenas) {
    // Le avisamos a validaciones.js que nosotros nos encargamos de guardar la reseña
    formResenas.dataset.manejoPersonalizado = 'true';

    // Cuando el formulario pasa todas las validaciones con éxito
    formResenas.addEventListener('resenaValida', (evento) => {
      const datosNuevaResena = evento.detail;
      agregarResena(datosNuevaResena);

      // Aviso de confirmación
      if (typeof mostrarAlertaFormulario === 'function') {
        mostrarAlertaFormulario(formResenas, '¡Gracias por tu opinión! Tu reseña ha sido publicada con éxito.', 'exito');
      }

      // Dejar el formulario limpio
      formResenas.reset();
      formResenas.querySelectorAll('.valido').forEach(el => el.classList.remove('valido'));

      // Bajamos suavemente la vista para que el usuario vea su nueva reseña
      contenedorLista.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Mostramos las reseñas que estén guardadas
  renderizarResenas();
}

// Carga las reseñas desde el almacenamiento del navegador (o pone las de ejemplo si está vacío)
function obtenerResenas() {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_LOCALSTORAGE_RESENAS);
    if (!datosGuardados) {
      guardarEnLocalStorage(RESENAS_SEMILLA);
      return [...RESENAS_SEMILLA];
    }
    const parseadas = JSON.parse(datosGuardados);
    return Array.isArray(parseadas) ? parseadas : [];
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return [];
  }
}

// Guarda la lista actualizada en localStorage convertida a texto JSON
function guardarEnLocalStorage(listaResenas) {
  try {
    localStorage.setItem(CLAVE_LOCALSTORAGE_RESENAS, JSON.stringify(listaResenas));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

// Crea la nueva reseña, la pone de primera en la lista y la guarda
function agregarResena(datos) {
  const lista = obtenerResenas();
  const nuevaResena = {
    id: Date.now(), // Usamos la fecha y hora actual como ID único
    nombre: datos.nombre,
    servicio: datos.servicio,
    servicioValor: datos.servicioValor,
    fecha: datos.fecha,
    calificacion: Number(datos.calificacion),
    comentario: datos.comentario
  };

  lista.unshift(nuevaResena);
  guardarEnLocalStorage(lista);
  renderizarResenas();
}

// Pide confirmación y elimina la reseña seleccionada
function eliminarResena(id) {
  const confirmacion = confirm('¿Deseas eliminar esta reseña?');
  if (!confirmacion) return;

  const listaActual = obtenerResenas();
  const listaFiltrada = listaActual.filter(item => item.id !== id);
  guardarEnLocalStorage(listaFiltrada);
  renderizarResenas();
}

// Dibuja las estrellas según la nota dada (de 1 a 5)
function generarEstrellasHTML(calificacion) {
  const nota = Math.max(1, Math.min(5, Math.round(calificacion)));
  let estrellasHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= nota) {
      estrellasHTML += '<i class="fa-solid fa-star" aria-hidden="true"></i>';
    } else {
      estrellasHTML += '<i class="fa-regular fa-star" aria-hidden="true"></i>';
    }
  }
  return estrellasHTML;
}

// Pinta todas las tarjetas de reseñas en el HTML
function renderizarResenas() {
  const contenedor = document.getElementById('contenedor-resenas');
  const mensajeVacio = document.querySelector('.opiniones-vacio');
  if (!contenedor) return;

  const resenas = obtenerResenas();

  // Si no hay ninguna reseña, mostramos el mensaje de aviso
  if (resenas.length === 0) {
    contenedor.innerHTML = '';
    if (mensajeVacio) mensajeVacio.style.display = 'block';
    return;
  }

  if (mensajeVacio) mensajeVacio.style.display = 'none';

  contenedor.innerHTML = '';

  resenas.forEach(resena => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-resena';
    tarjeta.dataset.id = resena.id;

    tarjeta.innerHTML = `
      <header class="resena-cabecera">
        <div class="resena-autor-grupo">
          <div class="resena-avatar" aria-hidden="true">${resena.nombre.charAt(0).toUpperCase()}</div>
          <div>
            <h3 class="resena-autor">${escapeHTML(resena.nombre)}</h3>
            <span class="resena-tecnica"><i class="fa-solid fa-spa" aria-hidden="true"></i> ${escapeHTML(resena.servicio)}</span>
          </div>
        </div>
        <div class="resena-estrellas" aria-label="Calificación: ${resena.calificacion} de 5 estrellas">
          ${generarEstrellasHTML(resena.calificacion)}
        </div>
      </header>

      <p class="resena-comentario">${escapeHTML(resena.comentario)}</p>

      <footer class="resena-pie">
        <span class="resena-fecha"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${formatearFecha(resena.fecha)}</span>
        <button type="button" class="boton-eliminar-resena" title="Eliminar reseña" aria-label="Eliminar reseña de ${escapeHTML(resena.nombre)}">
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Eliminar
        </button>
      </footer>
    `;

    // Botón para borrar la reseña directamente
    const btnEliminar = tarjeta.querySelector('.boton-eliminar-resena');
    btnEliminar.addEventListener('click', () => {
      eliminarResena(resena.id);
    });

    contenedor.appendChild(tarjeta);
  });
}

// Limpia caracteres para evitar problemas con etiquetas HTML
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto || '';
  return div.innerHTML;
}

// Convierte la fecha del formato AAAA-MM-DD a uno más legible (ej: 24 de oct de 2026)
function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  try {
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
      return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return fechaStr;
  } catch {
    return fechaStr;
  }
}
