// Run with: node seedCurriculum.js from inside server/ folder
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const Curriculum = require('./models/Curriculum');

const TAMIL = [
    {
        language: 'Tamil', day: 1, theme: 'Vowels — அ to ஐ', tasks: [
            { taskIndex: 0, word: 'அ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'அம்மா - Mother', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ஆ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'ஆடு - Goat', difficulty: 'beginner' },
            { taskIndex: 2, word: 'இ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'இலை - Leaf', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ஈ', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ஈ - Fly', difficulty: 'beginner' },
            { taskIndex: 4, word: 'உ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'உடல் - Body', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ஊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ஊர் - Town', difficulty: 'beginner' },
            { taskIndex: 6, word: 'எ', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'எலி - Mouse', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ஏ', transliteration: 'ee', meaning: 'Eighth vowel', exampleSentence: 'ஏணி - Ladder', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ஐ', transliteration: 'ai', meaning: 'Ninth vowel', exampleSentence: 'ஐந்து - Five', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ஒ', transliteration: 'o', meaning: 'Tenth vowel', exampleSentence: 'ஒட்டகம் - Camel', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Tamil', day: 2, theme: 'Vowels — ஓ to ஔ + க', tasks: [
            { taskIndex: 0, word: 'ஓ', transliteration: 'oo', meaning: 'Eleventh vowel', exampleSentence: 'ஓடு - Run', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ஔ', transliteration: 'au', meaning: 'Twelfth vowel', exampleSentence: 'ஔடதம் - Medicine', difficulty: 'beginner' },
            { taskIndex: 2, word: 'க', transliteration: 'ka', meaning: 'First consonant', exampleSentence: 'கடல் - Sea', difficulty: 'beginner' },
            { taskIndex: 3, word: 'கா', transliteration: 'kaa', meaning: 'க + ஆ', exampleSentence: 'காடு - Forest', difficulty: 'beginner' },
            { taskIndex: 4, word: 'கி', transliteration: 'ki', meaning: 'க + இ', exampleSentence: 'கிளை - Branch', difficulty: 'beginner' },
            { taskIndex: 5, word: 'கீ', transliteration: 'kii', meaning: 'க + ஈ', exampleSentence: 'கீரை - Spinach', difficulty: 'beginner' },
            { taskIndex: 6, word: 'கு', transliteration: 'ku', meaning: 'க + உ', exampleSentence: 'குரல் - Voice', difficulty: 'beginner' },
            { taskIndex: 7, word: 'கூ', transliteration: 'kuu', meaning: 'க + ஊ', exampleSentence: 'கூடு - Nest', difficulty: 'beginner' },
            { taskIndex: 8, word: 'கெ', transliteration: 'ke', meaning: 'க + எ', exampleSentence: 'கெட்ட - Bad', difficulty: 'beginner' },
            { taskIndex: 9, word: 'கை', transliteration: 'kai', meaning: 'க + ஐ', exampleSentence: 'கைகள் - Hands', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Tamil', day: 3, theme: 'Basic Greetings', tasks: [
            { taskIndex: 0, word: 'வணக்கம்', transliteration: 'vanakkam', meaning: 'Hello', exampleSentence: 'வணக்கம் ஐயா', difficulty: 'beginner' },
            { taskIndex: 1, word: 'நன்றி', transliteration: 'nandri', meaning: 'Thank you', exampleSentence: 'மிக்க நன்றி', difficulty: 'beginner' },
            { taskIndex: 2, word: 'மன்னிக்கவும்', transliteration: 'mannikkavum', meaning: 'Sorry', exampleSentence: 'மன்னிக்கவும் ஐயா', difficulty: 'beginner' },
            { taskIndex: 3, word: 'சரி', transliteration: 'sari', meaning: 'OK', exampleSentence: 'சரி போகலாம்', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ஆமாம்', transliteration: 'aamaam', meaning: 'Yes', exampleSentence: 'ஆமாம் வருவேன்', difficulty: 'beginner' },
            { taskIndex: 5, word: 'இல்லை', transliteration: 'illai', meaning: 'No', exampleSentence: 'இல்லை வர மாட்டேன்', difficulty: 'beginner' },
            { taskIndex: 6, word: 'எப்படி இருக்கீங்க', transliteration: 'eppadi irukkeenga', meaning: 'How are you', exampleSentence: 'நீங்க எப்படி இருக்கீங்க', difficulty: 'beginner' },
            { taskIndex: 7, word: 'நலமாக இருக்கேன்', transliteration: 'nalamaga irukken', meaning: 'I am fine', exampleSentence: 'நான் நலமாக இருக்கேன்', difficulty: 'beginner' },
            { taskIndex: 8, word: 'உங்கள் பெயர் என்ன', transliteration: 'ungal peyar enna', meaning: 'What is your name', exampleSentence: 'உங்கள் பெயர் என்ன', difficulty: 'beginner' },
            { taskIndex: 9, word: 'என் பெயர்', transliteration: 'en peyar', meaning: 'My name is', exampleSentence: 'என் பெயர் ரவி', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Tamil', day: 4, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'ஒன்று', transliteration: 'ondru', meaning: 'One', exampleSentence: 'ஒன்று ஆப்பிள்', difficulty: 'beginner' },
            { taskIndex: 1, word: 'இரண்டு', transliteration: 'irandu', meaning: 'Two', exampleSentence: 'இரண்டு கண்கள்', difficulty: 'beginner' },
            { taskIndex: 2, word: 'மூன்று', transliteration: 'moondru', meaning: 'Three', exampleSentence: 'மூன்று பூக்கள்', difficulty: 'beginner' },
            { taskIndex: 3, word: 'நான்கு', transliteration: 'naangu', meaning: 'Four', exampleSentence: 'நான்கு கால்கள்', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ஐந்து', transliteration: 'aindhu', meaning: 'Five', exampleSentence: 'ஐந்து விரல்கள்', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ஆறு', transliteration: 'aaru', meaning: 'Six', exampleSentence: 'ஆறு மாதங்கள்', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ஏழு', transliteration: 'eelu', meaning: 'Seven', exampleSentence: 'ஏழு நாட்கள்', difficulty: 'beginner' },
            { taskIndex: 7, word: 'எட்டு', transliteration: 'ettu', meaning: 'Eight', exampleSentence: 'எட்டு கால்கள்', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ஒன்பது', transliteration: 'onbadu', meaning: 'Nine', exampleSentence: 'ஒன்பது கிரகங்கள்', difficulty: 'beginner' },
            { taskIndex: 9, word: 'பத்து', transliteration: 'pathu', meaning: 'Ten', exampleSentence: 'பத்து விரல்கள்', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Tamil', day: 5, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'சிவப்பு', transliteration: 'sivappu', meaning: 'Red', exampleSentence: 'சிவப்பு ரோஜா', difficulty: 'beginner' },
            { taskIndex: 1, word: 'நீலம்', transliteration: 'neelam', meaning: 'Blue', exampleSentence: 'நீல வானம்', difficulty: 'beginner' },
            { taskIndex: 2, word: 'பச்சை', transliteration: 'pachai', meaning: 'Green', exampleSentence: 'பச்சை இலை', difficulty: 'beginner' },
            { taskIndex: 3, word: 'மஞ்சள்', transliteration: 'manjal', meaning: 'Yellow', exampleSentence: 'மஞ்சள் சூரியன்', difficulty: 'beginner' },
            { taskIndex: 4, word: 'வெள்ளை', transliteration: 'vellai', meaning: 'White', exampleSentence: 'வெள்ளை பால்', difficulty: 'beginner' },
            { taskIndex: 5, word: 'கறுப்பு', transliteration: 'karuppu', meaning: 'Black', exampleSentence: 'கறுப்பு இரவு', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ஆரஞ்சு', transliteration: 'aaranju', meaning: 'Orange', exampleSentence: 'ஆரஞ்சு பழம்', difficulty: 'beginner' },
            { taskIndex: 7, word: 'இளஞ்சிவப்பு', transliteration: 'ilanjivappu', meaning: 'Pink', exampleSentence: 'இளஞ்சிவப்பு பூ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'பழுப்பு', transliteration: 'paluppu', meaning: 'Brown', exampleSentence: 'பழுப்பு மண்', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ஊதா', transliteration: 'ootha', meaning: 'Purple', exampleSentence: 'ஊதா திராட்சை', difficulty: 'beginner' },
        ]
    },
];

const HINDI = [
    {
        language: 'Hindi', day: 1, theme: 'Vowels — अ to औ', tasks: [
            { taskIndex: 0, word: 'अ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'अनार - Pomegranate', difficulty: 'beginner' },
            { taskIndex: 1, word: 'आ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'आम - Mango', difficulty: 'beginner' },
            { taskIndex: 2, word: 'इ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'इमली - Tamarind', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ई', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ईख - Sugarcane', difficulty: 'beginner' },
            { taskIndex: 4, word: 'उ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'उल्लू - Owl', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ऊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ऊन - Wool', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ए', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'एक - One', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ऐ', transliteration: 'ai', meaning: 'Eighth vowel', exampleSentence: 'ऐनक - Spectacles', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ओ', transliteration: 'o', meaning: 'Ninth vowel', exampleSentence: 'ओस - Dew', difficulty: 'beginner' },
            { taskIndex: 9, word: 'औ', transliteration: 'au', meaning: 'Tenth vowel', exampleSentence: 'औरत - Woman', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Hindi', day: 2, theme: 'Consonants — क to ड', tasks: [
            { taskIndex: 0, word: 'क', transliteration: 'ka', meaning: 'First consonant', exampleSentence: 'कमल - Lotus', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ख', transliteration: 'kha', meaning: 'Second consonant', exampleSentence: 'खरगोश - Rabbit', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ग', transliteration: 'ga', meaning: 'Third consonant', exampleSentence: 'गाय - Cow', difficulty: 'beginner' },
            { taskIndex: 3, word: 'घ', transliteration: 'gha', meaning: 'Fourth consonant', exampleSentence: 'घर - House', difficulty: 'beginner' },
            { taskIndex: 4, word: 'च', transliteration: 'cha', meaning: 'Fifth consonant', exampleSentence: 'चाय - Tea', difficulty: 'beginner' },
            { taskIndex: 5, word: 'छ', transliteration: 'chha', meaning: 'Sixth consonant', exampleSentence: 'छाता - Umbrella', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ज', transliteration: 'ja', meaning: 'Seventh consonant', exampleSentence: 'जल - Water', difficulty: 'beginner' },
            { taskIndex: 7, word: 'झ', transliteration: 'jha', meaning: 'Eighth consonant', exampleSentence: 'झील - Lake', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ट', transliteration: 'ta', meaning: 'Ninth consonant', exampleSentence: 'टमाटर - Tomato', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ड', transliteration: 'da', meaning: 'Tenth consonant', exampleSentence: 'डाकिया - Postman', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Hindi', day: 3, theme: 'Basic Greetings', tasks: [
            { taskIndex: 0, word: 'नमस्ते', transliteration: 'namaste', meaning: 'Hello', exampleSentence: 'नमस्ते जी', difficulty: 'beginner' },
            { taskIndex: 1, word: 'धन्यवाद', transliteration: 'dhanyavaad', meaning: 'Thank you', exampleSentence: 'बहुत धन्यवाद', difficulty: 'beginner' },
            { taskIndex: 2, word: 'माफ करना', transliteration: 'maaf karna', meaning: 'Sorry', exampleSentence: 'माफ करना जी', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ठीक है', transliteration: 'theek hai', meaning: 'OK', exampleSentence: 'ठीक है चलते हैं', difficulty: 'beginner' },
            { taskIndex: 4, word: 'हाँ', transliteration: 'haan', meaning: 'Yes', exampleSentence: 'हाँ मैं आऊंगा', difficulty: 'beginner' },
            { taskIndex: 5, word: 'नहीं', transliteration: 'nahin', meaning: 'No', exampleSentence: 'नहीं मैं नहीं आऊंगा', difficulty: 'beginner' },
            { taskIndex: 6, word: 'आप कैसे हैं', transliteration: 'aap kaise hain', meaning: 'How are you', exampleSentence: 'आप कैसे हैं', difficulty: 'beginner' },
            { taskIndex: 7, word: 'मैं ठीक हूँ', transliteration: 'main theek hoon', meaning: 'I am fine', exampleSentence: 'मैं ठीक हूँ धन्यवाद', difficulty: 'beginner' },
            { taskIndex: 8, word: 'आपका नाम क्या है', transliteration: 'aapka naam kya hai', meaning: 'What is your name', exampleSentence: 'आपका नाम क्या है', difficulty: 'beginner' },
            { taskIndex: 9, word: 'मेरा नाम', transliteration: 'mera naam', meaning: 'My name is', exampleSentence: 'मेरा नाम राज है', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Hindi', day: 4, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'एक', transliteration: 'ek', meaning: 'One', exampleSentence: 'एक सेब', difficulty: 'beginner' },
            { taskIndex: 1, word: 'दो', transliteration: 'do', meaning: 'Two', exampleSentence: 'दो आँखें', difficulty: 'beginner' },
            { taskIndex: 2, word: 'तीन', transliteration: 'teen', meaning: 'Three', exampleSentence: 'तीन फूल', difficulty: 'beginner' },
            { taskIndex: 3, word: 'चार', transliteration: 'chaar', meaning: 'Four', exampleSentence: 'चार पैर', difficulty: 'beginner' },
            { taskIndex: 4, word: 'पाँच', transliteration: 'paanch', meaning: 'Five', exampleSentence: 'पाँच उंगलियाँ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'छह', transliteration: 'chhah', meaning: 'Six', exampleSentence: 'छह महीने', difficulty: 'beginner' },
            { taskIndex: 6, word: 'सात', transliteration: 'saat', meaning: 'Seven', exampleSentence: 'सात दिन', difficulty: 'beginner' },
            { taskIndex: 7, word: 'आठ', transliteration: 'aath', meaning: 'Eight', exampleSentence: 'आठ पैर', difficulty: 'beginner' },
            { taskIndex: 8, word: 'नौ', transliteration: 'nau', meaning: 'Nine', exampleSentence: 'नौ ग्रह', difficulty: 'beginner' },
            { taskIndex: 9, word: 'दस', transliteration: 'das', meaning: 'Ten', exampleSentence: 'दस उंगलियाँ', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Hindi', day: 5, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'लाल', transliteration: 'laal', meaning: 'Red', exampleSentence: 'लाल गुलाब', difficulty: 'beginner' },
            { taskIndex: 1, word: 'नीला', transliteration: 'neela', meaning: 'Blue', exampleSentence: 'नीला आसमान', difficulty: 'beginner' },
            { taskIndex: 2, word: 'हरा', transliteration: 'hara', meaning: 'Green', exampleSentence: 'हरी पत्ती', difficulty: 'beginner' },
            { taskIndex: 3, word: 'पीला', transliteration: 'peela', meaning: 'Yellow', exampleSentence: 'पीला सूरज', difficulty: 'beginner' },
            { taskIndex: 4, word: 'सफेद', transliteration: 'safed', meaning: 'White', exampleSentence: 'सफेद दूध', difficulty: 'beginner' },
            { taskIndex: 5, word: 'काला', transliteration: 'kaala', meaning: 'Black', exampleSentence: 'काली रात', difficulty: 'beginner' },
            { taskIndex: 6, word: 'नारंगी', transliteration: 'naarangi', meaning: 'Orange', exampleSentence: 'नारंगी फल', difficulty: 'beginner' },
            { taskIndex: 7, word: 'गुलाबी', transliteration: 'gulaabi', meaning: 'Pink', exampleSentence: 'गुलाबी फूल', difficulty: 'beginner' },
            { taskIndex: 8, word: 'भूरा', transliteration: 'bhoora', meaning: 'Brown', exampleSentence: 'भूरी मिट्टी', difficulty: 'beginner' },
            { taskIndex: 9, word: 'बैंगनी', transliteration: 'baingani', meaning: 'Purple', exampleSentence: 'बैंगनी अंगूर', difficulty: 'beginner' },
        ]
    },
];

const TELUGU = [
    {
        language: 'Telugu', day: 1, theme: 'Vowels — అ to ఒ', tasks: [
            { taskIndex: 0, word: 'అ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'అమ్మ - Mother', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ఆ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'ఆవు - Cow', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ఇ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'ఇల్లు - House', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ఈ', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ఈత - Swimming', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ఉ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'ఉప్పు - Salt', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ఊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ఊరు - Village', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ఎ', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'ఎద్దు - Ox', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ఏ', transliteration: 'ee', meaning: 'Eighth vowel', exampleSentence: 'ఏనుగు - Elephant', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ఐ', transliteration: 'ai', meaning: 'Ninth vowel', exampleSentence: 'ఐదు - Five', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ఒ', transliteration: 'o', meaning: 'Tenth vowel', exampleSentence: 'ఒంటె - Camel', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Telugu', day: 2, theme: 'Greetings', tasks: [
            { taskIndex: 0, word: 'నమస్కారం', transliteration: 'namaskaram', meaning: 'Hello', exampleSentence: 'నమస్కారం అండి', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ధన్యవాదాలు', transliteration: 'dhanyavaadaalu', meaning: 'Thank you', exampleSentence: 'మీకు ధన్యవాదాలు', difficulty: 'beginner' },
            { taskIndex: 2, word: 'క్షమించండి', transliteration: 'kshaminchand', meaning: 'Sorry', exampleSentence: 'క్షమించండి', difficulty: 'beginner' },
            { taskIndex: 3, word: 'సరే', transliteration: 'sare', meaning: 'OK', exampleSentence: 'సరే వెళ్దాం', difficulty: 'beginner' },
            { taskIndex: 4, word: 'అవును', transliteration: 'avunu', meaning: 'Yes', exampleSentence: 'అవును వస్తాను', difficulty: 'beginner' },
            { taskIndex: 5, word: 'కాదు', transliteration: 'kaadu', meaning: 'No', exampleSentence: 'కాదు రాను', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ఎలా ఉన్నారు', transliteration: 'ela unnaru', meaning: 'How are you', exampleSentence: 'మీరు ఎలా ఉన్నారు', difficulty: 'beginner' },
            { taskIndex: 7, word: 'బాగున్నాను', transliteration: 'bagunnanu', meaning: 'I am fine', exampleSentence: 'నేను బాగున్నాను', difficulty: 'beginner' },
            { taskIndex: 8, word: 'మీ పేరు ఏమిటి', transliteration: 'mee peru emiti', meaning: 'What is your name', exampleSentence: 'మీ పేరు ఏమిటి', difficulty: 'beginner' },
            { taskIndex: 9, word: 'నా పేరు', transliteration: 'naa peru', meaning: 'My name is', exampleSentence: 'నా పేరు రవి', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Telugu', day: 3, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'ఒకటి', transliteration: 'okati', meaning: 'One', exampleSentence: 'ఒకటి ఆపిల్', difficulty: 'beginner' },
            { taskIndex: 1, word: 'రెండు', transliteration: 'rendu', meaning: 'Two', exampleSentence: 'రెండు కళ్ళు', difficulty: 'beginner' },
            { taskIndex: 2, word: 'మూడు', transliteration: 'moodu', meaning: 'Three', exampleSentence: 'మూడు పూలు', difficulty: 'beginner' },
            { taskIndex: 3, word: 'నాలుగు', transliteration: 'naalugu', meaning: 'Four', exampleSentence: 'నాలుగు కాళ్ళు', difficulty: 'beginner' },
            { taskIndex: 4, word: 'అయిదు', transliteration: 'ayidu', meaning: 'Five', exampleSentence: 'అయిదు వేళ్ళు', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ఆరు', transliteration: 'aaru', meaning: 'Six', exampleSentence: 'ఆరు నెలలు', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ఏడు', transliteration: 'edu', meaning: 'Seven', exampleSentence: 'ఏడు రోజులు', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ఎనిమిది', transliteration: 'enimidi', meaning: 'Eight', exampleSentence: 'ఎనిమిది కాళ్ళు', difficulty: 'beginner' },
            { taskIndex: 8, word: 'తొమ్మిది', transliteration: 'tommidi', meaning: 'Nine', exampleSentence: 'తొమ్మిది గ్రహాలు', difficulty: 'beginner' },
            { taskIndex: 9, word: 'పది', transliteration: 'padi', meaning: 'Ten', exampleSentence: 'పది వేళ్ళు', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Telugu', day: 4, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'ఎరుపు', transliteration: 'erupu', meaning: 'Red', exampleSentence: 'ఎరుపు గులాబి', difficulty: 'beginner' },
            { taskIndex: 1, word: 'నీలం', transliteration: 'neelam', meaning: 'Blue', exampleSentence: 'నీల ఆకాశం', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ఆకుపచ్చ', transliteration: 'aakupachcha', meaning: 'Green', exampleSentence: 'ఆకుపచ్చ ఆకు', difficulty: 'beginner' },
            { taskIndex: 3, word: 'పసుపు', transliteration: 'pasupu', meaning: 'Yellow', exampleSentence: 'పసుపు సూర్యుడు', difficulty: 'beginner' },
            { taskIndex: 4, word: 'తెలుపు', transliteration: 'telupu', meaning: 'White', exampleSentence: 'తెలుపు పాలు', difficulty: 'beginner' },
            { taskIndex: 5, word: 'నలుపు', transliteration: 'nalupu', meaning: 'Black', exampleSentence: 'నలుపు రాత్రి', difficulty: 'beginner' },
            { taskIndex: 6, word: 'నారింజ', transliteration: 'naarinja', meaning: 'Orange', exampleSentence: 'నారింజ పండు', difficulty: 'beginner' },
            { taskIndex: 7, word: 'గులాబి', transliteration: 'gulaabi', meaning: 'Pink', exampleSentence: 'గులాబి పువ్వు', difficulty: 'beginner' },
            { taskIndex: 8, word: 'గోధుమ', transliteration: 'godhuma', meaning: 'Brown', exampleSentence: 'గోధుమ మట్టి', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ఊదా', transliteration: 'ooda', meaning: 'Purple', exampleSentence: 'ఊదా ద్రాక్ష', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Telugu', day: 5, theme: 'Family Members', tasks: [
            { taskIndex: 0, word: 'అమ్మ', transliteration: 'amma', meaning: 'Mother', exampleSentence: 'నా అమ్మ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'నాన్న', transliteration: 'naanna', meaning: 'Father', exampleSentence: 'నా నాన్న', difficulty: 'beginner' },
            { taskIndex: 2, word: 'అన్న', transliteration: 'anna', meaning: 'Elder brother', exampleSentence: 'నా అన్న', difficulty: 'beginner' },
            { taskIndex: 3, word: 'అక్క', transliteration: 'akka', meaning: 'Elder sister', exampleSentence: 'నా అక్క', difficulty: 'beginner' },
            { taskIndex: 4, word: 'తమ్ముడు', transliteration: 'tammudo', meaning: 'Younger brother', exampleSentence: 'నా తమ్ముడు', difficulty: 'beginner' },
            { taskIndex: 5, word: 'చెల్లి', transliteration: 'chelli', meaning: 'Younger sister', exampleSentence: 'నా చెల్లి', difficulty: 'beginner' },
            { taskIndex: 6, word: 'తాత', transliteration: 'taata', meaning: 'Grandfather', exampleSentence: 'నా తాత', difficulty: 'beginner' },
            { taskIndex: 7, word: 'నానమ్మ', transliteration: 'naanamma', meaning: 'Grandmother', exampleSentence: 'నా నానమ్మ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'మావయ్య', transliteration: 'maavayya', meaning: 'Uncle', exampleSentence: 'నా మావయ్య', difficulty: 'beginner' },
            { taskIndex: 9, word: 'అత్త', transliteration: 'atta', meaning: 'Aunt', exampleSentence: 'నా అత్త', difficulty: 'beginner' },
        ]
    },
];

const KANNADA = [
    {
        language: 'Kannada', day: 1, theme: 'Vowels — ಅ to ಒ', tasks: [
            { taskIndex: 0, word: 'ಅ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'ಅಮ್ಮ - Mother', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ಆ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'ಆನೆ - Elephant', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ಇ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'ಇಲಿ - Mouse', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ಈ', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ಈಜು - Swimming', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ಉ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'ಉಪ್ಪು - Salt', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ಊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ಊರು - Village', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ಎ', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'ಎತ್ತು - Ox', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ಏ', transliteration: 'ee', meaning: 'Eighth vowel', exampleSentence: 'ಏಣಿ - Ladder', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ಐ', transliteration: 'ai', meaning: 'Ninth vowel', exampleSentence: 'ಐದು - Five', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ಒ', transliteration: 'o', meaning: 'Tenth vowel', exampleSentence: 'ಒಂಟೆ - Camel', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Kannada', day: 2, theme: 'Greetings', tasks: [
            { taskIndex: 0, word: 'ನಮಸ್ಕಾರ', transliteration: 'namaskara', meaning: 'Hello', exampleSentence: 'ನಮಸ್ಕಾರ ಸರ್', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ಧನ್ಯವಾದ', transliteration: 'dhanyavaada', meaning: 'Thank you', exampleSentence: 'ತುಂಬ ಧನ್ಯವಾದ', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ಕ್ಷಮಿಸಿ', transliteration: 'kshamisi', meaning: 'Sorry', exampleSentence: 'ಕ್ಷಮಿಸಿ ಸರ್', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ಸರಿ', transliteration: 'sari', meaning: 'OK', exampleSentence: 'ಸರಿ ಹೋಗೋಣ', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ಹೌದು', transliteration: 'haudu', meaning: 'Yes', exampleSentence: 'ಹೌದು ಬರುತ್ತೇನೆ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ಇಲ್ಲ', transliteration: 'illa', meaning: 'No', exampleSentence: 'ಇಲ್ಲ ಬರುವುದಿಲ್ಲ', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ಹೇಗಿದ್ದೀರಿ', transliteration: 'hegiddiri', meaning: 'How are you', exampleSentence: 'ನೀವು ಹೇಗಿದ್ದೀರಿ', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ', transliteration: 'chennaagiddene', meaning: 'I am fine', exampleSentence: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ನಿಮ್ಮ ಹೆಸರೇನು', transliteration: 'nimma hesarenu', meaning: 'What is your name', exampleSentence: 'ನಿಮ್ಮ ಹೆಸರೇನು', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ನನ್ನ ಹೆಸರು', transliteration: 'nanna hesaru', meaning: 'My name is', exampleSentence: 'ನನ್ನ ಹೆಸರು ರವಿ', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Kannada', day: 3, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'ಒಂದು', transliteration: 'ondu', meaning: 'One', exampleSentence: 'ಒಂದು ಸೇಬು', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ಎರಡು', transliteration: 'eradu', meaning: 'Two', exampleSentence: 'ಎರಡು ಕಣ್ಣು', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ಮೂರು', transliteration: 'mooru', meaning: 'Three', exampleSentence: 'ಮೂರು ಹೂಗಳು', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ನಾಲ್ಕು', transliteration: 'naalku', meaning: 'Four', exampleSentence: 'ನಾಲ್ಕು ಕಾಲು', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ಐದು', transliteration: 'aidu', meaning: 'Five', exampleSentence: 'ಐದು ಬೆರಳು', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ಆರು', transliteration: 'aaru', meaning: 'Six', exampleSentence: 'ಆರು ತಿಂಗಳು', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ಏಳು', transliteration: 'elu', meaning: 'Seven', exampleSentence: 'ಏಳು ದಿನ', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ಎಂಟು', transliteration: 'entu', meaning: 'Eight', exampleSentence: 'ಎಂಟು ಕಾಲು', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ಒಂಬತ್ತು', transliteration: 'ombattu', meaning: 'Nine', exampleSentence: 'ಒಂಬತ್ತು ಗ್ರಹ', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ಹತ್ತು', transliteration: 'hattu', meaning: 'Ten', exampleSentence: 'ಹತ್ತು ಬೆರಳು', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Kannada', day: 4, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'ಕೆಂಪು', transliteration: 'kempu', meaning: 'Red', exampleSentence: 'ಕೆಂಪು ಗುಲಾಬಿ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ನೀಲಿ', transliteration: 'neeli', meaning: 'Blue', exampleSentence: 'ನೀಲಿ ಆಕಾಶ', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ಹಸಿರು', transliteration: 'hasiru', meaning: 'Green', exampleSentence: 'ಹಸಿರು ಎಲೆ', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ಹಳದಿ', transliteration: 'haladi', meaning: 'Yellow', exampleSentence: 'ಹಳದಿ ಸೂರ್ಯ', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ಬಿಳಿ', transliteration: 'bili', meaning: 'White', exampleSentence: 'ಬಿಳಿ ಹಾಲು', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ಕಪ್ಪು', transliteration: 'kappu', meaning: 'Black', exampleSentence: 'ಕಪ್ಪು ರಾತ್ರಿ', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ಕಿತ್ತಳೆ', transliteration: 'kittale', meaning: 'Orange', exampleSentence: 'ಕಿತ್ತಳೆ ಹಣ್ಣು', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ಗುಲಾಬಿ', transliteration: 'gulaabi', meaning: 'Pink', exampleSentence: 'ಗುಲಾಬಿ ಹೂ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ಕಂದು', transliteration: 'kandu', meaning: 'Brown', exampleSentence: 'ಕಂದು ಮಣ್ಣು', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ನೇರಳೆ', transliteration: 'nerale', meaning: 'Purple', exampleSentence: 'ನೇರಳೆ ದ್ರಾಕ್ಷಿ', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Kannada', day: 5, theme: 'Family Members', tasks: [
            { taskIndex: 0, word: 'ಅಮ್ಮ', transliteration: 'amma', meaning: 'Mother', exampleSentence: 'ನನ್ನ ಅಮ್ಮ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ಅಪ್ಪ', transliteration: 'appa', meaning: 'Father', exampleSentence: 'ನನ್ನ ಅಪ್ಪ', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ಅಣ್ಣ', transliteration: 'anna', meaning: 'Elder brother', exampleSentence: 'ನನ್ನ ಅಣ್ಣ', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ಅಕ್ಕ', transliteration: 'akka', meaning: 'Elder sister', exampleSentence: 'ನನ್ನ ಅಕ್ಕ', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ತಮ್ಮ', transliteration: 'tamma', meaning: 'Younger brother', exampleSentence: 'ನನ್ನ ತಮ್ಮ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ತಂಗಿ', transliteration: 'tangi', meaning: 'Younger sister', exampleSentence: 'ನನ್ನ ತಂಗಿ', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ತಾತ', transliteration: 'taata', meaning: 'Grandfather', exampleSentence: 'ನನ್ನ ತಾತ', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ಅಜ್ಜಿ', transliteration: 'ajji', meaning: 'Grandmother', exampleSentence: 'ನನ್ನ ಅಜ್ಜಿ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ಚಿಕ್ಕಪ್ಪ', transliteration: 'chikkappa', meaning: 'Uncle', exampleSentence: 'ನನ್ನ ಚಿಕ್ಕಪ್ಪ', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ಚಿಕ್ಕಮ್ಮ', transliteration: 'chikkamma', meaning: 'Aunt', exampleSentence: 'ನನ್ನ ಚಿಕ್ಕಮ್ಮ', difficulty: 'beginner' },
        ]
    },
];

const MALAYALAM = [
    {
        language: 'Malayalam', day: 1, theme: 'Vowels — അ to ഒ', tasks: [
            { taskIndex: 0, word: 'അ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'അമ്മ - Mother', difficulty: 'beginner' },
            { taskIndex: 1, word: 'ആ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'ആന - Elephant', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ഇ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'ഇല - Leaf', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ഈ', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ഈച്ച - Fly', difficulty: 'beginner' },
            { taskIndex: 4, word: 'ഉ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'ഉപ്പ് - Salt', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ഊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ഊര് - Village', difficulty: 'beginner' },
            { taskIndex: 6, word: 'എ', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'എലി - Mouse', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ഏ', transliteration: 'ee', meaning: 'Eighth vowel', exampleSentence: 'ഏണി - Ladder', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ഐ', transliteration: 'ai', meaning: 'Ninth vowel', exampleSentence: 'ഐശ്വര്യം - Prosperity', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ഒ', transliteration: 'o', meaning: 'Tenth vowel', exampleSentence: 'ഒട്ടകം - Camel', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Malayalam', day: 2, theme: 'Greetings', tasks: [
            { taskIndex: 0, word: 'നമസ്കാരം', transliteration: 'namaskaram', meaning: 'Hello', exampleSentence: 'നമസ്കാരം സർ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'നന്ദി', transliteration: 'nandi', meaning: 'Thank you', exampleSentence: 'വളരെ നന്ദി', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ക്ഷമിക്കണം', transliteration: 'kshamikkanum', meaning: 'Sorry', exampleSentence: 'ക്ഷമിക്കണം', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ശരി', transliteration: 'shari', meaning: 'OK', exampleSentence: 'ശരി പോകാം', difficulty: 'beginner' },
            { taskIndex: 4, word: 'അതെ', transliteration: 'athe', meaning: 'Yes', exampleSentence: 'അതെ വരും', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ഇല്ല', transliteration: 'illa', meaning: 'No', exampleSentence: 'ഇല്ല വരില്ല', difficulty: 'beginner' },
            { taskIndex: 6, word: 'സുഖമാണോ', transliteration: 'sukhamaano', meaning: 'How are you', exampleSentence: 'നിങ്ങൾക്ക് സുഖമാണോ', difficulty: 'beginner' },
            { taskIndex: 7, word: 'സുഖമാണ്', transliteration: 'sukhamaan', meaning: 'I am fine', exampleSentence: 'എനിക്ക് സുഖമാണ്', difficulty: 'beginner' },
            { taskIndex: 8, word: 'പേര് എന്താണ്', transliteration: 'peru enthaan', meaning: 'What is your name', exampleSentence: 'നിങ്ങളുടെ പേര്', difficulty: 'beginner' },
            { taskIndex: 9, word: 'എന്റെ പേര്', transliteration: 'ente peru', meaning: 'My name is', exampleSentence: 'എന്റെ പേര് രവി', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Malayalam', day: 3, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'ഒന്ന്', transliteration: 'onnu', meaning: 'One', exampleSentence: 'ഒന്ന് ആപ്പിൾ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'രണ്ട്', transliteration: 'randu', meaning: 'Two', exampleSentence: 'രണ്ട് കണ്ണ്', difficulty: 'beginner' },
            { taskIndex: 2, word: 'മൂന്ന്', transliteration: 'moonnu', meaning: 'Three', exampleSentence: 'മൂന്ന് പൂക്കൾ', difficulty: 'beginner' },
            { taskIndex: 3, word: 'നാല്', transliteration: 'naal', meaning: 'Four', exampleSentence: 'നാല് കാലുകൾ', difficulty: 'beginner' },
            { taskIndex: 4, word: 'അഞ്ച്', transliteration: 'anchu', meaning: 'Five', exampleSentence: 'അഞ്ച് വിരലുകൾ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ആറ്', transliteration: 'aaru', meaning: 'Six', exampleSentence: 'ആറ് മാസം', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ഏഴ്', transliteration: 'elu', meaning: 'Seven', exampleSentence: 'ഏഴ് ദിവസം', difficulty: 'beginner' },
            { taskIndex: 7, word: 'എട്ട്', transliteration: 'ettu', meaning: 'Eight', exampleSentence: 'എട്ട് കാലുകൾ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ഒൻപത്', transliteration: 'onpathu', meaning: 'Nine', exampleSentence: 'ഒൻപത് ഗ്രഹങ്ങൾ', difficulty: 'beginner' },
            { taskIndex: 9, word: 'പത്ത്', transliteration: 'pathu', meaning: 'Ten', exampleSentence: 'പത്ത് വിരലുകൾ', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Malayalam', day: 4, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'ചുവപ്പ്', transliteration: 'chuvappu', meaning: 'Red', exampleSentence: 'ചുവന്ന റോസ്', difficulty: 'beginner' },
            { taskIndex: 1, word: 'നീല്', transliteration: 'neela', meaning: 'Blue', exampleSentence: 'നീല ആകാശം', difficulty: 'beginner' },
            { taskIndex: 2, word: 'പച്ച', transliteration: 'pacha', meaning: 'Green', exampleSentence: 'പച്ച ഇല', difficulty: 'beginner' },
            { taskIndex: 3, word: 'മഞ്ഞ', transliteration: 'manja', meaning: 'Yellow', exampleSentence: 'മഞ്ഞ സൂര്യൻ', difficulty: 'beginner' },
            { taskIndex: 4, word: 'വെള്ള', transliteration: 'vella', meaning: 'White', exampleSentence: 'വെള്ള പാൽ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'കറുപ്പ്', transliteration: 'karuppu', meaning: 'Black', exampleSentence: 'കറുത്ത രാത്രി', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ഓറഞ്ച്', transliteration: 'oranchu', meaning: 'Orange', exampleSentence: 'ഓറഞ്ച് പഴം', difficulty: 'beginner' },
            { taskIndex: 7, word: 'പിങ്ക്', transliteration: 'pink', meaning: 'Pink', exampleSentence: 'പിങ്ക് പൂ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'തവിട്ട്', transliteration: 'thavittu', meaning: 'Brown', exampleSentence: 'തവിട്ട് മണ്ണ്', difficulty: 'beginner' },
            { taskIndex: 9, word: 'വയലറ്റ്', transliteration: 'violet', meaning: 'Purple', exampleSentence: 'വയലറ്റ് മുന്തിരി', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Malayalam', day: 5, theme: 'Family Members', tasks: [
            { taskIndex: 0, word: 'അമ്മ', transliteration: 'amma', meaning: 'Mother', exampleSentence: 'എന്റെ അമ്മ', difficulty: 'beginner' },
            { taskIndex: 1, word: 'അച്ഛൻ', transliteration: 'achhan', meaning: 'Father', exampleSentence: 'എന്റെ അച്ഛൻ', difficulty: 'beginner' },
            { taskIndex: 2, word: 'ചേട്ടൻ', transliteration: 'chettan', meaning: 'Elder brother', exampleSentence: 'എന്റെ ചേട്ടൻ', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ചേച്ചി', transliteration: 'chechi', meaning: 'Elder sister', exampleSentence: 'എന്റെ ചേച്ചി', difficulty: 'beginner' },
            { taskIndex: 4, word: 'അനിയൻ', transliteration: 'aniyan', meaning: 'Younger brother', exampleSentence: 'എന്റെ അനിയൻ', difficulty: 'beginner' },
            { taskIndex: 5, word: 'അനിയത്തി', transliteration: 'aniyathi', meaning: 'Younger sister', exampleSentence: 'എന്റെ അനിയത്തി', difficulty: 'beginner' },
            { taskIndex: 6, word: 'തോടൻ', transliteration: 'thodan', meaning: 'Grandfather', exampleSentence: 'എന്റെ തോടൻ', difficulty: 'beginner' },
            { taskIndex: 7, word: 'അമ்മൂമ്മ', transliteration: 'ammoomma', meaning: 'Grandmother', exampleSentence: 'എന്റെ അമ്മൂമ്മ', difficulty: 'beginner' },
            { taskIndex: 8, word: 'അമ്മാവൻ', transliteration: 'ammaavan', meaning: 'Uncle', exampleSentence: 'എന്റെ അമ്മാവൻ', difficulty: 'beginner' },
            { taskIndex: 9, word: 'അമ്മായി', transliteration: 'ammayi', meaning: 'Aunt', exampleSentence: 'എന്റെ അമ്മായി', difficulty: 'beginner' },
        ]
    },
];

const ENGLISH = [
    {
        language: 'English', day: 1, theme: 'Alphabet A-J', tasks: [
            { taskIndex: 0, word: 'Apple', transliteration: 'ae-pul', meaning: 'A fruit', exampleSentence: 'I eat an apple', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Ball', transliteration: 'bawl', meaning: 'Round toy', exampleSentence: 'Kick the ball', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Cat', transliteration: 'kat', meaning: 'Animal', exampleSentence: 'The cat sleeps', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Dog', transliteration: 'dawg', meaning: 'Animal', exampleSentence: 'The dog barks', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Elephant', transliteration: 'el-uh-funt', meaning: 'Big animal', exampleSentence: 'Elephant is big', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Fish', transliteration: 'fish', meaning: 'Water animal', exampleSentence: 'Fish swims', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Goat', transliteration: 'goht', meaning: 'Animal', exampleSentence: 'The goat eats', difficulty: 'beginner' },
            { taskIndex: 7, word: 'House', transliteration: 'hows', meaning: 'Home', exampleSentence: 'My house is big', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Ice', transliteration: 'ice', meaning: 'Frozen water', exampleSentence: 'Ice is cold', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Juice', transliteration: 'joos', meaning: 'Drink', exampleSentence: 'Drink the juice', difficulty: 'beginner' },
        ]
    },
    {
        language: 'English', day: 2, theme: 'Greetings', tasks: [
            { taskIndex: 0, word: 'Hello', transliteration: 'heh-loh', meaning: 'Greeting', exampleSentence: 'Hello sir', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Thank you', transliteration: 'thank yoo', meaning: 'Gratitude', exampleSentence: 'Thank you very much', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Sorry', transliteration: 'sor-ee', meaning: 'Apology', exampleSentence: 'I am sorry', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Please', transliteration: 'pleez', meaning: 'Request', exampleSentence: 'Please help me', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Yes', transliteration: 'yes', meaning: 'Agreement', exampleSentence: 'Yes I will come', difficulty: 'beginner' },
            { taskIndex: 5, word: 'No', transliteration: 'noh', meaning: 'Disagreement', exampleSentence: 'No I cannot', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Good morning', transliteration: 'good mor-ning', meaning: 'Morning greeting', exampleSentence: 'Good morning sir', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Good night', transliteration: 'good nite', meaning: 'Night greeting', exampleSentence: 'Good night everyone', difficulty: 'beginner' },
            { taskIndex: 8, word: 'How are you', transliteration: 'how ar yoo', meaning: 'Asking wellbeing', exampleSentence: 'How are you today', difficulty: 'beginner' },
            { taskIndex: 9, word: 'I am fine', transliteration: 'i am fine', meaning: 'Wellbeing response', exampleSentence: 'I am fine thank you', difficulty: 'beginner' },
        ]
    },
    {
        language: 'English', day: 3, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'One', transliteration: 'wun', meaning: '1', exampleSentence: 'One apple', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Two', transliteration: 'too', meaning: '2', exampleSentence: 'Two eyes', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Three', transliteration: 'three', meaning: '3', exampleSentence: 'Three flowers', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Four', transliteration: 'for', meaning: '4', exampleSentence: 'Four legs', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Five', transliteration: 'fiyv', meaning: '5', exampleSentence: 'Five fingers', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Six', transliteration: 'siks', meaning: '6', exampleSentence: 'Six months', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Seven', transliteration: 'sev-en', meaning: '7', exampleSentence: 'Seven days', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Eight', transliteration: 'ayt', meaning: '8', exampleSentence: 'Eight legs', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Nine', transliteration: 'niyn', meaning: '9', exampleSentence: 'Nine planets', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Ten', transliteration: 'ten', meaning: '10', exampleSentence: 'Ten fingers', difficulty: 'beginner' },
        ]
    },
    {
        language: 'English', day: 4, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'Red', transliteration: 'red', meaning: 'Color', exampleSentence: 'Red rose', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Blue', transliteration: 'bloo', meaning: 'Color', exampleSentence: 'Blue sky', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Green', transliteration: 'green', meaning: 'Color', exampleSentence: 'Green leaf', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Yellow', transliteration: 'yel-oh', meaning: 'Color', exampleSentence: 'Yellow sun', difficulty: 'beginner' },
            { taskIndex: 4, word: 'White', transliteration: 'wite', meaning: 'Color', exampleSentence: 'White milk', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Black', transliteration: 'blak', meaning: 'Color', exampleSentence: 'Black night', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Orange', transliteration: 'or-inj', meaning: 'Color', exampleSentence: 'Orange fruit', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Pink', transliteration: 'pink', meaning: 'Color', exampleSentence: 'Pink flower', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Brown', transliteration: 'brown', meaning: 'Color', exampleSentence: 'Brown soil', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Purple', transliteration: 'pur-pul', meaning: 'Color', exampleSentence: 'Purple grapes', difficulty: 'beginner' },
        ]
    },
    {
        language: 'English', day: 5, theme: 'Family Members', tasks: [
            { taskIndex: 0, word: 'Mother', transliteration: 'muth-er', meaning: 'Female parent', exampleSentence: 'My mother', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Father', transliteration: 'fah-ther', meaning: 'Male parent', exampleSentence: 'My father', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Brother', transliteration: 'bruth-er', meaning: 'Male sibling', exampleSentence: 'My brother', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Sister', transliteration: 'sis-ter', meaning: 'Female sibling', exampleSentence: 'My sister', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Grandfather', transliteration: 'grand-fah-ther', meaning: 'Fathers father', exampleSentence: 'My grandfather', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Grandmother', transliteration: 'grand-muth-er', meaning: 'Fathers mother', exampleSentence: 'My grandmother', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Uncle', transliteration: 'unk-ul', meaning: 'Parents brother', exampleSentence: 'My uncle', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Aunt', transliteration: 'ant', meaning: 'Parents sister', exampleSentence: 'My aunt', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Son', transliteration: 'sun', meaning: 'Male child', exampleSentence: 'My son', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Daughter', transliteration: 'daw-ter', meaning: 'Female child', exampleSentence: 'My daughter', difficulty: 'beginner' },
        ]
    },
];

const FRENCH = [
    {
        language: 'French', day: 1, theme: 'Greetings', tasks: [
            { taskIndex: 0, word: 'Bonjour', transliteration: 'bon-zhoor', meaning: 'Hello', exampleSentence: 'Bonjour monsieur', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Merci', transliteration: 'mair-see', meaning: 'Thank you', exampleSentence: 'Merci beaucoup', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Oui', transliteration: 'wee', meaning: 'Yes', exampleSentence: 'Oui je viens', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Non', transliteration: 'nohn', meaning: 'No', exampleSentence: 'Non je ne viens pas', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Pardon', transliteration: 'par-dohn', meaning: 'Sorry', exampleSentence: 'Pardon monsieur', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Bonsoir', transliteration: 'bon-swaar', meaning: 'Good evening', exampleSentence: 'Bonsoir madame', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Au revoir', transliteration: 'oh ruh-vwaar', meaning: 'Goodbye', exampleSentence: 'Au revoir', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Comment allez-vous', transliteration: 'kom-mohn ta-lay voo', meaning: 'How are you', exampleSentence: 'Comment allez-vous', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Je vais bien', transliteration: 'zhuh vay byan', meaning: 'I am fine', exampleSentence: 'Je vais bien merci', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Bonne nuit', transliteration: 'bon nwee', meaning: 'Good night', exampleSentence: 'Bonne nuit', difficulty: 'beginner' },
        ]
    },
    {
        language: 'French', day: 2, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'Un', transliteration: 'uhn', meaning: 'One', exampleSentence: 'Un pomme', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Deux', transliteration: 'duh', meaning: 'Two', exampleSentence: 'Deux yeux', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Trois', transliteration: 'trwah', meaning: 'Three', exampleSentence: 'Trois fleurs', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Quatre', transliteration: 'katr', meaning: 'Four', exampleSentence: 'Quatre pattes', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Cinq', transliteration: 'sank', meaning: 'Five', exampleSentence: 'Cinq doigts', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Six', transliteration: 'sees', meaning: 'Six', exampleSentence: 'Six mois', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Sept', transliteration: 'set', meaning: 'Seven', exampleSentence: 'Sept jours', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Huit', transliteration: 'weet', meaning: 'Eight', exampleSentence: 'Huit pattes', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Neuf', transliteration: 'nuhf', meaning: 'Nine', exampleSentence: 'Neuf planetes', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Dix', transliteration: 'dees', meaning: 'Ten', exampleSentence: 'Dix doigts', difficulty: 'beginner' },
        ]
    },
    {
        language: 'French', day: 3, theme: 'Colors', tasks: [
            { taskIndex: 0, word: 'Rouge', transliteration: 'roozh', meaning: 'Red', exampleSentence: 'Rose rouge', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Bleu', transliteration: 'bluh', meaning: 'Blue', exampleSentence: 'Ciel bleu', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Vert', transliteration: 'vair', meaning: 'Green', exampleSentence: 'Feuille verte', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Jaune', transliteration: 'zhohn', meaning: 'Yellow', exampleSentence: 'Soleil jaune', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Blanc', transliteration: 'blahn', meaning: 'White', exampleSentence: 'Lait blanc', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Noir', transliteration: 'nwaar', meaning: 'Black', exampleSentence: 'Nuit noire', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Orange', transliteration: 'oh-rahnzh', meaning: 'Orange', exampleSentence: 'Fruit orange', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Rose', transliteration: 'rohz', meaning: 'Pink', exampleSentence: 'Fleur rose', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Marron', transliteration: 'ma-rohn', meaning: 'Brown', exampleSentence: 'Terre marron', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Violet', transliteration: 'vyo-lay', meaning: 'Purple', exampleSentence: 'Raisin violet', difficulty: 'beginner' },
        ]
    },
    {
        language: 'French', day: 4, theme: 'Family Members', tasks: [
            { taskIndex: 0, word: 'Mere', transliteration: 'mair', meaning: 'Mother', exampleSentence: 'Ma mere', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Pere', transliteration: 'pair', meaning: 'Father', exampleSentence: 'Mon pere', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Frere', transliteration: 'frair', meaning: 'Brother', exampleSentence: 'Mon frere', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Soeur', transliteration: 'sur', meaning: 'Sister', exampleSentence: 'Ma soeur', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Grand-pere', transliteration: 'grahn-pair', meaning: 'Grandfather', exampleSentence: 'Mon grand-pere', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Grand-mere', transliteration: 'grahn-mair', meaning: 'Grandmother', exampleSentence: 'Ma grand-mere', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Oncle', transliteration: 'onkl', meaning: 'Uncle', exampleSentence: 'Mon oncle', difficulty: 'beginner' },
            { taskIndex: 7, word: 'Tante', transliteration: 'tahnt', meaning: 'Aunt', exampleSentence: 'Ma tante', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Fils', transliteration: 'fees', meaning: 'Son', exampleSentence: 'Mon fils', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Fille', transliteration: 'fee', meaning: 'Daughter', exampleSentence: 'Ma fille', difficulty: 'beginner' },
        ]
    },
    {
        language: 'French', day: 5, theme: 'Animals', tasks: [
            { taskIndex: 0, word: 'Chat', transliteration: 'shah', meaning: 'Cat', exampleSentence: 'Le chat dort', difficulty: 'beginner' },
            { taskIndex: 1, word: 'Chien', transliteration: 'shyan', meaning: 'Dog', exampleSentence: 'Le chien aboie', difficulty: 'beginner' },
            { taskIndex: 2, word: 'Vache', transliteration: 'vash', meaning: 'Cow', exampleSentence: 'La vache mange', difficulty: 'beginner' },
            { taskIndex: 3, word: 'Oiseau', transliteration: 'wah-zoh', meaning: 'Bird', exampleSentence: 'L oiseau chante', difficulty: 'beginner' },
            { taskIndex: 4, word: 'Poisson', transliteration: 'pwah-sohn', meaning: 'Fish', exampleSentence: 'Le poisson nage', difficulty: 'beginner' },
            { taskIndex: 5, word: 'Cheval', transliteration: 'shuh-val', meaning: 'Horse', exampleSentence: 'Le cheval court', difficulty: 'beginner' },
            { taskIndex: 6, word: 'Lion', transliteration: 'lyohn', meaning: 'Lion', exampleSentence: 'Le lion rugit', difficulty: 'beginner' },
            { taskIndex: 7, word: 'elephant', transliteration: 'ay-lay-fahn', meaning: 'Elephant', exampleSentence: 'L elephant est grand', difficulty: 'beginner' },
            { taskIndex: 8, word: 'Lapin', transliteration: 'la-pan', meaning: 'Rabbit', exampleSentence: 'Le lapin saute', difficulty: 'beginner' },
            { taskIndex: 9, word: 'Tigre', transliteration: 'teegr', meaning: 'Tiger', exampleSentence: 'Le tigre court', difficulty: 'beginner' },
        ]
    },
];

const SANSKRIT = [
    {
        language: 'Sanskrit', day: 1, theme: 'Vowels — अ to औ', tasks: [
            { taskIndex: 0, word: 'अ', transliteration: 'a', meaning: 'First vowel', exampleSentence: 'अकारः - The letter A', difficulty: 'beginner' },
            { taskIndex: 1, word: 'आ', transliteration: 'aa', meaning: 'Second vowel', exampleSentence: 'आम्रः - Mango', difficulty: 'beginner' },
            { taskIndex: 2, word: 'इ', transliteration: 'i', meaning: 'Third vowel', exampleSentence: 'इन्दुः - Moon', difficulty: 'beginner' },
            { taskIndex: 3, word: 'ई', transliteration: 'ii', meaning: 'Fourth vowel', exampleSentence: 'ईश्वरः - God', difficulty: 'beginner' },
            { taskIndex: 4, word: 'उ', transliteration: 'u', meaning: 'Fifth vowel', exampleSentence: 'उषः - Dawn', difficulty: 'beginner' },
            { taskIndex: 5, word: 'ऊ', transliteration: 'uu', meaning: 'Sixth vowel', exampleSentence: 'ऊर्जा - Energy', difficulty: 'beginner' },
            { taskIndex: 6, word: 'ए', transliteration: 'e', meaning: 'Seventh vowel', exampleSentence: 'एकः - One', difficulty: 'beginner' },
            { taskIndex: 7, word: 'ऐ', transliteration: 'ai', meaning: 'Eighth vowel', exampleSentence: 'ऐरावतः - Indras elephant', difficulty: 'beginner' },
            { taskIndex: 8, word: 'ओ', transliteration: 'o', meaning: 'Ninth vowel', exampleSentence: 'ओजः - Strength', difficulty: 'beginner' },
            { taskIndex: 9, word: 'औ', transliteration: 'au', meaning: 'Tenth vowel', exampleSentence: 'औषधम् - Medicine', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Sanskrit', day: 2, theme: 'Basic Words', tasks: [
            { taskIndex: 0, word: 'नमस्ते', transliteration: 'namaste', meaning: 'Hello', exampleSentence: 'नमस्ते मित्र', difficulty: 'beginner' },
            { taskIndex: 1, word: 'धन्यवादः', transliteration: 'dhanyavaadah', meaning: 'Thank you', exampleSentence: 'बहु धन्यवादः', difficulty: 'beginner' },
            { taskIndex: 2, word: 'आम्', transliteration: 'aam', meaning: 'Yes', exampleSentence: 'आम् अहम् आगच्छामि', difficulty: 'beginner' },
            { taskIndex: 3, word: 'न', transliteration: 'na', meaning: 'No', exampleSentence: 'न अहम् आगच्छामि', difficulty: 'beginner' },
            { taskIndex: 4, word: 'क्षमस्व', transliteration: 'kshamasva', meaning: 'Sorry', exampleSentence: 'क्षमस्व मित्र', difficulty: 'beginner' },
            { taskIndex: 5, word: 'शुभम्', transliteration: 'shubham', meaning: 'Good', exampleSentence: 'शुभम् भवतु', difficulty: 'beginner' },
            { taskIndex: 6, word: 'अहम्', transliteration: 'aham', meaning: 'I', exampleSentence: 'अहम् छात्रः', difficulty: 'beginner' },
            { taskIndex: 7, word: 'त्वम्', transliteration: 'tvam', meaning: 'You', exampleSentence: 'त्वम् कः', difficulty: 'beginner' },
            { taskIndex: 8, word: 'किम्', transliteration: 'kim', meaning: 'What', exampleSentence: 'किम् नाम ते', difficulty: 'beginner' },
            { taskIndex: 9, word: 'ओम्', transliteration: 'om', meaning: 'Sacred sound', exampleSentence: 'ओम् शान्तिः', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Sanskrit', day: 3, theme: 'Numbers 1-10', tasks: [
            { taskIndex: 0, word: 'एकम्', transliteration: 'ekam', meaning: 'One', exampleSentence: 'एकम् फलम्', difficulty: 'beginner' },
            { taskIndex: 1, word: 'द्वे', transliteration: 'dve', meaning: 'Two', exampleSentence: 'द्वे नेत्रे', difficulty: 'beginner' },
            { taskIndex: 2, word: 'त्रीणि', transliteration: 'treeni', meaning: 'Three', exampleSentence: 'त्रीणि पुष्पाणि', difficulty: 'beginner' },
            { taskIndex: 3, word: 'चत्वारि', transliteration: 'chatvaari', meaning: 'Four', exampleSentence: 'चत्वारि पादाः', difficulty: 'beginner' },
            { taskIndex: 4, word: 'पञ्च', transliteration: 'pancha', meaning: 'Five', exampleSentence: 'पञ्च अङ्गुलयः', difficulty: 'beginner' },
            { taskIndex: 5, word: 'षट्', transliteration: 'shat', meaning: 'Six', exampleSentence: 'षट् मासाः', difficulty: 'beginner' },
            { taskIndex: 6, word: 'सप्त', transliteration: 'sapta', meaning: 'Seven', exampleSentence: 'सप्त दिनानि', difficulty: 'beginner' },
            { taskIndex: 7, word: 'अष्ट', transliteration: 'ashta', meaning: 'Eight', exampleSentence: 'अष्ट पादाः', difficulty: 'beginner' },
            { taskIndex: 8, word: 'नव', transliteration: 'nava', meaning: 'Nine', exampleSentence: 'नव ग्रहाः', difficulty: 'beginner' },
            { taskIndex: 9, word: 'दश', transliteration: 'dasha', meaning: 'Ten', exampleSentence: 'दश अङ्गुलयः', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Sanskrit', day: 4, theme: 'Nature Words', tasks: [
            { taskIndex: 0, word: 'सूर्यः', transliteration: 'suryah', meaning: 'Sun', exampleSentence: 'सूर्यः उदेति', difficulty: 'beginner' },
            { taskIndex: 1, word: 'चन्द्रः', transliteration: 'chandrah', meaning: 'Moon', exampleSentence: 'चन्द्रः शोभते', difficulty: 'beginner' },
            { taskIndex: 2, word: 'जलम्', transliteration: 'jalam', meaning: 'Water', exampleSentence: 'जलम् पिब', difficulty: 'beginner' },
            { taskIndex: 3, word: 'वायुः', transliteration: 'vaayuh', meaning: 'Air', exampleSentence: 'वायुः वाति', difficulty: 'beginner' },
            { taskIndex: 4, word: 'अग्निः', transliteration: 'agnih', meaning: 'Fire', exampleSentence: 'अग्निः ज्वलति', difficulty: 'beginner' },
            { taskIndex: 5, word: 'पृथ्वी', transliteration: 'prithvee', meaning: 'Earth', exampleSentence: 'पृथ्वी वर्तुला', difficulty: 'beginner' },
            { taskIndex: 6, word: 'आकाशः', transliteration: 'aakashah', meaning: 'Sky', exampleSentence: 'आकाशः नीलः', difficulty: 'beginner' },
            { taskIndex: 7, word: 'वृक्षः', transliteration: 'vriksah', meaning: 'Tree', exampleSentence: 'वृक्षः महान्', difficulty: 'beginner' },
            { taskIndex: 8, word: 'पुष्पम्', transliteration: 'pushpam', meaning: 'Flower', exampleSentence: 'पुष्पम् सुन्दरम्', difficulty: 'beginner' },
            { taskIndex: 9, word: 'फलम्', transliteration: 'phalam', meaning: 'Fruit', exampleSentence: 'फलम् मधुरम्', difficulty: 'beginner' },
        ]
    },
    {
        language: 'Sanskrit', day: 5, theme: 'Body Parts', tasks: [
            { taskIndex: 0, word: 'शिरः', transliteration: 'shirah', meaning: 'Head', exampleSentence: 'शिरः उपरि', difficulty: 'beginner' },
            { taskIndex: 1, word: 'नेत्रम्', transliteration: 'netram', meaning: 'Eye', exampleSentence: 'नेत्रम् पश्यति', difficulty: 'beginner' },
            { taskIndex: 2, word: 'नासिका', transliteration: 'naasika', meaning: 'Nose', exampleSentence: 'नासिका घ्राति', difficulty: 'beginner' },
            { taskIndex: 3, word: 'मुखम्', transliteration: 'mukham', meaning: 'Mouth', exampleSentence: 'मुखम् भाषते', difficulty: 'beginner' },
            { taskIndex: 4, word: 'कर्णः', transliteration: 'karnah', meaning: 'Ear', exampleSentence: 'कर्णः शृणोति', difficulty: 'beginner' },
            { taskIndex: 5, word: 'हस्तः', transliteration: 'hastah', meaning: 'Hand', exampleSentence: 'हस्तः स्पृशति', difficulty: 'beginner' },
            { taskIndex: 6, word: 'पादः', transliteration: 'paadah', meaning: 'Foot', exampleSentence: 'पादः चलति', difficulty: 'beginner' },
            { taskIndex: 7, word: 'हृदयम्', transliteration: 'hridayam', meaning: 'Heart', exampleSentence: 'हृदयम् स्पन्दते', difficulty: 'beginner' },
            { taskIndex: 8, word: 'उदरम्', transliteration: 'udaram', meaning: 'Stomach', exampleSentence: 'उदरम् क्षुधितम्', difficulty: 'beginner' },
            { taskIndex: 9, word: 'मस्तिष्कम्', transliteration: 'mastishkam', meaning: 'Brain', exampleSentence: 'मस्तिष्कम् चिन्तयति', difficulty: 'beginner' },
        ]
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const allLanguages = ['Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Sanskrit', 'English', 'French'];
        await Curriculum.deleteMany({ language: { $in: allLanguages } });
        console.log('🗑️ Cleared existing curriculum data');

        const allData = [...TAMIL, ...HINDI, ...TELUGU, ...KANNADA, ...MALAYALAM, ...SANSKRIT, ...ENGLISH, ...FRENCH];

        await Curriculum.insertMany(allData);

        console.log('\n✅ SEED COMPLETE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🌺 Tamil     — Days 1-5');
        console.log('🪷 Hindi     — Days 1-5');
        console.log('🌸 Telugu    — Days 1-5');
        console.log('🌼 Kannada   — Days 1-5');
        console.log('🌴 Malayalam — Days 1-5');
        console.log('📿 Sanskrit  — Days 1-5');
        console.log('🌍 English   — Days 1-5');
        console.log('🥐 French    — Days 1-5');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📚 Total: ${allData.length} days seeded!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seed();