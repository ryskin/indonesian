/**
 * Google Cloud Text-to-Speech Audio Generation Script
 * Generates audio files for all verbs and vocabulary
 *
 * Requirements:
 * - npm install @google-cloud/text-to-speech fs
 * - Google Cloud account with TTS API enabled
 * - Service account credentials JSON file
 * - Set environment variable: GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
 */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Load data files
const verbsData = require('../src/data/verbs.json');
const vocabularyData = require('../src/data/vocabulary.json');

// Initialize Google TTS client
const client = new textToSpeech.TextToSpeechClient();

// Configuration
const CONFIG = {
  // Voice settings
  voiceName: 'id-ID-Wavenet-D', // Female voice (options: A, B, C, D)
  languageCode: 'id-ID',

  // Audio settings
  audioEncoding: 'MP3',
  sampleRateHertz: 24000,
  speakingRate: 0.9, // Slightly slower for learning
  pitch: 0.0,

  // Output directories
  verbsDir: path.join(__dirname, '../public/audio/verbs'),
  vocabDir: path.join(__dirname, '../public/audio/vocab'),

  // Delays (to avoid rate limiting)
  delayBetweenRequests: 200, // milliseconds
};

// Utility: Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility: Create directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
};

// Utility: Sanitize filename
const sanitizeFilename = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
};

/**
 * Generate audio file from text using Google TTS
 * @param {string} text - Indonesian text to synthesize
 * @param {string} outputPath - Full path where to save MP3 file
 * @returns {Promise<boolean>} Success status
 */
async function generateAudio(text, outputPath) {
  try {
    // Build the synthesis request
    const request = {
      input: { text },
      voice: {
        languageCode: CONFIG.languageCode,
        name: CONFIG.voiceName,
      },
      audioConfig: {
        audioEncoding: CONFIG.audioEncoding,
        sampleRateHertz: CONFIG.sampleRateHertz,
        speakingRate: CONFIG.speakingRate,
        pitch: CONFIG.pitch,
      },
    };

    // Call Google TTS API
    const [response] = await client.synthesizeSpeech(request);

    // Save the audio file
    await fs.promises.writeFile(outputPath, response.audioContent, 'binary');

    return true;
  } catch (error) {
    console.error(`✗ Error generating audio for "${text}":`, error.message);
    return false;
  }
}

/**
 * Generate audio for all verbs
 */
async function generateVerbsAudio() {
  console.log('\n📚 Generating audio for 100 verbs...\n');

  ensureDirectoryExists(CONFIG.verbsDir);

  let successCount = 0;
  let errorCount = 0;

  for (const verb of verbsData.verbs) {
    const filename = `${sanitizeFilename(verb.indonesian)}.mp3`;
    const outputPath = path.join(CONFIG.verbsDir, filename);

    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭  Skipping (exists): ${verb.indonesian}`);
      successCount++;
      continue;
    }

    // Generate audio
    const success = await generateAudio(verb.indonesian, outputPath);

    if (success) {
      console.log(`✓ Generated: ${verb.indonesian} → ${filename}`);
      successCount++;
    } else {
      console.log(`✗ Failed: ${verb.indonesian}`);
      errorCount++;
    }

    // Delay between requests to avoid rate limiting
    await sleep(CONFIG.delayBetweenRequests);
  }

  console.log(`\n✅ Verbs complete: ${successCount} success, ${errorCount} errors`);
}

/**
 * Generate audio for all vocabulary
 */
async function generateVocabularyAudio() {
  console.log('\n📖 Generating audio for vocabulary...\n');

  ensureDirectoryExists(CONFIG.vocabDir);

  let successCount = 0;
  let errorCount = 0;
  let totalWords = 0;

  // Iterate through all categories
  for (const [categoryKey, categoryData] of Object.entries(vocabularyData.vocabulary)) {
    console.log(`\n--- Category: ${categoryData.name} ---`);

    for (const word of categoryData.words) {
      totalWords++;

      const filename = `${sanitizeFilename(word.indonesian)}.mp3`;
      const outputPath = path.join(CONFIG.vocabDir, filename);

      // Skip if file already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭  Skipping (exists): ${word.indonesian}`);
        successCount++;
        continue;
      }

      // Generate audio
      const success = await generateAudio(word.indonesian, outputPath);

      if (success) {
        console.log(`✓ Generated: ${word.indonesian} → ${filename}`);
        successCount++;
      } else {
        console.log(`✗ Failed: ${word.indonesian}`);
        errorCount++;
      }

      // Delay between requests
      await sleep(CONFIG.delayBetweenRequests);
    }
  }

  console.log(`\n✅ Vocabulary complete: ${successCount} success, ${errorCount} errors`);
  console.log(`📊 Total words processed: ${totalWords}`);
}

/**
 * Generate audio for verb example sentences (optional)
 */
async function generateExampleSentencesAudio() {
  console.log('\n💬 Generating audio for example sentences...\n');

  const sentencesDir = path.join(__dirname, '../public/audio/sentences');
  ensureDirectoryExists(sentencesDir);

  let successCount = 0;
  let errorCount = 0;

  for (const verb of verbsData.verbs) {
    console.log(`\n--- Verb: ${verb.indonesian} ---`);

    for (let i = 0; i < verb.examples.length; i++) {
      const example = verb.examples[i];
      const filename = `${verb.id}_example_${i + 1}.mp3`;
      const outputPath = path.join(sentencesDir, filename);

      // Skip if exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭  Skipping: ${example.indonesian}`);
        successCount++;
        continue;
      }

      // Generate audio
      const success = await generateAudio(example.indonesian, outputPath);

      if (success) {
        console.log(`✓ Generated: ${example.indonesian}`);
        successCount++;
      } else {
        console.log(`✗ Failed: ${example.indonesian}`);
        errorCount++;
      }

      await sleep(CONFIG.delayBetweenRequests);
    }
  }

  console.log(`\n✅ Sentences complete: ${successCount} success, ${errorCount} errors`);
}

/**
 * Calculate estimated cost
 */
function calculateEstimatedCost() {
  let totalCharacters = 0;

  // Count verb characters
  verbsData.verbs.forEach(verb => {
    totalCharacters += verb.indonesian.length;

    // Optional: include examples
    // verb.examples.forEach(ex => {
    //   totalCharacters += ex.indonesian.length;
    // });
  });

  // Count vocabulary characters
  for (const category of Object.values(vocabularyData.vocabulary)) {
    category.words.forEach(word => {
      totalCharacters += word.indonesian.length;
    });
  }

  // Google TTS pricing: $16 per 1M characters (WaveNet)
  // First 1M characters/month are free
  const costPerMillion = 16;
  const estimatedCost = (totalCharacters / 1000000) * costPerMillion;

  console.log('\n💰 Cost Estimation:');
  console.log(`   Total characters: ${totalCharacters.toLocaleString()}`);
  console.log(`   Estimated cost: $${estimatedCost.toFixed(2)}`);
  console.log(`   (First 1M characters/month are FREE)`);

  if (totalCharacters < 1000000) {
    console.log(`   ✅ This will likely be FREE (under 1M limit)`);
  }
}

/**
 * Generate summary report
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));

  const verbFiles = fs.readdirSync(CONFIG.verbsDir).filter(f => f.endsWith('.mp3'));
  const vocabFiles = fs.readdirSync(CONFIG.vocabDir).filter(f => f.endsWith('.mp3'));

  console.log(`\n✓ Verbs audio files: ${verbFiles.length}/100`);
  console.log(`✓ Vocabulary audio files: ${vocabFiles.length}`);

  const totalSize = [...verbFiles, ...vocabFiles].reduce((sum, file) => {
    const dir = file.startsWith('verb_') ? CONFIG.verbsDir : CONFIG.vocabDir;
    const stats = fs.statSync(path.join(dir, file));
    return sum + stats.size;
  }, 0);

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`✓ Total size: ${totalSizeMB} MB`);

  console.log('\n' + '='.repeat(60));
}

/**
 * Main execution
 */
async function main() {
  console.log('🎤 Indonesian Learning App - Audio Generation');
  console.log('='.repeat(60));

  // Check for credentials
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('\n❌ ERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable not set!');
    console.error('Please set it to the path of your service account JSON file.');
    console.error('\nExample:');
    console.error('  export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"');
    process.exit(1);
  }

  // Show cost estimation
  calculateEstimatedCost();

  // Confirm before proceeding
  console.log('\n⚠️  This will make API calls to Google Cloud Text-to-Speech.');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await sleep(5000);

  const startTime = Date.now();

  try {
    // Generate all audio files
    await generateVerbsAudio();
    await generateVocabularyAudio();

    // Optional: Generate example sentences
    // await generateExampleSentencesAudio();

    // Generate report
    generateReport();

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n⏱  Total time: ${duration} seconds`);
    console.log('\n🎉 Audio generation complete!');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// CLI options parsing
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Indonesian Learning App - Audio Generation Script

Usage:
  node generate-audio.js [options]

Options:
  --help, -h           Show this help message
  --estimate           Show cost estimation only (no generation)
  --verbs-only         Generate only verb audio files
  --vocab-only         Generate only vocabulary audio files
  --sentences          Also generate audio for example sentences
  --voice <name>       Use specific voice (default: id-ID-Wavenet-D)
                       Options: id-ID-Wavenet-A, B, C, D

Examples:
  node generate-audio.js
  node generate-audio.js --estimate
  node generate-audio.js --verbs-only
  node generate-audio.js --voice id-ID-Wavenet-B

Setup:
  1. Install dependencies: npm install @google-cloud/text-to-speech
  2. Set up Google Cloud project with TTS API enabled
  3. Download service account credentials JSON
  4. Set environment variable:
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
  5. Run this script

Documentation:
  https://cloud.google.com/text-to-speech/docs
  `);
  process.exit(0);
}

if (args.includes('--estimate')) {
  calculateEstimatedCost();
  process.exit(0);
}

// Run main function
main();
