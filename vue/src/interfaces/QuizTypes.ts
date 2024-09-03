export namespace QuizTypes {
  export interface IQuestion {
    text?: string; // The text of the question, optional if the question is represented by an image
    imageUrl?: string; // URL of the image if the question is represented by an image
  }

  export interface IAnswerOption {
    id?: number;
    text?: string; // The text of the option, optional if the option is an image
    imageUrl?: string; // URL of the image if the option is an image
    isCorrect: boolean; // Whether this option is a correct answer
  }

  export enum EQuizQuestionType {
    SingleChoice = "Single Choice",
    MultipleChoice = "Multi Choice",
    TrueFalse = "True or False",
    OpenEnded = "Open Ended",
    Matching = "Matching",
    Ordering = "Ordering",
  }

  export interface IQuizQuestion {
    id?: number;
    question: IQuestion;
    options: IAnswerOption[];
    correctOptionIds: number[]; // Correct answers
    answerOptionIds: number[]; // User's answers
    type: EQuizQuestionType;
    explanation?: string;
  }

  export interface IQuiz {
    id?: number;
    title: string; // Title of the quiz
    questions: IQuizQuestion[]; // Array of quiz questions
    passingScore: number; // Percentage of correct answers required to pass
    shuffleQuestions?: boolean; // A flag to indicate if questions should be presented in random order.
    shuffleOptions?: boolean; // A flag to indicate if answer options should be shuffled.
    description?: string; // Optional description of the quiz
  }
}
