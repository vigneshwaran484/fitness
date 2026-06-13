import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../theme';

export default function TypingIndicator() {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.delay(600 - delay),
                ])
            );

        const anim1 = animateDot(dot1, 0);
        const anim2 = animateDot(dot2, 150);
        const anim3 = animateDot(dot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    const renderDot = (anim: Animated.Value) => {
        const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -6],
        });
        const opacity = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
        });
        return (
            <Animated.View
                style={[styles.dot, { transform: [{ translateY }], opacity }]}
            />
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.userBubbleStart, colors.userBubbleEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
            >
                <View style={styles.avatarInner}>
                    <Animated.Text style={styles.avatarEmoji}>🤖</Animated.Text>
                </View>
            </LinearGradient>
            <View style={styles.dotsContainer}>
                {renderDot(dot1)}
                {renderDot(dot2)}
                {renderDot(dot3)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.botBubble,
        borderWidth: 1,
        borderColor: colors.botBubbleBorder,
        borderRadius: borderRadius.md,
        borderBottomLeftRadius: 4,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.textMuted,
    },
});
