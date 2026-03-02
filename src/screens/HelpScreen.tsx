import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';

const HelpScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayuda</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Icon name="help-outline" size={56} color={Colors.primary} />
                </View>
                <Text style={styles.title}>¿Necesitas ayuda?</Text>
                <Text style={styles.body}>
                    Si tienes problemas para acceder o usar la plataforma, contacta al
                    administrador del sistema o envía un correo a:
                </Text>
                <Text style={styles.email}>soporte@meritum.edu.mx</Text>

                <View style={styles.faqSection}>
                    {['¿Cómo evalúo un proyecto?', '¿Puedo editar mi evaluación?', '¿Cómo veo mis resultados?'].map(
                        (q, i) => (
                            <TouchableOpacity key={i} style={styles.faqItem}>
                                <Text style={styles.faqText}>{q}</Text>
                                <Icon name="chevron-right" size={20} color={Colors.gray400} />
                            </TouchableOpacity>
                        ),
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 48,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textMain },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxxl,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: Spacing.md,
    },
    body: {
        fontSize: 15,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.sm,
    },
    email: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: Spacing.xxxl,
    },
    faqSection: { width: '100%' },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    faqText: { fontSize: 15, fontWeight: '600', color: Colors.textMain },
});

export default HelpScreen;
