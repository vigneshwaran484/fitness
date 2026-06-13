/**
 * Fitness & Nutrition Calculators (Shared Logic)
 */

export function calculateBMI(weightKg: number, heightCm: number) {
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    let category = '';
    if (parseFloat(bmi) < 18.5) category = 'Underweight';
    else if (parseFloat(bmi) < 25) category = 'Normal weight';
    else if (parseFloat(bmi) < 30) category = 'Overweight';
    else category = 'Obese';

    return { bmi, category };
}

export function calculateCalories(weightKg: number, heightCm: number, age: number, gender: string, activityMultiplier: number) {
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    return Math.round(bmr * activityMultiplier);
}

export function calculateMacros(tdee: number, goal: string) {
    let adjustedCalories = tdee;
    let ratios = { p: 0.3, f: 0.25, c: 0.45 }; // Default (Maintenance)

    if (goal === 'lose') {
        adjustedCalories = tdee - 500;
        ratios = { p: 0.4, f: 0.3, c: 0.3 };
    } else if (goal === 'gain') {
        adjustedCalories = tdee + 300;
        ratios = { p: 0.3, f: 0.2, c: 0.5 };
    }

    const protein = Math.round((adjustedCalories * ratios.p) / 4);
    const fats = Math.round((adjustedCalories * ratios.f) / 9);
    const carbs = Math.round((adjustedCalories * ratios.c) / 4);

    return {
        calories: adjustedCalories,
        protein,
        fats,
        carbs
    };
}

export function calculateWater(weightKg: number, activityMinutes: number) {
    // Baseline: 35ml per kg
    let waterMl = weightKg * 35;

    // Add 12ml per minute of activity
    waterMl += activityMinutes * 12;

    return (waterMl / 1000).toFixed(1);
}
