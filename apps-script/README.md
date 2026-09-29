# Formulario de contacto → Google Sheets + aviso por email

El formulario del sitio envía las consultas a un **Google Apps Script** publicado
como Web App. El script guarda cada consulta en una Google Sheet y manda un aviso
a `dimpsystems@gmail.com`. No hay servidor ni costo.

## Paso a paso (una sola vez, ~5 minutos)

Hacerlo con la cuenta de Google `dimpsystems@gmail.com`, así la planilla y los
avisos quedan a nombre de DIMP.

1. **Crear la planilla.** Entrar a <https://sheets.new> y ponerle de nombre
   `DIMP — Consultas web`.
2. **Abrir el editor de scripts.** En la planilla: menú **Extensiones → Apps Script**.
3. **Pegar el código.** Borrar lo que haya en `Código.gs`, pegar todo el contenido
   de [`Code.gs`](Code.gs) y guardar (ícono de disquete o `Ctrl + S`).
   Arriba a la izquierda, renombrar el proyecto a `Formulario web DIMP`.
4. **Dar permisos y probar.** En la barra de arriba elegir la función
   `probarEnvio` y tocar **▶ Ejecutar**. Google va a pedir autorización:
   - **Revisar permisos** → elegir la cuenta de DIMP.
   - Si aparece "Google no verificó esta app": **Configuración avanzada →
     Ir a Formulario web DIMP (no seguro)**. Es normal: la app es tuya y no
     está publicada en el Marketplace.
   - **Permitir.** Los permisos son para editar esa planilla y enviar emails
     como vos.

   Tiene que aparecer una pestaña **Consultas** en la planilla con una fila de
   prueba, y llegar un email "Nueva consulta desde la web: Prueba". Esa fila se
   puede borrar.
5. **Publicar como Web App.** Botón azul **Implementar → Nueva implementación**:
   - Tipo (ícono ⚙️): **App web**.
   - Descripción: `Formulario web v1`.
   - Ejecutar como: **Yo (dimpsystems@gmail.com)**.
   - Quién tiene acceso: **Cualquier usuario** (sin esto, el sitio no puede enviar).
   - **Implementar** y copiar la **URL de la app web** (termina en `/exec`).
6. **Conectar el sitio.** Pegar esa URL en `script.js`, en la línea
   `const FORM_ENDPOINT = '';`, hacer commit y push.

Para verificar que quedó publicado: abrir la URL `/exec` en el navegador; tiene que
mostrar `{"ok":true,"servicio":"Formulario DIMP Systems"}`.

## Si después se cambia el código del script

Una implementación queda "congelada" en la versión con la que se publicó. Para que
un cambio en `Code.gs` llegue al sitio **sin cambiar la URL**:
**Implementar → Gestionar implementaciones → ✏️ (editar) → Versión: Nueva versión → Implementar.**
(Si se usa "Nueva implementación" se genera otra URL y habría que actualizar `script.js`.)

## Notas

- Los avisos por email usan la cuota gratuita de Google (100 emails por día en
  cuentas personales), más que suficiente para un formulario de contacto.
- El formulario tiene un campo oculto "trampa" para bots: si viene completo, el
  script responde OK pero no guarda nada.
- Al responder el email de aviso, la respuesta va directo a la persona que
  escribió (el script pone su email como "Responder a").
