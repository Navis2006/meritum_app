import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import { evaluationsApi, sessionStorage, Evaluation } from '../services/api';

const EvaluationHistoryScreen = ({ navigation }: any) => {
    const [history, setHistory] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const user = await sessionStorage.getUser();
            if (user?.id) {
                const data = await evaluationsApi.getByUser(user.id);
                setHistory(data.history || []);
            }
        } catch (error) {
            console.log('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Fecha no disponible';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Fecha no disponible';

        const months = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
        ];
        return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.gray800} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Historial</Text>
                <View style={{ width: 40 }} />
            </View>

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
                ) : history.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="history" size={48} color={Colors.gray300} />
                        <Text style={styles.emptyText}>No hay evaluaciones previas</Text>
                        <Text style={styles.emptySubtext}>
                            Las evaluaciones que envíes aparecerán aquí
                        </Text>
                    </View>
                ) : (
                    history.map((evaluation, index) => (
                        <TouchableOpacity
                            key={evaluation.id || index}
                            style={styles.historyItem}
                            activeOpacity={0.7}
                        >
                            <View style={styles.itemLeft}>
                                <Text style={styles.itemTitle}>
                                    Evaluación de {(evaluation as any).projectTitle || `Proyecto ${(index + 1).toString().padStart(2, '0')}`}
                                </Text>
                                <Text style={styles.itemDate}>
                                    {formatDate(evaluation.createdAt)}
                                </Text>
                            </View>
                            <Text style={styles.itemScore}>
                                {evaluation.finalScore.toFixed(1)}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: 48,
        paddingBottom: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
        backgroundColor: `${Colors.white}F2`,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textMain,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        paddingBottom: 48,
    },
    loader: {
        marginTop: Spacing.xxxl,
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
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    itemLeft: {
        gap: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textMain,
        lineHeight: 20,
    },
    itemDate: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray400,
    },
    itemScore: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary,
    },
});

export default EvaluationHistoryScreen;
