# Gimnasio

Aplicación web móvil-first para gestión y seguimiento de rutinas de entrenamiento en gimnasio.

## 📋 Descripción General

**Gimnasio** es una aplicación web diseñada para personas que entrenan en gimnasio y necesitan una herramienta digital para registrar, organizar y analizar sus rutinas de entrenamiento.

La aplicación reemplaza métodos tradicionales como cuadernos, hojas de cálculo o aplicaciones limitadas por suscripciones de pago, ofreciendo una solución completa, gratuita y sin restricciones artificiales.

### 🎯 Problema que Resuelve

-   **Gestión centralizada de rutinas**: Crea, organiza y ejecuta rutinas de entrenamiento sin límites
-   **Seguimiento de progreso**: Registro histórico completo de entrenamientos (series, pesos, tiempos)
-   **Métricas y feedback**: Estadísticas detalladas para visualizar evolución y rendimiento
-   **Organización flexible**: Sistema de carpetas para agrupar rutinas según objetivos o etapas
-   **Acceso móvil**: Diseño mobile-first optimizado para usar directamente en el gimnasio

### 👥 Público Objetivo

-   Personas que entrenan regularmente en gimnasio
-   Usuarios que buscan una alternativa digital gratuita sin limitaciones
-   Atletas que desean llevar control detallado de su progreso
-   Cualquier persona que prefiera una herramienta web profesional sobre apps móviles comerciales

## 🏗️ Arquitectura General

La aplicación sigue una arquitectura cliente-servidor con separación completa entre frontend y backend:

```
┌─────────────────────────────────────────────┐
│           FRONTEND (React + TS)             │
│  - Interfaz mobile-first responsive          │
│  - Gestión de estado y autenticación        │
│  - Comunicación con API REST                │
└─────────────────┬───────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────────┐
│        BACKEND (Node.js + Express)          │
│  - API RESTful con autenticación JWT        │
│  - Lógica de negocio y validaciones         │
│  - Seguridad (CSRF, Rate Limiting, Helmet)  │
└─────────────────┬───────────────────────────┘
                  │ Prisma ORM
┌─────────────────▼───────────────────────────┐
│         BASE DE DATOS (PostgreSQL)          │
│  - Usuarios, roles y permisos               │
│  - Ejercicios, equipamiento, grupos musc.   │
│  - Rutinas, folders, entrenamientos         │
│  - Histórico completo y estadísticas        │
└─────────────────────────────────────────────┘
```

## 🛠️ Stack Tecnológico Principal

### Frontend

-   **React 19** con **TypeScript 5.9** (tipado estricto)
-   **Vite 7** (build tool y dev server)
-   **React Router** (navegación SPA)
-   **Lucide React** (iconografía)

### Backend

-   **Node.js 24** con **Express 5**
-   **Prisma 6** como ORM
-   **PostgreSQL** (base de datos relacional)
-   **JWT** (autenticación con dual tokens)

### Seguridad

-   **Helmet** (headers HTTP seguros)
-   **CSRF Protection** (csrf-csrf)
-   **Rate Limiting** (express-rate-limit)
-   **Bcrypt** (hash de contraseñas)
-   **File Type Validation** (validación magic bytes)

### Herramientas

-   **pnpm** (gestor de paquetes)
-   **Jest** (testing)
-   **Git** (control de versiones)

## 🚀 Funcionalidades Principales

### Sistema de Roles

-   **Usuario**: Crea y ejecuta rutinas, accede a estadísticas personales
-   **Manager**: Gestiona catálogo de ejercicios, equipamiento y grupos musculares
-   **Administrador**: Gestión completa de usuarios, roles y permisos

### Gestión de Rutinas

-   Creación ilimitada de rutinas personalizadas
-   Organización mediante carpetas
-   Rutina activa para seguimiento en tiempo real durante entrenamientos
-   Histórico completo de entrenamientos realizados

### Seguimiento y Métricas

-   Registro detallado: series, repeticiones, pesos, tiempos
-   Estadísticas de progreso temporal
-   Sistema de feedback para el usuario
-   Visualización de evolución por ejercicio

### Privacidad

-   Perfiles públicos/privados configurable por usuario
-   Control de visibilidad de rutinas y estadísticas
-   Autenticación segura con tokens de corta duración

## 📦 Estructura del Proyecto

```
gimnasio/
├── frontend/           # Aplicación React (Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # Componentes reutilizables y UI
│   │   ├── pages/         # Vistas principales
│   │   ├── services/      # API calls y lógica de servicios
│   │   ├── contexts/      # Context API (Toast, Auth)
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utilidades y validadores
│   └── package.json
│
├── backend/            # API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Configuración (JWT, CSRF, Prisma)
│   │   ├── controllers/   # Controladores de rutas
│   │   ├── services/      # Lógica de negocio
│   │   ├── middlewares/   # Auth, errores, rate limiting
│   │   ├── routes/        # Definición de endpoints
│   │   ├── validators/    # Validaciones express-validator
│   │   └── tests/         # Tests unitarios y e2e
│   ├── prisma/
│   │   └── schema.prisma  # Modelo de datos
│   └── package.json
│
└── README.md           # Este archivo
```

## 🔧 Instalación y Ejecución

### Prerrequisitos

-   Node.js 24.12.0 o superior
-   PostgreSQL 4
-   pnpm 10.25.0

### Backend

```bash
cd backend
pnpm install
# Configurar .env según .env.example
pnpm prisma migrate dev
pnpm seed
pnpm dev
```

### Frontend

```bash
cd frontend
pnpm install
# Configurar .env según variables requeridas
pnpm dev
```

Consulta los README específicos en `/backend` y `/frontend` para instrucciones detalladas.

## 📊 Estado del Proyecto

**Versión**: 1.0.0 (En desarrollo activo)

**Estado actual**:

-   ✅ Sistema de autenticación completo (JWT dual tokens)
-   ✅ CRUD de usuarios, ejercicios, rutinas, folders
-   ✅ Sistema de roles y permisos
-   ✅ Rutinas activas con seguimiento en tiempo real
-   ✅ Histórico de entrenamientos y estadísticas
-   ✅ Seguridad implementada (CSRF, Rate Limiting, Helmet)
-   ✅ Validaciones frontend y backend sincronizadas
-   ✅ Diseño responsive mobile-first
-   🚧 Testing exhaustivo en progreso

## 📄 Licencia y Restricciones de Uso

**Copyright © 2026 José Núñez. Todos los derechos reservados.**

### ⚖️ Términos de Uso

Este proyecto es de **propiedad intelectual exclusiva** de José Núñez.

#### ✅ Permitido

-   **Visualización del código** con fines educativos y de aprendizaje
-   **Revisión técnica** para comprender implementaciones y patrones

#### ❌ Prohibido

-   **Copiar**, clonar o replicar el código (parcial o totalmente)
-   **Modificar** o crear trabajos derivados
-   **Redistribuir** o publicar en otros repositorios
-   **Uso comercial** de cualquier tipo
-   **Apropiación** de ideas, implementaciones o diseños específicos

#### 📜 Licencia

Este software se distribuye bajo una licencia restrictiva personalizada. El código fuente está disponible solo para inspección y aprendizaje. Cualquier otro uso requiere autorización explícita y por escrito del propietario.

**All Rights Reserved**

---

## 👨‍💻 Autor

**José Núñez**  
Desarrollador Fullstack

---

## 📞 Contacto

Para consultas sobre el proyecto, permisos especiales o colaboraciones, contactar directamente al propietario.

---

**Nota**: Esta aplicación fue diseñada para uso público gratuito sin limitaciones artificiales. El objetivo es ofrecer una herramienta profesional que compita con aplicaciones comerciales del mercado, pero manteniendo el control y propiedad intelectual del código fuente.
