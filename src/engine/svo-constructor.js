/**
 * SVO Sentence Constructor Engine
 * Builds Indonesian sentences using Subject-Verb-Object structure
 */

class SVOConstructor {
  constructor(verbsData, vocabularyData) {
    this.verbs = verbsData.verbs;
    this.vocabulary = vocabularyData.vocabulary;
    this.subjects = this.vocabulary.pronouns.words;
  }

  /**
   * Generate a sentence from SVO components
   * @param {string} subject - Indonesian subject (e.g., "Saya")
   * @param {number} verbId - Verb ID from verbs database
   * @param {string} object - Indonesian object (e.g., "kopi")
   * @returns {Object} Sentence with Indonesian and English
   */
  buildSentence(subject, verbId, object) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    const indonesian = `${subject} ${verb.indonesian} ${object}`;
    const english = `${this.translateSubject(subject)} ${verb.english} ${object}`;

    return {
      indonesian,
      english,
      svo: {
        subject,
        verb: verb.indonesian,
        object
      },
      verbCategory: verb.category,
      audio: verb.audio
    };
  }

  /**
   * Generate sentence with negation
   * @param {string} subject
   * @param {number} verbId
   * @param {string} object
   * @returns {Object}
   */
  buildNegativeSentence(subject, verbId, object) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    const indonesian = `${subject} tidak ${verb.indonesian} ${object}`;
    const english = `${this.translateSubject(subject)} don't/doesn't ${verb.english} ${object}`;

    return {
      indonesian,
      english,
      svo: {
        subject,
        negation: "tidak",
        verb: verb.indonesian,
        object
      },
      verbCategory: verb.category
    };
  }

  /**
   * Generate sentence with time marker (tense)
   * @param {string} subject
   * @param {number} verbId
   * @param {string} object
   * @param {string} timeMarker - "sudah" (already), "akan" (will), "sedang" (is doing)
   * @returns {Object}
   */
  buildTenseSentence(subject, verbId, object, timeMarker) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    const timeMarkers = {
      sudah: { indonesian: "sudah", english: "have/has" },
      akan: { indonesian: "akan", english: "will" },
      sedang: { indonesian: "sedang", english: "am/is/are" },
      belum: { indonesian: "belum", english: "haven't/hasn't yet" }
    };

    const marker = timeMarkers[timeMarker];

    if (!marker) {
      throw new Error(`Unknown time marker: ${timeMarker}`);
    }

    const indonesian = `${subject} ${marker.indonesian} ${verb.indonesian} ${object}`;
    const english = `${this.translateSubject(subject)} ${marker.english} ${verb.english} ${object}`;

    return {
      indonesian,
      english,
      svo: {
        subject,
        timeMarker: marker.indonesian,
        verb: verb.indonesian,
        object
      },
      verbCategory: verb.category
    };
  }

  /**
   * Generate sentence with location
   * @param {string} subject
   * @param {number} verbId
   * @param {string} object
   * @param {string} location
   * @returns {Object}
   */
  buildLocationSentence(subject, verbId, object, location) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    const indonesian = `${subject} ${verb.indonesian} ${object} di ${location}`;
    const english = `${this.translateSubject(subject)} ${verb.english} ${object} at/in ${location}`;

    return {
      indonesian,
      english,
      svo: {
        subject,
        verb: verb.indonesian,
        object,
        location: `di ${location}`
      },
      verbCategory: verb.category
    };
  }

  /**
   * Generate random practice sentence
   * @param {number} verbId
   * @param {Object} options - { withNegation, withTense, withLocation }
   * @returns {Object}
   */
  generatePracticeSentence(verbId, options = {}) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    // Pick random subject
    const subject = this.getRandomItem(this.subjects).indonesian;

    // Use example object from verb data
    const exampleIndex = Math.floor(Math.random() * verb.examples.length);
    const object = verb.examples[exampleIndex].svo.object;

    if (options.withNegation) {
      return this.buildNegativeSentence(subject, verbId, object);
    }

    if (options.withTense) {
      const tenseMarkers = ['sudah', 'akan', 'sedang', 'belum'];
      const randomTense = this.getRandomItem(tenseMarkers);
      return this.buildTenseSentence(subject, verbId, object, randomTense);
    }

    if (options.withLocation) {
      const places = this.vocabulary.places.words;
      const randomPlace = this.getRandomItem(places).indonesian;
      return this.buildLocationSentence(subject, verbId, object, randomPlace);
    }

    return this.buildSentence(subject, verbId, object);
  }

  /**
   * Get all possible sentences for a verb
   * @param {number} verbId
   * @returns {Array}
   */
  getAllCombinations(verbId) {
    const verb = this.verbs.find(v => v.id === verbId);

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`);
    }

    const combinations = [];

    // For each example in verb data
    verb.examples.forEach(example => {
      const object = example.svo.object;

      // For each subject
      this.subjects.forEach(subj => {
        combinations.push(this.buildSentence(subj.indonesian, verbId, object));
      });
    });

    return combinations;
  }

  /**
   * Validate user-constructed sentence
   * @param {Object} userSentence - { subject, verb, object }
   * @param {Object} targetSentence - Expected sentence
   * @returns {Object} Validation result
   */
  validateSentence(userSentence, targetSentence) {
    const isCorrect =
      userSentence.subject === targetSentence.subject &&
      userSentence.verb === targetSentence.verb &&
      userSentence.object === targetSentence.object;

    return {
      isCorrect,
      userSentence: `${userSentence.subject} ${userSentence.verb} ${userSentence.object}`,
      correctSentence: `${targetSentence.subject} ${targetSentence.verb} ${targetSentence.object}`,
      feedback: isCorrect ? 'Correct!' : 'Try again'
    };
  }

  // Helper methods
  translateSubject(indonesianSubject) {
    const subject = this.subjects.find(s => s.indonesian === indonesianSubject);
    return subject ? subject.english : indonesianSubject;
  }

  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get verb by ID
   * @param {number} verbId
   * @returns {Object}
   */
  getVerb(verbId) {
    return this.verbs.find(v => v.id === verbId);
  }

  /**
   * Get verbs by category
   * @param {string} category
   * @returns {Array}
   */
  getVerbsByCategory(category) {
    return this.verbs.filter(v => v.category === category);
  }

  /**
   * Get verbs by difficulty
   * @param {number} difficulty
   * @returns {Array}
   */
  getVerbsByDifficulty(difficulty) {
    return this.verbs.filter(v => v.difficulty === difficulty);
  }
}

// Example usage:
/*
const verbsData = require('../data/verbs.json');
const vocabularyData = require('../data/vocabulary.json');

const constructor = new SVOConstructor(verbsData, vocabularyData);

// Build basic sentence
const sentence1 = constructor.buildSentence('Saya', 1, 'nasi');
console.log(sentence1.indonesian); // "Saya makan nasi"

// Build negative sentence
const sentence2 = constructor.buildNegativeSentence('Dia', 2, 'kopi');
console.log(sentence2.indonesian); // "Dia tidak minum kopi"

// Build with tense
const sentence3 = constructor.buildTenseSentence('Kami', 3, 'ke pasar', 'sudah');
console.log(sentence3.indonesian); // "Kami sudah pergi ke pasar"

// Generate random practice
const practice = constructor.generatePracticeSentence(7, { withNegation: true });
console.log(practice.indonesian);
*/

module.exports = SVOConstructor;
