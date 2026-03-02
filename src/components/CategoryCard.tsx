import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../theme';

interface CategoryCardProps {
    name: string;
    projectCount: number;
    iconName: string;
    iconColor?: string;
    iconBgColor?: string;
    onPress: () => void;
    hasVisualContent?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    name,
    projectCount,
    iconName,
    iconColor = Colors.primary,
    iconBgColor,
    onPress,
    hasVisualContent = false,
}) => {
    const bgColor = iconBgColor || `${iconColor}15`;

    return (
        <TouchableOpacity
            style={[styles.container, Shadows.card]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                        <Icon name={iconName} size={28} color={iconColor} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>
                            {projectCount} Proyectos Disponibles
                        </Text>
                    </View>
                </View>
                <View style={styles.chevronContainer}>
                    <Icon name="chevron-right" size={24} color={Colors.textMuted} />
                </View>
            </View>

            {hasVisualContent && (
                <View style={styles.visualContent}>
                    <View style={styles.browserWindow}>
                        <View style={styles.browserDots}>
                            <View style={[styles.dot, { backgroundColor: Colors.red400 }]} />
                            <View style={[styles.dot, { backgroundColor: Colors.yellow400 }]} />
                            <View style={[styles.dot, { backgroundColor: Colors.green400 }]} />
                        </View>
                        <View style={styles.browserBar} />
                        <View style={styles.browserBody}>
                            <View style={styles.browserCol1} />
                            <View style={styles.browserCol2} />
                        </View>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.cardLight,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.lg,
        flex: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textMain,
        lineHeight: 24,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginTop: 2,
    },
    chevronContainer: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    visualContent: {
        marginTop: Spacing.md,
        width: '100%',
        height: 128,
        borderRadius: BorderRadius.lg,
        backgroundColor: '#fff7ed',
        overflow: 'hidden',
        position: 'relative',
    },
    browserWindow: {
        position: 'absolute',
        top: 24,
        left: 24,
        right: 24,
        bottom: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 12,
        opacity: 0.8,
    },
    browserDots: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    browserBar: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.gray100,
        borderRadius: BorderRadius.full,
        marginBottom: 8,
    },
    browserBody: {
        flexDirection: 'row',
        gap: 8,
    },
    browserCol1: {
        flex: 1,
        height: 48,
        backgroundColor: Colors.gray100,
        borderRadius: 6,
    },
    browserCol2: {
        flex: 2,
        height: 48,
        backgroundColor: Colors.gray50,
        borderRadius: 6,
    },
});

export default CategoryCard;
