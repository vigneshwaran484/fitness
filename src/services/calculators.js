/**
 * Fitness & Nutrition Calculators
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weightKg 
 * @param {number} heightCm 
 * @returns {object} { bmi, category }
 */
export function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    return { bmi, category };
}

/**
 * Calculate Daily Calorie Needs (TDEE) using Mifflin-St Jeor
 * @param {number} weightKg 
 * @param {number} heightCm 
 * @param {number} age 
 * @param {string} gender 'male' | 'female'
 * @param {number} activityMultiplier 1.2 to 1.9
 * @returns {number} Daily calories
 */
export function calculateCalories(weightKg, heightCm, age, gender, activityMultiplier) {
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    return Math.round(bmr * activityMultiplier);
}

/**
 * Calculate Macros based on TDEE and Goal
 * @param {number} tdee 
 * @param {string} goal 'lose' | 'maintain' | 'gain'
 * @returns {object} { protein, fats, carbs } in grams
 */
export function calculateMacros(tdee, goal) {
    let adjustedCalories = tdee;
    let ratios = { p: 0.3, f: 0.25, c: 0.45 }; // Default (Maintenance)

    if (goal === 'lose') {
        adjustedCalories = tdee - 500;
        ratios = { p: 0.4, f: 0.3, c: 0.3 }; // High protein for retention
    } else if (goal === 'gain') {
        adjustedCalories = tdee + 300;
        ratios = { p: 0.3, f: 0.2, c: 0.5 }; // High carb for energy
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

/**
 * Calculate Daily Water Intake
 * @param {number} weightKg 
 * @param {number} activityMinutes 
 * @returns {number} Liters needed
 */
export function calculateWater(weightKg, activityMinutes) {
    // Baseline: 35ml per kg
    let waterMl = weightKg * 35;

    // Add 12ml per minute of activity
    waterMl += activityMinutes * 12;

    return (waterMl / 1000).toFixed(1);
}
