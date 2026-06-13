import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.background, '#1e293b']}
                style={StyleSheet.absoluteFillObject}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Hello, Athlete! 💪</Text>
                        <Text style={styles.subtitle}>Your AI Coach is ready.</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.heroCard}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroGradient}
                        >
                            <Ionicons name="chatbubbles" size={32} color="white" />
                            <Text style={styles.heroTitle}>Ask FitBot</Text>
                            <Text style={styles.heroText}>Get instant advice on workouts & diet.</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Tools & Trackers</Text>
                    <View style={styles.grid}>
                        <FeatureCard
                            icon="calculator"
                            title="Calculators"
                            onPress={() => navigation.navigate('Tools')}
                        />
                        <FeatureCard
                            icon="person"
                            title="Profile"
                            onPress={() => navigation.navigate('Profile')}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function FeatureCard({ icon, title, onPress }: any) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Ionicons name={icon as any} size={28} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    safeArea: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { marginBottom: 30 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 5 },
    heroCard: { borderRadius: 16, marginBottom: 30, overflow: 'hidden' },
    heroGradient: { padding: 25, alignItems: 'center' },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 10 },
    heroText: { color: 'rgba(255,255,255,0.9)', marginTop: 5 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 15 },
    grid: { flexDirection: 'row', gap: 15 },
    card: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    cardTitle: { color: theme.colors.textPrimary, fontWeight: '600', marginTop: 10 }
});
