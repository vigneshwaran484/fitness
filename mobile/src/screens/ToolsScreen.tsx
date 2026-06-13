import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { calculateBMI, calculateCalories, calculateMacros, calculateWater } from '../services/calculators';

// Import pure JS calculators (shared logic)
// Note: We need to copy/paste calculate functions or import if environment supports shared code.
// Since it's a separate mobile root, I'll implement a local services/calculators.ts adapter or paste logic.
// I'll assume we duplicate logic for now to avoid symlink complexities in Expo.

export function ToolsScreen({ navigation }: any) {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [context, setContext] = useState<string | null>(null);

    // Form Stats
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('1.2');

    const resetForm = () => {
        setWeight(''); setHeight(''); setAge(''); setResult(null); setContext(null);
    };

    const handleCalculate = () => {
        if (!weight) return Alert.alert('Error', 'Please enter weight');

        let res = '';
        let ctx = '';

        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);

        if (selectedTool === 'BMI') {
            if (!h) return Alert.alert('Error', 'Please enter height');
            const heightM = h / 100;
            const bmi = (w / (heightM * heightM)).toFixed(1);
            let cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
            res = `BMI: ${bmi}\nCategory: ${cat}`;
            ctx = `My BMI is ${bmi} (${cat}). Advice?`;
        }
        else if (selectedTool === 'Calories') {
            if (!h || !a) return Alert.alert('Error', 'Enter all fields');
            let bmr = (10 * w) + (6.25 * h) - (5 * a) + (gender === 'male' ? 5 : -161);
            const tdee = Math.round(bmr * parseFloat(activity));
            res = `Daily Needs: ${tdee} kcal`;
            ctx = `My TDEE is ${tdee} calories. Meal plan?`;
        }
        else if (selectedTool === 'Water') {
            const water = ((w * 35) + (30 * 12)) / 1000; // Simplified assumption for activity
            res = `Target: ${water.toFixed(1)} Liters`;
            ctx = `I need ${water.toFixed(1)}L water daily. Hydration tips?`;
        }

        setResult(res);
        setContext(ctx);
    };

    const handleAskFitBot = () => {
        setSelectedTool(null);
        resetForm();
        navigation.navigate('Chat', { context });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.header}>Fitness Tools 🧮</Text>

                <View style={styles.grid}>
                    <ToolCard title="BMI Calculator" icon="scale" onPress={() => setSelectedTool('BMI')} />
                    <ToolCard title="Daily Calories" icon="flame" onPress={() => setSelectedTool('Calories')} />
                    <ToolCard title="Macro Split" icon="pie-chart" onPress={() => Alert.alert('Coming Soon')} />
                    <ToolCard title="Water Intake" icon="water" onPress={() => setSelectedTool('Water')} />
                </View>
            </ScrollView>

            <Modal visible={!!selectedTool} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedTool} Calculator</Text>
                            <TouchableOpacity onPress={() => setSelectedTool(null)}>
                                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="70" placeholderTextColor="#666" />

                        {(selectedTool === 'BMI' || selectedTool === 'Calories') && (
                            <>
                                <Text style={styles.label}>Height (cm)</Text>
                                <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="175" placeholderTextColor="#666" />
                            </>
                        )}

                        {selectedTool === 'Calories' && (
                            <>
                                <Text style={styles.label}>Age</Text>
                                <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} placeholder="25" placeholderTextColor="#666" />
                            </>
                        )}

                        {result ? (
                            <View style={styles.resultBox}>
                                <Text style={styles.resultText}>{result}</Text>
                                <TouchableOpacity style={styles.askBtn} onPress={handleAskFitBot}>
                                    <Text style={styles.btnText}>Ask FitBot About This</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
                                <Text style={styles.btnText}>Calculate</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function ToolCard({ title, icon, onPress }: any) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconBox}>
                <Ionicons name={icon as any} size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    card: {
        width: '47%',
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center'
    },
    iconBox: { marginBottom: 15, padding: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 50 },
    cardTitle: { color: theme.colors.textPrimary, fontWeight: '600', textAlign: 'center' },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    label: { color: theme.colors.textSecondary, marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, color: 'white', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    calcBtn: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
    askBtn: { backgroundColor: '#059669', padding: 15, borderRadius: 12, marginTop: 10, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    resultBox: { marginTop: 20, padding: 15, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, alignItems: 'center' },
    resultText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }
});
