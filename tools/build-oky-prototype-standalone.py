import base64, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, "images")

MIME = {".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp",
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".otf": "font/otf",
        ".woff2": "font/woff2", ".ttf": "font/ttf"}

def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")

def data_uri(path):
    return f"data:{MIME[os.path.splitext(path)[1].lower()]};base64,{b64(path)}"

# ── 1. CSS ────────────────────────────────────────────────
css = open(os.path.join(ROOT, "stories", "mars.css"), encoding="utf-8").read()

# mars.css declara las webfonts de Font Awesome por ruta absoluta
# (/public/fontawesome-pro/...). Esas rutas solo existen detrás de
# Storybook, y por eso en el archivo suelto los iconos salían en
# blanco (flecha de atrás y navbar incluidas).
#
# Se reapuntan a los woff2 del paquete Free en vez de inlinear los
# OTF Pro: el prototipo solo usa glifos que existen en Free, y son
# 183 KB contra 8.9 MB. Las caras light (100/300) caen a solid para
# que cualquier fa-light suelto siga dibujando algo.
FREE = os.path.join(ROOT, "public/fontawesome-free/webfonts")
WEIGHT_FONT = {
    "100": "fa-solid-900.woff2",
    "300": "fa-solid-900.woff2",
    "400": "fa-regular-400.woff2",
    "900": "fa-solid-900.woff2",
}
_uri_cache = {}
def free_uri(fname):
    if fname not in _uri_cache:
        _uri_cache[fname] = data_uri(os.path.join(FREE, fname))
    return _uri_cache[fname]

def repoint(m):
    block = m.group(0)
    weight = re.search(r'font-weight:\s*(\d+)', block)
    fname = WEIGHT_FONT.get(weight.group(1) if weight else "900", "fa-solid-900.woff2")
    return re.sub(r'src:[^;]+;', f'src: url("{free_uri(fname)}") format("woff2");', block)

css, n_faces = re.subn(
    r'@font-face\s*\{[^}]*?fontawesome-pro[^}]*?\}', repoint, css, flags=re.S)

# La cara del kit custom no se usa en el prototipo: se deja fuera.
css = re.sub(r'@font-face\s*\{[^}]*?fontawesome-kit[^}]*?\}', '', css, flags=re.S)

# Font Awesome Free Regular solo trae ~163 glifos: fa-signal, fa-wifi,
# fa-battery-full o fa-magnifying-glass no están y salían como cajas.
# Se añade una familia de respaldo apuntando a Solid y se encadena
# detrás de la Pro: el navegador cae glifo a glifo a la que exista.
css += """
@font-face {
  font-family: "FA Free Solid Fallback";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("%s") format("woff2");
}

.fa-regular,
.far,
.fa-light,
.fal {
  font-family: "Font Awesome 6 Pro", "FA Free Solid Fallback";
}

/* mars.css no declara la familia Brands (en Storybook la trae el CSS
   de Font Awesome Free); aquí hay que inlinearla o fa-cc-visa y
   fa-cc-mastercard salen como cajas. */
@font-face {
  font-family: "Font Awesome 6 Brands";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("%s") format("woff2");
}

.fa-brands,
.fab {
  font-family: "Font Awesome 6 Brands";
  font-weight: 400;
}
""" % (free_uri("fa-solid-900.woff2"), free_uri("fa-brands-400.woff2"))

font_refs = {f"{n_faces} @font-face"}

# Del CSS de Font Awesome Free solo interesa el mapa de codepoints;
# sus propios @font-face se descartan (las caras ya vienen de arriba).
fa_css = []
fa_path = os.path.join(ROOT, "public/fontawesome-free/css/all.min.css")
if os.path.exists(fa_path):
    text = open(fa_path, encoding="utf-8").read()
    text = re.sub(r'@font-face\s*\{[^}]*\}', '', text)
    fa_css.append(text)

# ── 2. JS bundle ──────────────────────────────────────────
# Cada módulo va en su propio IIFE y publica solo sus exports.
# Concatenarlos en un scope plano rompía en silencio: paymentCards.js
# y middleCard.js definen ambos renderFooter, y la segunda pisaba a la
# primera (la Payment Card acababa imprimiendo "undefined").
MODULES = [
    "flag", "paymentCards", "historyCards", "plateu", "discoveryHeader",
    "middleCard", "primeCards", "cardOrganism", "okyCashPrototype",
]

def load_module(name):
    with open(os.path.join(ROOT, "stories", "_shared", name + ".js"), encoding="utf-8") as f:
        return f.read()

chunks = ["var __mods = {};"]
for name in MODULES:
    text = load_module(name)

    exports = re.findall(r'(?m)^export\s+(?:function|const|let|var)\s+([A-Za-z0-9_$]+)', text)

    imports = []
    for names, dep in re.findall(r'(?m)^import\s*\{([^}]*)\}\s*from\s*"\./([A-Za-z0-9_$]+)(?:\.js)?";', text):
        wanted = [n.strip() for n in names.split(",") if n.strip()]
        imports.append(f'  var {{ {", ".join(wanted)} }} = __mods["{dep}"];')
    text = re.sub(r'(?m)^import\s*\{[^}]*\}\s*from\s*"\.[^"]*";\n', '', text)
    text = re.sub(r'(?m)^export\s+(function|const|let|var)\s', r'\1 ', text)

    body = "\n".join(imports) + "\n" + text
    returned = ", ".join(exports)
    chunks.append(
        f'__mods["{name}"] = (function () {{\n{body}\n  return {{ {returned} }};\n}})();'
    )

bundle = "\n\n".join(chunks)

# El átomo Flag apunta a /flagpack/4x3/<iso>.svg, que Storybook sirve
# desde node_modules. Fuera de ahí no existe y el atom cae a su estado
# "missing" (el recuadro gris con el código). Se reapunta a las
# banderas redondas que ya viven en images/.
FLAGPACK = {"us": "usa-flag.png", "gt": "guatemala-flag.png"}
_flags = {
    iso: data_uri(os.path.join(IMAGES, asset))
    for iso, asset in FLAGPACK.items()
    if os.path.exists(os.path.join(IMAGES, asset))
}
if _flags:
    # El src se arma con un template literal, así que se sustituye la
    # expresión entera por una búsqueda en la tabla.
    table = ", ".join(f'"{iso}": "{uri}"' for iso, uri in _flags.items())
    bundle = bundle.replace(
        'const src = `/flagpack/4x3/${country.alpha2.toLowerCase()}.svg`;',
        'var __FLAGS = {' + table + '};\n'
        '  const src = __FLAGS[country.alpha2.toLowerCase()] '
        '|| `/flagpack/4x3/${country.alpha2.toLowerCase()}.svg`;',
    )

# ── 3. Imágenes → data URIs ───────────────────────────────
names = set(re.findall(r'["\']([A-Za-z0-9_.\-]+\.(?:png|svg|webp|jpe?g))["\']', bundle))
missing = []
for name in sorted(names):
    disk = os.path.join(IMAGES, name)
    if not os.path.exists(disk):
        missing.append(name)
        continue
    uri = data_uri(disk)
    bundle = bundle.replace(f'"{name}"', f'"{uri}"').replace(f"'{name}'", f"'{uri}'")
if missing:
    raise SystemExit("Missing image assets: " + ", ".join(missing))

html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OKY Cash — Prototipo</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,700&family=Inter:wght@100..900&family=Nunito+Sans:wght@300..900&display=swap" rel="stylesheet" />
<style>
{chr(10).join(fa_css)}
</style>
<style>
body {{ margin:0; padding:24px; background:#eceef2; display:flex; justify-content:center;
        font-family:"Nunito Sans",sans-serif; }}
{css}
</style>
</head>
<body>
<div id="oky-app"></div>
<script>
{bundle}
__mods["okyCashPrototype"].mountOkyCashPrototype(document.getElementById("oky-app"), {{ userType: "first-time" }});
</script>
</body>
</html>
"""

out = os.path.join(IMAGES, "oky-cash-prototype-demo.html")
open(out, "w", encoding="utf-8").write(html)
print(f"wrote {out}  ({len(html)/1024/1024:.1f} MB), {len(names)} images, {len(font_refs)} font refs inlined")

# Variante para publicar como Artifact: el host aporta doctype/head/
# body, así que aquí va solo el contenido.
artifact = f"""<title>OKY Cash Prototype</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,700&family=Inter:wght@100..900&family=Nunito+Sans:wght@300..900&display=swap" rel="stylesheet" />
<style>
{chr(10).join(fa_css)}
</style>
<style>
body {{ margin:0; padding:24px; background:#eceef2; display:flex; justify-content:center;
        font-family:"Nunito Sans",sans-serif; min-height:100vh; box-sizing:border-box; }}
{css}
</style>
<div id="oky-app"></div>
<script>
{bundle}
__mods["okyCashPrototype"].mountOkyCashPrototype(document.getElementById("oky-app"), {{ userType: "first-time" }});
</script>
"""
art_out = os.path.join(ROOT, "tools", "oky-cash-prototype-artifact.html")
open(art_out, "w", encoding="utf-8").write(artifact)
print(f"wrote {art_out}  ({len(artifact)/1024/1024:.1f} MB)")
