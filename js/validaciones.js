// Script de validaciones para los formularios de Contacto y Reseñas  
// Revisa que los datos ingresados sean correctos mientras el usuario escribe y al enviar el formulario. 

document.addEventListener('DOMContentLoaded', () => {
  inicializarValidacionesContacto();
  inicializarValidacionesResenas();
});

// Comprueba que el texto solo contenga letras (con tildes o eñes) y tenga una longitud válida
function validarSoloLetras(valor, min = 3, max = 50) {
  const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  const textoLimpio = valor.trim();
  if (textoLimpio.length < min || textoLimpio.length > max) {
    return { valido: false, mensaje: `Debe contener entre ${min} y ${max} letras.` };
  }
  if (!patron.test(textoLimpio)) {
    return { valido: false, mensaje: 'Solo se permiten letras y espacios (sin números ni símbolos).' };
  }
  return { valido: true };
}

// Verifica que el correo tenga una estructura correcta (ejemplo: usuario@correo.com)
function validarCorreo(valor) {
  const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const correoLimpio = valor.trim();
  if (!correoLimpio) {
    return { valido: false, mensaje: 'El correo electrónico es obligatorio.' };
  }
  if (!patron.test(correoLimpio)) {
    return { valido: false, mensaje: 'Ingresa un correo electrónico válido (ejemplo: usuario@correo.com).' };
  }
  return { valido: true };
}

// En Colombia los números de celular tienen exactamente 10 dígitos numéricos
function validarTelefono(valor) {
  const telefonoLimpio = valor.trim();
  const patron = /^[0-9]{10}$/;
  if (!telefonoLimpio) {
    return { valido: false, mensaje: 'El número de teléfono es obligatorio.' };
  }
  if (!patron.test(telefonoLimpio)) {
    return { valido: false, mensaje: 'El teléfono debe tener exactamente 10 dígitos numéricos.' };
  }
  return { valido: true };
}

// Verifica que se haya seleccionado una opción en el menú desplegable
function validarSeleccion(valor, nombreCampo = 'este campo') {
  if (!valor || valor.trim() === '') {
    return { valido: false, mensaje: `Por favor selecciona una opción para ${nombreCampo}.` };
  }
  return { valido: true };
}

// Revisa que el mensaje no sea demasiado corto ni supere el límite permitido
function validarLongitudTexto(valor, min = 10, max = 500) {
  const textoLimpio = valor.trim();
  if (textoLimpio.length < min) {
    return { valido: false, mensaje: `El mensaje debe tener al menos ${min} caracteres (actual: ${textoLimpio.length}).` };
  }
  if (textoLimpio.length > max) {
    return { valido: false, mensaje: `El mensaje no puede superar los ${max} caracteres.` };
  }
  return { valido: true };
}

// Valida que la calificación sea un número entre 1 y 5
function validarCalificacion(valor, min = 1, max = 5) {
  const numero = Number(valor);
  if (!valor || isNaN(numero) || numero < min || numero > max) {
    return { valido: false, mensaje: `Ingresa una calificación válida entre ${min} y ${max}.` };
  }
  return { valido: true };
}

// Marca el campo en rojo y crea un mensaje de error justo debajo
function mostrarErrorCampo(campoElemento, mensaje) {
  const contenedor = campoElemento.closest('.campo') || campoElemento.parentElement;
  campoElemento.classList.remove('valido');
  campoElemento.classList.add('invalido');

  // Si ya existía un mensaje de error previo, lo reutilizamos
  let mensajeError = contenedor.querySelector('.mensaje-error');
  if (!mensajeError) {
    mensajeError = document.createElement('span');
    mensajeError.className = 'mensaje-error';
    mensajeError.setAttribute('role', 'alert');
    contenedor.appendChild(mensajeError);
  }
  mensajeError.innerHTML = `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${mensaje}`;
}

// Quita el mensaje de error y marca el campo con borde verde si todo está bien
function limpiarErrorCampo(campoElemento) {
  const contenedor = campoElemento.closest('.campo') || campoElemento.parentElement;
  campoElemento.classList.remove('invalido');
  campoElemento.classList.add('valido');

  const mensajeError = contenedor.querySelector('.mensaje-error');
  if (mensajeError) {
    mensajeError.remove();
  }
}

// Muestra una notificación temporal de éxito o error al enviar el formulario
function mostrarAlertaFormulario(formulario, mensaje, tipo = 'exito') {
  const alertaPrevia = formulario.querySelector('.alerta-formulario');
  if (alertaPrevia) alertaPrevia.remove();

  const alerta = document.createElement('div');
  alerta.className = `alerta-formulario ${tipo}`;
  const icono = tipo === 'exito' ? 'fa-circle-check' : 'fa-circle-xmark';
  alerta.innerHTML = `<i class="fa-solid ${icono}" aria-hidden="true"></i> <span>${mensaje}</span>`;

  formulario.appendChild(alerta);

  // Se borra sola después de 6 segundos si es de éxito
  if (tipo === 'exito') {
    setTimeout(() => {
      alerta.remove();
    }, 6000);
  }
}

// --- Formulario de Contacto ---
function inicializarValidacionesContacto() {
  const form = document.querySelector('form[action="contacto.html"]');
  if (!form) return;

  // Desactivamos la validación nativa para usar nuestros propios avisos visuales
  form.setAttribute('novalidate', 'true');

  const inputNombre = form.querySelector('#nombre');
  const inputCorreo = form.querySelector('#correo');
  const inputTelefono = form.querySelector('#telefono');
  const selectServicio = form.querySelector('#servicio');
  const textareaMensaje = form.querySelector('#mensaje');

  function validarCampo(input) {
    let resultado = { valido: true };

    if (input === inputNombre) {
      resultado = validarSoloLetras(input.value, 3, 50);
    } else if (input === inputCorreo) {
      resultado = validarCorreo(input.value);
    } else if (input === inputTelefono) {
      resultado = validarTelefono(input.value);
    } else if (input === selectServicio) {
      resultado = validarSeleccion(input.value, 'el servicio');
    } else if (input === textareaMensaje) {
      resultado = validarLongitudTexto(input.value, 10, 500);
    }

    if (!resultado.valido) {
      mostrarErrorCampo(input, resultado.mensaje);
      return false;
    } else {
      limpiarErrorCampo(input);
      return true;
    }
  }

  // Validar en tiempo real mientras el usuario escribe o cambia de campo
  [inputNombre, inputCorreo, inputTelefono, textareaMensaje].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  if (selectServicio) {
    selectServicio.addEventListener('change', () => validarCampo(selectServicio));
    selectServicio.addEventListener('blur', () => validarCampo(selectServicio));
  }

  // Al dar clic en enviar mensaje
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const esNombreValido = validarCampo(inputNombre);
    const esCorreoValido = validarCampo(inputCorreo);
    const esTelefonoValido = validarCampo(inputTelefono);
    const esServicioValido = validarCampo(selectServicio);
    const esMensajeValido = validarCampo(textareaMensaje);

    const todoValido = esNombreValido && esCorreoValido && esTelefonoValido && esServicioValido && esMensajeValido;

    if (!todoValido) {
      // Lleva el cursor al primer campo que tenga error
      const primerInvalido = form.querySelector('.invalido');
      if (primerInvalido) primerInvalido.focus();
      mostrarAlertaFormulario(form, 'Por favor corrige los campos marcados en rojo antes de enviar.', 'error');
      return;
    }

    mostrarAlertaFormulario(form, '¡Muchas gracias! Tu mensaje ha sido enviado. Te responderemos muy pronto.', 'exito');
    form.reset();

    // Limpiamos los bordes verdes tras reiniciar el formulario
    form.querySelectorAll('.valido').forEach(el => el.classList.remove('valido'));
  });
}

// --- Formulario de Reseñas ---
function inicializarValidacionesResenas() {
  const form = document.querySelector('form[action="resenas.html"]');
  if (!form) return;

  form.setAttribute('novalidate', 'true');

  const inputNombre = form.querySelector('#nombre');
  const inputCorreo = form.querySelector('#correo');
  const selectServicio = form.querySelector('#servicio');
  const inputFecha = form.querySelector('#fecha');
  const inputCalificacion = form.querySelector('#calificacion');
  const textareaComentario = form.querySelector('#comentario');
  const checkAcepto = form.querySelector('#acepto');

  function validarCampo(input) {
    let resultado = { valido: true };

    if (input === inputNombre) {
      resultado = validarSoloLetras(input.value, 3, 40);
    } else if (input === inputCorreo) {
      resultado = validarCorreo(input.value);
    } else if (input === selectServicio) {
      resultado = validarSeleccion(input.value, 'la técnica');
    } else if (input === inputFecha) {
      resultado = input.value ? { valido: true } : { valido: false, mensaje: 'Por favor selecciona la fecha del servicio.' };
    } else if (input === inputCalificacion) {
      resultado = validarCalificacion(input.value, 1, 5);
    } else if (input === textareaComentario) {
      resultado = validarLongitudTexto(input.value, 20, 500);
    } else if (input === checkAcepto) {
      resultado = input.checked ? { valido: true } : { valido: false, mensaje: 'Debes aceptar la publicación de tu reseña.' };
    }

    if (!resultado.valido) {
      mostrarErrorCampo(input, resultado.mensaje);
      return false;
    } else {
      limpiarErrorCampo(input);
      return true;
    }
  }

  // Eventos para validar mientras se llena el formulario
  [inputNombre, inputCorreo, inputCalificacion, textareaComentario].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  [selectServicio, inputFecha].forEach(input => {
    if (!input) return;
    input.addEventListener('change', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
  });

  if (checkAcepto) {
    checkAcepto.addEventListener('change', () => validarCampo(checkAcepto));
  }

  // Al enviar la reseña
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const esNombreValido = validarCampo(inputNombre);
    const esCorreoValido = validarCampo(inputCorreo);
    const esServicioValido = validarCampo(selectServicio);
    const esFechaValido = validarCampo(inputFecha);
    const esCalificacionValido = validarCampo(inputCalificacion);
    const esComentarioValido = validarCampo(textareaComentario);
    const esAceptoValido = validarCampo(checkAcepto);

    const todoValido = esNombreValido && esCorreoValido && esServicioValido &&
                       esFechaValido && esCalificacionValido && esComentarioValido && esAceptoValido;

    if (!todoValido) {
      const primerInvalido = form.querySelector('.invalido');
      if (primerInvalido) primerInvalido.focus();
      mostrarAlertaFormulario(form, 'Por favor corrige los campos marcados antes de enviar.', 'error');
      return;
    }

    // Le pasamos los datos al script de resenas.js para que los guarde en localStorage
    const eventoResenaValida = new CustomEvent('resenaValida', {
      detail: {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        servicio: selectServicio.options[selectServicio.selectedIndex].text,
        servicioValor: selectServicio.value,
        fecha: inputFecha.value,
        calificacion: Number(inputCalificacion.value),
        comentario: textareaComentario.value.trim()
      }
    });
    form.dispatchEvent(eventoResenaValida);

    if (!form.dataset.manejoPersonalizado) {
      mostrarAlertaFormulario(form, '¡Formulario validado con éxito! Listo para guardar.', 'exito');
      form.reset();
      form.querySelectorAll('.valido').forEach(el => el.classList.remove('valido'));
    }
  });
}
