import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Shadows, BorderRadius } from '../theme';
import { Project } from '../services/api';

interface GalleryCardProps {
    project: Project;
    globalScore?: number;
    onPress: () => void;
}

const GalleryCard = ({ project, globalScore, onPress }: GalleryCardProps) => {
    return (
        <TouchableOpacity
            style={[styles.card, Shadows.small]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: project.imageUrl || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                    resizeMode="cover"
                />
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
        </TouchableOpacity >
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
        width: 64,
        height: 64,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.gray200,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    image: {
        width: '100%',
        height: '100%',
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
        borderRadius: 999, // Full pill
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
