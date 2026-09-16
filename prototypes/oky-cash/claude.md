# OKY App — Convenciones del repo  
  
## Entorno  
- No hay Node ni npm instalados en esta máquina.  
- El prototipo se construye con Python, no con Storybook ni un bundler de JS.  
  
## Build del prototipo  
Comando: `python3 tools/build-oky-prototype-standalone.py`  
  
Verificación: servir la carpeta `images/` en un puerto local (no usar Storybook).  
  
El build genera **tres copias**:  
1. Demo  
2. Artifact  
3. Versión de Vercel, en `prototypes/oky-cash/`  
  
## Assets  
- Los assets vienen de Figma vía `rawImages`, **no** por export de nodo.  
- Hay que reducir su tamaño antes de incluirlos: el límite del Artifact es de 16MB.  
  
## Git  
- Se comitea a **dos ramas**: `main` y `feature/oky-cash-prototype`.  
- Los mensajes de commit van **en español**.  
