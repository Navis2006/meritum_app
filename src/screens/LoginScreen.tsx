import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { authApi, sessionStorage } from '../services/api';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu correo institucional');
            return;
        }

        setLoading(true);
        try {
            const user = await authApi.login(
                email.trim(),
                password.trim() || undefined
            );
            await sessionStorage.saveUser(user);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            Alert.alert(
                'Error de conexión',
                'No se pudo conectar con el servidor. Verifica la URL del API.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Decorative Background Elements */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        {/* Logo */}
                        <Image
                            source={require('../../assets/MERITUM_LOGO.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />

                        <View style={styles.textBlock}>
                            <Text style={styles.appName}></Text>
                            <Text style={styles.tagline}>
                                Plataforma de evaluación universitaria
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <View style={styles.inputIconContainer}>
                                <Icon
                                    name="mail"
                                    size={24}
                                    color={email ? Colors.primary : Colors.gray400}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Institucional"
                                placeholderTextColor={Colors.gray300}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputIconContainer}>
                                <Icon
                                    name="lock"
                                    size={24}
                                    color={password ? Colors.primary : Colors.gray400}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor={Colors.gray300}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Action Button */}
                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={[styles.button, Shadows.primaryGlow]}
                            onPress={handleLogin}
                            activeOpacity={0.9}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.buttonText}>INGRESAR</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.outlineButton]}
                            onPress={() => navigation.navigate('SignUp')}
                            disabled={loading}
                        >
                            <Text style={styles.outlineButtonText}>Crear una cuenta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Links */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Help')}>
                            <Text style={styles.footerLink}>¿Necesitas ayuda?</Text>
                        </TouchableOpacity>
                        <View style={styles.footerDot} />
                        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                            <Text style={styles.footerLink}>Privacidad</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    scrollContent: {
        flexGrow: 1,
    },
    decorCircle1: {
        position: 'absolute',
        top: -96,
        right: -96,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: `${Colors.primary}08`,
    },
    decorCircle2: {
        position: 'absolute',
        top: '50%',
        left: -96,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: `${Colors.primary}08`,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xxl,
        maxWidth: 448,
        width: '100%',
        alignSelf: 'center',
    },
    logoSection: {
        alignItems: 'center',
        gap: Spacing.xl,
        marginBottom: 40,
        width: '100%',
    },
    logoImage: {
        width: 240,
        height: 240,
        marginBottom: Spacing.sm,
    },
    textBlock: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    appName: {
        color: Colors.primary,
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -0.5,
        lineHeight: 40,
    },
    tagline: {
        color: Colors.gray400,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    formSection: {
        width: '100%',
        gap: Spacing.xxl,
        marginBottom: Spacing.xxl,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
    },
    inputIconContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.lg,
        paddingLeft: 40,
        paddingRight: Spacing.lg,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.textMain,
        backgroundColor: 'transparent',
    },
    buttonSection: {
        width: '100%',
        marginTop: Spacing.lg,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
        marginTop: Spacing.md,
    },
    outlineButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
        marginTop: Spacing.xxxl,
    },
    footerLink: {
        color: Colors.gray400,
        fontSize: 12,
    },
    footerDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.gray300,
    },
});

export default LoginScreen;
