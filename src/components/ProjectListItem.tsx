import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Shadows } from '../theme';

interface ProjectListItemProps {
    title: string;
    author: string;
    imageUrl?: string;
    onPress: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
    title,
    author,
    imageUrl,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, Shadows.card]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={styles.avatar}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Icon name="image" size={24} color={Colors.gray400} />
                )}
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {author}
                </Text>
            </View>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.lg,
        backgroundColor: Colors.cardLight,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.gray100,
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        lineHeight: 20,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray500,
        lineHeight: 20,
    },
});

export default ProjectListItem;
