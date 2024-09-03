import { QuizTypes } from "../interfaces/QuizTypes";

export namespace QuizModels {
  /**
   * Represents a question in a quiz.
   * @class
   * @implements {QuizTypes.IQuestion}
   */
  export class Question implements QuizTypes.IQuestion {
    /**
     * Creates an instance of a Question.
     * @param {string} [text] - The text of the question.
     * @param {string} [imageUrl] - The URL of an image associated with the question.
     */
    constructor(public text?: string, public imageUrl?: string) {}

    /**
     * Sets the text of the question.
     * @param {string} text - The text to set for the question.
     * @returns {this} - The current instance for chaining.
     */
    withText(text?: string): this {
      this.text = text;
      return this;
    }

    /**
     * Sets the image URL of the question.
     * @param {string} imageUrl - The URL of the image to associate with the question.
     * @returns {this} - The current instance for chaining.
     */
    withImageUrl(imageUrl?: string): this {
      this.imageUrl = imageUrl;
      return this;
    }
  }

  /**
   * Represents an answer option for a quiz question.
   * @class
   * @implements {QuizTypes.IAnswerOption}
   */
  export class AnswerOption implements QuizTypes.IAnswerOption {
    /**
     * Creates an instance of an AnswerOption.
     * @param {number} [id=0] - The unique identifier for the answer option.
     * @param {string} [text] - The text of the answer option.
     * @param {string} [imageUrl] - The URL of an image associated with the answer option.
     * @param {boolean} [isCorrect=false] - Indicates whether the answer option is correct.
     */
    public id?: number;
    constructor(
      public text?: string,
      public imageUrl?: string,
      public isCorrect: boolean = false
    ) {}

    /**
     * Sets the text of the answer option.
     * @param {string} text - The text to set for the answer option.
     * @returns {this} - The current instance for chaining.
     */
    withText(text?: string): this {
      this.text = text;
      return this;
    }

    /**
     * Sets the image URL of the answer option.
     * @param {string} imageUrl - The URL of the image to associate with the answer option.
     * @returns {this} - The current instance for chaining.
     */
    withImageUrl(imageUrl?: string): this {
      this.imageUrl = imageUrl;
      return this;
    }

    /**
     * Marks the answer option as correct.
     * @param {boolean} [isCorrect=true] - Whether the answer option is correct.
     * @returns {this} - The current instance for chaining.
     */
    markAsCorrect(isCorrect: boolean = true): this {
      this.isCorrect = isCorrect;
      return this;
    }
  }

  /**
   * Represents a question in a quiz, including possible answer options.
   * @class
   * @implements {QuizTypes.IQuizQuestion}
   */
  export class QuizQuestion implements QuizTypes.IQuizQuestion {
    /**
     * Creates an instance of a QuizQuestion.
     * @param {number} id - The unique identifier for the quiz question.
     * @param {Question} question - The question text and associated data.
     * @param {AnswerOption[]} options - The list of answer options for the question.
     * @param {number[]} correctOptionIds - The IDs of the correct answer options.
     * @param {number[]} answerOptionIds - The IDs of the user's selected answer options.
     * @param {QuizTypes.EQuizQuestionType} type - The type of the quiz question (e.g., SingleChoice, MultipleChoice).
     * @param {string} [explanation] - The explanation for the correct answer.
     */
    public id?: number;
    constructor(
      public question: Question,
      public options: AnswerOption[],
      public correctOptionIds: number[], // Correct answers
      public answerOptionIds: number[], // User's answers
      public type: QuizTypes.EQuizQuestionType,
      public explanation?: string
    ) {}

    /**
     * Sets the question for the quiz question.
     * @param {Question} question - The question to set.
     * @returns {this} - The current instance for chaining.
     */
    withQuestion(question: Question): this {
      this.question = question;
      return this;
    }

    /**
     * Sets the type of the quiz question.
     * @param {QuizTypes.EQuizQuestionType} type - The type to set for the quiz question.
     * @returns {this} - The current instance for chaining.
     */
    withType(type: QuizTypes.EQuizQuestionType): this {
      this.type = type;
      return this;
    }

    /**
     * Sets the explanation for the correct answer.
     * @param {string} [explanation] - The explanation to set.
     * @returns {this} - The current instance for chaining.
     */
    withExplanation(explanation?: string): this {
      this.explanation = explanation;
      return this;
    }

    /**
     * Adds an answer option to the quiz question.
     * @param {AnswerOption} option - The answer option to add.
     * @returns {this} - The current instance for chaining.
     */
    addOption(option: AnswerOption): this {
      option.id = this.options.length;
      if (option.isCorrect) this.correctOptionIds.push(option.id);
      this.options.push(option);
      return this;
    }

    /**
     * Records the user's selected answer options.
     * @param {number[]} answer - The IDs of the selected answer options.
     * @returns {this} - The current instance for chaining.
     */
    addAnswer(answer: number[]): this {
      this.answerOptionIds = answer;
      return this;
    }

    /**
     * Checks whether the user's answers match the correct answers.
     * @returns {boolean} - True if the answers are correct, false otherwise.
     */
    checkAnswers(): boolean {
      // Check if the length of the arrays is the same
      if (this.correctOptionIds.length !== this.answerOptionIds.length) {
        return false;
      }
      // Check if every correct option ID is included in the answer option IDs
      const isCorrect = this.correctOptionIds.every((id) => this.answerOptionIds.includes(id));
      return isCorrect;
    }
  }

  /**
   * Represents a quiz, containing a series of questions.
   * @class
   * @implements {QuizTypes.IQuiz}
   */
  export class Quiz implements QuizTypes.IQuiz {
    /**
     * Creates an instance of a Quiz.
     * @param {number} id - The unique identifier for the quiz.
     * @param {string} title - The title of the quiz.
     * @param {QuizQuestion[]} questions - The list of questions in the quiz.
     * @param {number} passingScore - The score required to pass the quiz.
     * @param {boolean} [shuffleQuestions=false] - Whether to shuffle the order of questions.
     * @param {boolean} [shuffleOptions=false] - Whether to shuffle the order of options within each question.
     * @param {string} [description] - A description of the quiz.
     */
    public id?: number;
    constructor(
      public title: string,
      public questions: QuizQuestion[],
      public passingScore: number,
      public shuffleQuestions: boolean = false,
      public shuffleOptions: boolean = false,
      public description?: string
    ) {}

    /**
     * Sets the title of the quiz.
     * @param {string} title - The title to set for the quiz.
     * @returns {this} - The current instance for chaining.
     */
    withTitle(title: string): this {
      this.title = title;
      return this;
    }

    /**
     * Sets the description of the quiz.
     * @param {string} [description] - The description to set for the quiz.
     * @returns {this} - The current instance for chaining.
     */
    withDescription(description?: string): this {
      this.description = description;
      return this;
    }

    /**
     * Sets the passing score of the quiz.
     * @param {number} passingScore - The score required to pass the quiz.
     * @returns {this} - The current instance for chaining.
     */
    withPassingScore(passingScore: number): this {
      this.passingScore = passingScore;
      return this;
    }

    /**
     * Enables or disables shuffling of the question order.
     * @param {boolean} [shuffle=true] - Whether to shuffle the questions.
     * @returns {this} - The current instance for chaining.
     */
    enableShuffleQuestions(shuffle: boolean = true): this {
      this.shuffleQuestions = shuffle;
      return this;
    }

    /**
     * Enables or disables shuffling of the answer options within each question.
     * @param {boolean} [shuffle=true] - Whether to shuffle the answer options.
     * @returns {this} - The current instance for chaining.
     */
    enableShuffleOptions(shuffle: boolean = true): this {
      this.shuffleOptions = shuffle;
      return this;
    }

    /**
     * Adds a question to the quiz.
     * @param {QuizQuestion} question - The question to add to the quiz.
     * @returns {this} - The current instance for chaining.
     */
    addQuestion(question: QuizQuestion): this {
      question.id = this.questions.length;
      this.questions.push(question);
      return this;
    }

    /**
     * Calculates the user's score as a percentage of correct answers.
     * @returns {number} - The percentage of correct answers.
     */
    checkScore(): number {
      const correctCount = this.questions.reduce((correct, question) => {
        if (question.checkAnswers()) correct++;
        return correct;
      }, 0);
      // Return the percentage of correct answers
      return (correctCount / this.questions.length) * 100;
    }
  }
}
