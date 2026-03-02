import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme';

const PrivacyScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacidad</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Política de Privacidad</Text>
                <Text style={styles.body}>
                    Meritum recopila únicamente la información necesaria para el
                    funcionamiento de la plataforma de evaluación académica.
                </Text>
                <Text style={styles.sectionTitle}>Datos que recopilamos</Text>
                <Text style={styles.body}>
                    • Correo electrónico institucional{'\n'}
                    • Evaluaciones realizadas{'\n'}
                    • Calificaciones otorgadas
                </Text>
                <Text style={styles.sectionTitle}>Uso de la información</Text>
                <Text style={styles.body}>
                    La información se utiliza exclusivamente para el proceso de
                    evaluación de proyectos dentro del ámbito universitario.
                </Text>
                <Text style={styles.sectionTitle}>Contacto</Text>
                <Text style={styles.body}>
                    Para dudas sobre privacidad, contacta al administrador del sistema.
                </Text>
            </ScrollView>
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
    scrollView: { flex: 1 },
    scrollContent: { padding: Spacing.xl, paddingBottom: 48 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
        marginTop: Spacing.xl,
        marginBottom: Spacing.sm,
    },
    body: {
        fontSize: 15,
        color: Colors.gray500,
        lineHeight: 24,
    },
});

export default PrivacyScreen;
