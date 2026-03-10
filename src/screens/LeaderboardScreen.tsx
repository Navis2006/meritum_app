import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { evaluationsApi } from '../services/api';

const FILTER_OPTIONS = ['Todos', '9.0 - 10.0', '8.0 - 8.9', '7.0 - 7.9', '< 7.0'];

const LeaderboardScreen = ({ navigation }: any) => {
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await evaluationsApi.getLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.log('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    // Derived states
    // The backend provides sorted data. We separate top 3 for the podium.
    const getFilteredData = () => {
        if (!leaderboard) return [];
        if (activeFilter === 'Todos') return leaderboard;

        return leaderboard.filter((item) => {
            const s = item.score ?? 0;
            if (activeFilter === '9.0 - 10.0') return s >= 9.0;
            if (activeFilter === '8.0 - 8.9') return s >= 8.0 && s < 9.0;
            if (activeFilter === '7.0 - 7.9') return s >= 7.0 && s < 8.0;
            return s < 7.0;
        });
    };

    const displayData = activeFilter ? getFilteredData() : leaderboard;
    const podiumData = displayData.slice(0, 3);
    const rankedData = displayData.slice(3);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Clasificación de Proyectos</Text>
                <TouchableOpacity style={styles.profileButton}>
                    <Icon name="account-circle" size={32} color={Colors.textMain} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xxxl }} />
                ) : leaderboard.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="leaderboard" size={48} color={Colors.gray300} />
                        <Text style={styles.emptyText}>Sin Clasificación Aún</Text>
                        <Text style={styles.emptySubtext}>
                            Aún no hay proyectos calificados.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Podium - solo si hay datos en el filtro actual */}
                        {displayData.length > 0 && (
                            <View style={styles.podiumContainer}>
                                {/* 2nd Place */}
                                <View style={styles.podiumSide}>
                                    {podiumData[1] && (
                                        <View style={[styles.podiumCard, Shadows.card]}>
                                            <View style={styles.podiumAvatarSm}>
                                                <Icon name="person" size={24} color={Colors.gray400} />
                                            </View>
                                            <View style={styles.rankBadgeSm}>
                                                <Text style={styles.rankTextSm}>#2</Text>
                                            </View>
                                            <Text style={styles.podiumName} numberOfLines={1}>
                                                {podiumData[1].title || 'Proyecto'}
                                            </Text>
                                            <Text style={styles.podiumProject} numberOfLines={1}>
                                                {podiumData[1].teamMembers?.split(',')[0] || 'Equipo'}
                                            </Text>
                                            <Text style={styles.podiumScoreSm}>{(podiumData[1].score ?? 0).toFixed(1)}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* 1st Place (Elevated) */}
                                <View style={[styles.podiumCenter]}>
                                    <Icon
                                        name="workspace-premium"
                                        size={28}
                                        color={Colors.primary}
                                        style={styles.crownIcon}
                                    />
                                    {podiumData[0] && (
                                        <View style={[styles.podiumCard, styles.podiumCardCenter, Shadows.soft]}>
                                            <View style={styles.podiumAvatarLg}>
                                                <Icon name="person" size={32} color={Colors.gray400} />
                                            </View>
                                            <View style={styles.rankBadgeLg}>
                                                <Text style={styles.rankTextLg}>#1</Text>
                                            </View>
                                            <Text style={styles.podiumNameLg} numberOfLines={1}>
                                                {podiumData[0].title || 'Proyecto'}
                                            </Text>
                                            <Text style={styles.podiumProject} numberOfLines={1}>
                                                {podiumData[0].teamMembers?.split(',')[0] || 'Equipo'}
                                            </Text>
                                            <Text style={styles.podiumScoreLg}>{(podiumData[0].score ?? 0).toFixed(1)}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* 3rd Place */}
                                <View style={styles.podiumSide}>
                                    {podiumData[2] && (
                                        <View style={[styles.podiumCard, Shadows.card]}>
                                            <View style={styles.podiumAvatarSm}>
                                                <Icon name="person" size={24} color={Colors.gray400} />
                                            </View>
                                            <View style={styles.rankBadgeSm}>
                                                <Text style={styles.rankTextSm}>#3</Text>
                                            </View>
                                            <Text style={styles.podiumName} numberOfLines={1}>
                                                {podiumData[2].title || 'Proyecto'}
                                            </Text>
                                            <Text style={styles.podiumProject} numberOfLines={1}>
                                                {podiumData[2].teamMembers?.split(',')[0] || 'Equipo'}
                                            </Text>
                                            <Text style={styles.podiumScoreSm}>{(podiumData[2].score ?? 0).toFixed(1)}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Filter Chips - SIEMPRE visibles */}
                        <View style={styles.filterContainer}>
                            <TouchableOpacity style={styles.filterIcon}>
                                <Icon name="filter-list" size={20} color={Colors.gray600} />
                            </TouchableOpacity>
                            <View style={styles.filterDivider} />
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterChips}
                            >
                                {FILTER_OPTIONS.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.chip,
                                            activeFilter === option
                                                ? styles.chipActive
                                                : styles.chipInactive,
                                        ]}
                                        onPress={() => setActiveFilter(option)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipTextBase,
                                                activeFilter === option
                                                    ? styles.chipText
                                                    : styles.chipTextInactive,
                                            ]}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Empty filter message or ranked list */}
                        {displayData.length === 0 ? (
                            <View style={styles.emptyFilterState}>
                                <Icon name="search-off" size={36} color={Colors.gray300} />
                                <Text style={styles.emptyFilterText}>
                                    No hay proyectos en el rango {activeFilter}
                                </Text>
                            </View>
                        ) : (
                            /* Ranked List (4th place onward) */
                            <View style={styles.rankedList}>
                                {rankedData.map((item, index) => (
                                    <View key={item.id} style={[styles.rankedItem, Shadows.card]}>
                                        <Text style={styles.rankedNumber}>{index + 4}</Text>
                                        <View style={styles.rankedAvatar}>
                                            <Icon name="person" size={24} color={Colors.gray400} />
                                        </View>
                                        <View style={styles.rankedInfo}>
                                            <Text style={styles.rankedName}>{item.title || 'Proyecto'}</Text>
                                            <Text style={styles.rankedProject}>{item.teamMembers || 'Equipo'}</Text>
                                        </View>
                                        <View style={styles.rankedScoreContainer}>
                                            <Text style={styles.rankedScore}>{(item.score ?? 0).toFixed(1)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 48,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.gray200}50`,
        backgroundColor: Colors.backgroundLight,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
        letterSpacing: -0.2,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 48,
        paddingBottom: Spacing.xl,
        gap: Spacing.md,
    },
    podiumSide: {
        flex: 1,
        alignItems: 'center',
    },
    podiumCenter: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 24,
    },
    crownIcon: {
        marginBottom: Spacing.sm,
    },
    podiumCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingTop: Spacing.xxl,
        alignItems: 'center',
        position: 'relative',
    },
    podiumCardCenter: {
        paddingTop: 40,
        borderWidth: 1,
        borderColor: `${Colors.primary}10`,
    },
    podiumAvatarSm: {
        position: 'absolute',
        top: -24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gray200,
        borderWidth: 2,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumAvatarLg: {
        position: 'absolute',
        top: -32,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.gray200,
        borderWidth: 4,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankBadgeSm: {
        position: 'absolute',
        bottom: -10,
        backgroundColor: Colors.gray700,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    rankBadgeLg: {
        position: 'absolute',
        bottom: -14,
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    rankTextSm: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    rankTextLg: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    podiumName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textMain,
        marginTop: Spacing.lg,
        textAlign: 'center',
        width: 80,
    },
    podiumNameLg: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        marginTop: Spacing.xl,
        textAlign: 'center',
    },
    podiumProject: {
        fontSize: 12,
        color: Colors.gray500,
        marginBottom: Spacing.sm,
        textAlign: 'center',
        width: 80,
    },
    podiumScoreSm: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
    },
    podiumScoreLg: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        gap: Spacing.md,
        backgroundColor: Colors.backgroundLight,
    },
    filterIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterDivider: {
        width: 1,
        height: 24,
        backgroundColor: Colors.gray300,
    },
    filterChips: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    chip: {
        height: 40,
        paddingHorizontal: 20,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: Colors.primary,
        ...Shadows.primaryGlow,
    },
    chipInactive: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    chipTextBase: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    chipText: {
        color: Colors.white,
    },
    chipTextInactive: {
        color: Colors.gray600,
    },
    rankedList: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    rankedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        gap: Spacing.lg,
    },
    rankedNumber: {
        width: 24,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
        color: Colors.gray400,
    },
    rankedAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankedInfo: {
        flex: 1,
    },
    rankedName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textMain,
    },
    rankedProject: {
        fontSize: 12,
        color: Colors.gray500,
    },
    rankedScoreContainer: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.lg,
        backgroundColor: `${Colors.primary}08`,
    },
    rankedScore: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 64,
        gap: Spacing.md,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.gray500,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.gray400,
        textAlign: 'center',
    },
    emptyFilterState: {
        alignItems: 'center',
        paddingTop: Spacing.xxxl,
        paddingBottom: Spacing.xxxl,
        gap: Spacing.sm,
    },
    emptyFilterText: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.gray400,
        textAlign: 'center',
    },
});

export default LeaderboardScreen;
