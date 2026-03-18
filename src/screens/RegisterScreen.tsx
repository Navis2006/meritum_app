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

const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await authApi.register(
                email.trim(),
                name.trim(),
                password.trim(),
            );

            // Si el registro es exitoso, logueamos al usuario automáticamente
            const user = await authApi.login(
                email.trim(),
                password.trim()
            );
            await sessionStorage.saveUser(user);
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            // Check if backend returned a specific message
            const serverMsg = error?.response?.data?.message;
            if (serverMsg) {
                Alert.alert('Error al registrarse', serverMsg);
            } else {
                Alert.alert(
                    'Error de conexión',
                    'No se pudo conectar con el servidor. Inténtalo más tarde.',
                );
            }
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
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>
                            Únete a Meritum para empezar
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <View style={styles.inputIconContainer}>
                                <Icon
                                    name="person"
                                    size={24}
                                    color={name ? Colors.primary : Colors.gray400}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Completo"
                                placeholderTextColor={Colors.gray300}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

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

                        <View style={styles.inputGroup}>
                            <View style={styles.inputIconContainer}>
                                <Icon
                                    name="lock-outline"
                                    size={24}
                                    color={confirmPassword ? Colors.primary : Colors.gray400}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar Contraseña"
                                placeholderTextColor={Colors.gray300}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Action Button */}
                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={[styles.button, Shadows.primaryGlow]}
                            onPress={handleRegister}
                            activeOpacity={0.9}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.buttonText}>REGISTRARSE</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.outlineButton]}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Text style={styles.outlineButtonText}>
                                YA TENGO UNA CUENTA
                            </Text>
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
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
    },
    decorCircle1: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Colors.primary + '10', // 10% opacity,
        zIndex: 0,
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: Colors.primary + '08', // 8% opacity,
        zIndex: 0,
    },
    content: {
        paddingHorizontal: Spacing.xl,
        zIndex: 1,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: Spacing.xs,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray500,
    },
    formSection: {
        gap: Spacing.md,
        marginBottom: Spacing.xxl,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.gray200,
        paddingHorizontal: Spacing.md,
    },
    inputIconContainer: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.lg,
        fontSize: 16,
        color: Colors.text,
    },
    buttonSection: {
        gap: Spacing.md,
    },
    button: {
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

export default RegisterScreen;
