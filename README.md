# Portafolio — Alexander Mejía Ospina

Sitio personal publicado en **https://alexanderm-code.github.io**

Una sola página hecha con HTML, CSS y JavaScript, sin frameworks ni compilación: funciona tal cual en GitHub Pages.

## Estructura

```
index.html        # Contenido en español; cada texto lleva su traducción en data-en
                  # (también data-en-href, data-en-aria y data-en-alt)
css/styles.css    # Tokens de color de los temas claro y oscuro, tipografía y diseño responsive
js/main.js        # Idioma ES/EN, tema, menú, estado de la API de CineX, cifras,
                  # gráfica del Observatorio, demo de CineX, diálogos y copiar correo
404.html          # Página de error con el mismo estilo
robots.txt, sitemap.xml
assets/           # Capturas reales (WebP), video de Numi, logos, fuentes (OFL), íconos y og.jpg
cv/               # Hojas de vida: español, inglés y analista de datos (no cambiar las rutas)
```

Para cambiar un texto, edítalo en `index.html` y actualiza también su atributo `data-en`.
Los textos que escribe el JavaScript (estados de la API, gráfica, demo) están en el objeto `T` de `js/main.js`.

## Datos en vivo

- **Estado del sistema:** `GET https://cinex-api-lt2q.onrender.com/productos` (reintenta si el servidor gratuito está dormido).
- **Demo de CineX:** solo lecturas (`GET /showtimes/{id}/availability`).
- **Gráfica:** `https://alexanderm-code.github.io/observatorio-salud-antioquia/data/eventos_por_anio.json`,
  con los datos de dengue guardados como respaldo.

## Verlo localmente

```bash
git clone https://github.com/AlexanderM-Code/AlexanderM-Code.github.io.git
cd AlexanderM-Code.github.io
python -m http.server 8000
```

Abre `http://localhost:8000` (la API de CineX acepta peticiones desde ese puerto).

## Al publicar cambios de CSS o JavaScript

Sube el número de versión `?v=...` en los enlaces a `css/styles.css` y `js/main.js` de `index.html`
(y de `404.html`). Así los navegadores descargan los archivos nuevos en vez de usar la copia guardada,
que GitHub Pages deja en caché 10 minutos.
