export const validators = {
    email: (value: string): string | undefined => {
        if (!value) return "El email es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email inválido";
        return undefined;
    },

    password: (value: string): string | undefined => {
        if (!value) return "La contraseña es requerida";
        if (value.length < 12)
            return "La contraseña debe tener al menos 12 caracteres";
        if (value.length > 128)
            return "La contraseña no puede exceder 128 caracteres";
        if (!/(?=.*[a-z])/.test(value))
            return "Debe contener al menos una minúscula";
        if (!/(?=.*[A-Z])/.test(value))
            return "Debe contener al menos una mayúscula";
        if (!/(?=.*\d)/.test(value)) return "Debe contener al menos un número";
        if (!/(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`])/.test(value))
            return "Debe contener al menos un carácter especial (@$!%*?&#, etc.)";
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
