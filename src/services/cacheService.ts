import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const DEFAULT_MAX_AGE_MINUTES = 30;

/**
 * Guarda datos en AsyncStorage con timestamp
 */
export const saveToCache = async <T>(key: string, data: T): Promise<void> => {
    try {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
        console.log('Cache save error:', error);
    }
};

/**
 * Lee datos cacheados. Devuelve null si no hay datos o si expiraron.
 */
export const getFromCache = async <T>(
    key: string,
    maxAgeMinutes: number = DEFAULT_MAX_AGE_MINUTES
): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;

        const entry: CacheEntry<T> = JSON.parse(raw);
        const ageMs = Date.now() - entry.timestamp;
        const maxAgeMs = maxAgeMinutes * 60 * 1000;

        if (ageMs > maxAgeMs) return null; // Expirado
        return entry.data;
    } catch (error) {
        console.log('Cache read error:', error);
        return null;
    }
};

/**
 * Cache-first-then-network: devuelve datos cacheados inmediatamente,
 * luego intenta actualizar desde la API.
 * Si la API falla, devuelve los datos cacheados (incluso si expiraron).
 */
export const cachedFetch = async <T>(
    key: string,
    apiFn: () => Promise<T>,
    maxAgeMinutes: number = DEFAULT_MAX_AGE_MINUTES
): Promise<T> => {
    // 1. Intentar desde caché
    const cached = await getFromCache<T>(key, maxAgeMinutes);

    try {
        // 2. Intentar actualizar desde API
        const freshData = await apiFn();
        // 3. Guardar en caché
        await saveToCache(key, freshData);
        return freshData;
    } catch (error) {
        // 4. Si la API falla, usar caché (incluso expirado)
        if (cached) return cached;

        // Si tampoco hay caché, intentar leer sin límite de tiempo
        const staleData = await getStaleCache<T>(key);
        if (staleData) return staleData;

        throw error; // No hay nada disponible
    }
};

/**
 * Lee caché sin importar si expiró (último recurso para offline)
 */
const getStaleCache = async <T>(key: string): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        return entry.data;
    } catch {
        return null;
    }
};

// Cache keys
export const CACHE_KEYS = {
    PROJECTS: '@cache_projects',
    CATEGORIES: '@cache_categories',
    LEADERBOARD: '@cache_leaderboard',
    historyKey: (userId: string) => `@cache_history_${userId}`,
    projectDetail: (projectId: string) => `@cache_project_${projectId}`,
};
