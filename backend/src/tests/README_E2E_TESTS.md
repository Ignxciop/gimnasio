# 🧪 Guía de Tests E2E - Reglas Obligatorias

## 🚨 REGLA DE ORO: Aislamiento Total de Datos

**Los tests E2E NUNCA deben tocar datos reales del usuario.**

---

## ✅ Principios Fundamentales

### 1. **Usar Prefijos Únicos**

Todos los datos de prueba deben tener un prefijo identificable:

```javascript
const E2E_PREFIX = "e2e_test_";
const TEST_EMAIL = `${E2E_PREFIX}user_${Date.now()}@test.com`;
const TEST_USERNAME = `${E2E_PREFIX}user_${Date.now()}`;
```

### 2. **Timestamps para Unicidad**

Usar `Date.now()` o UUIDs para evitar colisiones:

```javascript
const testExercise = {
    name: `${E2E_PREFIX}Exercise_${Date.now()}`,
    // ...
};
```

### 3. **Rastrear IDs Creados**

Mantener un registro de todos los IDs creados:

```javascript
const createdIds = {
    userId: null,
    exerciseId: null,
    routineId: null,
    // ...
};
```

### 4. **Limpieza Segura en afterAll**

Eliminar **SOLO** los datos creados por el test:

```javascript
afterAll(async () => {
    try {
        if (createdIds.exerciseId) {
            await prisma.exercise.deleteMany({
                where: { id: createdIds.exerciseId }, // ✅ ID específico
            });
        }

        if (createdIds.userId) {
            await prisma.user.deleteMany({
                where: { id: createdIds.userId }, // ✅ ID específico
            });
        }
    } catch (error) {
        console.error("Error during test cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
});
```

---

## ❌ Prácticas PROHIBIDAS

### 1. **Eliminar por Condiciones Amplias**

```javascript
// ❌ NUNCA HACER ESTO - Elimina TODOS los usuarios
await prisma.user.deleteMany({
    where: { email: { contains: "@test.com" } },
});

// ❌ NUNCA HACER ESTO - Elimina TODO
await prisma.exercise.deleteMany({});
```

### 2. **Asumir Base de Datos Vacía**

```javascript
// ❌ MAL - Asume que no hay datos previos
const exercise = await prisma.exercise.findFirst();
exerciseId = exercise.id; // Podría ser un ejercicio real!
```

### 3. **Eliminar Datos en beforeAll**

```javascript
// ❌ MAL - Podría eliminar datos reales
beforeAll(async () => {
    await prisma.user.deleteMany({
        where: { email: "test@test.com" },
    });
});
```

### 4. **Reutilizar Datos Existentes**

```javascript
// ❌ MAL - Usar datos reales del sistema
const equipment = await prisma.equipment.findFirst();
// ¿Y si este equipo es usado por usuarios reales?
```

---

## ✅ Patrón Recomendado Completo

```javascript
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import { prisma } from "../../config/prisma.js";

const E2E_PREFIX = "e2e_test_";
const TEST_EMAIL = `${E2E_PREFIX}user_${Date.now()}@test.com`;
const TEST_USERNAME = `${E2E_PREFIX}user_${Date.now()}`;

const createdIds = {
    userId: null,
    exerciseId: null,
    routineId: null,
};

let authToken;

beforeAll(async () => {
    // 1. Crear usuario de prueba
    const role = await prisma.role.findFirst({
        where: { role: "usuario" },
    });

    const testUser = {
        username: TEST_USERNAME,
        name: `${E2E_PREFIX}Test`,
        lastname: `${E2E_PREFIX}User`,
        email: TEST_EMAIL,
        password: "Test123!",
        gender: "male",
        roleId: role.id,
    };

    const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(testUser);

    if (registerResponse.status !== 201) {
        throw new Error(
            `Test setup failed: ${JSON.stringify(registerResponse.body)}`
        );
    }

    // 2. Login
    const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
    });

    authToken = loginResponse.body.data.token;
    createdIds.userId = loginResponse.body.data.user.id;

    // 3. Crear datos de prueba necesarios
    const equipment = await prisma.equipment.findFirst();
    const muscleGroup = await prisma.muscleGroup.findFirst();

    const exercise = await prisma.exercise.create({
        data: {
            name: `${E2E_PREFIX}Exercise_${Date.now()}`,
            equipmentId: equipment.id,
            muscleGroupId: muscleGroup.id,
        },
    });
    createdIds.exerciseId = exercise.id;
});

afterAll(async () => {
    try {
        // Eliminar en orden inverso respetando foreign keys
        if (createdIds.exerciseId) {
            await prisma.exercise.deleteMany({
                where: { id: createdIds.exerciseId },
            });
        }

        if (createdIds.userId) {
            await prisma.user.deleteMany({
                where: { id: createdIds.userId },
            });
        }
    } catch (error) {
        console.error("Error during test cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
});

describe("Feature Tests", () => {
    test("Test example", async () => {
        // Tests aquí
    });
});
```

---

## 🔍 Verificación Pre-Commit

Antes de hacer commit de tests E2E, verificar:

-   [ ] ¿Usa prefijo `e2e_test_` o similar?
-   [ ] ¿Usa timestamps para unicidad?
-   [ ] ¿Rastrea todos los IDs creados?
-   [ ] ¿Elimina SOLO datos creados por el test?
-   [ ] ¿Usa IDs específicos en `deleteMany`?
-   [ ] ¿Nunca usa `deleteMany({})` sin where?
-   [ ] ¿Maneja errores en afterAll?
-   [ ] ¿Desconecta Prisma en finally?

---

## 📊 Ejemplo de Limpieza Correcta

```javascript
// ✅ CORRECTO - Elimina solo lo que creó
afterAll(async () => {
    try {
        // Orden inverso por foreign keys
        if (createdIds.routineExerciseId) {
            await prisma.routineExercise.deleteMany({
                where: { id: createdIds.routineExerciseId },
            });
        }

        if (createdIds.routineId) {
            await prisma.routine.deleteMany({
                where: { id: createdIds.routineId },
            });
        }

        if (createdIds.exerciseId) {
            await prisma.exercise.deleteMany({
                where: { id: createdIds.exerciseId },
            });
        }

        if (createdIds.userId) {
            await prisma.user.deleteMany({
                where: { id: createdIds.userId },
            });
        }
    } catch (error) {
        console.error("Error during test cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
});
```

---

## 🎯 Objetivo Final

**Los tests E2E deben ser:**

1. **Seguros**: Nunca afectan datos reales
2. **Idempotentes**: Pueden ejecutarse múltiples veces
3. **Aislados**: No dependen de datos externos
4. **Limpios**: Eliminan todo lo que crearon
5. **Rastreables**: Nombres con prefijos identificables

---

## 📝 Notas Importantes

-   Si un test falla a mitad de ejecución, `afterAll` debe poder limpiar todo
-   Usar `try-catch-finally` en `afterAll` para garantizar limpieza
-   Logs de errores en cleanup para debugging
-   Nunca asumir orden de ejecución de tests
-   Cada test debe poder ejecutarse independientemente

---

**Última actualización**: Diciembre 28, 2025  
**Versión**: 1.0  
**Estado**: Obligatorio para todos los tests E2E
