import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Platform,
    StyleSheet,
    StatusBar,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    addUserMessage,
    addAssistantMessage,
    sendMessageToGroq,
    clearConversation,
} from '../services/groqApi';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import WelcomeCard from '../components/WelcomeCard';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}

import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    // Navigation and Context
    const route = useRoute<any>();
    const context = route.params?.context;

    useEffect(() => {
        if (context) {
            setInputText(context);
        }
    }, [context]);

    const showWelcome = messages.length === 0 && !isLoading;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const sub = Keyboard.addListener(showEvent, () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 150);
        });
        return () => sub.remove();
    }, []);

    const handleSend = useCallback(
        async (text?: string) => {
            const messageText = (text || inputText).trim();
            if (!messageText || isLoading) return;

            setInputText('');

            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: messageText,
            };
            setMessages((prev) => [...prev, userMsg]);
            addUserMessage(messageText);

            setIsLoading(true);
            try {
                const response = await sendMessageToGroq();
                const botMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                };
                addAssistantMessage(response);
                setMessages((prev) => [...prev, botMsg]);
            } catch (error: any) {
                const errMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `⚠️ Sorry, I encountered an error: ${error.message}. Please try again.`,
                    isError: true,
                };
                setMessages((prev) => [...prev, errMsg]);
            }
            setIsLoading(false);
        },
        [inputText, isLoading]
    );

    const handleClear = useCallback(() => {
        clearConversation();
        setMessages([]);
    }, []);

    const handleChipPress = useCallback(
        (query: string) => {
            handleSend(query);
        },
        [handleSend]
    );

    const renderItem = useCallback(({ item }: { item: ChatMessage }) => (
        <MessageBubble
            role={item.role}
            content={item.content}
            isError={item.isError}
        />
    ), []);

    const renderFooter = useCallback(() => {
        if (!isLoading) return null;
        return <TypingIndicator />;
    }, [isLoading]);

    return (
        <LinearGradient
            colors={['#0a0f1a', '#0f1729', '#0a0f1a']}
            style={styles.root}
        >
            <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" translucent={false} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* ===== HEADER ===== */}
                <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                    <View style={styles.headerLeft}>
                        <LinearGradient
                            colors={[colors.userBubbleStart, colors.userBubbleEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoIcon}
                        >
                            <Text style={styles.logoEmoji}>🏋️</Text>
                        </LinearGradient>
                        <View>
                            <Text style={styles.headerTitle}>FitBot</Text>
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>AI Fitness Expert</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.clearBtn}
                        activeOpacity={0.7}
                        onPress={handleClear}
                    >
                        <Text style={styles.clearIcon}>🗑️</Text>
                    </TouchableOpacity>
                </View>

                {/* ===== MESSAGE LIST (flex: 1) ===== */}
                <View style={styles.chatArea}>
                    {showWelcome ? (
                        <ScrollView
                            contentContainerStyle={styles.welcomeScroll}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <WelcomeCard onChipPress={handleChipPress} />
                        </ScrollView>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.messagesList}
                            ListFooterComponent={renderFooter}
                            onContentSizeChange={() =>
                                flatListRef.current?.scrollToEnd({ animated: true })
                            }
                            onLayout={() =>
                                flatListRef.current?.scrollToEnd({ animated: false })
                            }
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </View>

                {/* ===== INPUT BAR ===== */}
                <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Ask about fitness, nutrition, workouts..."
                            placeholderTextColor={colors.textMuted}
                            multiline
                            maxLength={2000}
                            returnKeyType="default"
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendBtn,
                                (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleSend()}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <LinearGradient
                                colors={
                                    inputText.trim() && !isLoading
                                        ? [colors.userBubbleStart, colors.userBubbleEnd]
                                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.sendBtnGradient}
                            >
                                <Text style={styles.sendIcon}>➤</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.disclaimer}>
                        FitBot is an AI assistant. Always consult a healthcare professional.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    // Root is the LinearGradient itself — flex: 1, fills screen
    root: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },

    // ===== HEADER =====
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderBottomWidth: 1,
        borderBottomColor: colors.borderGlass,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    logoIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoEmoji: {
        fontSize: 22,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs + 2,
        marginTop: 2,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.accent,
    },
    statusText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.accentLight,
        letterSpacing: 0.3,
    },
    clearBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.bgGlass,
        borderWidth: 1,
        borderColor: colors.borderGlass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearIcon: {
        fontSize: 16,
    },

    // ===== CHAT AREA (flex: 1 — fills space between header and input) =====
    chatArea: {
        flex: 1,
        // Debug background — remove after confirming layout works
        // backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    welcomeScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: spacing.lg,
    },
    messagesList: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },

    // ===== INPUT BAR =====
    inputArea: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderTopWidth: 1,
        borderTopColor: colors.borderGlass,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
        backgroundColor: colors.bgGlass,
        borderWidth: 1,
        borderColor: colors.borderGlass,
        borderRadius: borderRadius.md,
        paddingLeft: spacing.lg,
        paddingRight: spacing.xs + 2,
        paddingVertical: spacing.xs + 2,
    },
    textInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: fontSize.md,
        lineHeight: 20,
        maxHeight: 100,
        paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.xs,
    },
    sendBtn: {},
    sendBtnDisabled: {
        opacity: 0.4,
    },
    sendBtnGradient: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendIcon: {
        fontSize: 18,
        color: colors.white,
    },
    disclaimer: {
        textAlign: 'center',
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: spacing.sm,
        letterSpacing: 0.2,
    },
});
