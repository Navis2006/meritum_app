import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../theme';

interface FeedbackChipProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

const FeedbackChip: React.FC<FeedbackChipProps> = ({
    label,
    isActive,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text
                style={[
                    styles.label,
                    isActive ? styles.labelActive : styles.labelInactive,
                ]}
            >
                {label}
            </Text>
            {isActive && (
                <Icon name="check" size={16} color={Colors.white} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        gap: 4,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        ...{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
    },
    chipInactive: {
        backgroundColor: Colors.gray100,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    labelActive: {
        color: Colors.white,
    },
    labelInactive: {
        color: Colors.gray600,
    },
});

export default FeedbackChip;
