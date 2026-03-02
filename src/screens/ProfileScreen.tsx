import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { authApi, evaluationsApi, sessionStorage } from '../services/api';

const ProfileScreen = ({ navigation }: any) => {
    const [role, setRole] = useState('');
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await sessionStorage.getUser();
            if (user?.id) {
                setEmail(user.email);
                setName(user.name || '');
                const profile = await authApi.getProfile(user.id);
                setRole(profile.role || 'Invitado');
                if (profile.name) {
                    setName(profile.name);
                }

                try {
                    const historyData = await evaluationsApi.getByUser(user.id);
                    if (historyData.stats) {
                        setTotalEvaluations(historyData.stats.totalEvaluations);
                        setAverageScore(historyData.stats.averageGiven);
                    }
                } catch {
                    // No history yet — leave defaults
                }
            }
        } catch (error) {
            console.log('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sí, cerrar',
                style: 'destructive',
                onPress: async () => {
                    await sessionStorage.clearUser();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back-ios-new" size={22} color={Colors.textMain} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 48, fontWeight: 'bold', color: Colors.gray400 }}>
                            {name ? name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
                        </Text>
                    </View>
                </View>

                {/* Info */}
                <Text style={styles.userNameText}>{name || email.split('@')[0] || 'Usuario'}</Text>

                {/* Role Badge */}
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>
                        {role?.toUpperCase() || 'USUARIO'}
                    </Text>
                </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
                <View style={styles.statsRow}>
                    <View style={[styles.statItem, styles.statBorderRight]}>
                        <Text style={styles.statNumber}>
                            {totalEvaluations}
                        </Text>
                        <Text style={styles.statLabel}>Evaluaciones</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {averageScore.toFixed(1)}
                        </Text>
                        <Text style={styles.statLabel}>Promedio</Text>
                    </View>
                </View>
            </View>

            {/* History Link */}
            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('EvaluationHistory')}
            >
                <Icon name="history" size={22} color={Colors.primary} />
                <Text style={styles.historyText}>Ver Historial de Evaluaciones</Text>
                <Icon name="chevron-right" size={22} color={Colors.gray400} />
            </TouchableOpacity>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.9}
                >
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        paddingTop: Spacing.xl + 24,
    },
    headerButton: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    editButton: {
        padding: Spacing.sm,
    },
    editText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: Spacing.xl,
        gap: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleBadge: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.primary}15`,
    },
    roleText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
    },
    userNameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textMain,
        marginTop: 8,
    },
    statsSection: {
        marginTop: Spacing.xxxl,
        paddingHorizontal: Spacing.xxl,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statBorderRight: {
        borderRightWidth: 1,
        borderRightColor: Colors.gray200,
    },
    statNumber: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.primary,
        lineHeight: 36,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.gray500,
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.xl,
        marginTop: Spacing.xxxl,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.backgroundLight,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
    },
    historyText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textMain,
    },
    logoutSection: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingBottom: 100,
    },
    logoutButton: {
        width: '100%',
        maxWidth: 384,
        height: 56,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.gray200,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textMain,
    },
});

export default ProfileScreen;
