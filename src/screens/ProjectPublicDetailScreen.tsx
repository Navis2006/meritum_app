import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
    Alert,
    Dimensions,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { projectsApi, commentsApi, Project, Comment, sessionStorage } from '../services/api';

const { width } = Dimensions.get('window');

const ProjectPublicDetailScreen = ({ route, navigation }: any) => {
    const { projectId } = route.params;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    // Comments State
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = async () => {
        try {
            const data = await projectsApi.getById(projectId);
            setProject(data);

            // Load comments
            const commentsData = await commentsApi.getByProject(projectId);
            setComments(commentsData);
        } catch (error) {
            console.log('Error loading project:', error);
            Alert.alert('Error', 'Error al cargar proyecto');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = () => {
        setLiked(!liked);
        Alert.alert('Voto', liked ? 'Voto retirado' : '¡Voto registrado!');
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const user = await sessionStorage.getUser();
            if (!user) {
                Alert.alert('Error', 'Debes iniciar sesión para comentar.');
                return;
            }

            const commentData: Comment = {
                projectId,
                userId: user.id,
                userName: user.email.split('@')[0], // Quick display name
                content: newComment,
                rating: 0,
            };

            const created = await commentsApi.create(commentData);
            setComments([created, ...comments]);
            setNewComment('');
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar el comentario');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleOpenVideo = () => {
        if (project?.videoUrl) {
            Linking.openURL(project.videoUrl);
        } else {
            Alert.alert('Aviso', 'No hay video disponible');
        }
    };

    const getFileName = (url: string) => {
        try {
            const parts = url.split('/');
            const fullName = parts[parts.length - 1];
            // Remove the guid prefix if it exists (assuming format guid_filename)
            const nameParts = fullName.split('_');
            if (nameParts.length > 1) {
                return nameParts.slice(1).join('_');
            }
            return fullName;
        } catch {
            return "Documento Adjunto";
        }
    };

    const handleOpenDoc = async (url: string) => {
        // Construct full url if it is relative
        const fullUrl = url.startsWith('http') ? url : `https://meritum.onrender.com${url}`;
        try {
            await WebBrowser.openBrowserAsync(fullUrl);
        } catch (error) {
            Linking.openURL(fullUrl);
        }
    };


    if (loading || !project) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10 }}>Cargando proyecto...</Text>
            </View>
        );
    }

    // Parse team members (comma separated string)
    const teamMembers = project.teamMembers ? project.teamMembers.split(',') : [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
                {/* Header Video/Image Section */}
                <View style={styles.headerImageContainer}>
                    {project.videoUrl ? (
                        <Video
                            style={styles.headerImage}
                            source={{ uri: project.videoUrl }}
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                            isLooping
                        />
                    ) : (
                        <>
                            <Image
                                source={{ uri: project.imageUrl || 'https://via.placeholder.com/800x600' }}
                                style={styles.headerImage}
                                resizeMode="cover"
                            />
                            <View style={styles.overlay} />
                        </>
                    )}

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={24} color={Colors.white} />
                    </TouchableOpacity>

                </View>

                {/* Content Section */}
                <View style={styles.contentContainer}>

                    <Text style={styles.title}>{project.title}</Text>

                    <Text style={styles.description}>
                        {project.description || 'Sin descripción disponible para este proyecto.'}
                    </Text>

                    {/* Team Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Equipo del proyecto</Text>
                        <View style={styles.teamRow}>
                            {teamMembers.map((member, index) => (
                                <View key={index} style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}>
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarInitials}>{member.trim().charAt(0)}</Text>
                                    </View>
                                </View>
                            ))}
                            {teamMembers.length > 3 && (
                                <View style={[styles.avatar, styles.moreAvatar, { marginLeft: -12 }]}>
                                    <Text style={styles.moreAvatarText}>+{teamMembers.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Comentarios ({comments.length})</Text>

                    {/* Comments List */}
                    {comments.map((comment, idx) => (
                        <View key={comment.id || idx} style={styles.commentCard}>
                            <View style={styles.commentHeaderRow}>
                                <View style={styles.commentAvatarSm}>
                                    <Text style={styles.commentAvatarText}>
                                        {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.commentUserName}>{comment.userName || 'Usuario'}</Text>
                                    <Text style={styles.commentDate}>
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Reciente'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.commentText}>{comment.content}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Actions (Fixed) */}
            <View style={[styles.bottomActions, Shadows.medium]}>
                {project.documentUrls && project.documentUrls.length > 0 ? (
                    project.documentUrls.map((docUrl, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={() => handleOpenDoc(docUrl)}
                        >
                            <Icon name="description" size={20} color={Colors.white} />
                            <Text style={styles.primaryButtonText} numberOfLines={1}>{getFileName(docUrl)}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton, { opacity: 0.5 }]}
                        disabled
                    >
                        <Icon name="description" size={20} color={Colors.white} />
                        <Text style={styles.primaryButtonText}>Sin Documentos</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
        backgroundColor: Colors.gray900,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 20,
    },
    playButtonContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 12,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    categoryTag: {
        backgroundColor: 'rgba(244, 140, 37, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: Spacing.sm,
    },
    categoryText: {
        color: Colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    timeText: {
        color: Colors.gray400,
        fontSize: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        color: Colors.gray600, // text-body color
        lineHeight: 24,
        marginBottom: Spacing.xl,
        fontWeight: '300',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.background,
        backgroundColor: Colors.gray200,
        overflow: 'hidden',
    },
    avatarPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray300,
    },
    avatarInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    moreAvatar: {
        backgroundColor: 'rgba(244, 140, 37, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.background,
    },
    moreAvatarText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        padding: Spacing.md,
        backgroundColor: Colors.white, // background-light
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.gray400,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        flexDirection: 'column',
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
    },
    actionButton: {
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: 'transparent',
    },
    likedButton: {
        backgroundColor: Colors.primary,
    },
    outlineButtonText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Comment styles
    commentInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    commentAvatarSm: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentAvatarText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentInput: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray100,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: 10,
        minHeight: 44,
    },
    commentSubmitBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentCard: {
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    commentHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    commentUserName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
    },
    commentDate: {
        fontSize: 10,
        color: Colors.gray400,
    },
    commentText: {
        fontSize: 14,
        color: Colors.gray600,
        lineHeight: 20,
    },
});

export default ProjectPublicDetailScreen;
