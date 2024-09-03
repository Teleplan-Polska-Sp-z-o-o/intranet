import { describe, it, expect } from "vitest";
import { QuizModels } from "../../models/QuizModels";
import { QuizTypes } from "../../interfaces/QuizTypes";

describe("QuizModels Tests", () => {
  // Test for the Question class
  describe("Question", () => {
    it("should set text using withText", () => {
      const question = new QuizModels.Question();
      question.withText("What is 2+2?");
      expect(question.text).toBe("What is 2+2?");
    });

    it("should set imageUrl using withImageUrl", () => {
      const question = new QuizModels.Question();
      question.withImageUrl("http://example.com/image.png");
      expect(question.imageUrl).toBe("http://example.com/image.png");
    });
  });

  // Test for the AnswerOption class
  describe("AnswerOption", () => {
    it("should set text using withText", () => {
      const option = new QuizModels.AnswerOption();
      option.withText("4");
      expect(option.text).toBe("4");
    });

    it("should set imageUrl using withImageUrl", () => {
      const option = new QuizModels.AnswerOption();
      option.withImageUrl("http://example.com/option.png");
      expect(option.imageUrl).toBe("http://example.com/option.png");
    });

    it("should mark option as correct using markAsCorrect", () => {
      const option = new QuizModels.AnswerOption();
      option.markAsCorrect();
      expect(option.isCorrect).toBe(true);
    });
  });

  // Test for the QuizQuestion class
  describe("QuizQuestion", () => {
    it("should set question using withQuestion", () => {
      const quizQuestion = new QuizModels.QuizQuestion(
        new QuizModels.Question(),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      const question = new QuizModels.Question("What is 2+2?");
      quizQuestion.withQuestion(question);
      expect(quizQuestion.question).toBe(question);
    });

    it("should add an option using addOption and assign an id", () => {
      const quizQuestion = new QuizModels.QuizQuestion(
        new QuizModels.Question(),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      const option = new QuizModels.AnswerOption();
      quizQuestion.addOption(option);
      expect(quizQuestion.options).toContain(option);
      expect(quizQuestion.options.length).toBe(1);
      expect(option.id).toBe(0); // First option id should be 0
    });

    it("should track correct option IDs when added", () => {
      const quizQuestion = new QuizModels.QuizQuestion(
        new QuizModels.Question(),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      const option = new QuizModels.AnswerOption();
      option.markAsCorrect();
      quizQuestion.addOption(option);
      expect(quizQuestion.correctOptionIds).toContain(option.id);
    });

    it("should set user answers using addAnswer", () => {
      const quizQuestion = new QuizModels.QuizQuestion(
        new QuizModels.Question(),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      quizQuestion.addAnswer([1, 3]);
      expect(quizQuestion.answerOptionIds).toEqual([1, 3]);
    });

    it("should correctly check answers", () => {
      const quizQuestion = new QuizModels.QuizQuestion(
        new QuizModels.Question(),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.MultipleChoice
      );
      quizQuestion.addOption(new QuizModels.AnswerOption("Option 1", undefined, true));
      quizQuestion.addOption(new QuizModels.AnswerOption("Option 2", undefined, false));
      quizQuestion.addOption(new QuizModels.AnswerOption("Option 3", undefined, true));
      quizQuestion.addAnswer([0, 2]); // User selects correct options
      expect(quizQuestion.checkAnswers()).toBe(true);
      quizQuestion.addAnswer([0, 1]); // User selects one incorrect option
      expect(quizQuestion.checkAnswers()).toBe(false);
    });
  });

  // Test for the Quiz class
  describe("Quiz", () => {
    it("should set title using withTitle", () => {
      const quiz = new QuizModels.Quiz("Old Title", [], 70);
      quiz.withTitle("New Title");
      expect(quiz.title).toBe("New Title");
    });

    it("should add a question using addQuestion", () => {
      const quiz = new QuizModels.Quiz("Sample Quiz", [], 70);
      const question = new QuizModels.QuizQuestion(
        new QuizModels.Question("What is 2+2?"),
        [],
        [3],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      quiz.addQuestion(question);
      expect(quiz.questions).toContain(question);
      expect(quiz.questions.length).toBe(1);
    });

    it("should calculate score correctly using checkScore", () => {
      const quiz = new QuizModels.Quiz("Sample Quiz", [], 70);
      const question1 = new QuizModels.QuizQuestion(
        new QuizModels.Question("What is 2+2?"),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      question1.addOption(new QuizModels.AnswerOption("4", undefined, true));
      question1.addOption(new QuizModels.AnswerOption("5", undefined, false));

      const question2 = new QuizModels.QuizQuestion(
        new QuizModels.Question("What is 3+3?"),
        [],
        [],
        [],
        QuizTypes.EQuizQuestionType.SingleChoice
      );
      question2.addOption(new QuizModels.AnswerOption("6", undefined, false));
      question2.addOption(new QuizModels.AnswerOption("7", undefined, true));

      quiz.addQuestion(question1);
      quiz.addQuestion(question2);

      question1.addAnswer([0]);
      question2.addAnswer([1]);

      expect(quiz.checkScore()).toBe(100); // 100% score

      question2.addAnswer([0]); // Incorrect
      expect(quiz.checkScore()).toBe(50); // 50% score
    });
  });
});
