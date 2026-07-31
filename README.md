# DIMP Website

Sitio web oficial de DIMP Systems.

> **Construimos tecnología. Desarrollamos personas.**

Esta primera versión es una landing page institucional enfocada en presentar los servicios de DIMP, su forma de trabajo y un caso de éxito anonimizado.

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
├── index.html   # Contenido y estructura semántica
├── styles.css   # Sistema visual y estilos responsive
├── script.js    # Navegación, animaciones y formulario demostrativo
├── LICENSE      # Licencia MIT
└── README.md    # Documentación del proyecto
```

## Estado del formulario

El formulario de contacto es demostrativo: valida los campos requeridos en el navegador, pero no envía ni almacena datos. Antes de publicar el sitio se debe definir el canal de recepción y conectar el formulario a un servicio o backend.

## Licencia

Este proyecto conserva la licencia MIT incluida en el repositorio. Consultar [`LICENSE`](LICENSE) para más información.
