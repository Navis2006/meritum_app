import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Colors, Spacing, Shadows, BorderRadius } from '../theme';
import { Project } from '../services/api';
import { getCachedVideoUri } from '../services/videoCacheService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.52; // ~16:9ish aspect ratio

// Colores neon para bordes por categoría
const NEON_COLORS = [
    '#f48c25', // Primary orange
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#3b82f6', // Blue
];

// Extraer fecha de un MongoDB ObjectId
const getDateFromObjectId = (objectId: string): Date => {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
};

const timeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return `${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
    if (diffDays > 0) return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}min`;
    return 'Ahora';
};

interface GalleryCardProps {
    project: Project;
    globalScore?: number;
    totalEvaluators?: number;
    categoryName?: string;
    categoryIndex?: number;
    onPress: () => void;
    isActive?: boolean;
    onActivate?: () => void;
}

const GalleryCard = ({
    project,
    globalScore,
    totalEvaluators,
    categoryName,
    categoryIndex = 0,
    onPress,
    isActive,
    onActivate,
}: GalleryCardProps) => {
    const videoRef = useRef<Video>(null);
    const hasPreview = !!project.previewVideoUrl;
    const [previewUri, setPreviewUri] = useState<string>(project.previewVideoUrl || '');

    const neonColor = NEON_COLORS[categoryIndex % NEON_COLORS.length];
    const createdDate = getDateFromObjectId(project.id);
    const scorePercent = globalScore ? (globalScore / 10) * 100 : 0;

    useEffect(() => {
        if (project.previewVideoUrl) {
            getCachedVideoUri(project.previewVideoUrl).then(cachedUri => {
                if (cachedUri) setPreviewUri(cachedUri);
            });
        }
    }, [project.previewVideoUrl]);

    return (
        <TouchableOpacity
            style={[
                styles.card,
                Shadows.medium,
                {
                    borderColor: neonColor + '60',
                    shadowColor: neonColor,
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 6,
                },
            ]}
            onPress={onPress}
            onLongPress={() => {
                if (hasPreview && onActivate) onActivate();
            }}
            delayLongPress={250}
            activeOpacity={0.92}
        >
            {/* TOP: Image / Video Preview */}
            <View style={styles.imageContainer}>
                {isActive && hasPreview ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: previewUri }}
                        style={styles.media}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={true}
                        isLooping={true}
                        isMuted={true}
                    />
                ) : (
                    <Image
                        source={{ uri: project.imageUrl || 'https://via.placeholder.com/400x200' }}
                        style={styles.media}
                        resizeMode="cover"
                    />
                )}

                {/* Category badge (top-left) */}
                {categoryName ? (
                    <View style={[styles.categoryOverlay, { backgroundColor: neonColor + 'DD' }]}>
                        <Text style={styles.categoryOverlayText}>{categoryName}</Text>
                    </View>
                ) : null}

                {/* Gradient overlay at bottom for seamless transition */}
                <View style={styles.imageGradient} />
            </View>

            {/* BOTTOM: Info */}
            <View style={styles.infoContainer}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={1}>
                    {project.title}
                </Text>

                {/* Team members */}
                <Text style={styles.teamMembers} numberOfLines={1}>
                    {project.teamMembers || 'Desarrollador General'}
                </Text>

                {/* Description */}
                {project.description ? (
                    <Text style={styles.description} numberOfLines={2}>
                        {project.description}
                    </Text>
                ) : null}

                {/* Meta row: date + evals */}
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>Hace {timeAgo(createdDate)}</Text>
                    {totalEvaluators !== undefined && totalEvaluators > 0 ? (
                        <Text style={styles.metaText}>  •  {totalEvaluators} evaluación{totalEvaluators > 1 ? 'es' : ''}</Text>
                    ) : null}
                </View>

                {/* Score bar */}
                <View style={styles.scoreBarContainer}>
                    <View style={styles.scoreBarBg}>
                        <View
                            style={[
                                styles.scoreBarFill,
                                {
                                    width: `${scorePercent}%`,
                                    backgroundColor: globalScore
                                        ? globalScore >= 8 ? '#10b981' : globalScore >= 6 ? '#f59e0b' : '#ef4444'
                                        : Colors.gray300,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.scoreLabel, !globalScore && { color: Colors.gray400 }]}>
                        {globalScore ? `${globalScore.toFixed(1)}/10` : 'Sin calificar'}
                    </Text>
                </View>

                {/* PLACEHOLDER: Tecnologías (futuro) */}
                {/* 
                <View style={styles.techRow}>
                    <View style={styles.techChip}><Text>PHP</Text></View>
                </View>
                */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.lg,
        borderWidth: 1.5,
    },
    imageContainer: {
        width: '100%',
        height: IMAGE_HEIGHT,
        position: 'relative',
        backgroundColor: Colors.gray200,
    },
    media: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: 'transparent',
    },
    scoreBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    scoreBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    categoryOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    categoryOverlayText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    infoContainer: {
        padding: Spacing.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    teamMembers: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    description: {
        fontSize: 11,
        color: Colors.gray500,
        lineHeight: 15,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaText: {
        fontSize: 10,
        color: Colors.gray400,
    },
    scoreBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: Colors.gray100,
        borderRadius: 3,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    scoreLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.text,
        minWidth: 60,
        textAlign: 'right',
    },
    // PLACEHOLDER: Estilos para tecnologías (futuro)
    // techRow: { flexDirection: 'row', gap: 4, marginTop: 6 },
    // techChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});

export default GalleryCard;
