import { Paths, File, Directory } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIDEO_CACHE_DIR_NAME = 'video_cache';
const MAX_CACHE_SIZE_MB = 500;
const CACHE_INDEX_KEY = '@video_cache_index';

interface CacheIndexEntry {
    remoteUrl: string;
    localUri: string;
    sizeBytes: number;
    lastAccessed: number;
}

/**
 * Obtiene el directorio de caché de videos, creándolo si no existe
 */
const getCacheDir = (): Directory => {
    const dir = new Directory(Paths.cache, VIDEO_CACHE_DIR_NAME);
    if (!dir.exists) {
        dir.create();
    }
    return dir;
};

/**
 * Genera un nombre de archivo seguro a partir de una URL
 */
const urlToFilename = (url: string): string => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1] || 'video.mp4';
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

/**
 * Lee el índice de caché de videos desde AsyncStorage
 */
const getCacheIndex = async (): Promise<Record<string, CacheIndexEntry>> => {
    try {
        const raw = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        if (!raw) return {};
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

/**
 * Guarda el índice de caché
 */
const saveCacheIndex = async (index: Record<string, CacheIndexEntry>) => {
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
};

/**
 * Limpia videos antiguos si se excede el límite de caché (FIFO)
 */
const enforceLimit = async (index: Record<string, CacheIndexEntry>) => {
    const maxBytes = MAX_CACHE_SIZE_MB * 1024 * 1024;
    let totalSize = Object.values(index).reduce((sum, e) => sum + e.sizeBytes, 0);

    if (totalSize <= maxBytes) return;

    const entries = Object.entries(index).sort(
        ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    for (const [key, entry] of entries) {
        if (totalSize <= maxBytes) break;
        try {
            const file = new File(entry.localUri);
            if (file.exists) file.delete();
        } catch { /* ignore */ }
        totalSize -= entry.sizeBytes;
        delete index[key];
    }

    await saveCacheIndex(index);
};

/**
 * Obtiene la URI local de un video cacheado, o null si no está
 */
export const getCachedVideoUri = async (remoteUrl: string): Promise<string | null> => {
    const index = await getCacheIndex();
    const entry = index[remoteUrl];

    if (!entry) return null;

    const file = new File(entry.localUri);
    if (!file.exists) {
        delete index[remoteUrl];
        await saveCacheIndex(index);
        return null;
    }

    // Actualizar último acceso
    entry.lastAccessed = Date.now();
    await saveCacheIndex(index);

    return entry.localUri;
};

/**
 * Descarga un video y lo guarda en caché
 */
export const cacheVideoInBackground = async (remoteUrl: string): Promise<void> => {
    try {
        const index = await getCacheIndex();
        if (index[remoteUrl]) return; // Ya cacheado

        const dir = getCacheDir();
        const filename = urlToFilename(remoteUrl);
        const targetFile = new File(dir, filename);

        // Descargar con fetch y guardar
        const response = await fetch(remoteUrl);
        if (!response.ok) return;

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Escribir al archivo usando el stream
        const writable = targetFile.writableStream();
        const writer = writable.getWriter();
        await writer.write(uint8Array);
        await writer.close();

        index[remoteUrl] = {
            remoteUrl,
            localUri: targetFile.uri,
            sizeBytes: uint8Array.byteLength,
            lastAccessed: Date.now(),
        };

        await saveCacheIndex(index);
        await enforceLimit(index);
    } catch (error) {
        console.log('Video cache error (non-blocking):', error);
    }
};
