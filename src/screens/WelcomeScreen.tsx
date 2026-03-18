import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Animated,
    Dimensions,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in logo
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Pulse animation for button
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handlePress = () => {
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            {/* Top Spacer */}
            <View style={{ flex: 1 }} />

            {/* Main Content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Logo Container */}
                <View style={styles.logoWrapper}>
                    <View style={styles.logoBackground}>
                        <Icon name="school" size={64} color="#FFF" />
                        {/* Decorative corners */}
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                    </View>
                </View>

                {/* Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Meritum</Text>
                    <Text style={styles.subtitle}>
                        Plataforma de evaluación universitaria
                    </Text>
                </View>
            </Animated.View>

            {/* Bottom Spacer */}
            <View style={{ flex: 1 }} />

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, Shadows.primaryGlow]}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.outlineButtonText}>CREAR CUENTA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
        zIndex: 10,
    },
    logoWrapper: {
        marginBottom: Spacing.lg,
    },
    logoBackground: {
        width: 128,
        height: 128,
        backgroundColor: Colors.primary,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '3deg' }],
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cornerTopRight: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
        borderTopRightRadius: 8,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: -4,
        left: -4,
        width: 12,
        height: 12,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
        borderBottomLeftRadius: 8,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: 18,
        color: Colors.gray500,
        textAlign: 'center',
        fontWeight: '300',
    },
    footer: {
        width: '100%',
        paddingBottom: Spacing.xxl * 2,
        gap: Spacing.md,
    },
    button: {
        width: '100%',
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    outlineButtonText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default WelcomeScreen;
