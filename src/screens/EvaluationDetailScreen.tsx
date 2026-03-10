import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

const CRITERIA_LABELS: Record<string, string> = {
    funcionalidad: 'Funcionalidad',
    rendimiento: 'Rendimiento',
    arquitectura: 'Arquitectura',
    uxui: 'UX / UI',
    mvp: 'Producto Mínimo Viable (MVP)',
    analisisMercado: 'Análisis de Mercado',
    objetivosInteligentes: 'Objetivos Inteligentes',
    innovacion: 'Innovación',
};

const CRITERIA_KEYS = Object.keys(CRITERIA_LABELS);

const EvaluationDetailScreen = ({ route, navigation }: any) => {
    const { evaluation } = route.params;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Fecha no disponible';
        const d = new Date(dateStr);
        if (isNaN(d.getTime()) || d.getFullYear() <= 1) return 'Fecha no disponible';
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const day = d.getDate().toString().padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 9.0) return '#22c55e';
        if (score >= 7.0) return Colors.primary;
        if (score >= 5.0) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle de Evaluación</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Project Info Card */}
                <View style={[styles.projectCard, Shadows.card]}>
                    <View style={styles.projectIcon}>
                        <Icon name="assignment" size={28} color={Colors.primary} />
                    </View>
                    <View style={styles.projectInfo}>
                        <Text style={styles.projectTitle}>
                            {evaluation.projectTitle || 'Proyecto'}
                        </Text>
                        <Text style={styles.projectDate}>
                            {formatDate(evaluation.createdAt)}
                        </Text>
                    </View>
                    <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(evaluation.finalScore) + '18' }]}>
                        <Text style={[styles.scoreBadgeText, { color: getScoreColor(evaluation.finalScore) }]}>
                            {evaluation.finalScore.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Criteria List */}
                <View style={[styles.criteriaCard, Shadows.card]}>
                    <Text style={styles.sectionTitle}>Calificaciones por Criterio</Text>
                    {CRITERIA_KEYS.map((key, idx) => {
                        const score = evaluation[key] ?? 0;
                        const percentage = (score / 10) * 100;
                        return (
                            <View key={key} style={[styles.criteriaRow, idx < CRITERIA_KEYS.length - 1 && styles.criteriaRowBorder]}>
                                <View style={styles.criteriaLeft}>
                                    <Text style={styles.criteriaLabel}>{CRITERIA_LABELS[key]}</Text>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                {
                                                    width: `${percentage}%`,
                                                    backgroundColor: getScoreColor(score),
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                                <Text style={[styles.criteriaScore, { color: getScoreColor(score) }]}>
                                    {score.toFixed(1)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Final Score Card */}
                <View style={[styles.finalCard, Shadows.card]}>
                    <Text style={styles.finalLabel}>Puntuación Final</Text>
                    <Text style={[styles.finalScore, { color: getScoreColor(evaluation.finalScore) }]}>
                        {evaluation.finalScore.toFixed(1)}
                        <Text style={styles.finalMax}> / 10</Text>
                    </Text>
                </View>
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
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 48,
    },
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    projectIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textMain,
    },
    projectDate: {
        fontSize: 13,
        color: Colors.gray500,
        marginTop: 2,
    },
    scoreBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: BorderRadius.lg,
    },
    scoreBadgeText: {
        fontSize: 20,
        fontWeight: '800',
    },
    criteriaCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: Spacing.lg,
    },
    criteriaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    criteriaRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    criteriaLeft: {
        flex: 1,
        marginRight: Spacing.md,
    },
    criteriaLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textMain,
        marginBottom: 6,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: Colors.gray100,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    criteriaScore: {
        fontSize: 18,
        fontWeight: '700',
        minWidth: 40,
        textAlign: 'right',
    },
    finalCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    finalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray500,
        marginBottom: 4,
    },
    finalScore: {
        fontSize: 36,
        fontWeight: '800',
    },
    finalMax: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.gray400,
    },
});

export default EvaluationDetailScreen;
