# 📱 Indonesian Learning App - UI Screens Documentation

## Overview
This document describes all screens in the Indonesian language learning application and their functionality.

---

## 🎯 1. Onboarding Flow

### 1.1 Welcome Screen
**Purpose:** First impression and value proposition

**Elements:**
- App logo
- Tagline: "Speak Indonesian in 30 Days"
- Animation: Simple Indonesian greeting
- CTA Button: "Get Started"

**User Action:** Tap to start onboarding

---

### 1.2 Goal Selection
**Purpose:** Understand user motivation

**Question:** "Why do you want to learn Indonesian?"

**Options:**
- 🌴 Travel & Tourism
- 💼 Work & Business
- 👥 Friends & Family
- 🎨 Culture & Interest

**User Action:** Select one option → Continue

---

### 1.3 Time Commitment
**Purpose:** Set daily study goal

**Question:** "How much time can you dedicate daily?"

**Options:**
- 5 minutes/day (Casual)
- 10 minutes/day (Steady)
- 20 minutes/day (Intensive)

**User Action:** Select time → Continue

---

### 1.4 First Lesson Preview
**Purpose:** Show immediate value

**Elements:**
- Text: "Your first phrase:"
- Indonesian: "Saya mau kopi" (large, with audio button)
- English: "I want coffee"
- Pronunciation guide
- Audio playback button

**User Action:** Tap audio, then "Start Learning" → Main App

---

## 🏠 2. Main Dashboard

### 2.1 Home Screen
**Purpose:** Central hub for all learning activities

**Top Section:**
- User avatar & level badge
- Current streak: "🔥 7 days"
- XP progress bar to next level

**Today's Lesson Card:**
- Week # - Day #
- Lesson title
- Estimated time
- Progress indicator
- "Continue" button (prominent)

**Quick Stats:**
- Verbs mastered: "23/100"
- Patterns learned: "12/30"
- Total study time: "12h 34m"

**Bottom Navigation:**
- 🏠 Home (active)
- 📚 Practice
- 📊 Progress
- ⚙️ Settings

---

## 📚 3. Learning Screens

### 3.1 Lesson Screen
**Purpose:** Deliver daily lesson content

**Header:**
- Back button
- Lesson title
- Progress: "2/5 exercises"

**Content Area (dynamic based on exercise type):**

#### Exercise Type: Vocabulary Introduction
- Word card with image
- Indonesian word (large)
- English translation
- Audio button
- Example sentence
- Navigation: "Next" button

#### Exercise Type: Pattern Practice
- Pattern template: "Saya mau [X]"
- 5-10 practice items
- Multiple choice or drag-and-drop
- Immediate feedback (✓ or ✗)
- "Continue" after completion

#### Exercise Type: SVO Constructor
- Three slots: [Subject] [Verb] [Object]
- Word bank below
- Drag words to slots
- "Check" button
- Audio playback of constructed sentence
- Feedback with correct answer

#### Exercise Type: Dialog Practice
- Two-person dialogue
- User's turn highlighted
- Multiple choice responses
- Audio for each line
- Progress through conversation

**Footer:**
- Skip button (if allowed)
- "Next Exercise" button

---

### 3.2 Verb Practice Screen
**Purpose:** Deep practice with specific verbs

**Layout:**
- Verb card at top
  - Indonesian verb (large)
  - English translation
  - Category badge
  - Audio button
- Example sentences (3)
  - Each with audio
  - SVO structure highlighted
- Practice section
  - "Create Sentence" button → SVO Constructor
  - "Quiz Me" button → Multiple choice
  - "Add to Review" button → SRS queue

---

### 3.3 Pattern Practice Screen
**Purpose:** Master sentence patterns

**Header:**
- Pattern formula: "Saya [verb]"
- English equivalent
- Difficulty badge (1-3 stars)

**Practice Area:**
- Fill-in-the-blank exercises
- Show pattern, user completes
- 10 variations
- Immediate feedback
- Running score display

**Bottom:**
- "Master This Pattern" progress bar
- "Practice More" / "Next Pattern" buttons

---

### 3.4 Dialog Scenario Screen
**Purpose:** Practice real-life conversations

**Top:**
- Scenario title: "At the Cafe"
- Scene illustration/icon
- Context: "You're ordering coffee..."

**Dialog Area:**
- Speech bubbles
- Speaker labels (You, Waiter, etc.)
- Each line shows:
  - Indonesian (main)
  - English translation (smaller, toggle)
  - Audio button
- User's turn: Multiple choice response buttons

**Progress:**
- Dots showing dialogue steps
- "Complete Dialog" achievement at end

---

### 3.5 Review (SRS) Screen
**Purpose:** Spaced repetition review

**Card Display:**
- Front: Question/prompt
  - Indonesian sentence with blank
  - Or: Word to translate
  - Or: Audio to type
- Flip animation to back
- Back: Answer with explanation

**Rating Buttons (after reveal):**
- 🔴 Again (forgot)
- 🟠 Hard (difficult)
- 🟢 Good (remembered)
- 🔵 Easy (very easy)

**Top Info:**
- Cards due: "23 cards"
- New: "5" | Learning: "10" | Review: "8"

**Progress:**
- Completion bar
- "X more cards"

---

## 📊 4. Progress & Stats Screens

### 4.1 Progress Overview
**Purpose:** Show learning progress and motivation

**Top:**
- Level badge (large)
- Current level & title
- XP bar to next level
- Total XP display

**16-Week Roadmap:**
- Visual timeline/map
- Week 1-16 nodes
- Completed weeks (✓ checkmark)
- Current week (highlighted)
- Locked future weeks (lock icon)
- Tap week → Week detail

**Key Metrics:**
- Verbs Mastered: Progress bar "45/100"
- Patterns Mastered: Progress bar "15/30"
- Lessons Completed: "24/48"
- Vocabulary Learned: "156 words"

**Streak Section:**
- Current streak: "🔥 12 days"
- Longest streak: "18 days"
- Calendar view of last 30 days (green dots)

---

### 4.2 Achievements Screen
**Purpose:** Display earned achievements

**Layout:**
- Grid of achievement badges
- Earned achievements (color, animated)
- Locked achievements (grayscale, lock icon)

**Each Achievement Card:**
- Icon
- Title
- Description
- Progress bar (if in progress)
- XP reward

**Sections:**
- Recently Earned (carousel)
- All Achievements (grid, categorized)
  - Verbs
  - Patterns
  - Lessons
  - Streaks
  - Time

---

### 4.3 Statistics Screen
**Purpose:** Detailed analytics

**Study Time:**
- Total time: "45h 20m"
- This week: "2h 15m"
- Average session: "15 minutes"
- Bar chart: Daily study time (last 7 days)

**Performance:**
- Overall accuracy: "87%"
- Line chart: Accuracy trend
- Sentences created: "234"
- Dialogues completed: "18"

**SRS Stats:**
- Cards due today: "23"
- Retention rate: "91%"
- Reviews done: "567"
- Forecast: Next 7 days review count

---

### 4.4 Verb Matrix Screen
**Purpose:** Visual overview of 100 verbs

**Layout:**
- Grid view (10x10)
- Each cell:
  - Verb number (1-100)
  - Mastered: ✓ badge, green
  - Learning: yellow
  - Locked: gray

**Categories Filter:**
- Tabs: All / Daily Actions / Movement / Communication / etc.

**Interaction:**
- Tap verb → Verb detail popup
- Shows mastery %
- "Practice This Verb" button

---

## ⚙️ 5. Settings & Profile

### 5.1 Settings Screen
**Purpose:** App configuration

**Profile Section:**
- Avatar
- Display name
- Learning goal recap
- Edit profile button

**Learning Settings:**
- Daily goal: Slider (5-60 minutes)
- Lesson difficulty
- Audio auto-play: Toggle
- Show romanization: Toggle

**Notifications:**
- Daily reminder: Toggle
- Time picker
- Streak reminder: Toggle

**App Settings:**
- Language: English
- Sound effects: Toggle
- Dark mode: Toggle

**Other:**
- About
- Privacy Policy
- Rate App
- Share with Friends
- Logout

---

### 5.2 Profile Screen
**Purpose:** User identity and history

**Header:**
- Avatar (large, editable)
- Display name
- Level badge
- Member since: Date

**Stats Summary:**
- Study streak
- Total lessons
- Verbs mastered
- Level & XP

**Recent Activity:**
- List of recent lessons
- Timestamps
- Quick access to repeat

---

## 🎮 6. Special Screens

### 6.1 SVO Constructor Screen
**Purpose:** Interactive sentence building

**Top:**
- Instruction: "Build a sentence"
- Target meaning (optional): "I drink coffee"

**Construction Area:**
- Three drop zones:
  - [Subject slot]
  - [Verb slot]
  - [Object slot]
- Filled slots show selected words

**Word Bank:**
- Categorized tabs: Subjects / Verbs / Objects
- Scrollable word buttons
- Tap to add to slot
- Clear slot button

**Bottom:**
- "Check Sentence" button
- Result area:
  - Full Indonesian sentence
  - English translation
  - Audio playback
  - Feedback (correct/incorrect)

---

### 6.2 Vocabulary Browser
**Purpose:** Explore all vocabulary

**Categories List:**
- Food & Drinks
- Numbers
- Time
- Places
- Directions
- Adjectives
- Family
- Transportation
- Shopping
- Body Parts
- Health
- etc.

**Each Category:**
- Tap → Word list
- Each word card:
  - Indonesian
  - English
  - Audio button
  - "Add to Review" button
  - Example sentence (expandable)

---

### 6.3 Curriculum Browser
**Purpose:** Browse 16-week program

**Layout:**
- Accordion list
- Week 1 (expandable)
  - Title & topics
  - Day 1: Lesson title
  - Day 2: Lesson title
  - Day 3: Lesson title
- Week 2 (expandable)
  - ...

**Interaction:**
- Tap lesson → Lesson details
- "Start Lesson" button (if unlocked)
- Lock icon (if not reached yet)

---

### 6.4 Rewards & Level Up Screen
**Purpose:** Celebrate achievements

**Triggered when:**
- Level up
- Achievement unlocked
- Milestone reached

**Animation:**
- Confetti / fireworks
- Badge zoom-in
- XP counter animation

**Content:**
- "Level Up!" heading
- New level badge
- Reward description
- XP gained
- "Continue" button

---

## 🎯 7. Workout Screens (Quick Practice)

### 7.1 Daily Challenge
**Purpose:** Quick daily engagement

**Format:**
- 5-minute timed challenge
- Mixed exercises:
  - Vocabulary
  - Pattern practice
  - Translation
- Score tracking
- Leaderboard (optional)

**Reward:**
- Bonus XP
- Daily challenge badge

---

### 7.2 Flashcard Mode
**Purpose:** Quick review

**Simple Interface:**
- Card front: Indonesian word/phrase
- Tap to flip
- Card back: English + example
- Swipe gestures:
  - Left: Don't know
  - Right: Know
  - Up: Hard
- Counter: X / Y cards

---

## 📱 Navigation & Common Elements

### Bottom Navigation Bar
- 🏠 Home
- 📚 Practice (opens practice menu)
- 📊 Progress
- ⚙️ Settings

Always visible on main screens.

---

### Practice Menu (Modal/Sheet)
Appears when tapping Practice nav item:
- Today's Lesson
- Review Cards (SRS)
- Verb Practice
- Pattern Practice
- Dialogue Practice
- Vocabulary Browser
- Daily Challenge
- Flashcards

---

### Common Header Elements
- Back button (left)
- Screen title (center)
- Action button (right, contextual)
  - Info icon
  - Settings
  - Share
  - etc.

---

### Common Interaction Patterns

**Audio Playback:**
- Speaker icon button
- Plays Indonesian audio
- Visual feedback (pulse animation)
- Can replay unlimited times

**Progress Indicators:**
- Linear progress bars
- Circular progress (percentages)
- Step indicators (dots)
- Checkmarks for completion

**Feedback:**
- ✓ Green for correct
- ✗ Red for incorrect
- Yellow for partially correct
- Haptic feedback on mobile
- Sound effects (if enabled)

---

## 🎨 Design Notes

### Color Scheme
- Primary: Blue/Teal (trust, learning)
- Success: Green (correct, mastery)
- Warning: Yellow/Orange (learning, review)
- Error: Red (incorrect)
- Neutral: Gray scale

### Typography
- Headers: Bold, large
- Body: Regular, readable
- Indonesian text: Slightly larger
- English translation: Smaller, secondary color

### Iconography
- Consistent icon set
- Outlined style for inactive
- Filled style for active
- Cultural sensitivity (Indonesian context)

### Spacing
- Generous whitespace
- Card-based layouts
- Clear section separation
- Thumb-friendly tap targets (44px+)

---

## 🔄 User Flows

### First Time User Flow
1. Welcome → Onboarding → First Lesson Preview
2. Main Dashboard → Today's Lesson
3. Complete Lesson → Rewards Screen
4. Dashboard (with progress shown)

### Daily User Flow
1. App Open → Dashboard
2. See streak, today's lesson
3. Tap "Continue Lesson"
4. Complete exercises
5. Rewards/Progress shown
6. Optional: Quick review (SRS)
7. Return to dashboard

### Review Flow
1. Dashboard → Practice Nav
2. "Review Cards" → SRS Screen
3. Review X cards
4. See completion summary
5. Return to dashboard/practice menu

---

## 📊 Empty States

### No Lessons Completed Yet
- Illustration
- "Start your first lesson!"
- CTA button to curriculum

### No Reviews Due
- "Great job! No cards due."
- "Next review in X hours"
- Suggest: Practice new verbs

### Streak Broken
- "Start a new streak today!"
- Motivational message
- CTA to today's lesson

---

## 🚀 Future Enhancements

- Social features (friends, leaderboards)
- Speaking practice (speech recognition)
- Writing practice (keyboard input)
- Community forum
- Cultural tips & notes
- Travel phrasebook
- Offline mode
- Multiple language pairs
- AI conversation partner

---

**End of UI Screens Documentation**
