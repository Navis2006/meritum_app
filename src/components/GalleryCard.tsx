import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Colors, Spacing, Shadows, BorderRadius } from '../theme';
import { Project } from '../services/api';
import { getCachedVideoUri } from '../services/videoCacheService';

interface GalleryCardProps {
    project: Project;
    globalScore?: number;
    onPress: () => void;
    isActive?: boolean;
    onActivate?: () => void;
}

const GalleryCard = ({ project, globalScore, onPress, isActive, onActivate }: GalleryCardProps) => {
    const videoRef = useRef<Video>(null);
    const hasPreview = !!project.previewVideoUrl;
    const [previewUri, setPreviewUri] = useState<string>(project.previewVideoUrl || '');

    useEffect(() => {
        if (project.previewVideoUrl) {
            getCachedVideoUri(project.previewVideoUrl).then(cachedUri => {
                if (cachedUri) setPreviewUri(cachedUri);
            });
        }
    }, [project.previewVideoUrl]);

    return (
        <TouchableOpacity
            style={[styles.card, Shadows.small]}
            onPress={onPress}
            onLongPress={() => {
                if (hasPreview && onActivate) onActivate();
            }}
            delayLongPress={250}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                {isActive && hasPreview ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: previewUri }}
                        style={styles.previewVideo}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={true}
                        isLooping={true}
                        isMuted={true}
                    />
                ) : (
                    <Image
                        source={{ uri: project.imageUrl || 'https://via.placeholder.com/150' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                {hasPreview && !isActive && (
                    <View style={styles.playBadge}>
                        <Text style={styles.playIcon}>▶</Text>
                    </View>
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {project.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {project.teamMembers || 'Desarrollador General'}
                </Text>
            </View>
            <View style={styles.scoreContainer}>
                <View style={[styles.badge, Shadows.small]}>
                    <Text style={styles.scoreText}>
                        {globalScore ? globalScore.toFixed(1) : 'S/C'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>VER</Text>
                </TouchableOpacity>
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
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.gray100,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.gray200,
        overflow: 'hidden',
        marginRight: Spacing.md,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    previewVideo: {
        width: '100%',
        height: '100%',
    },
    playBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playIcon: {
        color: '#fff',
        fontSize: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 2,
        lineHeight: 20,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.sm,
    },
    badge: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: Spacing.sm,
    },
    scoreText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    button: {
        backgroundColor: `${Colors.primary}15`,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default GalleryCard;
