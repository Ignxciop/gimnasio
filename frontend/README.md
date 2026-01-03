# Frontend - Gimnasio

Aplicación web móvil-first construida con React, TypeScript y Vite para gestión de rutinas de entrenamiento en gimnasio.

## 📋 Descripción

El frontend de **Gimnasio** es una aplicación web **mobile-first** y **responsive** diseñada específicamente para usarse en el gimnasio desde dispositivos móviles. Proporciona una interfaz intuitiva, rápida y optimizada para registrar entrenamientos, gestionar rutinas y visualizar progreso.

## 🎯 Rol en el Sistema

El frontend actúa como:

-   **Interfaz de usuario** principal para interacción con la aplicación
-   **Cliente SPA (Single Page Application)** con navegación sin recargas
-   **Gestor de estado** de autenticación y sesión del usuario
-   **Consumidor de API REST** mediante llamadas HTTP al backend
-   **Validador de datos** en cliente antes de enviar al servidor

## 🛠️ Stack Tecnológico

### Core

-   **React**: `19.2.3` (librería UI con concurrent features)
-   **TypeScript**: `5.9.3` (tipado estático)
-   **Vite**: `7.3.0` (build tool y dev server ultra-rápido)

### Routing y Navegación

-   **React Router DOM**: Navegación SPA con lazy loading de componentes

### Estilos

-   **CSS Modules** y **CSS vanilla**
-   **Variables CSS globales** para paleta de colores consistente
-   **Media queries** para diseño responsive

### Iconografía

-   **Lucide React**: Iconos SVG optimizados y tree-shakeable

### Utilidades

-   **Custom Hooks**: Lógica reutilizable (fetch, modales, autenticación)
-   **Context API**: Gestión de estado global (Toast, notificaciones)
-   **Type Guards**: Validación de tipos en runtime

### Desarrollo

-   **ESLint**: Linting con reglas de TypeScript y React
-   **pnpm**: `10.25.0` (gestor de paquetes)

## 📐 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes reutilizables genéricos
│   │   │   ├── Button.tsx         # Botón con variants (primary, secondary, danger)
│   │   │   ├── Input.tsx          # Input con label, error, validación
│   │   │   ├── Modal.tsx          # Modal con backdrop-filter
│   │   │   ├── ConfirmDialog.tsx  # Diálogo de confirmación/cancelación
│   │   │   ├── Card.tsx           # Cards con estilos consistentes
│   │   │   ├── Select.tsx         # Selects dropdown personalizados
│   │   │   └── Toast.tsx          # Notificaciones toast
│   │   │
│   │   ├── LoginForm.tsx          # Formulario de login
│   │   ├── RegisterForm.tsx       # Formulario de registro
│   │   ├── LeftNav.tsx            # Navegación lateral
│   │   ├── ExerciseCard.tsx       # Card de ejercicio
│   │   ├── RoutineCard.tsx        # Card de rutina
│   │   └── ...                    # Componentes específicos
│   │
│   ├── pages/                     # Vistas principales (solo ensamblan componentes)
│   │   ├── Login.tsx              # Página de login
│   │   ├── Register.tsx           # Página de registro
│   │   ├── Home.tsx               # Dashboard principal
│   │   ├── Profile.tsx            # Perfil de usuario
│   │   ├── Rutinas.tsx            # Lista de rutinas
│   │   ├── RoutineDetail.tsx      # Detalle de rutina
│   │   ├── ActiveRoutine.tsx      # Rutina en ejecución
│   │   ├── WorkoutDay.tsx         # Registro de entrenamiento
│   │   ├── CompletedRoutines.tsx  # Histórico de entrenamientos
│   │   ├── Statistics.tsx         # Métricas y progreso
│   │   ├── Gestion.tsx            # Panel de manager
│   │   └── Admin.tsx              # Panel de administrador
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx         # Layout para login/register
│   │   └── MainLayout.tsx         # Layout con sidebar y navbar
│   │
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP base
│   │   ├── apiInterceptor.ts      # Interceptor con auto-refresh tokens
│   │   ├── authService.ts         # Login, register, logout, refresh
│   │   ├── tokenStorage.ts        # Almacenamiento seguro en memoria
│   │   ├── exerciseService.ts     # CRUD ejercicios
│   │   ├── routineService.ts      # CRUD rutinas
│   │   └── ...                    # Servicios por entidad
│   │
│   ├── contexts/
│   │   └── ToastContext.tsx       # Context para notificaciones toast
│   │
│   ├── hooks/
│   │   ├── useFetch.ts            # Fetch genérico con loading/error
│   │   ├── useAuth.ts             # Hook de autenticación
│   │   ├── useModal.ts            # Gestión de estado de modales
│   │   └── ...                    # Hooks personalizados
│   │
│   ├── types/
│   │   ├── auth.ts                # Tipos de autenticación
│   │   ├── user.ts                # Tipos de usuario
│   │   ├── exercise.ts            # Tipos de ejercicio
│   │   ├── routine.ts             # Tipos de rutina
│   │   └── ...                    # Tipos por entidad
│   │
│   ├── utils/
│   │   ├── validators.ts          # Validadores (email, password, name)
│   │   ├── constants.ts           # Constantes globales
│   │   └── formatters.ts          # Formateo de fechas, números, etc.
│   │
│   ├── styles/
│   │   ├── variables.css          # Variables CSS globales (colores, espaciado)
│   │   └── global.css             # Estilos globales base
│   │
│   ├── config/
│   │   └── api.config.ts          # Configuración de API (URL base)
│   │
│   ├── App.tsx                    # Componente raíz con routing
│   └── main.tsx                   # Entry point
│
├── public/                        # Assets estáticos
├── index.html                     # HTML base
├── vite.config.ts                 # Configuración de Vite
├── tsconfig.json                  # Configuración TypeScript
└── package.json
```

## 🎨 Convenciones de Componentes

### Principio de Responsabilidad Única

#### ❌ Páginas NO deben:

-   Contener lógica de negocio compleja
-   Manejar inputs y formularios directamente
-   Hacer redirecciones internas
-   Duplicar código entre páginas

#### ✅ Páginas SÍ deben:

-   Solo **ensamblar componentes**
-   Pasar props a componentes hijos
-   Gestionar estado mínimo (ej: tabs activos)

### Componentes Reutilizables (ui/)

**REGLA DE ORO**: Antes de crear un componente nuevo, **auditar componentes existentes**.

Componentes disponibles en `components/ui/`:

-   **Button**: variants (primary, secondary, danger), isLoading, fullWidth
-   **Input**: con label, error, validación
-   **Modal**: con backdrop-filter, overlay, header
-   **ConfirmDialog**: diálogos de confirmación/cancelación
-   **Card**: cards con estilos consistentes
-   **Select**: selects dropdown personalizados
-   **Toast**: notificaciones toast

**Prioridad**: Reutilizar → Extender → Crear nuevo (solo como último recurso)

### Custom Hooks

Extraer lógica reutilizable a hooks personalizados:

```typescript
// Ejemplo: useFetch
const { data, loading, error } = useFetch<Exercise[]>("/api/exercises");

// Ejemplo: useModal
const { isOpen, open, close } = useModal();
```

### Separación de Responsabilidades

```
┌─────────────────────────────────────┐
│            PAGES                    │
│  - Ensamblan componentes            │
│  - NO contienen lógica de negocio   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          COMPONENTS                 │
│  - Lógica específica                │
│  - Manejo de estado local           │
│  - Validaciones de formularios      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           SERVICES                  │
│  - Llamadas API                     │
│  - Transformación de datos          │
│  - Manejo de errores HTTP           │
└─────────────────────────────────────┘
```

## 🔐 Autenticación en Frontend

### Almacenamiento Seguro de Tokens

El frontend implementa **almacenamiento en memoria** para prevenir XSS:

```typescript
// tokenStorage.ts - Closure con variable privada
let accessToken: string | null = null;

export const tokenStorage = {
    setToken(token: string): void {
        accessToken = token;
    },
    getToken(): string | null {
        return accessToken;
    },
    removeToken(): void {
        accessToken = null;
    },
};
```

**❌ Prohibido usar**:

-   `localStorage` (vulnerable a XSS)
-   `sessionStorage` (vulnerable a XSS)

**✅ Solución**:

-   Variable en memoria (closure-based)
-   Se pierde al recargar página → Usa refresh token automático

### Flujo de Autenticación

```
┌───────────────────────────────────────────────────────────┐
│                    USUARIO INICIA SESIÓN                  │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│  authService.login({ email, password })                   │
│  - POST /api/auth/login                                   │
│  - Recibe accessToken + Cookie httpOnly (refreshToken)    │
│  - Guarda accessToken en memoria con tokenStorage         │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│  Usuario autenticado - Acceso a rutas protegidas         │
│  - Cada request incluye Header: Bearer {accessToken}      │
└───────────────────────────┬───────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│  TOKEN VÁLIDO           │  │  TOKEN EXPIRADO         │
│  (< 15 minutos)         │  │  (> 15 minutos)         │
│  - Request exitoso      │  │  - Backend: 401         │
└─────────────────────────┘  └──────────┬──────────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │  apiInterceptor detecta 401           │
                    │  - POST /api/auth/refresh             │
                    │  - Cookie refreshToken enviada auto   │
                    │  - Recibe nuevo accessToken           │
                    │  - Guarda en memoria                  │
                    │  - Reintenta request original         │
                    └───────────────────┬───────────────────┘
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                            ▼                       ▼
                ┌─────────────────────┐  ┌─────────────────────┐
                │  REFRESH EXITOSO    │  │  REFRESH FALLIDO    │
                │  - Request exitoso  │  │  - Limpiar tokens   │
                │  - Usuario sigue    │  │  - Redirect /login  │
                │    autenticado      │  │                     │
                └─────────────────────┘  └─────────────────────┘
```

### Interceptor HTTP con Auto-Refresh

```typescript
// apiInterceptor.ts
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = tokenStorage.getToken();

    // Primera request con token actual
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
        credentials: "include", // Importante para enviar cookies
    });

    // Si token expiró (401/403), refrescar automáticamente
    if (response.status === 401 || response.status === 403) {
        const newToken = await refreshAccessToken(); // POST /api/auth/refresh
        tokenStorage.setToken(newToken);

        // Reintentar request original con nuevo token
        response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                ...options.headers,
            },
            credentials: "include",
        });
    }

    return response;
};
```

### Validación de Token al Montar App

```typescript
// App.tsx
useEffect(() => {
    const token = authService.getToken();
    if (token && !authService.isTokenValid()) {
        authService.clearAuth(); // Limpiar token expirado
        setIsAuthenticated(false);
    }
}, []);
```

### Método clearAuth

Limpia token y redirige a login **solo si no está ya en página pública**:

```typescript
clearAuth(): void {
  this.removeToken();
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/register"
  ) {
    window.location.href = "/login";
  }
}
```

Esto previene loops infinitos de redirección.

## 🌐 Comunicación con Backend

### Cliente HTTP Base

```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`);
        return response.json();
    },

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    // ... put, delete
};
```

### Manejo de Errores

```typescript
try {
    const data = await api.post<LoginResponse>("/auth/login", credentials);
    // Éxito
} catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Error de autenticación:", error.message);
    }
}
```

**IMPORTANTE**: Usar `error: unknown` con type guards, **nunca** `error: any`.

## 🛡️ Seguridad en Frontend

### Prevención XSS

1. **React escapa automáticamente** contenido en JSX
2. **Nunca usar** `dangerouslySetInnerHTML` sin sanitización
3. **Validar entrada** antes de enviar al backend
4. **Tokens en memoria**, NO en localStorage/sessionStorage

### Validaciones del Cliente

Sincronizadas con backend para consistencia:

```typescript
// utils/validators.ts
export const validators = {
    password: (value: string): string | undefined => {
        if (!value) return "La contraseña es requerida";
        if (value.length < 12) return "Mínimo 12 caracteres";
        if (value.length > 128) return "Máximo 128 caracteres";
        if (!/(?=.*[a-z])/.test(value)) return "Debe contener minúscula";
        if (!/(?=.*[A-Z])/.test(value)) return "Debe contener mayúscula";
        if (!/(?=.*\d)/.test(value)) return "Debe contener número";
        if (!/(?=.*[@$!%*?&#])/.test(value))
            return "Debe contener carácter especial";
        return undefined;
    },
};
```

### CSRF Protection

El frontend incluye token CSRF en requests mutables:

```typescript
// Obtener CSRF token antes de POST/PUT/DELETE
const csrfResponse = await fetch(`${API_URL}/api/auth/csrf-token`, {
    credentials: "include",
});
const { csrfToken } = await csrfResponse.json();

// Usar en headers
await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
        "x-csrf-token": csrfToken,
    },
});
```

## 📱 Diseño Responsive Mobile-First

### Breakpoints

```css
/* variables.css */
:root {
    --breakpoint-mobile: 480px;
    --breakpoint-tablet: 768px;
    --breakpoint-desktop: 1024px;
}

/* Mobile-first approach */
.container {
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### Paleta de Colores

**Tema oscuro inspirado en fuerza y gimnasio**:

```css
:root {
    /* Colores primarios */
    --color-primary: #0b0b0b; /* Negro profundo */
    --color-surface: #1a1a1a; /* Gris oscuro */
    --color-surface-light: #2a2a2a; /* Gris medio */

    /* Acentos (gradiente rojo-naranja) */
    --accent-start: crimson; /* Rojo intenso */
    --accent-mid: #dc143c; /* Rojo */
    --accent-end: #ff4500; /* Naranja rojizo */
    --gradient-accent: linear-gradient(
        135deg,
        var(--accent-start),
        var(--accent-mid),
        var(--accent-end)
    );

    /* Textos */
    --color-text: #e0e0e0;
    --color-text-secondary: #a0a0a0;
}
```

### Touch-Friendly UI

-   **Botones**: Mínimo 44x44px para touch targets
-   **Espaciado**: Generoso entre elementos interactivos
-   **Feedback visual**: Estados hover, active y focus claros
-   **Gestos**: Soporte para swipe en listas (donde aplique)

## ⚙️ Variables de Entorno

Crear archivo `.env` en la raíz de `/frontend`:

```bash
# URL del backend API
VITE_API_URL=http://localhost:3000

# En producción:
# VITE_API_URL=https://api.tudominio.com
```

**IMPORTANTE**: Variables en Vite **deben** tener prefijo `VITE_`.

### Uso en Código

```typescript
const API_URL = import.meta.env.VITE_API_URL;

// ❌ NUNCA hardcodear URLs
const response = await fetch("http://localhost:3000/api/users");

// ✅ Siempre usar variable de entorno
const response = await fetch(`${API_URL}/api/users`);
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

-   **Node.js**: 24.12.0 o superior
-   **pnpm**: 10.25.0

### Instalación

```bash
# Ir a carpeta frontend
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con URL del backend
```

### Ejecución

#### Desarrollo

```bash
pnpm dev
```

Servidor de desarrollo en `http://localhost:5173` con HMR (Hot Module Replacement)

#### Build de Producción

```bash
pnpm build
```

Genera carpeta `/dist` con archivos optimizados para producción.

#### Preview de Build

```bash
pnpm preview
```

Previsualiza build de producción localmente.

### Comandos Útiles

```bash
# Linting
pnpm lint

# Build con análisis de tamaño de bundles
pnpm build --report
```

## 📦 Build y Optimización

### Vite Optimizaciones

Vite aplica automáticamente:

-   **Tree-shaking**: Elimina código no usado
-   **Code splitting**: Divide bundles por rutas (lazy loading)
-   **Minificación**: CSS y JS comprimidos
-   **Asset optimization**: Imágenes y fuentes optimizadas

### Lazy Loading de Páginas

```typescript
// App.tsx - Carga páginas bajo demanda
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Rutinas = lazy(() => import("./pages/Rutinas"));

<Suspense fallback={<LoadingSpinner />}>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/rutinas" element={<Rutinas />} />
    </Routes>
</Suspense>;
```

Esto divide el código en chunks separados que se cargan solo cuando el usuario navega a esa ruta.

## 📊 Consideraciones de Producción

### Checklist Pre-Deploy

-   [ ] `VITE_API_URL` apunta a URL de producción (HTTPS)
-   [ ] Build ejecutado sin errores: `pnpm build`
-   [ ] Assets optimizados y comprimidos
-   [ ] Variables de entorno configuradas correctamente
-   [ ] Certificado SSL/TLS configurado
-   [ ] Headers de seguridad en servidor web
-   [ ] CORS configurado en backend para dominio de producción
-   [ ] Service Worker configurado (opcional, para PWA)
-   [ ] Analytics configurado (opcional)

### Hosting Recomendado

Opciones ideales para SPAs con React:

-   **Vercel** (recomendado para Vite)
-   **Netlify**
-   **Railway**
-   **Cloudflare Pages**
-   **GitHub Pages** (solo sitios públicos)

### Configuración de Rutas en Servidor

Para que funcione React Router en producción, el servidor debe redirigir todas las rutas a `index.html`:

#### Ejemplo Netlify (`netlify.toml`)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Ejemplo Vercel (`vercel.json`)

```json
{
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Variables de Producción

```bash
VITE_API_URL=https://api.tudominio.com
```

**Nunca** incluir secretos sensibles en variables con prefijo `VITE_`, ya que se embeben en el bundle público.

## 🎨 Guía de Estilo

### TypeScript

```typescript
// ✅ Interfaces para props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

// ✅ Tipos explícitos para responses
interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// ❌ Evitar any
const handleError = (error: any) => { ... }

// ✅ Usar unknown con type guards
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

### Componentes

```typescript
// ✅ Nombres descriptivos, PascalCase
export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return <div>...</div>;
};

// ✅ Props destructuradas
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isLoading = false
}) => { ... };

// ❌ Props sin destructurar
export const Button: React.FC<ButtonProps> = (props) => { ... };
```

### Convenciones de Nombres

-   **Componentes**: PascalCase (`ExerciseCard.tsx`)
-   **Hooks**: camelCase con prefijo `use` (`useFetch.ts`)
-   **Services**: camelCase (`authService.ts`)
-   **Types**: PascalCase (`User.ts`, `Exercise.ts`)
-   **Utils**: camelCase (`validators.ts`)
-   **Constants**: SCREAMING_SNAKE_CASE (`API_URL`, `MAX_FILE_SIZE`)

## 📄 Licencia

**Copyright © 2026 José Núñez. Todos los derechos reservados.**

Este código es propiedad intelectual de José Núñez. Consultar `LICENSE` en la raíz del proyecto para más información.

---

**Desarrollado por**: José Núñez  
**Versión**: 1.0.0
