# DIMP Website

Sitio web oficial de DIMP Systems.

Landing institucional: qué hacemos, proyectos, quiénes somos, equipo y contacto (email, WhatsApp y formulario).

Sitio publicado: https://dimpsystems.github.io/dimp-website/

## Tecnologías

- HTML5 semántico
- CSS3 con variables y diseño responsive
- JavaScript nativo

El proyecto no utiliza frameworks, dependencias ni proceso de compilación.

## Ejecutar localmente

La opción recomendada es iniciar un servidor HTTP desde la raíz del repositorio:

```bash
python -m http.server 8000
```

Luego abrir [http://localhost:8000](http://localhost:8000) en el navegador.

También se puede abrir `index.html` directamente, aunque un servidor local representa mejor el comportamiento de un sitio publicado.

## Estructura

```text
.
├── index.html          # Contenido y estructura semántica
├── styles.css          # Sistema visual (mobile-first, tema oscuro)
├── script.js           # Menú, animaciones y envío del formulario
├── assets/             # Logo, favicons y QR del sitio
├── apps-script/        # Receptor del formulario (Google Apps Script) + guía
├── LICENSE
└── README.md
```

## Formulario de contacto

El formulario envía las consultas a un Google Apps Script publicado como Web App,
que las guarda en una Google Sheet y avisa por email a `dimpsystems@gmail.com`.
La URL del Web App se configura en `script.js` (`FORM_ENDPOINT`). Mientras esté
vacía, el formulario valida los campos e indica que se escriba por email o WhatsApp.

Instalación paso a paso: [`apps-script/README.md`](apps-script/README.md).

## Publicación

El sitio se publica con GitHub Pages desde la rama `main` (carpeta raíz).

## Licencia

Este proyecto conserva la licencia MIT incluida en el repositorio. Consultar [`LICENSE`](LICENSE) para más información.
