import mongoose from "mongoose";

const optionModel = new mongoose.Schema({
  a: {
    type: String,
    required,
  },
  b: {
    type: String,
    required,
  },
  c: {
    type: String,
    required,
  },
  d: {
    type: String,
    required,
  },
});
const questionsModel = new mongoose.Schema({
  topics: [
    {
      name: {
        type: String,
        required: true,
      },
      numofquestions: {
        type: String,
        require: true,
      },
    },
  ],
  questions: [
    {
      subjectName: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      options: [optionModel],
      answer: {
        type: String,
        required: true
      },
      solution: {
        type: String,
        required: true
      }
    },
  ],
});

const Question = new mongoose.Model(questionsModel);
export default Questions;