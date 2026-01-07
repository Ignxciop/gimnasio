# Resumen de Cambios - Configuración Runtime

## 🎯 Objetivo Cumplido

Implementar configuración de API URL en runtime, sin hardcodeos, compatible con docker-compose.

---

## 📝 Cambios Realizados

### 1. Frontend - Runtime Configuration

#### `frontend/env.sh`

-   ✅ Usa `window.__ENV__` (estándar, no `window.ENV`)
-   ✅ Prioriza `API_URL` sobre `VITE_API_URL`
-   ✅ Falla explícitamente si no hay variable configurada (no usa fallback hardcodeado)
-   ✅ Logging detallado para debug

#### `frontend/src/config/constants.ts`

-   ✅ Lee `window.__ENV__.API_URL` en runtime
-   ✅ Fallback a `import.meta.env.VITE_API_URL` (build time)
-   ✅ Fallback a localhost **solo en modo desarrollo** (`import.meta.env.DEV`)
-   ✅ Lanza error claro si falta configuración en producción
-   ✅ NO hardcodea ninguna URL de producción

#### `frontend/src/services/*`

-   ✅ Eliminado `const API_URL = "http://localhost:3000/api"` de:
    -   `dashboardService.ts`
    -   `folderService.ts`
    -   `routineExerciseService.ts`
-   ✅ Todos usan `import { API_BASE_URL } from "../config/constants"`

#### `frontend/src/env.d.ts` (nuevo)

-   ✅ Tipos TypeScript para `window.__ENV__`

### 2. Docker Configuration

#### `docker-compose.yml`

-   ✅ Cambiado `VITE_API_URL` por `API_URL` (más claro)
-   ✅ Sin fallback hardcodeado: `API_URL: ${API_URL}`
-   ✅ La variable debe venir del entorno

### 3. Documentación

#### `ENV_CONFIG.md` (nuevo)

-   ✅ Guía completa para configurar Dokploy
-   ✅ Pasos de verificación
-   ✅ Troubleshooting

#### `.env.example`

-   ✅ Actualizado con `API_URL` en lugar de `VITE_API_URL`

#### `.env.local.example` (nuevo)

-   ✅ Plantilla completa para desarrollo local

---

## 🔍 Flujo Correcto

### Build Time (Docker Build)

1. Frontend se construye con Vite
2. NO se inyecta ninguna URL hardcodeada
3. El bundle queda agnóstico del entorno

### Runtime (Container Start)

1. `env.sh` se ejecuta como ENTRYPOINT
2. Lee `API_URL` de las variables de entorno del contenedor
3. Genera `/usr/share/nginx/html/env-config.js`:
    ```javascript
    window.__ENV__ = {
        API_URL: "https://gimnasio-api.josenunez.cl",
    };
    ```
4. Nginx sirve el frontend

### Application Load

1. Browser carga `index.html`
2. `<script src="/env-config.js"></script>` carga ANTES del bundle
3. `window.__ENV__.API_URL` está disponible
4. `API_BASE_URL` lee de `window.__ENV__.API_URL`
5. Todas las requests van a la URL correcta

---

## ✅ Validación

### Sin hardcodeos

```bash
grep -r "localhost:3000" frontend/src --exclude-dir=node_modules
# Solo debe aparecer en constants.ts dentro del bloque import.meta.env.DEV
```

### Sin URLs de producción

```bash
grep -r "gimnasio-api.josenunez.cl" frontend/src --exclude-dir=node_modules
# No debe aparecer en ningún archivo
```

### Variables requeridas en Dokploy

```bash
API_URL=https://gimnasio-api.josenunez.cl
```

---

## 🚀 Para Deployar

1. **Agregar variable en Dokploy:**

    ```
    API_URL=https://gimnasio-api.josenunez.cl
    ```

2. **Commit y push:**

    ```bash
    git add -A
    git commit -m "fix: implementar configuración runtime de API URL sin hardcodeos"
    git push
    ```

3. **Verificar después del deploy:**
    - `https://gimnasio.josenunez.cl/env-config.js` debe mostrar la URL correcta
    - DevTools → Network: requests deben ir a `gimnasio-api.josenunez.cl`
    - NO deben aparecer errores CSP de localhost

---

## 🎓 Aprendizajes

-   ✅ Runtime config es mejor que build-time para URLs de API
-   ✅ `window.__ENV__` es el estándar para configuración runtime en SPAs
-   ✅ Los fallbacks deben ser explícitos y protegidos por ambiente
-   ✅ Nunca hardcodear URLs de producción ni localhost en el código
-   ✅ `env.sh` + ENTRYPOINT es el patrón correcto para Docker
