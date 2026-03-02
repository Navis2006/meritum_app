import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../theme';
import {
    categoriesApi,
    projectsApi,
    evaluationsApi,
    Category,
    Project,
    sessionStorage,
} from '../services/api';
import CategoryCard from '../components/CategoryCard';

const ICON_MAP: Record<string, { icon: string; color: string }> = {
    code: { icon: 'code', color: Colors.primary },
    smartphone: { icon: 'smartphone', color: Colors.blue500 },
    brush: { icon: 'brush', color: Colors.purple500 },
    science: { icon: 'science', color: '#10b981' },
    engineering: { icon: 'engineering', color: '#6366f1' },
};

const DashboardScreen = ({ navigation }: any) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('Evaluador');

    const loadData = async () => {
        try {
            const [cats, allProjects, user] = await Promise.all([
                categoriesApi.getAll(),
                projectsApi.getAll(),
                sessionStorage.getUser(),
            ]);
            setCategories(cats);

            let evaluatedIds: string[] = [];
            if (user?.id) {
                try {
                    const historyResponse = await evaluationsApi.getByUser(user.id);
                    if (historyResponse?.history) {
                        evaluatedIds = historyResponse.history.map(e => e.projectId);
                    }
                } catch (e) {
                    // Ignore errors (new users might get 404 or empty)
                }
            }

            // Count only pending projects per category
            const counts: Record<string, number> = {};
            allProjects.forEach((p: Project) => {
                if (!evaluatedIds.includes(p.id)) {
                    counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
                } else if (!counts[p.categoryId]) {
                    // Initialize with 0 if it exists but all are evaluated
                    counts[p.categoryId] = 0;
                }
            });
            setProjectCounts(counts);

            if (user) {
                if (user.name) {
                    setUserName(user.name);
                } else if (user.email) {
                    const emailName = user.email.split('@')[0];
                    setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
                }
            }
        } catch (error) {
            console.log('Error cargando datos:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getIconConfig = (index: number) => {
        const icons = Object.values(ICON_MAP);
        return icons[index % icons.length];
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hola, {userName}</Text>
                    <Text style={styles.subtitle}>Bienvenido a Meritum</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('ProfileTab')}
                >
                    <Icon name="account-circle" size={36} color={Colors.textMain} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                    />
                }
            >
                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categorías Pendientes</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>Ver todo</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={styles.loader}
                    />
                ) : categories.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="category" size={48} color={Colors.gray300} />
                        <Text style={styles.emptyText}>
                            No hay categorías disponibles aún.
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Usa Swagger para crear categorías desde el backend.
                        </Text>
                    </View>
                ) : (
                    categories.map((cat, index) => {
                        const iconConfig = getIconConfig(index);
                        const count = projectCounts[cat.id] || 0;
                        return (
                            <CategoryCard
                                key={cat.id}
                                name={cat.name}
                                projectCount={count}
                                iconName={iconConfig.icon}
                                iconColor={iconConfig.color}
                                hasVisualContent={index === 0}
                                onPress={() =>
                                    navigation.navigate('EvaluationList', {
                                        categoryId: cat.id,
                                        categoryName: cat.name,
                                    })
                                }
                            />
                        );
                    })
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
        paddingHorizontal: Spacing.xl,
        paddingTop: 48,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.backgroundLight,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textMain,
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginTop: 2,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    loader: {
        marginTop: Spacing.xxxl,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxxl,
        gap: Spacing.md,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.gray500,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.gray400,
        textAlign: 'center',
    },
});

export default DashboardScreen;
