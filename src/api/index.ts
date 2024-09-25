import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:1323",
  timeout: 2000,
});

interface Quiz {
  id: number;
  question: Array<Array<string>>;
  difficulty: string;
  lnaguage: string;
}

export type Quizzes = Array<Quiz>;

export interface QuizResult {
  id: number;
  is_correct: boolean;
}

export const getQuizzes = async (): Promise<Quizzes | undefined> => {
  try {
    const response = await apiClient.get<Quizzes>("/quizzes");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getResult = async (
  quizId: string,
  x: number,
  y: number,
  editedText: string
): Promise<QuizResult | undefined> => {
  try {
    const response = await apiClient.get<QuizResult>(
      `/quizzes/check/${quizId}`,
      {
        params: {
          x: x,
          y: y,
          editedText: editedText,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
