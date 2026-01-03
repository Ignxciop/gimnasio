# Backend - Gimnasio API

API RESTful construida con Node.js, Express y Prisma para la gestión de rutinas de entrenamiento en gimnasio.

## 📋 Descripción

El backend de **Gimnasio** es una API REST que proporciona todos los servicios necesarios para gestionar usuarios, ejercicios, rutinas, entrenamientos y estadísticas. Implementa un sistema de autenticación robusto con JWT y medidas de seguridad avanzadas.

## 🏗️ Rol en el Sistema

El backend actúa como:

-   **API RESTful** que expone endpoints para todas las operaciones CRUD
-   **Capa de seguridad** con autenticación, autorización y validaciones
-   **Gestor de lógica de negocio** separada de la presentación
-   **Intermediario con base de datos** mediante Prisma ORM
-   **Proveedor de métricas y estadísticas** calculadas en servidor

## 🛠️ Stack Tecnológico

### Core

-   **Node.js**: `24.12.0` (runtime JavaScript)
-   **Express**: `5.2.1` (framework web)
-   **Prisma**: `6.19.1` (ORM y cliente de base de datos)
-   **PostgreSQL**: Base de datos relacional

### Seguridad

-   **helmet**: `8.1.0` (headers HTTP seguros)
-   **csrf-csrf**: `4.0.3` (protección CSRF con double submit cookie)
-   **express-rate-limit**: `8.2.1` (rate limiting por IP)
-   **bcryptjs**: `3.0.3` (hashing de contraseñas con salt)
-   **jsonwebtoken**: `9.0.3` (generación y verificación de JWT)
-   **file-type**: `21.2.0` (validación magic bytes de archivos)

### Validación y Utilidades

-   **express-validator**: `7.3.1` (validaciones de entrada)
-   **cors**: `2.8.5` (CORS configurado por origen)
-   **cookie-parser**: `1.4.7` (manejo de cookies httpOnly)
-   **multer**: `2.0.2` (subida de archivos)
-   **dotenv**: `17.2.3` (variables de entorno)

### Testing

-   **jest**: `30.2.0` (framework de testing)
-   **supertest**: `7.1.4` (testing de endpoints HTTP)

### Desarrollo

-   **nodemon**: `3.1.11` (auto-reload en desarrollo)
-   **pnpm**: `10.25.0` (gestor de paquetes)

## 📐 Arquitectura

El backend sigue una arquitectura en capas con separación de responsabilidades:

```
┌─────────────────────────────────────────────────┐
│                  ROUTES                         │
│  - Definición de endpoints                      │
│  - Aplicación de middlewares y validadores     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│               MIDDLEWARES                       │
│  - authenticate (verificación JWT)              │
│  - authorize (verificación de roles)            │
│  - errorHandler (manejo centralizado)          │
│  - rateLimiter (limitación de requests)        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              VALIDATORS                         │
│  - express-validator schemas                    │
│  - Validaciones de entrada                     │
│  - Sanitización de datos                       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              CONTROLLERS                        │
│  - Manejo de request/response                   │
│  - Llamadas a servicios                        │
│  - Formateo de respuestas                      │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│               SERVICES                          │
│  - Lógica de negocio compleja                   │
│  - Interacción con Prisma                      │
│  - Cálculo de métricas y estadísticas          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            PRISMA ORM                           │
│  - Queries type-safe a PostgreSQL               │
│  - Migraciones automáticas                     │
│  - Generación de cliente tipado                │
└─────────────────────────────────────────────────┘
```

### Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js              # Variables de entorno
│   │   ├── jwt.js                 # Generación/verificación JWT
│   │   ├── csrf.js                # Configuración CSRF
│   │   ├── rateLimiter.js         # Rate limiters personalizados
│   │   ├── multer.js              # Configuración de uploads
│   │   └── prisma.js              # Cliente Prisma
│   │
│   ├── controllers/
│   │   ├── authController.js      # Login, register, refresh, logout
│   │   ├── profileController.js   # Gestión de perfiles
│   │   ├── exerciseController.js  # CRUD ejercicios
│   │   ├── routineController.js   # CRUD rutinas
│   │   ├── folderController.js    # CRUD folders
│   │   ├── activeRoutineController.js  # Rutinas en ejecución
│   │   ├── statisticsController.js     # Métricas y progreso
│   │   ├── feedbackController.js       # Sistema de feedback
│   │   └── adminController.js          # Gestión usuarios/roles
│   │
│   ├── services/
│   │   ├── authService.js         # Lógica de autenticación
│   │   ├── exerciseService.js     # Lógica de ejercicios
│   │   ├── routineService.js      # Lógica de rutinas
│   │   └── ...
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js      # authenticate, authorize, optionalAuth
│   │   └── errorHandler.js        # Manejo centralizado de errores
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── profileRoutes.js       # /api/profile/*
│   │   ├── exerciseRoutes.js      # /api/exercises/*
│   │   ├── routineRoutes.js       # /api/routines/*
│   │   └── ...
│   │
│   ├── validators/
│   │   ├── authValidator.js       # Validaciones de login
│   │   ├── userValidator.js       # Validaciones de registro
│   │   ├── exerciseValidator.js   # Validaciones de ejercicios
│   │   └── ...
│   │
│   ├── scripts/
│   │   ├── seed.js                # Seed de datos iniciales
│   │   └── cleanup-orphan-videos.js  # Limpieza de archivos huérfanos
│   │
│   └── tests/
│       ├── unit/                  # Tests unitarios
│       └── e2e/                   # Tests end-to-end
│
├── prisma/
│   ├── schema.prisma              # Modelo de datos completo
│   └── migrations/                # Historial de migraciones
│
├── resources/
│   ├── examples_exercises/        # Videos de ejercicios
│   └── user_photo/                # Fotos de perfil
│
├── index.js                       # Punto de entrada principal
├── package.json
└── .env.example                   # Template de variables de entorno
```

## 🔐 Autenticación y Seguridad

### Sistema de Dual Tokens (JWT)

El backend implementa un sistema de autenticación con **dos tokens separados**:

#### 1. Access Token (Corta duración)

-   **Duración**: 15 minutos
-   **Almacenamiento**: Memoria del frontend (NO sessionStorage/localStorage)
-   **Propósito**: Autenticación en cada request
-   **Secret**: `JWT_SECRET` (independiente)
-   **Payload**: `userId`, `email`, `roleId`, `username`

#### 2. Refresh Token (Larga duración)

-   **Duración**: 7 días
-   **Almacenamiento**: Cookie httpOnly, Secure, SameSite=Strict
-   **Propósito**: Renovar access token sin re-login
-   **Secret**: `REFRESH_JWT_SECRET` (diferente al access)
-   **Payload**: `userId` (mínimo)
-   **Persistencia**: Hash SHA-256 en base de datos para validación

### Flujo de Autenticación

```
┌────────────┐              ┌────────────┐              ┌────────────┐
│  CLIENTE   │              │   BACKEND  │              │  DATABASE  │
└──────┬─────┘              └──────┬─────┘              └──────┬─────┘
       │                           │                           │
       │  POST /auth/login         │                           │
       ├──────────────────────────>│                           │
       │  {email, password}        │                           │
       │                           │  Verificar credenciales   │
       │                           ├──────────────────────────>│
       │                           │<──────────────────────────┤
       │                           │  Usuario válido           │
       │                           │                           │
       │                           │  Guardar hash refresh     │
       │                           ├──────────────────────────>│
       │                           │                           │
       │<──────────────────────────┤                           │
       │  {accessToken}            │                           │
       │  Cookie: refreshToken     │                           │
       │                           │                           │
       │  GET /api/resource        │                           │
       │  Header: Bearer {access}  │                           │
       ├──────────────────────────>│                           │
       │                           │  Verificar JWT            │
       │                           │  (15 min válido)          │
       │<──────────────────────────┤                           │
       │  {data}                   │                           │
       │                           │                           │
       │  (15 min después)         │                           │
       │  GET /api/resource        │                           │
       │  Header: Bearer {expired} │                           │
       ├──────────────────────────>│                           │
       │<──────────────────────────┤                           │
       │  401 Unauthorized         │                           │
       │                           │                           │
       │  POST /auth/refresh       │                           │
       │  Cookie: refreshToken     │                           │
       ├──────────────────────────>│                           │
       │                           │  Verificar hash en DB     │
       │                           ├──────────────────────────>│
       │                           │<──────────────────────────┤
       │                           │  Hash válido              │
       │                           │                           │
       │                           │  Eliminar token usado     │
       │                           ├──────────────────────────>│
       │                           │                           │
       │                           │  Guardar nuevo hash       │
       │                           ├──────────────────────────>│
       │<──────────────────────────┤                           │
       │  {newAccessToken}         │                           │
       │  Cookie: newRefreshToken  │                           │
       │                           │                           │
```

### Detección de Reuso de Tokens

El backend implementa **detección de reuso de refresh tokens** para prevenir ataques:

1. Cada refresh token se almacena como **hash SHA-256** en la base de datos
2. Al refrescar, el token **se elimina inmediatamente** de la DB
3. Si se intenta reusar un token ya usado:
    - Se eliminan **todos los tokens** del usuario
    - Se responde con **401 Unauthorized**
    - El usuario debe volver a autenticarse

Esto previene que un atacante robe y reuse un refresh token comprometido.

### Hashing de Contraseñas

-   **Algoritmo**: bcryptjs con salt rounds automático
-   **Nunca** se almacenan contraseñas en texto plano
-   **Validación robusta**: Mínimo 12 caracteres, mayúsculas, minúsculas, números y caracteres especiales

### Protección CSRF

-   **Implementación**: Double Submit Cookie Pattern con `csrf-csrf`
-   **Token CSRF**: Generado en `/api/auth/csrf-token`
-   **Validación**: Header `x-csrf-token` requerido en POST/PUT/DELETE
-   **Cookies**: httpOnly, Secure (producción), SameSite=Strict

### Rate Limiting

El backend aplica **5 rate limiters** diferenciados:

| Limiter           | Endpoint         | Ventana | Máximo       | Propósito                  |
| ----------------- | ---------------- | ------- | ------------ | -------------------------- |
| `loginLimiter`    | `/auth/login`    | 15 min  | 5 requests   | Prevenir fuerza bruta      |
| `refreshLimiter`  | `/auth/refresh`  | 15 min  | 10 requests  | Evitar abuso de refresh    |
| `registerLimiter` | `/auth/register` | 60 min  | 3 requests   | Prevenir spam de registros |
| `uploadLimiter`   | `/exercises/*`   | 60 min  | 20 requests  | Limitar subida de archivos |
| `generalLimiter`  | `/api/*`         | 15 min  | 100 requests | Protección general         |

### Headers de Seguridad (Helmet)

```javascript
{
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    mediaSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"]
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}
```

### Validación de Archivos

Subida de videos de ejercicios (MP4):

1. **Validación de MIME type**: Rechaza si no es `video/mp4`
2. **Validación de extensión**: Rechaza si no es `.mp4`
3. **Validación de magic bytes**: Usa `file-type` para verificar firma binaria real del archivo
4. **Límite de tamaño**: 50 MB por archivo
5. **Eliminación automática**: Si falla validación, el archivo se elimina del servidor

## 🛡️ Manejo de Errores

### Error Handler Centralizado

Todos los errores pasan por un middleware centralizado que:

-   **En desarrollo**: Muestra stack trace completo en consola
-   **En producción**: Oculta detalles técnicos sensibles
-   **Formato consistente**: Todas las respuestas de error tienen estructura unificada

```javascript
{
  success: false,
  message: "Descripción del error",
  errors: [
    { field: "campo", message: "mensaje específico" }
  ]
}
```

### Errores Específicos de Prisma

| Código Prisma | Código HTTP | Descripción                                      |
| ------------- | ----------- | ------------------------------------------------ |
| `P2002`       | 409         | Conflicto de unicidad (email/username duplicado) |
| `P2003`       | 409         | Violación de foreign key (registro en uso)       |

## ⚙️ Variables de Entorno Requeridas

Crear archivo `.env` en la raíz de `/backend` según `.env.example`:

```bash
# Base de datos
DATABASE_URL="postgresql://user:password@host:port/database"

# Servidor
PORT=3000
NODE_ENV=development  # development | production

# Autenticación JWT
JWT_SECRET=tu_secret_muy_largo_aleatorio_min_64_chars
REFRESH_JWT_SECRET=refresh_secret_diferente_muy_largo_aleatorio_min_64_chars
JWT_EXPIRES_IN=15m
REFRESH_JWT_EXPIRES_IN=7d

# Seguridad CSRF
CSRF_SECRET=csrf_secret_muy_largo_aleatorio_min_64_caracteres

# CORS
CORS_ORIGIN=http://localhost:5173  # Separar múltiples con comas
```

### 🔑 Generación de Secretos Seguros

**CRÍTICO**: Los secretos deben ser únicos, aleatorios y mínimo 64 caracteres.

```bash
# Generar secretos aleatorios seguros
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecutar este comando **3 veces** para generar:

1. `JWT_SECRET`
2. `REFRESH_JWT_SECRET`
3. `CSRF_SECRET`

**Nunca** reutilizar secretos entre entornos (desarrollo/producción).

## 🚀 Instalación y Ejecución

### Prerrequisitos

-   **Node.js**: 24.12.0 o superior
-   **PostgreSQL**: 4 o superior
-   **pnpm**: 10.25.0

### Instalación

```bash
# Clonar repositorio e ir a backend
cd backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores reales

# Generar cliente Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# Poblar base de datos con datos iniciales (roles, equipamiento, grupos musculares)
pnpm seed
```

### Ejecución

#### Desarrollo

```bash
pnpm dev
```

Servidor con auto-reload en `http://localhost:3000`

#### Producción

```bash
pnpm start
```

### Comandos Útiles

```bash
# Ver base de datos en interfaz visual
pnpm prisma studio

# Crear nueva migración
pnpm prisma:migrate nombre_migracion

# Poblar base de datos
pnpm seed

# Limpiar videos huérfanos
pnpm cleanup-orphans

# Tests
pnpm test              # Todos los tests
pnpm test:unit         # Solo tests unitarios
pnpm test:e2e          # Solo tests end-to-end
```

## 🧪 Testing

El backend incluye tests con **Jest** y **Supertest**:

### Principios de Testing E2E

**REGLA CRÍTICA**: Los tests E2E **NUNCA** deben tocar datos reales.

-   Todos los datos de prueba usan prefijo `e2e_test_`
-   Timestamps únicos para evitar colisiones: `Date.now()`
-   Rastreo de IDs creados para limpieza específica
-   Limpieza garantizada en `afterAll` con `try-catch-finally`
-   **Prohibido**: `deleteMany({})` sin `where` específico

### Estructura de Tests

```
src/tests/
├── unit/              # Tests de funciones individuales
│   ├── services/
│   └── validators/
└── e2e/               # Tests de endpoints completos
    ├── auth.test.js
    ├── exercises.test.js
    └── routines.test.js
```

## 📊 Consideraciones de Producción

### Checklist Pre-Deploy

-   [ ] `NODE_ENV=production` en variables de entorno
-   [ ] Secrets únicos y aleatorios (64+ caracteres)
-   [ ] `CORS_ORIGIN` configurado con dominio real
-   [ ] Base de datos PostgreSQL en servidor remoto
-   [ ] Certificado SSL/TLS configurado (HTTPS)
-   [ ] Logs centralizados configurados
-   [ ] Monitoreo de errores activo
-   [ ] Backups automáticos de base de datos
-   [ ] Rate limiters ajustados según tráfico esperado
-   [ ] Tamaño máximo de body configurado (`10kb`)
-   [ ] Validación de archivos funcionando correctamente

### Recomendaciones

1. **Base de datos**: Usar servicio administrado (RDS, Railway, Supabase)
2. **Hosting**: Node.js compatible (Railway, Render, DigitalOcean)
3. **SSL**: Obligatorio para cookies `Secure` y `httpOnly`
4. **Logs**: Implementar Winston o similar para logs estructurados
5. **Monitoreo**: Sentry o similar para tracking de errores
6. **Backups**: Automáticos diarios de PostgreSQL
7. **Escalado**: Considerar clustering de Node.js si carga aumenta

### Variables de Producción

```bash
NODE_ENV=production
DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/prod_db"
PORT=3000
JWT_SECRET=[SECRETO_ÚNICO_PRODUCCIÓN_64_CHARS]
REFRESH_JWT_SECRET=[SECRETO_DIFERENTE_64_CHARS]
CSRF_SECRET=[SECRETO_CSRF_64_CHARS]
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
```

## 📄 Licencia

**Copyright © 2026 José Núñez. Todos los derechos reservados.**

Este código es propiedad intelectual de José Núñez. Consultar `LICENSE` en la raíz del proyecto para más información.

---

**Desarrollado por**: José Núñez  
**Versión**: 1.0.0
