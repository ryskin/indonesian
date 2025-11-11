// SVO Sentence Constructor Engine - TypeScript Version

interface SVOComponents {
  subject: string
  verb: string
  object: string
}

interface Sentence {
  indonesian: string
  english: string
  svo: SVOComponents
  verbCategory?: string
  audio?: string
}

interface Verb {
  id: number
  indonesian: string
  english: string
  category: string
  difficulty: number
  examples: Array<{
    indonesian: string
    english: string
    svo: SVOComponents
  }>
  audio: string
}

interface VocabularyWord {
  indonesian: string
  english: string
  audio: string
}

export class SVOConstructor {
  private verbs: Verb[]
  private subjects: VocabularyWord[]

  constructor(verbsData: { verbs: Verb[] }, vocabularyData: any) {
    this.verbs = verbsData.verbs
    this.subjects = vocabularyData.vocabulary.pronouns.words
  }

  buildSentence(subject: string, verbId: number, object: string): Sentence {
    const verb = this.verbs.find((v) => v.id === verbId)

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`)
    }

    const indonesian = `${subject} ${verb.indonesian} ${object}`
    const subjectEn = this.translateSubject(subject)
    const english = `${subjectEn} ${verb.english} ${object}`

    return {
      indonesian,
      english,
      svo: {
        subject,
        verb: verb.indonesian,
        object,
      },
      verbCategory: verb.category,
      audio: verb.audio,
    }
  }

  buildNegativeSentence(subject: string, verbId: number, object: string): Sentence {
    const verb = this.verbs.find((v) => v.id === verbId)

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`)
    }

    const indonesian = `${subject} tidak ${verb.indonesian} ${object}`
    const subjectEn = this.translateSubject(subject)
    const english = `${subjectEn} don't/doesn't ${verb.english} ${object}`

    return {
      indonesian,
      english,
      svo: {
        subject,
        verb: `tidak ${verb.indonesian}`,
        object,
      },
      verbCategory: verb.category,
    }
  }

  buildTenseSentence(
    subject: string,
    verbId: number,
    object: string,
    timeMarker: 'sudah' | 'akan' | 'sedang' | 'belum'
  ): Sentence {
    const verb = this.verbs.find((v) => v.id === verbId)

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`)
    }

    const timeMarkers = {
      sudah: { indonesian: 'sudah', english: 'have/has' },
      akan: { indonesian: 'akan', english: 'will' },
      sedang: { indonesian: 'sedang', english: 'am/is/are' },
      belum: { indonesian: 'belum', english: "haven't/hasn't yet" },
    }

    const marker = timeMarkers[timeMarker]
    const indonesian = `${subject} ${marker.indonesian} ${verb.indonesian} ${object}`
    const subjectEn = this.translateSubject(subject)
    const english = `${subjectEn} ${marker.english} ${verb.english} ${object}`

    return {
      indonesian,
      english,
      svo: {
        subject,
        verb: `${marker.indonesian} ${verb.indonesian}`,
        object,
      },
      verbCategory: verb.category,
    }
  }

  generatePracticeSentence(
    verbId: number,
    options: {
      withNegation?: boolean
      withTense?: boolean
      withLocation?: boolean
    } = {}
  ): Sentence {
    const verb = this.verbs.find((v) => v.id === verbId)

    if (!verb) {
      throw new Error(`Verb with ID ${verbId} not found`)
    }

    const subject = this.getRandomItem(this.subjects).indonesian
    const exampleIndex = Math.floor(Math.random() * verb.examples.length)
    const object = verb.examples[exampleIndex].svo.object

    if (options.withNegation) {
      return this.buildNegativeSentence(subject, verbId, object)
    }

    if (options.withTense) {
      const tenseMarkers: Array<'sudah' | 'akan' | 'sedang' | 'belum'> = [
        'sudah',
        'akan',
        'sedang',
        'belum',
      ]
      const randomTense = this.getRandomItem(tenseMarkers)
      return this.buildTenseSentence(subject, verbId, object, randomTense)
    }

    return this.buildSentence(subject, verbId, object)
  }

  validateSentence(
    userSentence: SVOComponents,
    targetSentence: SVOComponents
  ): {
    isCorrect: boolean
    userSentence: string
    correctSentence: string
    feedback: string
  } {
    const isCorrect =
      userSentence.subject === targetSentence.subject &&
      userSentence.verb === targetSentence.verb &&
      userSentence.object === targetSentence.object

    return {
      isCorrect,
      userSentence: `${userSentence.subject} ${userSentence.verb} ${userSentence.object}`,
      correctSentence: `${targetSentence.subject} ${targetSentence.verb} ${targetSentence.object}`,
      feedback: isCorrect ? 'Correct! 🎉' : 'Try again 🔄',
    }
  }

  getVerb(verbId: number): Verb | undefined {
    return this.verbs.find((v) => v.id === verbId)
  }

  getVerbsByCategory(category: string): Verb[] {
    return this.verbs.filter((v) => v.category === category)
  }

  private translateSubject(indonesianSubject: string): string {
    const subject = this.subjects.find((s) => s.indonesian === indonesianSubject)
    return subject ? subject.english : indonesianSubject
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }
}
