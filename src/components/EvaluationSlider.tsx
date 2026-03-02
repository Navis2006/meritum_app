import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Spacing } from '../theme';

interface EvaluationSliderProps {
    label: string;
    weight: string;
    value: number;
    onValueChange: (value: number) => void;
}

const EvaluationSlider: React.FC<EvaluationSliderProps> = ({
    label,
    weight,
    value,
    onValueChange,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.weight}>Weight: {weight}</Text>
            </View>
            <View style={styles.sliderRow}>
                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={10}
                        step={0.5}
                        value={value}
                        onValueChange={onValueChange}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor={Colors.gray200}
                        thumbTintColor={Colors.primary}
                    />
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{value.toFixed(1)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
    },
    weight: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xl,
    },
    sliderContainer: {
        flex: 1,
        height: 48,
        justifyContent: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    scoreContainer: {
        minWidth: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.primary,
        lineHeight: 36,
    },
});

export default EvaluationSlider;
