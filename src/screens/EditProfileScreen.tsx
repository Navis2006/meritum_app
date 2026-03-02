import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { sessionStorage, User } from '../services/api';

const EditProfileScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const u = await sessionStorage.getUser();
        if (u) {
            setUser(u);
            setName(u.name || '');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Mocking Backend Update by saving to local session first
            const updatedUser = { ...user, name: name.trim() };
            await sessionStorage.saveUser(updatedUser);

            Alert.alert('Éxito', 'Perfil actualizado localmente. Los cambios se sincronizarán al iniciar sesión nuevamente.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                        <Text style={styles.saveText}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 36, fontWeight: 'bold', color: Colors.gray400 }}>
                            {name ? name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert('Aviso', 'El cambio de foto se habilitará próximamente.')}>
                        <Text style={styles.changePhotoText}>Cambiar foto</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={[styles.value, styles.input]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Tu nombre completo"
                            placeholderTextColor={Colors.gray400}
                        />
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo (Solo lectura)</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Rol</Text>
                        <Text style={styles.value}>{user?.role || 'Invitado'}</Text>
                    </View>
                </View>

                <Text style={styles.note}>
                    Nota: Actualmente no existe un endpoint en el backend para actualizar el nombre dinámicamente. El cambio se reflejará en tu sesión local.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 48,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textMain },
    saveText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xxl,
        alignItems: 'center',
    },
    avatarSection: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxxl },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changePhotoText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
    infoSection: { width: '100%' },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    label: { fontSize: 13, fontWeight: '500', color: Colors.gray400, flex: 1 },
    value: { fontSize: 15, fontWeight: '600', color: Colors.textMain, flex: 2, textAlign: 'right' },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
        paddingBottom: 4,
    },
    note: {
        marginTop: Spacing.xxxl,
        fontSize: 13,
        color: Colors.gray400,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default EditProfileScreen;
