import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { projectsApi, evaluationsApi, Project, sessionStorage } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import ProjectListItem from '../components/ProjectListItem';

const EvaluationListScreen = ({ route, navigation }: any) => {
    const { categoryId, categoryName } = route.params;
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadProjects();
        }, [])
    );

    const loadProjects = async () => {
        try {
            const [data, user] = await Promise.all([
                projectsApi.getByCategory(categoryId),
                sessionStorage.getUser(),
            ]);

            let pendingProjects = data;
            if (user?.id) {
                try {
                    const historyResponse = await evaluationsApi.getByUser(user.id);
                    if (historyResponse?.history) {
                        const evaluatedIds = historyResponse.history.map(e => e.projectId);
                        pendingProjects = data.filter(p => !evaluatedIds.includes(p.id));
                    }
                } catch (e) {
                    // Ignore fetching history errors
                }
            }

            setProjects(pendingProjects);
        } catch (error) {
            console.log('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(
        p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.teamMembers.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{categoryName || 'Lista de Evaluación'}</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Icon name="filter-list" size={24} color={Colors.textMain} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, Shadows.card]}>
                    <Icon name="search" size={24} color={Colors.primary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por proyecto o estudiante..."
                        placeholderTextColor={Colors.gray400}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={styles.loader}
                    />
                ) : filteredProjects.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="check-circle-outline" size={48} color={Colors.primary} />
                        <Text style={styles.emptyText}>No hay proyectos que calificar</Text>
                    </View>
                ) : (
                    filteredProjects.map((project, index) => (
                        <ProjectListItem
                            key={project.id}
                            title={project.title}
                            author={project.teamMembers}
                            imageUrl={project.imageUrl}
                            onPress={() =>
                                navigation.navigate('ProjectDetail', {
                                    projectId: project.id,
                                })
                            }
                        />
                    ))
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
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.backgroundLight,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textMain,
        letterSpacing: -0.3,
    },
    filterButton: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    searchContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.sm,
        backgroundColor: Colors.backgroundLight,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.gray100,
        gap: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textMain,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
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
    },
});

export default EvaluationListScreen;
