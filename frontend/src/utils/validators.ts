export const validators = {
    email: (value: string): string | undefined => {
        if (!value) return "El email es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email inválido";
        return undefined;
    },

    password: (value: string): string | undefined => {
        if (!value) return "La contraseña es requerida";
        if (value.length < 4)
            return "La contraseña debe tener al menos 4 caracteres";
        return undefined;
    },
};
