import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme';

const DocumentViewerScreen = ({ route, navigation }: any) => {
    const { url, title } = route.params;
    const [loading, setLoading] = useState(true);

    // Usa el visor de Google Docs para renderizar PDFs y archivos de Office
    // sin necesidad de librerías nativas completas
    const googleDocsViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="close" size={28} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title || "Documento"}
                </Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Document WebView */}
            <View style={styles.webviewContainer}>
                <WebView
                    source={{ uri: googleDocsViewerUrl }}
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    originWhitelist={['*']}
                    scalesPageToFit={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
                
                {loading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loaderText}>Cargando documento...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
        backgroundColor: Colors.white,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginHorizontal: Spacing.sm,
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: Colors.gray100, // Background color while loading/around edges
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    loaderText: {
        marginTop: Spacing.md,
        fontSize: 14,
        color: Colors.gray600,
    },
});

export default DocumentViewerScreen;
