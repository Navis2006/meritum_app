import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { projectsApi, evaluationsApi, categoriesApi, Project, Category } from '../services/api';
import GalleryCard from '../components/GalleryCard';
import { cacheVideoInBackground } from '../services/videoCacheService';

const GalleryScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Filtering State
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Re-fetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        let result = projects;

        // Apply Category Filter
        if (activeCategoryId) {
            result = result.filter(p => p.categoryId === activeCategoryId);
        }

        // Apply Search Filter
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(lower));
        }

        setFilteredProjects(result);
    }, [searchQuery, projects, activeCategoryId]);

    const loadData = async () => {
        try {
            const [projectsData, leaderboardData, categoriesData] = await Promise.all([
                projectsApi.getAll(),
                evaluationsApi.getLeaderboard().catch(() => []),
                categoriesApi.getAll().catch(() => []),
            ]);
            setProjects(projectsData);
            setLeaderboard(leaderboardData || []);
            setCategories(categoriesData || []);

            // Pre-cachear TODOS los videos preview (son cortos, ~10 seg)
            projectsData.forEach((p: Project) => {
                if (p.previewVideoUrl) {
                    cacheVideoInBackground(p.previewVideoUrl);
                }
            });
        } catch (error) {
            console.log('Error loading gallery data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getScoreForProject = (projectId: string) => {
        const entry = leaderboard.find((l: any) => l.id === projectId);
        return entry ? entry.score : undefined;
    };

    const getEvalCountForProject = (projectId: string) => {
        const entry = leaderboard.find((l: any) => l.id === projectId);
        return entry ? entry.totalEvaluators : 0;
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat?.name || '';
    };

    const getCategoryIndex = (categoryId: string) => {
        return categories.findIndex(c => c.id === categoryId);
    };

    const handleProjectPress = (project: Project) => {
        navigation.navigate('ProjectPublicDetail', { projectId: project.id, projectTitle: project.title });
    };

    const renderHeader = () => (
        <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Catálogo de Proyectos</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.iconButton}>
                    <View style={{ position: 'relative' }}>
                        <Icon name="tune" size={24} color={Colors.white} />
                        {activeCategoryId && (
                            <View style={styles.filterActiveBadge} />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar proyectos..."
                    placeholderTextColor={Colors.gray400}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        </View>
    );
    const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

    // Callback when visible items change (for auto-preview during scroll)
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            // Encontrar el item más centrado que tenga preview
            const withPreview = viewableItems.find(
                (v: any) => v.item.previewVideoUrl
            );
            if (withPreview) {
                setActivePreviewId(withPreview.item.id);
            }
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 70,
    }).current;

    const renderFilterModal = () => (
        <Modal
            visible={filterModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFilterModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrar por Categoría</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.modalCloseButton}>
                            <Icon name="close" size={24} color={Colors.textMain} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll}>
                        {/* Option: Todos */}
                        <TouchableOpacity
                            style={[
                                styles.filterOption,
                                activeCategoryId === null && styles.filterOptionActive
                            ]}
                            onPress={() => {
                                setActiveCategoryId(null);
                                setFilterModalVisible(false);
                            }}
                        >
                            <Icon name="apps" size={24} color={activeCategoryId === null ? Colors.primary : Colors.gray500} />
                            <Text style={[
                                styles.filterOptionText,
                                activeCategoryId === null && styles.filterOptionTextActive
                            ]}>
                                Todos los Proyectos
                            </Text>
                            {activeCategoryId === null && <Icon name="check" size={24} color={Colors.primary} />}
                        </TouchableOpacity>

                        {/* Category Options */}
                        {categories.map((cat, index) => {
                            const isActive = activeCategoryId === cat.id;
                            // Re-use some logic for color assignment if you have it, else default:
                            const iconColor = [Colors.primary, '#6366f1', '#10b981', '#f59e0b', '#8b5cf6'][index % 5];
                            
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.filterOption,
                                        isActive && styles.filterOptionActive
                                    ]}
                                    onPress={() => {
                                        setActiveCategoryId(cat.id);
                                        setFilterModalVisible(false);
                                    }}
                                >
                                    <View style={[styles.filterIconContainer, { backgroundColor: iconColor + '20' }]}>
                                        <Icon name={isActive ? "check-box" : "label-outline"} size={22} color={iconColor} />
                                    </View>
                                    <Text style={[
                                        styles.filterOptionText,
                                        isActive && styles.filterOptionTextActive
                                    ]}>
                                        {cat.name}
                                    </Text>
                                    {isActive && <Icon name="check" size={24} color={Colors.primary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderFilterModal()}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredProjects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GalleryCard
                            project={item}
                            globalScore={getScoreForProject(item.id)}
                            totalEvaluators={getEvalCountForProject(item.id)}
                            categoryName={getCategoryName(item.categoryId)}
                            categoryIndex={getCategoryIndex(item.categoryId)}
                            onPress={() => handleProjectPress(item)}
                            isActive={activePreviewId === item.id}
                            onActivate={() => setActivePreviewId(prev =>
                                prev === item.id ? null : item.id
                            )}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf5ef',
    },
    headerContainer: {
        // --- Header Café Oscuro (Original elegido por el usuario) ---
        backgroundColor: Colors.backgroundDark, 
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 3,
        borderBottomColor: Colors.primary,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.primary,
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a2f24', // Fondo café oscuro para buscador
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.primary + '40',
    },
    searchIcon: {
        marginRight: Spacing.sm,
        color: Colors.white,
    },
    input: {
        flex: 1,
        color: Colors.white,
        fontSize: 14,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    filterActiveBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.backgroundDark,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#faf5ef',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        maxHeight: '80%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textMain,
    },
    modalCloseButton: {
        padding: Spacing.xs,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.full,
    },
    modalScroll: {
        padding: Spacing.lg,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    filterOptionActive: {
        borderColor: Colors.primary,
        backgroundColor: '#fff7ed',
    },
    filterIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    filterOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textMain,
        marginLeft: Spacing.sm,
    },
    filterOptionTextActive: {
        color: Colors.primary,
    },
});

export default GalleryScreen;
