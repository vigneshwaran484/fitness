import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="white" />
                </View>
                <Text style={styles.name}>User Profile</Text>
                <Text style={styles.subtext}>Consistency is key. 🔑</Text>
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Workouts" value="0" />
                <StatCard label="Streak" value="0 days" />
                <StatCard label="Weight" value="-- kg" />
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>About You</Text>
                <Text style={styles.infoText}>Track your progress here. Future updates will allow you to save your stats locally.</Text>
            </View>
        </SafeAreaView>
    );
}

function StatCard({ label, value }: any) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
    header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
    avatar: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary,
        alignItems: 'center', justifyContent: 'center', marginBottom: 10
    },
    name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary },
    subtext: { color: theme.colors.textSecondary },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    statCard: {
        backgroundColor: theme.colors.surface, padding: 15, borderRadius: 12,
        alignItems: 'center', flex: 1, marginHorizontal: 5
    },
    statValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },
    statLabel: { color: theme.colors.textSecondary, fontSize: 12 },
    infoCard: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 16 },
    infoTitle: { color: theme.colors.textPrimary, fontWeight: 'bold', marginBottom: 10 },
    infoText: { color: theme.colors.textSecondary, lineHeight: 20 }
});
