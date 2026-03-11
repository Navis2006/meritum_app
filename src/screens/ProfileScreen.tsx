import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { authApi, evaluationsApi, sessionStorage } from '../services/api';
import { Shadows } from '../theme';

const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
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
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Icon name="edit" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                    <Text style={styles.emailText}>{email}</Text>

                    {/* Role Badge */}
                    <View style={styles.roleBadge}>
                        <Icon name="verified-user" size={16} color={Colors.primary} />
                        <Text style={styles.roleText}>
                            {role?.toUpperCase() || 'USUARIO'}
                        </Text>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <View style={[styles.statsRow, Shadows.card]}>
                        <View style={[styles.statItem, styles.statBorderRight]}>
                            <Icon name="assignment-turned-in" size={28} color={Colors.primary} />
                            <Text style={styles.statNumber}>
                                {totalEvaluations}
                            </Text>
                            <Text style={styles.statLabel}>Evaluaciones</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="star" size={28} color="#f59e0b" />
                            <Text style={styles.statNumber}>
                                {averageScore.toFixed(1)}
                            </Text>
                            <Text style={styles.statLabel}>Prom. Otorgado</Text>
                        </View>
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.actionsContainer}>
                    {/* History Link */}
                    <TouchableOpacity
                        style={[styles.actionButton, Shadows.soft]}
                        onPress={() => navigation.navigate('EvaluationHistory')}
                    >
                        <View style={styles.actionIconContainer}>
                            <Icon name="history" size={24} color={Colors.white} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Historial de Evaluaciones</Text>
                            <Text style={styles.actionSubtitle}>Mira tus calificaciones pasadas</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={Colors.gray400} />
                    </TouchableOpacity>
                </View>

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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5ef',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.backgroundDark,
        borderBottomWidth: 3,
        borderBottomColor: Colors.primary,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.primary,
        letterSpacing: -0.3,
    },
    editButton: {
        padding: Spacing.sm,
        backgroundColor: Colors.primary + '40',
        borderRadius: BorderRadius.full,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.sm,
        padding: 4,
        borderRadius: 72,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userNameText: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textMain,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.gray500,
        marginTop: 4,
        marginBottom: Spacing.md,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.primary}20`,
        gap: 6,
    },
    roleText: {
        color: Colors.primaryDark,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
    },
    statsSection: {
        marginTop: Spacing.xxxl,
        paddingHorizontal: Spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    statBorderRight: {
        borderRightWidth: 1,
        borderRightColor: Colors.gray100,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textMain,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.gray400,
        textTransform: 'uppercase',
    },
    actionsContainer: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xxxl,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.md,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 13,
        color: Colors.gray500,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Spacing.xxxl,
    },
    logoutSection: {
        marginTop: Spacing.xxxl,
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
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
