import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    role: {
        findUnique: jest.fn(),
    },
};

const mockBcrypt = {
    hash: jest.fn(),
};

jest.unstable_mockModule("../../config/prisma.js", () => ({
    prisma: mockPrisma,
}));

jest.unstable_mockModule("bcryptjs", () => ({
    default: mockBcrypt,
}));

const { default: userService } = await import("../../services/userService.js");

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        const validUserData = {
            name: "Juan",
            lastname: "Pérez",
            username: "juanp",
            email: "juan@example.com",
            password: "Password123",
            roleId: 1,
        };

        it("debería crear un usuario exitosamente", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.role.findUnique.mockResolvedValue({
                id: 1,
                role: "usuario",
            });
            mockBcrypt.hash.mockResolvedValue("hashedPassword123");

            const mockUser = {
                id: "123",
                name: "Juan",
                lastname: "Pérez",
                username: "juanp",
                email: "juan@example.com",
                createdAt: new Date(),
                is_active: true,
                role: { id: 1, role: "usuario" },
            };

            mockPrisma.user.create.mockResolvedValue(mockUser);

            const result = await userService.createUser(validUserData);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(2);
            expect(mockBcrypt.hash).toHaveBeenCalledWith("Password123", 10);
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it("debería lanzar error si el email ya existe", async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                email: "juan@example.com",
            });

            await expect(userService.createUser(validUserData)).rejects.toThrow(
                "El email ya está registrado"
            );
        });

        it("debería lanzar error si el username ya existe", async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ username: "juanp" });

            await expect(userService.createUser(validUserData)).rejects.toThrow(
                "El nombre de usuario ya está en uso"
            );
        });

        it("debería lanzar error si el rol no existe", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.role.findUnique.mockResolvedValue(null);

            await expect(userService.createUser(validUserData)).rejects.toThrow(
                "El rol especificado no existe"
            );
        });
    });
});
