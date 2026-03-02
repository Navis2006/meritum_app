import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { projectsApi, evaluationsApi, Project } from '../services/api';
import GalleryCard from '../components/GalleryCard';

const GalleryScreen = ({ navigation }: any) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            setFilteredProjects(
                projects.filter(p => p.title.toLowerCase().includes(lower))
            );
        } else {
            setFilteredProjects(projects);
        }
    }, [searchQuery, projects]);

    const loadData = async () => {
        try {
            const [projectsData, leaderboardData] = await Promise.all([
                projectsApi.getAll(),
                evaluationsApi.getLeaderboard().catch(() => []) // Silently ignore if failing
            ]);
            setProjects(projectsData);
            setLeaderboard(leaderboardData || []);
        } catch (error) {
            console.log('Error loading gallery data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreForProject = (projectId: string) => {
        const entry = leaderboard.find(l => l.id === projectId);
        return entry ? entry.score : undefined;
    };

    const handleProjectPress = (project: Project) => {
        navigation.navigate('ProjectPublicDetail', { projectId: project.id, projectTitle: project.title });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Galería de Proyectos</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="tune" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={Colors.gray400} style={styles.searchIcon} />
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

    return (
        <View style={styles.container}>
            {renderHeader()}

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
                            onPress={() => handleProjectPress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
    },
    iconButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray100,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 44,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 14,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Spacing.md,
        paddingBottom: 100,
    },
});

export default GalleryScreen;
