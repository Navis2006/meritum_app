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
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { authApi, sessionStorage } from '../services/api';

const SignUpScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Ingresa tu correo institucional');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'La contraseña es obligatoria');
            return;
        }
        setLoading(true);
        try {
            const user = await authApi.register(email.trim(), name.trim(), password.trim());
            await sessionStorage.saveUser(user);
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'No se pudo crear la cuenta';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.content}>
                {/* Logo */}
                <Image
                    source={require('../../assets/MERITUM_LOGO.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Regístrate con tu correo institucional</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Icon name="person" size={24} color={email ? Colors.primary : Colors.gray400} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
                            placeholderTextColor={Colors.gray300}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Icon name="mail" size={24} color={email ? Colors.primary : Colors.gray400} />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Institucional"
                            placeholderTextColor={Colors.gray300}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Icon name="lock" size={24} color={password ? Colors.primary : Colors.gray400} />
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

                <TouchableOpacity
                    style={[styles.button, Shadows.primaryGlow]}
                    onPress={handleSignUp}
                    disabled={loading}
                    activeOpacity={0.9}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>REGISTRARSE</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>
                        ¿Ya tienes cuenta?{' '}
                        <Text style={styles.loginTextBold}>Ingresar</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xxl,
    },
    logoImage: {
        width: 250,
        height: 250,
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.gray400,
        marginBottom: Spacing.xxl,
    },
    form: { width: '100%', gap: Spacing.lg, marginBottom: Spacing.xxl },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.lg,
        fontSize: 16,
        color: Colors.textMain,
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
    loginLink: { marginTop: Spacing.xxl },
    loginText: { fontSize: 14, color: Colors.gray400 },
    loginTextBold: { color: Colors.primary, fontWeight: '700' },
});

export default SignUpScreen;
