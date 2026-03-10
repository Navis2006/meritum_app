import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// CONFIGURACIÓN DE LA API
// Cambia esta URL según tu entorno:
//   - Emulador Android:  http://10.0.2.2:5227/api
//   - Dispositivo físico: http://<TU_IP_LOCAL>:5227/api
//   - Producción:         https://tu-dominio.com/api
// ============================================================
const API_BASE_URL = 'https://meritum.onrender.com/api';


const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================================
// AUTH
// ============================================================
export interface LoginRequest {
    email: string;
    password?: string;
    name?: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password?: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
}

export const authApi = {
    login: async (email: string, password?: string): Promise<User> => {
        const payload: LoginRequest = { email };
        if (password) payload.password = password;

        const response = await api.post('/auth/login', payload);
        return response.data;
    },
    register: async (email: string, name: string, password?: string): Promise<User> => {
        const payload: RegisterRequest = { email, name };
        if (password) payload.password = password;

        const response = await api.post('/auth/register', payload);
        return response.data;
    },
    getProfile: async (userId: string): Promise<User> => {
        const response = await api.get(`/auth/${userId}`);
        return response.data;
    },
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/auth');
        return response.data;
    },
};

// ============================================================
// CATEGORIES
// ============================================================
export interface Category {
    id: string;
    name: string;
    iconUrl: string;
}

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get('/categories');
        return response.data;
    },
};

// ============================================================
// PROJECTS
// ============================================================
export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    teamMembers: string;
    categoryId: string;
    videoUrls?: string[];
    documentUrls?: string[];
}

export const projectsApi = {
    getAll: async (): Promise<Project[]> => {
        const response = await api.get('/projects');
        return response.data;
    },
    getByCategory: async (categoryId: string): Promise<Project[]> => {
        const response = await api.get(`/projects?categoryId=${categoryId}`);
        return response.data;
    },
    getById: async (id: string): Promise<Project> => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
};

// ============================================================
// EVALUATIONS
// ============================================================
export interface EvaluationPayload {
    funcionalidad: number;
    rendimiento: number;
    arquitectura: number;
    uxui: number;
    mvp: number;
    analisisMercado: number;
    objetivosInteligentes: number;
    innovacion: number;
    projectId: string;
    userId: string;
}

export interface Evaluation {
    id: string;
    funcionalidad: number;
    rendimiento: number;
    arquitectura: number;
    uxui: number;
    mvp: number;
    analisisMercado: number;
    objetivosInteligentes: number;
    innovacion: number;
    finalScore: number;
    projectId: string;
    userId: string;
    createdAt: string;
}

export interface HistoryResponse {
    stats: {
        totalEvaluations: number;
        averageGiven: number;
    };
    history: Evaluation[];
    message?: string;
    count?: number;
}

export const evaluationsApi = {
    submit: async (evaluation: EvaluationPayload): Promise<{ message: string; id: string }> => {
        const response = await api.post('/evaluations', evaluation);
        return response.data;
    },
    getByUser: async (userId: string): Promise<HistoryResponse> => {
        const response = await api.get(`/evaluations/user/${userId}`);
        return response.data;
    },
    getAll: async (): Promise<Evaluation[]> => {
        const response = await api.get('/evaluations');
        return response.data;
    },
    getLeaderboard: async (): Promise<any[]> => {
        const response = await api.get('/evaluations/leaderboard');
        return response.data;
    }
};

// ============================================================
// COMMENTS
// ============================================================
export interface Comment {
    id?: string;
    projectId: string;
    userId: string;
    userName?: string;
    content: string;
    rating?: number;
    createdAt?: string;
}

export const commentsApi = {
    getByProject: async (projectId: string): Promise<Comment[]> => {
        const response = await api.get(`/comments/project/${projectId}`);
        return response.data;
    },
    create: async (comment: Comment): Promise<Comment> => {
        const response = await api.post('/comments', comment);
        return response.data;
    }
};

// ============================================================
// SESSION HELPERS
// ============================================================
const USER_KEY = '@meritum_user';

export const sessionStorage = {
    saveUser: async (user: User) => {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    getUser: async (): Promise<User | null> => {
        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },
    clearUser: async () => {
        await AsyncStorage.removeItem(USER_KEY);
    },
};

export default api;
