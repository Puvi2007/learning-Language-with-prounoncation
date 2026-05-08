const Activity = require('../models/Activity');
const curriculumData = require('./curriculumData');

/**
 * Generates 10 activities for a specific language and day.
 */
const generateDailyActivities = async (language, dayNum) => {
    // Check if activities already exist in cache/DB for this lang/day
    const existing = await Activity.find({ language, day: dayNum }).limit(10);
    if (existing.length >= 10) return existing;

    // Use curriculumData for localized fallbacks
    const activities = generateFallbackActivities(language, dayNum);

    // Save to DB for future use (caching)
    const saved = await Activity.insertMany(activities.map(a => ({ ...a, language, day: dayNum })));
    return saved;
};

const generateFallbackActivities = (language, day) => {
    const langData = curriculumData[language] || curriculumData['Tamil'] || {};
    
    // Attempt to get data for the specific day
    let dayData = langData[day];
    
    // If day exceeds defined curriculum, create dynamic but UNIQUE content based on themes
    if (!dayData) {
        dayData = generateDynamicDay(language, day);
    }

    // Map to activity format
    let activities = dayData.map((item, index) => ({
        ...item,
        activityType: index % 3 === 0 ? "pronunciation" : (index % 3 === 1 ? "listening" : "repeat"),
        exampleSentence: `Master the word for "${item.meaning}" in ${language}.`,
        difficulty: day > 10 ? 'advanced' : (day > 5 ? 'intermediate' : 'beginner')
    }));

    // Ensure exactly 10 activities
    if (activities.length < 10) {
        const padding = generateDynamicDay(language, day, 10 - activities.length);
        activities = [...activities, ...padding.map((item, index) => ({
            ...item,
            activityType: "pronunciation",
            exampleSentence: `Practice: ${item.meaning}`,
            difficulty: 'beginner'
        }))];
    }

    return activities.slice(0, 10);
};

const generateDynamicDay = (language, day, count = 10) => {
    const themes = [
        "Nature", "Travel", "Work", "Feelings", "Shopping", 
        "Health", "Hobbies", "Music", "Art", "Science"
    ];
    const theme = themes[day % themes.length];
    
    let items = [];
    for (let i = 1; i <= count; i++) {
        items.push({
            word: `${theme} Concept ${i + (day * 10)}`,
            nativeWord: `${theme} - Day ${day}`,
            meaning: `Intermediate ${theme} term ${i}`,
            transliteration: `pro-nun-ci-a-tion-${i}`,
        });
    }
    return items;
};

module.exports = { generateDailyActivities };
