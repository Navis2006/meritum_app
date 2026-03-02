import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { evaluationsApi, commentsApi, sessionStorage } from '../services/api';
import EvaluationSlider from '../components/EvaluationSlider';
import FeedbackChip from '../components/FeedbackChip';

const FEEDBACK_OPTIONS = [
    'Diseño Excelente',
    'Lógica Clara',
    'Creativo',
    'Necesita Optimización',
    'Buena Documentación',
    'Con Errores',
    'Sostenible',
    'Innovador',
    'Muy Completo',
    'Falta Desarrollo'
];

const EvaluationRubricScreen = ({ route, navigation }: any) => {
    const { projectId, projectTitle } = route.params;

    const [funcionalidad, setFuncionalidad] = useState(8.5);
    const [rendimiento, setRendimiento] = useState(8.0);
    const [arquitectura, setArquitectura] = useState(7.5);
    const [uxui, setUxui] = useState(8.0);
    const [mvp, setMvp] = useState(8.5);
    const [analisisMercado, setAnalisisMercado] = useState(7.0);
    const [objetivosInteligentes, setObjetivosInteligentes] = useState(8.0);
    const [innovacion, setInnovacion] = useState(9.0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const totalScore =
        (funcionalidad + rendimiento + arquitectura + uxui + mvp + analisisMercado + objetivosInteligentes + innovacion) / 8;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const user = await sessionStorage.getUser();
            if (!user) {
                Alert.alert('Error', 'No se encontró sesión de usuario');
                return;
            }

            await evaluationsApi.submit({
                funcionalidad,
                rendimiento,
                arquitectura,
                uxui,
                mvp,
                analisisMercado,
                objetivosInteligentes,
                innovacion,
                projectId,
                userId: user.id,
            });

            if (comment.trim()) {
                await commentsApi.create({
                    projectId,
                    userId: user.id,
                    content: comment.trim(),
                    rating: totalScore,
                });
            }

            navigation.navigate('EvaluationSuccess');
        } catch (error: any) {
            const msg =
                error?.response?.data ?? 'Error al enviar la evaluación';
            Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Evaluación</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.profileAvatar}>
                        <Icon name="person" size={36} color={Colors.gray400} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{projectTitle}</Text>
                        <Text style={styles.profileId}>ID Proyecto: {projectId?.slice(-4)}</Text>
                    </View>
                    <TouchableOpacity style={styles.infoButton}>
                        <Icon name="info" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Sliders */}
                <EvaluationSlider
                    label="Funcionalidad"
                    weight="12.5%"
                    value={funcionalidad}
                    onValueChange={setFuncionalidad}
                />
                <EvaluationSlider
                    label="Rendimiento"
                    weight="12.5%"
                    value={rendimiento}
                    onValueChange={setRendimiento}
                />
                <EvaluationSlider
                    label="Arquitectura"
                    weight="12.5%"
                    value={arquitectura}
                    onValueChange={setArquitectura}
                />
                <EvaluationSlider
                    label="UX / UI"
                    weight="12.5%"
                    value={uxui}
                    onValueChange={setUxui}
                />
                <EvaluationSlider
                    label="Producto Mínimo Viable (MVP)"
                    weight="12.5%"
                    value={mvp}
                    onValueChange={setMvp}
                />
                <EvaluationSlider
                    label="Análisis de Mercado"
                    weight="12.5%"
                    value={analisisMercado}
                    onValueChange={setAnalisisMercado}
                />
                <EvaluationSlider
                    label="Objetivos Inteligentes"
                    weight="12.5%"
                    value={objetivosInteligentes}
                    onValueChange={setObjetivosInteligentes}
                />
                <EvaluationSlider
                    label="Innovación"
                    weight="12.5%"
                    value={innovacion}
                    onValueChange={setInnovacion}
                />

                {/* Optional General Feedback */}
                <View style={[styles.feedbackSection, Shadows.card]}>
                    <View style={styles.feedbackHeader}>
                        <Icon name="comment" size={22} color={Colors.primary} />
                        <Text style={styles.feedbackTitle}>Comentarios y Retroalimentación</Text>
                    </View>

                    {/* Pre-defined Chips */}
                    <View style={styles.chipsContainer}>
                        {FEEDBACK_OPTIONS.map((option, idx) => {
                            const isSelected = comment.includes(option);
                            return (
                                <FeedbackChip
                                    key={idx}
                                    label={option}
                                    isActive={isSelected}
                                    onPress={() => {
                                        if (isSelected) {
                                            setComment(comment.replace(option + ' ', '').replace(option, '').trim());
                                        } else {
                                            setComment(comment ? `${comment} ${option}` : option);
                                        }
                                    }}
                                />
                            );
                        })}
                    </View>

                    {/* Comment Input */}
                    <View style={styles.commentContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Agregar un comentario específico..."
                            placeholderTextColor={Colors.gray400}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, Shadows.soft]}>
                <View style={styles.footerScore}>
                    <Text style={styles.footerLabel}>Puntuación Total</Text>
                    <Text style={styles.footerValue}>
                        {totalScore.toFixed(1)}{' '}
                        <Text style={styles.footerMax}>/ 10</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.submitButton, Shadows.primaryGlow]}
                    onPress={handleSubmit}
                    activeOpacity={0.9}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <>
                            <Text style={styles.submitText}>ENVIAR EVALUACIÓN</Text>
                            <Icon name="arrow-forward" size={22} color={Colors.white} />
                        </>
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 48,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.backgroundLight,
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.gray200}80`,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
        letterSpacing: -0.2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 180,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.lg,
        marginTop: Spacing.sm,
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textMain,
        letterSpacing: -0.2,
    },
    profileId: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray500,
        marginTop: 4,
    },
    infoButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray200,
        marginVertical: Spacing.sm,
    },
    feedbackSection: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    commentContainer: {
        marginTop: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        backgroundColor: Colors.gray50,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        fontSize: 14,
        color: Colors.textMain,
    },
    sendButton: {
        position: 'absolute',
        right: Spacing.md,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    footerScore: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
        paddingHorizontal: 4,
    },
    footerLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray500,
    },
    footerValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textMain,
    },
    footerMax: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.gray400,
    },
    submitButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    submitText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EvaluationRubricScreen;
