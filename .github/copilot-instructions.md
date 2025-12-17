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
-   **UI (components/ui/)**: Componentes reutilizables genéricos (Button, Input, LeftNav)
-   **Layouts (layouts/)**: Envolturas para diferentes secciones (AuthLayout, MainLayout)

### Responsabilidades Claras

-   Las páginas NO manejan redirecciones directamente
-   Los formularios manejan su propio estado y validaciones
-   Los servicios manejan llamadas API
-   Reutilizar componentes UI, NO duplicar lógica
-   Validaciones en el cliente usando `utils/validators.ts`

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

### Navegación

-   Usar `react-router-dom` para navegación
-   `useNavigate()` para redirecciones programáticas
-   `NavLink` para enlaces de navegación con estado activo

## Convenciones de Código Backend

### Arquitectura

-   **Controladores**: Manejan request/response, delegan lógica a servicios
-   **Servicios**: Contienen lógica de negocio
-   **Validadores**: Usan `express-validator` para validaciones
-   **Middlewares**: Auth, manejo de errores
-   **Routes**: Solo definen rutas y aplican middlewares/validadores

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

## NO Hacer

### Frontend

-   ❌ Un solo formulario gigante con mil condiciones
-   ❌ Duplicar CSS entre componentes
-   ❌ Lógica de API dentro de componentes
-   ❌ Manejar redirecciones en componentes de formulario
-   ❌ Usar colores azules (paleta vieja)
-   ❌ **NUNCA colocar comentarios en el código** - El código debe ser autoexplicativo con nombres descriptivos

### Backend

-   ❌ Lógica de negocio en controladores
-   ❌ Queries directas en controladores
-   ❌ Devolver passwords en responses
-   ❌ Validaciones en servicios (van en validators/)
-   ❌ **NUNCA colocar comentarios en el código** - El código debe ser autoexplicativo con nombres descriptivos

## SÍ Hacer

### Frontend

-   ✅ Formularios separados con responsabilidades claras
-   ✅ Componentes pequeños y reutilizables
-   ✅ Services para manejar API
-   ✅ Usar variables CSS para colores y espaciado
-   ✅ Aplicar gradiente acento en botones principales

### Backend

-   ✅ Separar responsabilidades (controller → service → prisma)
-   ✅ Validar datos con express-validator
-   ✅ Manejar errores de forma centralizada
-   ✅ Usar transacciones cuando sea necesario
-   ✅ Tests para endpoints críticos

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

**Frontend**: React 19, TypeScript, Vite, React Router
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
