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

    name: (
        value: string,
        min: number = 2,
        max: number = 100
    ): string | undefined => {
        if (!value) return "El nombre es requerido";
        if (value.trim().length < min)
            return `El nombre debe tener al menos ${min} caracteres`;
        if (value.trim().length > max)
            return `El nombre no puede exceder ${max} caracteres`;
        return undefined;
    },

    select: (value: number, fieldName: string): string | undefined => {
        if (value === 0 || !value) return `Debes seleccionar ${fieldName}`;
        return undefined;
    },
};
