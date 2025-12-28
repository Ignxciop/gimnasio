# GitHub Copilot Instructions - Gimnasio App

## Estructura del Proyecto

Este es un proyecto fullstack con frontend (React + TypeScript) y backend (Node.js + Express + Prisma).

```
gimnasio/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Vistas/pantallas
│   │   ├── layouts/      # Layouts (AuthLayout, MainLayout)
│   │   ├── hooks/        # Custom hooks de React
│   │   ├── services/     # Llamadas API y lógica de servicios
│   │   ├── styles/       # CSS global y variables
│   │   ├── types/        # TypeScript types/interfaces
│   │   └── utils/        # Utilidades y validadores
│   └── package.json
└── backend/           # Node.js + Express + Prisma
    ├── src/
    │   ├── config/       # Configuración (DB, JWT, etc.)
    │   ├── controllers/  # Controladores de rutas
    │   ├── middlewares/  # Middlewares (auth, errores)
    │   ├── routes/       # Definición de rutas
    │   ├── services/     # Lógica de negocio
    │   ├── validators/   # Validaciones con express-validator
    │   └── tests/        # Tests unitarios y e2e
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

## Convenciones de Código Frontend

### Componentes

-   **Páginas (pages/)**: Solo ensamblan componentes, NO contienen lógica de negocio ni inputs directamente
-   **Componentes (components/)**: Componentes específicos de funcionalidad (LoginForm, RegisterForm)
-   **UI (components/ui/)**: Componentes reutilizables genéricos (Button, Input, Modal)
-   **Layouts (layouts/)**: Envolturas para diferentes secciones (AuthLayout, MainLayout)
-   **Hooks (hooks/)**: Custom hooks para lógica reutilizable (useFetch, useAuth, useModal)

### Responsabilidades Claras

-   Las páginas NO manejan redirecciones directamente
-   Los formularios manejan su propio estado y validaciones
-   Los servicios manejan llamadas API
-   **Custom hooks** extraen lógica reutilizable (fetch, estado modal, autenticación)
-   Reutilizar componentes UI, NO duplicar lógica
-   Validaciones en el cliente usando `utils/validators.ts`

### 🚨 REGLA PERMANENTE: Auditoría de Reutilización

**Antes de crear cualquier componente, modal, botón o lógica nueva, SIEMPRE debes:**

1. **Auditoría previa obligatoria**

    - Revisar componentes existentes en `components/ui/`
    - Identificar si alguno cumple total o parcialmente el requerimiento
    - Verificar si puede extenderse con props en vez de duplicarse

2. **Prioridad de reutilización**

    - Si existe un componente reutilizable → **DEBES usarlo**
    - Solo puedes crear uno nuevo si el existente no puede adaptarse razonablemente
    - Si creas uno nuevo, debes justificarlo explícitamente

3. **Componentes disponibles para reutilizar**

    - `ui/Button` → Botones con variants (primary, secondary, danger), isLoading, fullWidth
    - `ui/Input` → Inputs con label, error, validación
    - `ui/Modal` → Modales con backdrop-filter, overlay, header
    - `ui/ConfirmDialog` → Diálogos de confirmación/cancelación
    - `ui/Card` → Cards con estilos consistentes
    - `ui/Select` → Selects dropdown personalizados
    - `ui/Toast` → Notificaciones toast

4. **Regla de oro**
    - ❌ NO crear componentes nuevos por comodidad
    - ✅ Reutilizar primero, extender si es necesario, crear solo como último recurso
    - ✅ Evitar duplicación de lógica y estilos
    - ✅ Asegurar consistencia visual y funcional en toda la app

### Estilos

-   Usar CSS modules o archivos CSS separados por componente
-   Variables CSS globales en `src/styles/variables.css`
-   **Paleta de colores**: Negros/grises oscuros con acentos rojos→naranjas
    -   Primary: `#0b0b0b` (negro profundo)
    -   Accent gradient: `--gradient-accent` (crimson → rojo → naranja)
    -   Usar `--accent-start`, `--accent-mid`, `--accent-end` para acentos
-   **Estética**: Poder, fuerza, gimnasio (difuminados, gradientes)

### TypeScript

-   Usar interfaces para props de componentes
-   Tipos explícitos para responses de API
-   Evitar `any`, usar tipos específicos
-   **Manejo de errores**: Usar `unknown` en lugar de `any` para catch blocks
    ```typescript
    try {
        // código
    } catch (error: unknown) {
        if (error instanceof Error) {
            // manejar error
        }
    }
    ```

### Navegación

-   Usar `react-router-dom` para navegación
-   `useNavigate()` para redirecciones programáticas
-   `NavLink` para enlaces de navegación con estado activo

### Variables de Entorno

-   **Vite**: Usar `import.meta.env.VITE_*` para variables de entorno
-   **NUNCA** hardcodear URLs de API, siempre usar variables
-   Ejemplo: `const API_URL = import.meta.env.VITE_API_URL;`
-   Archivo `.env` en la raíz del proyecto frontend

## Convenciones de Código Backend

### Arquitectura

-   **Controladores**: Manejan request/response, delegan lógica a servicios
-   **Servicios**: Contienen lógica de negocio
-   **Validadores**: Usan `express-validator` para validaciones
-   **Middlewares**: Auth, manejo de errores
-   **Routes**: Solo definen rutas y aplican middlewares/validadores
-   **Modules**: Usar ES6 modules (`export`/`import`), NO CommonJS (`module.exports`/`require`)

### Prisma

-   Usar `prisma` para todas las operaciones de DB
-   Seleccionar solo campos necesarios en queries
-   Hashear passwords con `bcryptjs`

### Manejo de Errores

-   Errores con `statusCode` personalizado
-   Middleware `errorHandler` centralizado
-   Validaciones retornan formato consistente:
    ```javascript
    {
      success: false,
      errors: [{ field: "campo", message: "mensaje" }]
    }
    ```

### Seguridad

-   JWT para autenticación
-   Middleware de autenticación en rutas protegidas
-   CORS configurado para desarrollo
-   Nunca devolver passwords en respuestas

### Responses

-   Formato consistente:
    ```javascript
    {
      success: true/false,
      message: "mensaje",
      data: { /* datos */ }
    }
    ```

### Testing

-   **Tests E2E**: Usar prefijo `e2e_test_` para datos de prueba (usuarios, registros, etc.)
-   **Aislamiento de datos**: Mantener array `createdIds` para rastrear y limpiar datos de prueba
-   **Imports**: Usar `@jest/globals` para describe, it, expect, beforeAll, afterAll
-   **Patrón de cleanup**:

    ```javascript
    const createdIds = { userId: null, itemId: null };

    beforeAll(async () => {
        // Setup con prefijo e2e_test_
    });

    afterAll(async () => {
        // Cleanup de createdIds
    });
    ```

-   **Nunca** usar datos reales en tests, siempre datos con prefijo identificable

## NO Hacer

### Frontend

-   ❌ Un solo formulario gigante con mil condiciones
-   ❌ Duplicar CSS entre componentes
-   ❌ Lógica de API dentro de componentes
-   ❌ Manejar redirecciones en componentes de formulario
-   ❌ Usar colores azules (paleta vieja)
-   ❌ **NUNCA hardcodear URLs de API** - Siempre usar `import.meta.env.VITE_API_URL`
-   ❌ **NUNCA usar `any` en TypeScript** - Usar `unknown` con type guards
-   ❌ **NUNCA colocar comentarios en el código** - El código debe ser autoexplicativo con nombres descriptivos
-   ❌ **NUNCA usar emojis** - Usar lucide-react icons en su lugar
-   ❌ **NUNCA usar emojis en logs** - Los logs deben ser claros y limpios

### Backend

-   ❌ Lógica de negocio en controladores
-   ❌ Queries directas en controladores
-   ❌ Devolver passwords en responses
-   ❌ Validaciones en servicios (van en validators/)
-   ❌ **NUNCA colocar comentarios en el código** - El código debe ser autoexplicativo con nombres descriptivos
-   ❌ **NUNCA usar emojis en logs** - Los logs deben ser claros y limpios

## SÍ Hacer

### Frontend

-   ✅ Custom hooks para lógica compartida (fetch, modales, autenticación)
-   ✅ Services para manejar API con `import.meta.env.VITE_API_URL`
-   ✅ Usar variables CSS para colores y espaciado
-   ✅ Aplicar gradiente acento en botones principales
-   ✅ **SIEMPRE diseñar responsive** - Todo debe verse bien en desktop y móviles (usar media queries)
-   ✅ Manejo de errores con `error: unknown` y type guards (`instanceof Error`)

### Backend

-   ✅ Separar responsabilidades (controller → service → prisma)
-   ✅ Validar datos con express-validator
-   ✅ Manejar errores de forma centralizada
-   ✅ Usar transacciones cuando sea necesario
-   ✅ **SIEMPRE crear tests** - Nuevas funcionalidades requieren tests unitarios y e2e. La funcionalidad está completa cuando todos los tests pasan

## Flujo de Autenticación

1. Usuario envía credenciales → Backend valida → Genera JWT
2. Frontend guarda token en localStorage
3. Requests incluyen token en headers
4. Middleware verifica token en rutas protegidas
5. Logout elimina token de localStorage

## Comandos Útiles

```bash
# Backend
cd backend
pnpm install
pnpm dev
pnpm test

# Frontend
cd frontend
pnpm install
pnpm dev
pnpm build

# Prisma
cd backend
npx prisma migrate dev
npx prisma studio
```

## Stack Tecnológico

**Frontend**: React 19, TypeScript, Vite, React Router, lucide-react (iconos)
**Backend**: Node.js, Express, Prisma, PostgreSQL
**Auth**: JWT, bcryptjs
**Validación**: express-validator (backend), custom validators (frontend)
**Testing**: Jest (backend)

## Convenciones de Git

### Commits Atómicos

**IMPORTANTE**: Hacer commits pequeños y atómicos después de cada cambio lógico. Cada commit debe representar UNA unidad de trabajo completada.

### Ejemplos de commits atómicos:

✅ **Crear componente LeftNav**

-   Archivos: `LeftNav.tsx` + `leftnav.css`
-   Commit: `feat: Agregar componente LeftNav para navegación lateral`

✅ **Actualizar variables CSS**

-   Archivo: `variables.css`
-   Commit: `style: Actualizar paleta de colores a negro/rojo-naranja`

✅ **Crear página Home**

-   Archivo: `Home.tsx`
-   Commit: `feat: Agregar página Home con MainLayout`

✅ **Agregar MainLayout**

-   Archivos: `MainLayout.tsx` + `mainLayout.css`
-   Commit: `feat: Agregar MainLayout con soporte de sidebar`

✅ **Actualizar rutas en App**

-   Archivo: `App.tsx`
-   Commit: `feat: Agregar ruta /home y lógica de rutas protegidas`

### Flujo de trabajo recomendado:

1. **Crear/modificar archivos relacionados** (componente + estilos)
2. **Hacer commit inmediatamente**
3. **Continuar con siguiente tarea**
4. **NO acumular múltiples features en un solo commit**

### Formato de mensajes de commit:

```
tipo: descripción corta en español

feat: nueva funcionalidad
fix: corrección de bug
style: cambios de estilos/CSS
refactor: refactorización de código
docs: documentación
test: añadir/modificar tests
chore: tareas de mantenimiento
```

### Ejemplos de MALOS commits (evitar):

❌ `feat: Agregar página home completa con navbar, estilos, rutas y formularios`
❌ `actualizar archivos`
❌ `cambios`
❌ Commits gigantes con 15+ archivos no relacionados

### Ejemplos de BUENOS commits:

✅ `feat: Agregar componente RegisterForm con validación`
✅ `style: Aplicar gradiente de acento a botones primarios`
✅ `fix: Corregir validación de roleId en endpoint de registro`
✅ `refactor: Extraer lógica de autenticación a authService`
