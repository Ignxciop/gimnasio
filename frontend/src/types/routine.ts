export interface Folder {
    id: number;
    name: string;
    description?: string | null;
    order: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    routines?: Routine[];
}

export interface Routine {
    id: number;
    name: string;
    description?: string | null;
    order: number;
    folderId?: number | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
    folder?: Folder | null;
}

export interface FolderFormData {
    name: string;
    description?: string;
}

export interface RoutineFormData {
    name: string;
    description?: string;
    folderId?: number | null;
}
