# 🇮🇩 Indonesian Language Learning App

> **Speak Indonesian in 30 Days** - A comprehensive language learning application using the SVO (Subject-Verb-Object) methodology with 100 core verbs.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Learning Methodology](#learning-methodology)
- [Project Structure](#project-structure)
- [Data Architecture](#data-architecture)
- [Core Engines](#core-engines)
- [16-Week Curriculum](#16-week-curriculum)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [Audio Generation](#audio-generation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This Indonesian language learning application is designed to teach conversational Indonesian efficiently using proven language acquisition techniques. The app focuses on **practical communication** through:

- **100 Essential Verbs** - The building blocks of Indonesian sentences
- **30 Key Patterns** - Core sentence structures for everyday communication
- **SVO Structure** - Simple, intuitive sentence construction
- **16-Week Program** - Structured path from beginner to conversational fluency
- **Real-life Scenarios** - Practice with authentic dialogues
- **Spaced Repetition** - Scientifically proven memory retention
- **Gamification** - Engaging learning experience with achievements and progress tracking

---

## ✨ Key Features

### 🎓 Learning Features

- **Progressive Curriculum**: 16-week structured program (48 lessons)
- **SVO Sentence Constructor**: Interactive tool to build sentences
- **100 Verb Mastery System**: Categorized verb learning with examples
- **30 Core Patterns**: From basic statements to complex conditionals
- **400+ Vocabulary Words**: Organized by categories and context
- **30+ Real-life Scenarios**: Dialogues for practical situations
- **Spaced Repetition System (SRS)**: Optimized review scheduling
- **Audio Pronunciation**: Native speaker audio for all content

### 📊 Progress Tracking

- **XP & Leveling System**: Earn experience points and level up
- **Achievement Badges**: 18+ achievements to unlock
- **Streak Tracking**: Daily study motivation
- **Detailed Statistics**: Track accuracy, time, and progress
- **Verb Matrix**: Visual overview of 100-verb mastery
- **Weekly Roadmap**: See your journey through the program

### 🎮 Gamification

- **Daily Challenges**: Quick 5-minute workouts
- **Rewards System**: XP, badges, and level-ups
- **Study Streaks**: Build consistent learning habits
- **Progress Milestones**: Celebrate key achievements
- **Leaderboards**: (Optional) Compete with friends

---

## 📚 Learning Methodology

### SVO Structure
Indonesian uses a simple **Subject-Verb-Object** structure, making it ideal for rapid language acquisition:

```
Saya makan nasi
  ↓    ↓     ↓
  S    V     O
  I   eat   rice
```

### 100 Core Verbs
The foundation of the app is 100 carefully selected verbs that cover:
- Daily actions (eat, drink, sleep, work)
- Movement (go, come, enter, exit)
- Communication (speak, ask, answer, call)
- Mental states (know, remember, think, understand)
- Emotions (like, love, happy, sad)
- And more...

### 30 Key Patterns
Master sentence patterns that unlock thousands of phrases:
- `Saya mau [X]` - I want [X]
- `Saya bisa [X]` - I can [X]
- `Ada [X] di [Y]` - There is [X] at [Y]
- `Di mana [X]?` - Where is [X]?
- And 26 more essential patterns...

### Spaced Repetition
Uses the **SM-2 algorithm** to optimize review timing:
- New material introduced gradually
- Reviews scheduled at optimal intervals
- Difficulty-based adjustments
- Long-term retention focus

---

## 📁 Project Structure

```
indonesian-learning-app/
├── src/
│   ├── data/
│   │   ├── verbs.json           # 100 verbs with examples
│   │   ├── patterns.json        # 30 sentence patterns
│   │   ├── vocabulary.json      # 400+ words by category
│   │   ├── curriculum.json      # 16-week program
│   │   └── scenarios.json       # Real-life dialogues
│   │
│   ├── engine/
│   │   ├── svo-constructor.js   # Sentence building engine
│   │   ├── srs-system.js        # Spaced repetition logic
│   │   └── progress-tracker.js  # Progress & gamification
│   │
│   ├── components/              # UI components (to be implemented)
│   ├── screens/                 # App screens (to be implemented)
│   ├── utils/                   # Utility functions
│   └── styles/                  # Styling
│
├── public/
│   └── audio/                   # Audio files (to be generated)
│       ├── verbs/
│       └── vocab/
│
├── docs/
│   ├── UI_SCREENS.md           # Complete UI documentation
│   └── METHODOLOGY.md          # Learning methodology details
│
├── scripts/
│   └── generate-audio.js       # Google TTS audio generation
│
└── README.md
```

---

## 🗂️ Data Architecture

### Verbs Database (`verbs.json`)

Each verb includes:
```json
{
  "id": 1,
  "indonesian": "makan",
  "english": "to eat",
  "category": "daily_actions",
  "difficulty": 1,
  "examples": [
    {
      "indonesian": "Saya makan nasi",
      "english": "I eat rice",
      "svo": { "subject": "Saya", "verb": "makan", "object": "nasi" }
    }
  ],
  "audio": "/audio/verbs/makan.mp3"
}
```

**Categories:**
- `daily_actions` - Everyday activities
- `movement` - Going places
- `communication` - Speaking and interacting
- `mental` - Thinking and knowing
- `emotion` - Feelings and states
- `leisure` - Entertainment and hobbies
- `health` - Medical and wellness
- `life_events` - Major life milestones

### Patterns Database (`patterns.json`)

Each pattern includes:
```json
{
  "id": 1,
  "pattern": "Saya [verb]",
  "english": "I [verb]",
  "description": "Basic statement with 'I'",
  "difficulty": 1,
  "week": 1,
  "examples": [
    { "indonesian": "Saya makan", "english": "I eat" },
    { "indonesian": "Saya minum", "english": "I drink" }
  ]
}
```

### Vocabulary Database (`vocabulary.json`)

Organized by categories:
- Pronouns (saya, kamu, dia, kami, mereka)
- Food & Drinks (nasi, kopi, air, ayam)
- Numbers (satu, dua, tiga, ...)
- Time (pagi, siang, malam, hari, minggu)
- Places (rumah, hotel, restoran, pasar)
- Directions (kanan, kiri, lurus, dekat)
- Adjectives (besar, kecil, bagus, enak)
- Family (keluarga, ayah, ibu, anak)
- Transportation (mobil, bus, taksi, pesawat)
- Shopping (harga, uang, beli, jual)
- Body Parts (kepala, tangan, kaki, mata)
- Health (sakit, dokter, obat, sehat)
- Work & Professions (guru, dokter, kerja)
- Common Words (ya, tidak, ada, apa, siapa)
- Greetings (halo, selamat pagi, terima kasih)
- Colors (merah, biru, hijau, putih)

### Curriculum Database (`curriculum.json`)

16 weeks × 3 lessons = **48 total lessons**

Each week includes:
- Learning objectives
- Topics covered
- Verb IDs to practice
- Pattern IDs to master
- Vocabulary categories
- Daily lesson plans with exercises

### Scenarios Database (`scenarios.json`)

30+ real-life dialogues:
- Meeting someone
- Ordering at cafe
- Asking directions
- Shopping & bargaining
- Hotel check-in
- Taking taxi
- At the doctor
- Restaurant ordering
- Making plans
- And more...

---

## ⚙️ Core Engines

### 1. SVO Constructor (`svo-constructor.js`)

Build sentences interactively:

```javascript
const constructor = new SVOConstructor(verbsData, vocabularyData);

// Build basic sentence
const sentence = constructor.buildSentence('Saya', 1, 'nasi');
// → "Saya makan nasi" (I eat rice)

// Build with negation
const negative = constructor.buildNegativeSentence('Dia', 2, 'kopi');
// → "Dia tidak minum kopi" (He/She doesn't drink coffee)

// Build with tense
const past = constructor.buildTenseSentence('Kami', 3, 'ke pasar', 'sudah');
// → "Kami sudah pergi ke pasar" (We have gone to the market)

// Generate practice sentence
const practice = constructor.generatePracticeSentence(7, { withNegation: true });
```

**Features:**
- Sentence generation from components
- Negation support
- Tense markers (sudah, akan, sedang, belum)
- Location phrases
- Random practice generation
- Sentence validation

### 2. SRS System (`srs-system.js`)

Spaced repetition based on SM-2 algorithm:

```javascript
const srs = new SRSSystem();

// Create flashcard
const card = srs.createCard(1, 'verb', {
  indonesian: 'makan',
  english: 'to eat',
  sentence: 'Saya makan nasi'
});

// Review card
const updated = srs.reviewCard(card, 'good');
// → Card scheduled for next review

// Get due cards
const due = srs.getDueCards(allCards);

// Get statistics
const stats = srs.getStatistics(allCards);
```

**Features:**
- Card states: new, learning, review, relearning
- Four rating levels: again, hard, good, easy
- Adaptive intervals based on performance
- Ease factor adjustments
- Retention rate tracking
- Review forecasting
- Study streak calculation
- Data export/import

### 3. Progress Tracker (`progress-tracker.js`)

Track learning progress and provide motivation:

```javascript
const tracker = new ProgressTracker();

// Create user profile
const profile = tracker.createUserProfile(userId, {
  purpose: 'travel',
  dailyMinutes: 10,
  targetDate: '2024-12-31'
});

// Complete lesson
const result = tracker.completeLesson(profile, { week: 1, day: 1, lessonId: 'w1d1' });
// → Returns: { userProfile, rewards: { xp, levelUp, newAchievements } }

// Track verb mastery
const verbProgress = tracker.trackVerbProgress(profile, verbId, 90);

// Start/end study session
const session = tracker.startStudySession(profile);
// ... study ...
const sessionResult = tracker.endStudySession(profile, session);

// Get comprehensive statistics
const stats = tracker.getStatistics(profile);
```

**Features:**
- XP and leveling system
- 18+ unlockable achievements
- Verb/pattern mastery tracking
- Study time tracking
- Daily goal monitoring
- Streak maintenance
- Milestone detection
- Session management
- Detailed analytics

---

## 📅 16-Week Curriculum

### Week 1: Getting Started
- Basic greetings & pronouns
- Simple statements: "Saya makan"
- Expressing wants: "Saya mau kopi"
- Ability: "Saya bisa..."

### Week 2: Likes & Negation
- Preferences: "Saya suka..."
- Negation: "Saya tidak..."
- Questions: "Ada...?"
- Numbers 1-100

### Week 3: Places & Questions
- Locations: "Ada X di Y"
- Asking: "Di mana...?"
- Prices: "Berapa...?"
- Directions

### Week 4: Time & Movement
- Time expressions
- "Kapan?" and "Jam berapa?"
- Going places: "Saya pergi ke..."
- Transportation

### Weeks 5-8: Building Complexity
- Describing things with adjectives
- Polite requests & commands
- Future tense: "Saya akan..."
- Progressive: "Saya sedang..."
- Past: "Saya sudah..."

### Weeks 9-12: Advanced Structures
- Comparisons: "Lebih besar dari..."
- Superlatives: "Paling enak"
- Conditionals: "Kalau..., ..."
- Reasons: "Karena..."
- Purpose & method

### Weeks 13-16: Real-world Application
- Hotel & accommodation
- Restaurants & food ordering
- Shopping & bargaining
- Comprehensive review
- Free conversation practice

**Total: 48 lessons, 100 verbs, 30 patterns, 400+ words**

---

## 🛠️ Technical Stack

### Recommended Technologies

**Frontend:**
- React Native (cross-platform mobile)
- React (web version)
- TypeScript (type safety)

**State Management:**
- Redux or Zustand
- AsyncStorage (React Native)
- LocalStorage (web)

**UI Components:**
- React Native Paper or Native Base
- Tailwind CSS (web)
- Custom animations (react-native-reanimated)

**Audio:**
- Google Cloud Text-to-Speech API
- react-native-sound or expo-av
- Web Audio API (browser)

**Data Storage:**
- SQLite (local database)
- AsyncStorage (preferences)
- Cloud backup (Firebase/Supabase)

**Analytics:**
- Custom progress tracking (built-in)
- Optional: Firebase Analytics
- Optional: Mixpanel

---

## 🚀 Getting Started

### Prerequisites

```bash
- Node.js 16+
- npm or yarn
- React Native CLI (for mobile)
- Google Cloud account (for TTS)
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/indonesian-learning-app
cd indonesian-learning-app

# Install dependencies
npm install

# Generate audio files (requires Google Cloud setup)
npm run generate-audio

# Run development server (web)
npm run dev

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Configuration

1. **Google Cloud TTS Setup:**
   ```bash
   # Install Google Cloud SDK
   # Create service account
   # Download credentials JSON
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
   ```

2. **Environment Variables:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   TTS_VOICE_NAME=id-ID-Wavenet-A
   TTS_LANGUAGE_CODE=id-ID
   ```

---

## 🎤 Audio Generation

The app requires audio files for all verbs and vocabulary words.

### Option 1: Google Cloud Text-to-Speech (Recommended)

```bash
# Run audio generation script
npm run generate-audio
```

This will:
- Read all verbs from `verbs.json`
- Read all vocabulary from `vocabulary.json`
- Generate MP3 files using Google TTS (id-ID-Wavenet voices)
- Save to `public/audio/` directory
- Update file paths in JSON

**Voices available:**
- `id-ID-Wavenet-A` (Female)
- `id-ID-Wavenet-B` (Male)
- `id-ID-Wavenet-C` (Male)
- `id-ID-Wavenet-D` (Female)

**Cost:** $16 per 1 million characters after 1M free per month

### Option 2: Web Speech API (Free, Browser-only)

```javascript
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance("Saya mau kopi");
utterance.lang = 'id-ID';
synth.speak(utterance);
```

**Pros:** Free, no setup
**Cons:** Quality varies, browser-dependent, requires internet

### Option 3: Pre-recorded Audio

Record native speakers and place MP3 files in:
- `public/audio/verbs/[verb-name].mp3`
- `public/audio/vocab/[word-name].mp3`

---

## 📱 App Screens

See [UI_SCREENS.md](./docs/UI_SCREENS.md) for complete documentation of all screens, including:

- Onboarding flow
- Main dashboard
- Lesson screens
- Practice modes
- Progress tracking
- Settings & profile
- And more...

---

## 🎯 Learning Outcomes

After completing the 16-week program, users will be able to:

✅ **Understand and use 100 core Indonesian verbs**
✅ **Construct sentences using 30 key patterns**
✅ **Recognize and use 400+ common words**
✅ **Hold basic conversations** in real-life scenarios
✅ **Order food and drinks** at restaurants
✅ **Ask for directions** and navigate cities
✅ **Shop and bargain** at markets
✅ **Check into hotels** and request services
✅ **Handle travel situations** with confidence
✅ **Express thoughts, feelings, and intentions**
✅ **Understand spoken Indonesian** in common contexts

**Target Level:** A2-B1 (CEFR) - Conversational fluency

---

## 🔮 Future Enhancements

### Phase 2: Enhanced Features
- [ ] Speech recognition (pronunciation practice)
- [ ] Writing practice with keyboard input
- [ ] AI conversation partner
- [ ] Community forums
- [ ] User-generated content

### Phase 3: Advanced Features
- [ ] Live tutoring integration
- [ ] Cultural notes & tips
- [ ] Regional dialects
- [ ] Business Indonesian module
- [ ] Advanced grammar deep-dives

### Phase 4: Expansion
- [ ] Indonesian → Other languages
- [ ] Kids version
- [ ] Classroom mode (teacher dashboard)
- [ ] Corporate training packages
- [ ] API for third-party integration

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Areas for Contribution

- **Content**: Add more verbs, patterns, vocabulary, scenarios
- **Audio**: Record native speaker audio
- **UI/UX**: Design improvements and animations
- **Features**: Implement new learning modes
- **Translations**: Add interface translations
- **Testing**: Write unit and integration tests
- **Documentation**: Improve docs and tutorials

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Indonesian language experts and native speakers
- Language learning research community
- Open source contributors
- Beta testers and early users

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/indonesian-learning-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/indonesian-learning-app/discussions)
- **Email**: support@indonesianapp.com
- **Twitter**: @IndonesianApp

---

## 🌟 Show Your Support

If this project helps you learn Indonesian, please give it a ⭐️ on GitHub!

---

**Selamat belajar!** (Happy learning!) 🎉

---

*Built with ❤️ for Indonesian language learners worldwide*
