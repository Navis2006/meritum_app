import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const EvaluationSuccessScreen = ({ navigation }: any) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 50,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Animated Check Circle */}
                <Animated.View
                    style={[
                        styles.checkCircle,
                        Shadows.primaryGlow,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    <Icon name="check" size={84} color={Colors.white} />
                </Animated.View>

                {/* Text */}
                <Animated.View style={{ opacity: opacityAnim }}>
                    <Text style={styles.title}>¡Listo!</Text>
                    <Text style={styles.subtitle}>Evaluación guardada</Text>
                </Animated.View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                        // Navigate to ProfileTab and then EvaluationHistory
                        navigation.navigate('ProfileTab', {
                            screen: 'EvaluationHistory',
                        });
                    }}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Ver Resumen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                        // Go back to Dashboard root
                        navigation.navigate('DashboardTab', {
                            screen: 'Dashboard',
                        });
                    }}
                >
                    <Text style={styles.secondaryButtonText}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 48,
    },
    checkCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: Colors.textMain,
        textAlign: 'center',
        lineHeight: 48,
        letterSpacing: -0.5,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: 24,
    },
    actions: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.xxl,
        paddingBottom: 48,
    },
    primaryButton: {
        width: '100%',
        height: 48,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    primaryButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    secondaryButton: {
        width: '100%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: Colors.gray500,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EvaluationSuccessScreen;
