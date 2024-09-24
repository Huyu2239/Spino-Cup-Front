import axios from "axios";

const apiBaseURL = import.meta.env.API_BASE_URL; // eslint-disable-line
const authToken = import.meta.env.AUTH_TOKEN; // eslint-disable-line

export const apiClient = axios.create({
  baseURL: apiBaseURL, // eslint-disable-line
  timeout: 2000,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${authToken}`; // eslint-disable-line
    return config;
  },
  (error) => {
    if (!(error instanceof Error)) {
      return Promise.reject(new Error(String(error)));
    }
    return Promise.reject(error);
  }
);

interface getQuizzes {
  id: number;
  question: Array<Array<string>>;
  difficulty: string;
  lnaguage: string;
}

export const getQuizzes = async (): Promise<getQuizzes | undefined> => {
  try {
    const response = await apiClient.get<getQuizzes>("/quizzes");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
