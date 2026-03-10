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
import { Colors, Spacing } from '../theme';

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
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={handlePress}
        >
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

            {/* Footer Action */}
            <View style={styles.footer}>
                <Animated.View style={[styles.touchIconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <Icon name="fingerprint" size={32} color={Colors.primary} />
                </Animated.View>
                <Text style={styles.footerText}>TOCA LA PANTALLA PARA EXPLORAR</Text>
            </View>
        </TouchableOpacity>
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
        alignItems: 'center',
        paddingBottom: Spacing.xxl * 2,
        gap: Spacing.md,
    },
    touchIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(244, 140, 37, 0.1)', // Primary opacity 0.1
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    footerText: {
        fontSize: 12,
        color: Colors.gray400,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});

export default WelcomeScreen;
