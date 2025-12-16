#Guía de uso backend

Para correcta inicialización del backend tener esto instalado en el entorno de trabajo:

-   NodeJS versión 24.12.0
-   PostgreSQL 4
-   Pnpm versión 10.25.0

Tener creado .env en la raiz del proyecto backend siguiendo como estructura .env.example

Para poder ejecutar el proyecto primero ejecutar:

-   pnpm install
-   pnpm prisma init
-   pnpm prisma generate
-   pnpm prisma:migrate init

Para ejecutar el backend:

-   pnpm dev (está funcionando con nodemon)
