import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cachedFetch, CACHE_KEYS } from './cacheService';

// ============================================================
// CONFIGURACIÓN DE LA API
// ============================================================
const API_BASE_URL = 'https://meritum.koyeb.app/api';

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
        return cachedFetch(CACHE_KEYS.CATEGORIES, async () => {
            const response = await api.get('/categories');
            return response.data;
        }, 60); // Cachear 1 hora
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
    previewVideoUrl?: string;
    teamMembers: string;
    categoryId: string;
    videoUrls?: string[];
    documentUrls?: string[];
    technologies?: string[];
}

export const projectsApi = {
    getAll: async (categoryId?: string): Promise<Project[]> => {
        const key = categoryId ? `${CACHE_KEYS.PROJECTS}_${categoryId}` : CACHE_KEYS.PROJECTS;
        return cachedFetch(key, async () => {
            const url = categoryId ? `/projects?categoryId=${categoryId}` : '/projects';
            const response = await api.get(url);
            return response.data;
        }, 15); // Cachear 15 minutos
    },
    getByCategory: async (categoryId: string): Promise<Project[]> => {
        return cachedFetch(`${CACHE_KEYS.PROJECTS}_${categoryId}`, async () => {
            const response = await api.get(`/projects?categoryId=${categoryId}`);
            return response.data;
        }, 15);
    },
    getById: async (id: string): Promise<Project> => {
        return cachedFetch(CACHE_KEYS.projectDetail(id), async () => {
            const response = await api.get(`/projects/${id}`);
            return response.data;
        }, 10); // Cachear 10 minutos
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
        return cachedFetch(CACHE_KEYS.historyKey(userId), async () => {
            const response = await api.get(`/evaluations/user/${userId}`);
            return response.data;
        }, 5); // Cachear 5 minutos
    },
    getAll: async (): Promise<Evaluation[]> => {
        const response = await api.get('/evaluations');
        return response.data;
    },
    getLeaderboard: async (): Promise<any[]> => {
        return cachedFetch(CACHE_KEYS.LEADERBOARD, async () => {
            const response = await api.get('/evaluations/leaderboard');
            return response.data;
        }, 10); // Cachear 10 minutos
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
        return cachedFetch(`@cache_comments_${projectId}`, async () => {
            const response = await api.get(`/comments/project/${projectId}`);
            return response.data;
        }, 5);
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
