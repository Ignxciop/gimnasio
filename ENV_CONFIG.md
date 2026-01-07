# Configuración de Variables de Entorno

## 🚨 Variable Crítica: API_URL

El frontend **requiere** la variable `API_URL` en runtime para conectarse al backend.

**La variable DEBE incluir el sufijo `/api` completo.**

```bash
API_URL=https://gimnasio-api.josenunez.cl/api
```

**Sin esta variable configurada correctamente, el frontend no podrá comunicarse con el backend.**

---

## ✅ Configurar en Dokploy

### Paso 1: Agregar Variables de Entorno

En Dokploy → Proyecto → **Settings** → **Environment Variables**, agrega:

```bash
# 🔴 CRÍTICA - Frontend API URL (DEBE incluir /api)
API_URL=https://gimnasio-api.josenunez.cl/api

# Database
GIMNASIO_DATABASE_URL=postgresql://postgres:PASSWORD@database-3rvmiy:5432/gimnasio

# JWT Secrets
JWT_SECRET=your-secure-jwt-secret-min-32-chars
REFRESH_JWT_SECRET=your-secure-refresh-jwt-secret-min-32-chars
CSRF_SECRET=your-secure-csrf-secret-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_JWT_EXPIRES_IN=7d

# CORS & URLs
CORS_ORIGIN=https://gimnasio.josenunez.cl
FRONTEND_URL=https://gimnasio.josenunez.cl

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

# Cloudflare Tunnel
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
```

### Paso 2: Redeploy

Después de agregar las variables:

1. Guarda los cambios
2. Haz **Redeploy** del proyecto
3. Espera a que termine el build

---

## 🔍 Verificación

### 1. Verificar archivo de configuración generado

Visita: `https://gimnasio.josenunez.cl/env-config.js`

**Debe mostrar:**

```javascript
window.__ENV__ = {
    API_URL: "https://gimnasio-api.josenunez.cl",
};
```

### 2. Revisar logs del contenedor

En Dokploy → Logs → Frontend, busca:

```
========================================
Runtime Environment Configuration
========================================
API_URL from environment: 'https://gimnasio-api.josenunez.cl'
========================================
Using API URL: https://gimnasio-api.josenunez.cl
Generated env-config.js:
window.__ENV__ = {
  API_URL: "https://gimnasio-api.josenunez.cl"
};
========================================
```

### 3. Verificar requests en la consola del navegador

Abre DevTools → Network. Las peticiones deben ir a:

-   ✅ `https://gimnasio-api.josenunez.cl/api/...`
-   ❌ NO `http://localhost:3000/api/...`

---

## ⚠️ Troubleshooting

### Problema: Sigue usando localhost

**Síntoma:**

```
Content-Security-Policy: blocked http://localhost:3000/api/...
```

**Causa:** La variable `API_URL` no está llegando al contenedor frontend.

**Solución:**

1. Verifica que `API_URL` está en las variables de entorno de Dokploy
2. Haz un redeploy completo (no restart)
3. Revisa los logs del frontend para confirmar que recibe la variable

### Problema: Error en env.sh

**Síntoma:**

```
ERROR: No API_URL or VITE_API_URL provided!
```

**Causa:** Dokploy no está pasando ninguna variable de API URL.

**Solución:**

1. Ve a Dokploy → Settings → Environment Variables
2. Asegúrate de que `API_URL=https://gimnasio-api.josenunez.cl` esté agregada
3. Guarda y redeploy

### Problema: env-config.js no se genera

**Síntoma:** `https://gimnasio.josenunez.cl/env-config.js` da 404

**Causa:** El contenedor no está ejecutando `env.sh` como entrypoint.

**Solución:**

1. Verifica que el Dockerfile tiene `ENTRYPOINT ["/docker-entrypoint.sh"]`
2. Redeploy completo (rebuild)

---

## 📝 Desarrollo Local

Para desarrollo local, crea un archivo `.env` en la raíz del proyecto:

```bash
# Desarrollo local
API_URL=http://localhost:3000

# O usa el .env.example como plantilla
cp .env.example .env
```

Luego ejecuta:

```bash
docker-compose up --build
```

El frontend en desarrollo usará automáticamente `http://localhost:3000` si no encuentra `API_URL` configurada.
