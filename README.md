# Portafolio — Alexander Mejía Ospina

Sitio personal publicado en **https://alexanderm-code.github.io**

Página de una sola vista hecha con HTML, CSS y JavaScript, sin frameworks ni dependencias de compilación.

## Estructura

```
index.html        # Contenido en español; cada texto lleva su traducción en data-en
css/styles.css    # Estilos, paleta y diseño responsive
js/main.js        # Idioma ES/EN, menú, animaciones de entrada, video de Numi y formulario de contacto
assets/           # Capturas reales de Numi, CineX y Casa Rendón (WebP), video de Numi,
                  # logos de tecnologías, ícono e imagen para compartir (og.jpg)
cv/               # Hoja de vida en español e inglés
```

Para cambiar un texto, edítalo en `index.html` y actualiza también su atributo `data-en`.

## Verlo localmente

```bash
git clone https://github.com/AlexanderM-Code/AlexanderM-Code.github.io.git
cd AlexanderM-Code.github.io
python -m http.server 8000
```

Abre `http://localhost:8000`.
