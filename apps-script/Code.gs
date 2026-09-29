/**
 * DIMP Systems — receptor del formulario de contacto del sitio.
 *
 * Se publica como Web App (Implementar → Nueva implementación → App web).
 * Cada consulta se guarda como una fila en la hoja "Consultas" de la Google
 * Sheet a la que está vinculado este script, y se manda un aviso por email.
 *
 * Paso a paso de instalación: ver apps-script/README.md en el repo.
 */

const EMAIL_AVISO = 'dimpsystems@gmail.com';
const NOMBRE_HOJA = 'Consultas';
const ENCABEZADOS = ['Fecha', 'Nombre', 'Negocio / empresa', 'Email', 'Mensaje'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Campo trampa: las personas no lo ven; si viene completo es un bot.
    // Respondemos "ok" para no darle pistas, pero no guardamos nada.
    if (p.website) return responder({ ok: true });

    const nombre = limpiar(p.nombre, 120);
    const empresa = limpiar(p.empresa, 120);
    const email = limpiar(p.email, 160);
    const mensaje = limpiar(p.mensaje, 3000);

    if (!nombre || !email || !mensaje) {
      return responder({ ok: false, error: 'Faltan campos obligatorios.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return responder({ ok: false, error: 'El email no es válido.' });
    }

    obtenerHoja().appendRow([new Date(), sinFormula(nombre), sinFormula(empresa), sinFormula(email), sinFormula(mensaje)]);

    MailApp.sendEmail({
      to: EMAIL_AVISO,
      replyTo: email,
      subject: 'Nueva consulta desde la web: ' + nombre + (empresa ? ' (' + empresa + ')' : ''),
      body: [
        'Llegó una nueva consulta desde el formulario de dimpsystems.github.io:',
        '',
        'Nombre: ' + nombre,
        'Negocio / empresa: ' + (empresa || '—'),
        'Email: ' + email,
        '',
        'Mensaje:',
        mensaje,
        '',
        '—',
        'Respondé este email para contestarle directamente.',
        'Todas las consultas: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join('\n'),
    });

    return responder({ ok: true });
  } catch (error) {
    console.error(error);
    return responder({ ok: false, error: 'Error interno.' });
  } finally {
    lock.releaseLock();
  }
}

/** Para probar que el Web App está publicado: abrir la URL /exec en el navegador. */
function doGet() {
  return responder({ ok: true, servicio: 'Formulario DIMP Systems' });
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(ENCABEZADOS);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(5, 480);
  }
  return hoja;
}

function limpiar(valor, largoMaximo) {
  return String(valor || '').trim().slice(0, largoMaximo);
}

/** Evita que un texto que empieza con = + - @ se interprete como fórmula en la planilla. */
function sinFormula(texto) {
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function responder(datos) {
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Ejecutar UNA vez desde el editor (botón ▶ Ejecutar) para dar los permisos
 * y comprobar que llega el email de prueba.
 */
function probarEnvio() {
  const resultado = doPost({ parameter: { nombre: 'Prueba', empresa: 'DIMP', email: EMAIL_AVISO, mensaje: 'Mensaje de prueba del formulario.' } });
  console.log(resultado.getContent());
}
