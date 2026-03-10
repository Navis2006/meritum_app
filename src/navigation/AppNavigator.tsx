import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { sessionStorage } from '../services/api';
import { Colors } from '../theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EvaluationListScreen from '../screens/EvaluationListScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import EvaluationRubricScreen from '../screens/EvaluationRubricScreen';
import EvaluationSuccessScreen from '../screens/EvaluationSuccessScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EvaluationHistoryScreen from '../screens/EvaluationHistoryScreen';
import GalleryScreen from '../screens/GalleryScreen';
import ProjectPublicDetailScreen from '../screens/ProjectPublicDetailScreen';
import EvaluationDetailScreen from '../screens/EvaluationDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const GalleryStack = createNativeStackNavigator();

// ============================================================
// Dashboard Stack (nested inside bottom tab)
// ============================================================
const DashboardStackNavigator = () => (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
        <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
        <DashboardStack.Screen
            name="EvaluationList"
            component={EvaluationListScreen}
        />
        <DashboardStack.Screen
            name="ProjectDetail"
            component={ProjectDetailScreen}
        />
        <DashboardStack.Screen
            name="EvaluationRubric"
            component={EvaluationRubricScreen}
        />
        <DashboardStack.Screen
            name="EvaluationSuccess"
            component={EvaluationSuccessScreen}
        />
    </DashboardStack.Navigator>
);

// ============================================================
// Gallery Stack (New)
// ============================================================
const GalleryStackNavigator = () => (
    <GalleryStack.Navigator screenOptions={{ headerShown: false }}>
        <GalleryStack.Screen name="Gallery" component={GalleryScreen} />
        <GalleryStack.Screen
            name="ProjectPublicDetail"
            component={ProjectPublicDetailScreen}
        />
    </GalleryStack.Navigator>
);

// ============================================================
// Profile Stack (nested inside bottom tab)
// ============================================================
const ProfileStackNavigator = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
        <ProfileStack.Screen
            name="EvaluationHistory"
            component={EvaluationHistoryScreen}
        />
        <ProfileStack.Screen
            name="EvaluationDetail"
            component={EvaluationDetailScreen}
        />
    </ProfileStack.Navigator>
);

// ============================================================
// Bottom Tab Navigator
// ============================================================
const MainTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.gray400,
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                marginTop: -2,
            },
            tabBarStyle: {
                backgroundColor: Colors.white,
                borderTopWidth: 1,
                borderTopColor: Colors.gray100,
                height: 64,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarIcon: ({ color, size }: { color: string; size: number }) => {
                let iconName = 'home';
                if (route.name === 'DashboardTab') iconName = 'home';
                else if (route.name === 'GalleryTab') iconName = 'grid-view';
                else if (route.name === 'LeaderboardTab') iconName = 'leaderboard';
                else if (route.name === 'ProfileTab') iconName = 'person';
                return <Icon name={iconName as any} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen
            name="DashboardTab"
            component={DashboardStackNavigator}
            options={{ title: 'Inicio' }}
        />
        <Tab.Screen
            name="GalleryTab"
            component={GalleryStackNavigator}
            options={{ title: 'Galería' }}
        />
        <Tab.Screen
            name="LeaderboardTab"
            component={LeaderboardScreen}
            options={{ title: 'Ranking' }}
        />
        <Tab.Screen
            name="ProfileTab"
            component={ProfileStackNavigator}
            options={{ title: 'Perfil' }}
        />
    </Tab.Navigator>
);

// ============================================================
// Root Navigator
// ============================================================
const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const user = await sessionStorage.getUser();
            // Start at Login if no user, else MainTabs
            setInitialRoute(user ? 'MainTabs' : 'Login');
        };
        checkSession();
    }, []);

    if (!initialRoute) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar hidden />
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
            >
                {/* Auth Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="Privacy" component={PrivacyScreen} />

                {/* Main App (Tab Navigator) */}
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
});

export default AppNavigator;
