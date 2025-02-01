import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  badAnswers: { type: [String], required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 }
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
