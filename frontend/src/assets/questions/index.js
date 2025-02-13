import { questionList1 } from "./questionList_1";
import { questionList2 } from "./questionList_2";
import { questionList3 } from "./questionList_3";
import { questionList4 } from "./questionList_4";
import { questionList5 } from "./questionList_5";

// DIFFICULTY MODE
export const questionLists = {
  1: questionList1,
  2: questionList2,
  3: questionList3,
  4: questionList4,
  5: questionList5,
};

// MODE ALL
export const allQuestions = [
  ...questionList1,
  ...questionList2,
  ...questionList3,
  ...questionList4,
  ...questionList5,
];
