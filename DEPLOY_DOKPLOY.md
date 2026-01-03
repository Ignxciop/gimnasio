# Guía de Despliegue en Dokploy

## 📋 Requisitos Previos

-   Cuenta en Dokploy
-   Repositorio Git del proyecto
-   Variables de entorno configuradas

## 🚀 Pasos de Despliegue

### 1. Variables de Entorno Requeridas

Configura estas variables en Dokploy:

#### Backend

```bash
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres
JWT_EXPIRES_IN=15m
REFRESH_JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-dominio.com
```

#### Frontend

```bash
VITE_API_URL=https://api.tu-dominio.com
```

#### Base de Datos

```bash
POSTGRES_USER=gimnasio
POSTGRES_PASSWORD=tu-password-seguro
POSTGRES_DB=gimnasio_db
```

### 2. Configurar el Proyecto en Dokploy

#### Opción A: Usando Docker Compose (Recomendado para todo junto)

1. Ir a **Applications** → **Create Application**
2. Seleccionar **Docker Compose**
3. Conectar tu repositorio Git
4. Dokploy detectará automáticamente el `docker-compose.yml`
5. Configurar las variables de entorno mencionadas arriba
6. Deploy

#### Opción B: Servicios Separados (Más control)

**Base de Datos:**

1. Ir a **Databases** → **Create Database**
2. Seleccionar **PostgreSQL**
3. Configurar usuario, contraseña y nombre de base de datos
4. Anotar la URL de conexión

**Backend:**

1. Ir a **Applications** → **Create Application**
2. Seleccionar **Dockerfile**
3. Conectar repositorio
4. Configurar:
    - **Build Path**: `/backend`
    - **Dockerfile Path**: `Dockerfile`
    - **Port**: `3000`
5. Agregar variables de entorno
6. Deploy

**Frontend:**

1. Ir a **Applications** → **Create Application**
2. Seleccionar **Dockerfile**
3. Conectar repositorio
4. Configurar:
    - **Build Path**: `/frontend`
    - **Dockerfile Path**: `Dockerfile`
    - **Port**: `80`
    - **Build Args**: `VITE_API_URL=https://api.tu-dominio.com`
5. Deploy

### 3. Configurar Dominios

1. En Dokploy, ir a la aplicación → **Domains**
2. Agregar dominio personalizado
3. Configurar DNS:
    - Backend: `api.tu-dominio.com` → IP del servidor
    - Frontend: `tu-dominio.com` → IP del servidor

### 4. Configurar SSL

Dokploy automáticamente configura Let's Encrypt para HTTPS.

## 🔍 Verificación Post-Despliegue

### Backend

```bash
curl https://api.tu-dominio.com/api/health
```

### Frontend

Abrir navegador en `https://tu-dominio.com`

### Base de Datos

```bash
# Conectar via psql
psql "postgresql://usuario:password@host:5432/database"

# Verificar tablas
\dt
```

## 📊 Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente al iniciar el backend:

```bash
pnpm prisma migrate deploy
```

Si necesitas ejecutarlas manualmente en Dokploy:

1. Ir al contenedor del backend
2. Abrir terminal
3. Ejecutar: `pnpm prisma migrate deploy`

## 🐛 Solución de Problemas

### El backend no inicia

-   Verificar que `DATABASE_URL` esté correctamente configurada
-   Verificar logs: Dokploy → Application → Logs
-   Verificar que las migraciones de Prisma se ejecutaron

### El frontend muestra 404 en rutas

-   Verificar que `nginx.conf` esté presente
-   Verificar que `try_files $uri $uri/ /index.html;` esté en nginx

### CORS errors

-   Verificar que `CORS_ORIGIN` incluya el dominio del frontend
-   Formato: `https://tu-dominio.com` (sin barra final)
-   Para múltiples orígenes: `https://dominio1.com,https://dominio2.com`

### Variables de entorno no se aplican en frontend

-   Las variables `VITE_*` se compilan en build-time
-   Necesitas rebuilddear si las cambias
-   Verificar que estén configuradas como **Build Args** en Dokploy

## 🔒 Checklist de Seguridad

-   [ ] Cambiar `JWT_SECRET` a un valor seguro (mínimo 32 caracteres)
-   [ ] Usar contraseñas fuertes para PostgreSQL
-   [ ] Habilitar HTTPS (automático con Dokploy)
-   [ ] Configurar `CORS_ORIGIN` solo para dominios autorizados
-   [ ] Verificar que `.env` no esté en el repositorio (usar `.env.example`)
-   [ ] Configurar backups de base de datos en Dokploy
-   [ ] Monitorear logs regularmente

## 📦 Estructura de Archivos Necesarios

```
proyecto/
├── docker-compose.yml          ✅ Configurado
├── .env.example               ✅ Configurado
├── backend/
│   ├── Dockerfile             ✅ Configurado con pnpm + Prisma
│   ├── .dockerignore          ✅ Configurado
│   ├── package.json           ✅
│   ├── pnpm-lock.yaml         ✅
│   └── prisma/
│       └── schema.prisma      ✅
└── frontend/
    ├── Dockerfile             ✅ Configurado con pnpm + nginx
    ├── nginx.conf             ✅ Configurado con SPA support
    ├── .dockerignore          ✅ Configurado
    ├── package.json           ✅
    └── pnpm-lock.yaml         ✅
```

## 🎯 Comandos Útiles en Dokploy

### Logs

```bash
# Ver logs en tiempo real
Dokploy UI → Application → Logs → Enable Real-time
```

### Shell en Contenedor

```bash
Dokploy UI → Application → Terminal
```

### Restart

```bash
Dokploy UI → Application → Restart
```

### Rebuild

```bash
Dokploy UI → Application → Redeploy
```

## 📝 Notas Importantes

1. **Primera vez**: Las migraciones toman tiempo, sé paciente
2. **Resources**: Asegúrate de que la carpeta `backend/resources` tenga permisos correctos
3. **Volúmenes**: Los datos de PostgreSQL persisten en volúmenes de Docker
4. **Escalabilidad**: Considera separar la base de datos a un servicio externo para producción seria
5. **Monitoring**: Configura alertas en Dokploy para monitorear el estado

## 🔄 Proceso de Actualización

1. Push cambios a Git
2. Dokploy auto-despliega (si está configurado)
3. O manualmente: Dokploy → Application → Redeploy

## 📞 Soporte

-   Documentación Dokploy: https://docs.dokploy.com
-   Issues del proyecto: Tu repositorio
