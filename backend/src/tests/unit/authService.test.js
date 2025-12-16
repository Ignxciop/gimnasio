import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
    },
};

const mockBcrypt = {
    compare: jest.fn(),
};

const mockJwt = {
    generateToken: jest.fn(),
};

jest.unstable_mockModule("../../config/prisma.js", () => ({
    prisma: mockPrisma,
}));

jest.unstable_mockModule("bcryptjs", () => ({
    default: mockBcrypt,
}));

jest.unstable_mockModule("../../config/jwt.js", () => mockJwt);

const { default: authService } = await import("../../services/authService.js");

describe("AuthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        const validCredentials = {
            email: "juan@example.com",
            password: "Password123",
        };

        const mockUser = {
            id: "123",
            name: "Juan",
            lastname: "Pérez",
            username: "juanp",
            email: "juan@example.com",
            password: "$2b$10$hashedPassword",
            is_active: true,
            roleId: 1,
            role: { id: 1, role: "usuario" },
        };

        it("debería iniciar sesión exitosamente con credenciales válidas", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockBcrypt.compare.mockResolvedValue(true);
            mockJwt.generateToken.mockReturnValue("mock.jwt.token");

            const result = await authService.login(validCredentials);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: validCredentials.email },
                select: expect.any(Object),
            });
            expect(mockBcrypt.compare).toHaveBeenCalledWith(
                validCredentials.password,
                mockUser.password
            );
            expect(mockJwt.generateToken).toHaveBeenCalledWith({
                userId: mockUser.id,
                email: mockUser.email,
                roleId: mockUser.roleId,
            });
            expect(result).toHaveProperty("token", "mock.jwt.token");
            expect(result).toHaveProperty("user");
            expect(result.user).not.toHaveProperty("password");
        });

        it("debería lanzar error si el usuario no existe", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(authService.login(validCredentials)).rejects.toThrow(
                "Credenciales inválidas"
            );
        });

        it("debería lanzar error si el usuario está inactivo", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                ...mockUser,
                is_active: false,
            });

            await expect(authService.login(validCredentials)).rejects.toThrow(
                "Usuario inactivo"
            );
        });

        it("debería lanzar error si la contraseña es incorrecta", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(validCredentials)).rejects.toThrow(
                "Credenciales inválidas"
            );
        });
    });
});
