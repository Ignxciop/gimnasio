export const LOADING_MESSAGES = {
    GENERIC: "Cargando...",
    USERS: "Cargando usuarios...",
    PROFILE: "Cargando perfil...",
    EXERCISES: "Cargando ejercicios...",
    ROUTINES: "Cargando rutinas...",
} as const;

export const ERROR_MESSAGES = {
    GENERIC: "Error al cargar datos",
    CONNECTION: "Error de conexión. Intenta nuevamente.",
    SESSION_EXPIRED: "Sesión expirada, inicia sesión nuevamente",

    AUTH: {
        LOGIN: "Credenciales inválidas",
        REGISTER: "No se pudo completar el registro",
    },

    PROFILE: {
        FETCH: "Error al cargar perfil",
        PRIVATE: "Este perfil es privado",
        UPDATE: "Error al actualizar privacidad del perfil",
        UPDATE_PRIVACY: "Error al actualizar privacidad",
    },

    ROUTINES: {
        FETCH: "Error al obtener rutinas",
        GET: "Error al obtener rutina",
        CREATE: "Error al crear rutina",
        UPDATE: "Error al actualizar rutina",
        DELETE: "Error al eliminar rutina",
        MOVE: "Error al mover rutina",
        START: "Error al iniciar entrenamiento",
        ADD_EXERCISE: "Error al agregar ejercicio",
        UPDATE_EXERCISE: "Error al actualizar ejercicio",
        DELETE_EXERCISE: "Error al eliminar ejercicio",
        UPDATE_ORDER: "Error al actualizar el orden",
    },

    EXERCISES: {
        FETCH: "Error al cargar ejercicios",
        ADD: "Error al agregar ejercicio",
        UPDATE: "Error al actualizar ejercicio",
        DELETE: "Error al eliminar ejercicio",
        REORDER: "Error al actualizar el orden",
        SAVE: "Error al guardar el ejercicio",
    },

    STATISTICS: {
        FETCH: "Error al cargar estadísticas",
        MONTHLY_SETS: "Error al obtener sets mensuales",
        MONTHS: "Error al obtener meses con entrenamientos",
        MONTH_DATA: "Error al cargar datos del mes",
    },

    DASHBOARD: {
        CALENDAR: "Error al cargar calendario",
        WORKOUTS: "Error al cargar entrenamientos",
        RECENT: "Error al obtener entrenamientos recientes",
        DAY: "Error al obtener entrenamientos del día",
        WEEKLY_STREAK: "Error al cargar racha semanal",
        MONTHLY_STATS: "Error al cargar estadísticas mensuales",
        COMPLETED_DATES: "Error al obtener fechas completadas",
    },

    ADMIN: {
        ROLE_UPDATE: "Error al actualizar el rol del usuario",
        STATUS_UPDATE: "Error al actualizar el estado del usuario",
    },

    ACTIVE_ROUTINE: {
        FETCH: "Error al cargar rutina activa",
        CREATE: "Error al crear rutina activa",
        UPDATE: "Error al actualizar",
        UPDATE_SET: "Error al actualizar serie",
        UPDATE_ORDER: "Error al actualizar orden",
        REORDER: "Error al reordenar series",
        COMPLETE: "Error al completar rutina",
        FINISH: "Error al finalizar entrenamiento",
        CANCEL: "Error al cancelar rutina",
        ADD_SET: "Error al agregar serie",
        DELETE_SET: "Error al eliminar serie",
    },

    FOLDERS: {
        FETCH: "Error al obtener carpetas",
        GET: "Error al obtener carpeta",
        CREATE: "Error al crear carpeta",
        UPDATE: "Error al actualizar carpeta",
        DELETE: "Error al eliminar carpeta",
        SAVE: "Error al guardar carpeta",
    },

    FEEDBACK: {
        SEND: "Error al enviar feedback",
        FETCH: "Error al obtener feedbacks",
    },
} as const;

export const SUCCESS_MESSAGES = {
    ROLE_UPDATED: "Rol de usuario actualizado correctamente",
    USER_ACTIVATED: "Usuario activado correctamente",
    USER_DEACTIVATED: "Usuario desactivado correctamente",

    ROUTINES: {
        EXERCISE_ADDED: "Ejercicio agregado exitosamente",
        EXERCISE_UPDATED: "Ejercicio actualizado exitosamente",
        EXERCISE_DELETED: "Ejercicio eliminado exitosamente",
        ORDER_UPDATED: "Orden actualizado exitosamente",
        WORKOUT_STARTED: "Entrenamiento iniciado",
        CREATED: "Rutina creada exitosamente",
        UPDATED: "Rutina actualizada exitosamente",
        DELETED: "Rutina eliminada exitosamente",
        MOVED: "Rutina movida exitosamente",
    },

    FOLDERS: {
        CREATED: "Carpeta creada exitosamente",
        UPDATED: "Carpeta actualizada exitosamente",
        DELETED: "Carpeta eliminada exitosamente",
    },

    EXERCISES: {
        CREATED: "Ejercicio creado correctamente",
        UPDATED: "Ejercicio actualizado correctamente",
        DELETED: "Ejercicio eliminado correctamente",
    },

    EQUIPMENT: {
        SAVED: "Equipamiento guardado correctamente",
    },

    FEEDBACK: {
        SUGGESTION_SENT: "Sugerencia enviada correctamente",
        REPORT_SENT: "Reporte enviado correctamente",
    },
} as const;

export const UI_TEXTS = {
    COMING_SOON: "Próximamente",
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    ACTIVATE: "Activar",
    DEACTIVATE: "Desactivar",
    SEARCH_PLACEHOLDER: "Buscar por nombre o usuario...",
    ALL_ROLES: "Todos los roles",
    ALL_STATUSES: "Todos los estados",
    MY_PROFILE: "Mi Perfil",
    YOUR_PROFILE: "Tu perfil",
    CANCEL: "Cancelar",
    CONFIRM: "Confirmar",
    CONFIRM_ACTION: "Confirmar acción",
    YES_CANCEL: "Sí, cancelar",
    CONFIRM_PASSWORD: "Confirmar Contraseña",
    CANCEL_ROUTINE: "Cancelar rutina",
    CANCEL_ROUTINE_MESSAGE:
        "¿Seguro que deseas cancelar esta rutina? Se perderá todo el progreso.",
    DELETE_EXERCISE_CONFIRM: "¿Estás seguro de eliminar este ejercicio?",
    DELETE_EQUIPMENT_CONFIRM: "¿Estás seguro de eliminar este equipamiento?",
    DELETE_MUSCLE_GROUP_CONFIRM:
        "¿Estás seguro de eliminar este grupo muscular?",
    DELETE_ROUTINE_CONFIRM: "¿Estás seguro de eliminar esta rutina?",
    DELETE_FOLDER_CONFIRM:
        "¿Estás seguro de eliminar esta carpeta? Las rutinas dentro se moverán a 'Sin carpeta'.",
} as const;
