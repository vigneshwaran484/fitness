import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface WelcomeCardProps {
    onChipPress: (query: string) => void;
}

const SUGGESTIONS = [
    { label: '🏋️ Beginner workout', query: "What's a good workout routine for beginners?" },
    { label: '🥩 Daily protein', query: 'How much protein do I need daily?' },
    { label: '🧘 Core exercises', query: 'Best exercises for core strength?' },
    { label: '🤸 Flexibility tips', query: 'How to improve flexibility?' },
];

export default function WelcomeCard({ onChipPress }: WelcomeCardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>💪</Text>
            <Text style={styles.title}>Welcome to FitBot</Text>
            <Text style={styles.subtitle}>
                Your AI-powered fitness & nutrition assistant. Ask me anything about
                workouts, diet, supplements, recovery, and more!
            </Text>
            <View style={styles.chips}>
                {SUGGESTIONS.map((s) => (
                    <TouchableOpacity
                        key={s.label}
                        style={styles.chip}
                        activeOpacity={0.7}
                        onPress={() => onChipPress(s.query)}
                    >
                        <Text style={styles.chipText}>{s.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.xxxl + 8,
        paddingHorizontal: spacing.xl,
    },
    icon: {
        fontSize: 56,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.accentLight,
        marginBottom: spacing.sm,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xxl,
        maxWidth: 340,
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.sm + 2,
    },
    chip: {
        paddingHorizontal: spacing.lg + 2,
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.bgGlass,
        borderWidth: 1,
        borderColor: colors.borderGlass,
        borderRadius: borderRadius.full,
    },
    chipText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
});
