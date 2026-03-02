import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Linking,
    Image,
    Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { projectsApi, Project } from '../services/api';

const ProjectDetailScreen = ({ route, navigation }: any) => {
    const { projectId } = route.params;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = async () => {
        try {
            const data = await projectsApi.getById(projectId);
            setProject(data);
        } catch (error) {
            console.log('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!project) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Icon name="error-outline" size={48} color={Colors.gray400} />
                <Text style={styles.errorText}>Proyecto no encontrado</Text>
            </View>
        );
    }

    const teamList = project.teamMembers
        ? project.teamMembers.split(',').map(m => m.trim())
        : [];

    return (
        <View style={styles.container}>
            {/* Top Nav */}
            <View style={styles.topNav}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back-ios-new" size={22} color={Colors.textMain} />
                </TouchableOpacity>
                <View style={styles.navRight}>
                    <TouchableOpacity style={styles.navButton}>
                        <Icon name="ios-share" size={22} color={Colors.textMain} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton}>
                        <Icon name="more-horiz" size={22} color={Colors.textMain} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image */}
                <View style={[styles.heroContainer, { paddingHorizontal: 0, paddingVertical: 0 }]}>
                    {project.imageUrl ? (
                        <Image source={{ uri: project.imageUrl }} style={[styles.heroImage, { borderRadius: 0 }]} />
                    ) : (
                        <View style={[styles.heroImage, { borderRadius: 0 }]}>
                            <Icon name="image" size={48} color={Colors.gray300} />
                            <Text style={styles.heroPlaceholderText}>Imagen del Proyecto</Text>
                        </View>
                    )}
                    <View style={styles.heroOverlay} />
                </View>

                {/* Title & Metadata */}
                <View style={styles.titleSection}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>PROYECTO FINAL</Text>
                        </View>
                    </View>
                </View>

                {/* Team Section */}
                <View style={styles.teamSection}>
                    <View style={styles.teamLeft}>
                        <View style={styles.avatarStack}>
                            {teamList.slice(0, 3).map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.teamAvatar,
                                        { marginLeft: i > 0 ? -12 : 0 },
                                    ]}
                                >
                                    <Icon name="person" size={20} color={Colors.gray400} />
                                </View>
                            ))}
                        </View>
                        <View style={styles.teamInfo}>
                            <Text style={styles.teamLabel}>Equipo</Text>
                            <Text style={styles.teamNames}>
                                {teamList.join(', ') || 'Sin asignar'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.mailButton}>
                        <Icon name="mail" size={18} color={Colors.gray600} />
                    </TouchableOpacity>
                </View>

                {/* Video Full Width Section */}
                {project.videoUrl && (
                    <View style={styles.videoSection}>
                        <Video
                            style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' }}
                            source={{ uri: project.videoUrl }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping={false}
                        />
                    </View>
                )}

                {/* Description */}
                <View style={styles.descriptionSection}>
                    <Text style={styles.descTitle}>Resumen del Proyecto</Text>
                    <Text style={styles.descText}>
                        {project.description || 'Sin descripción disponible.'}
                    </Text>

                    {/* Links Grid */}
                    <View style={styles.detailGrid}>
                        {/* El video ya se renderiza arriba a ancho completo */}
                        {project.documentUrls && project.documentUrls.length > 0 ? (
                            project.documentUrls.map((url, index) => (
                                <TouchableOpacity
                                    key={`doc-${index}`}
                                    style={[styles.detailCard, Shadows.card, { marginTop: index > 0 ? Spacing.sm : 0 }]}
                                    onPress={() => Linking.openURL(url)}
                                >
                                    <View style={styles.detailHeader}>
                                        <Icon name="description" size={20} color={Colors.primary} />
                                        <Text style={styles.detailLabel}>DOCUMENTO {index + 1}</Text>
                                    </View>
                                    <Text style={styles.detailValue}>Ver Documento</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={[styles.detailCard, Shadows.card]}>
                                <View style={styles.detailHeader}>
                                    <Icon name="description" size={20} color={Colors.gray400} />
                                    <Text style={[styles.detailLabel, { color: Colors.gray400 }]}>DOCUMENTO</Text>
                                </View>
                                <Text style={[styles.detailValue, { color: Colors.gray400 }]}>No disponible</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.fabButton, Shadows.primaryGlow]}
                    onPress={() =>
                        navigation.navigate('EvaluationRubric', {
                            projectId: project.id,
                            projectTitle: project.title,
                        })
                    }
                    activeOpacity={0.9}
                >
                    <Text style={styles.fabText}>COMENZAR EVALUACIÓN</Text>
                    <Icon name="arrow-forward" size={22} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.gray500,
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingTop: 48,
        backgroundColor: Colors.backgroundLight,
        zIndex: 10,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navRight: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    heroContainer: {
        width: '100%',
    },
    heroImage: {
        width: '100%',
        aspectRatio: 4 / 3,
        backgroundColor: Colors.gray100,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroPlaceholderText: {
        fontSize: 14,
        color: Colors.gray400,
        marginTop: Spacing.sm,
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: Spacing.lg,
        right: Spacing.lg,
        height: 40,
        borderBottomLeftRadius: BorderRadius.lg,
        borderBottomRightRadius: BorderRadius.lg,
    },
    titleSection: {
        paddingHorizontal: 20,
        paddingTop: Spacing.sm,
    },
    projectTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.textMain,
        lineHeight: 34,
        letterSpacing: -0.3,
        marginBottom: Spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    badge: {
        backgroundColor: `${Colors.primary}15`,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    teamSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.lg,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: `${Colors.black}08`,
    },
    teamLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarStack: {
        flexDirection: 'row',
        marginRight: Spacing.lg,
    },
    teamAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.backgroundLight,
    },
    teamInfo: {
        gap: 2,
    },
    teamLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray500,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    teamNames: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textMain,
    },
    mailButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${Colors.black}08`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionSection: {
        paddingHorizontal: 20,
        paddingVertical: Spacing.xl,
    },
    descTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: Spacing.md,
    },
    descText: {
        fontSize: 16,
        fontWeight: '300',
        color: Colors.gray600,
        lineHeight: 26,
    },
    detailGrid: {
        marginTop: Spacing.xxl,
    },
    videoSection: {
        width: '100%',
        marginTop: Spacing.lg,
    },
    detailCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: `${Colors.black}08`,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textMain,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    fabButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    fabText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default ProjectDetailScreen;
