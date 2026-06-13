import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}

// Simple markdown-to-components renderer
function renderMarkdown(text: string) {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Headings
        if (line.startsWith('### ')) {
            elements.push(
                <Text key={key++} style={styles.heading3}>
                    {parseBold(line.slice(4))}
                </Text>
            );
        } else if (line.startsWith('## ')) {
            elements.push(
                <Text key={key++} style={styles.heading2}>
                    {parseBold(line.slice(3))}
                </Text>
            );
        } else if (line.startsWith('# ')) {
            elements.push(
                <Text key={key++} style={styles.heading1}>
                    {parseBold(line.slice(2))}
                </Text>
            );
        }
        // Bullet points
        else if (line.match(/^[\-\*] /)) {
            elements.push(
                <View key={key++} style={styles.bulletItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{parseBold(line.slice(2))}</Text>
                </View>
            );
        }
        // Numbered lists
        else if (line.match(/^\d+\. /)) {
            const match = line.match(/^(\d+)\. (.+)/);
            if (match) {
                elements.push(
                    <View key={key++} style={styles.bulletItem}>
                        <Text style={styles.bulletNum}>{match[1]}.</Text>
                        <Text style={styles.bulletText}>{parseBold(match[2])}</Text>
                    </View>
                );
            }
        }
        // Empty line (paragraph break)
        else if (line.trim() === '') {
            elements.push(<View key={key++} style={{ height: spacing.sm }} />);
        }
        // Normal text
        else {
            elements.push(
                <Text key={key++} style={styles.bodyText}>
                    {parseBold(line)}
                </Text>
            );
        }
    }

    return elements;
}

// Parse **bold** inside text
function parseBold(text: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <Text key={i} style={styles.boldText}>
                    {part.slice(2, -2)}
                </Text>
            );
        }
        return <Text key={i}>{part}</Text>;
    });
}

export default function MessageBubble({ role, content, isError }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <View style={[styles.container, isUser ? styles.userRow : styles.botRow]}>
            {/* Avatar */}
            {isUser ? (
                <LinearGradient
                    colors={[colors.userAvatarStart, colors.userAvatarEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarEmoji}>🧑</Text>
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={[colors.userBubbleStart, colors.userBubbleEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarEmoji}>🤖</Text>
                </LinearGradient>
            )}

            {/* Bubble */}
            {isUser ? (
                <LinearGradient
                    colors={[colors.userBubbleStart, colors.userBubbleEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.bubble, styles.userBubble]}
                >
                    <Text style={styles.userText}>{content}</Text>
                </LinearGradient>
            ) : (
                <View
                    style={[
                        styles.bubble,
                        styles.botBubble,
                        isError && styles.errorBubble,
                    ]}
                >
                    {renderMarkdown(content)}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
        maxWidth: '88%',
    },
    userRow: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    botRow: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    avatarEmoji: {
        fontSize: 16,
    },
    bubble: {
        flex: 1,
        paddingHorizontal: spacing.lg + 2,
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.md,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: colors.botBubble,
        borderWidth: 1,
        borderColor: colors.botBubbleBorder,
        borderBottomLeftRadius: 4,
    },
    errorBubble: {
        backgroundColor: colors.dangerBg,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    userText: {
        color: colors.white,
        fontSize: fontSize.md,
        lineHeight: 22,
        letterSpacing: 0.15,
    },
    bodyText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
        lineHeight: 22,
        letterSpacing: 0.15,
    },
    boldText: {
        color: colors.accentLight,
        fontWeight: fontWeight.semibold,
    },
    heading1: {
        color: colors.accentLight,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    heading2: {
        color: colors.accentLight,
        fontSize: fontSize.md + 1,
        fontWeight: fontWeight.semibold,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    heading3: {
        color: colors.accentLight,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    bulletItem: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    bulletDot: {
        color: colors.accentLight,
        fontSize: fontSize.md,
        lineHeight: 22,
        width: 14,
    },
    bulletNum: {
        color: colors.accentLight,
        fontSize: fontSize.md,
        lineHeight: 22,
        fontWeight: fontWeight.semibold,
        width: 20,
    },
    bulletText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
        lineHeight: 22,
        flex: 1,
        letterSpacing: 0.15,
    },
});
