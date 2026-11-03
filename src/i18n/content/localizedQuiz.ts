import {
  IMMERSION_SCENARIOS,
  QUIZ_IRRADIATION_CONTAMINATION,
  QUIZ_DECONTAMINATION,
  ADDITIONAL_MODULES,
  QuizQuestion,
  DetailedQuiz,
  AdditionalModule
} from '../../data/quizData';
import {
  IMMERSION_SCENARIOS_EN,
  QUIZ_IRRADIATION_CONTAMINATION_EN,
  QUIZ_DECONTAMINATION_EN,
  ADDITIONAL_MODULES_EN,
  TRAINER_SCENARIOS_EN
} from './quiz.en';
import { TRAINER_SCENARIOS, TrainerExerciseScenario } from '../../components/TrainerSessionModal';
import { Language } from '../types';

export interface LocalizedQuizPackage {
  immersionScenarios: QuizQuestion[];
  mainExercise: QuizQuestion;
  quizIrradiation: DetailedQuiz;
  quizDecontamination: DetailedQuiz;
  additionalModules: AdditionalModule[];
}

/**
 * Returns localized quiz and training datasets based on active language
 */
export function getLocalizedQuizData(lang: Language): LocalizedQuizPackage {
  if (lang === 'en') {
    return {
      immersionScenarios: IMMERSION_SCENARIOS_EN,
      mainExercise: IMMERSION_SCENARIOS_EN[0],
      quizIrradiation: QUIZ_IRRADIATION_CONTAMINATION_EN,
      quizDecontamination: QUIZ_DECONTAMINATION_EN,
      additionalModules: ADDITIONAL_MODULES_EN
    };
  }

  return {
    immersionScenarios: IMMERSION_SCENARIOS,
    mainExercise: IMMERSION_SCENARIOS[0],
    quizIrradiation: QUIZ_IRRADIATION_CONTAMINATION,
    quizDecontamination: QUIZ_DECONTAMINATION,
    additionalModules: ADDITIONAL_MODULES
  };
}

/**
 * Returns localized collective trainer scenarios
 */
export function getLocalizedTrainerScenarios(lang: Language): TrainerExerciseScenario[] {
  if (lang === 'en') {
    return TRAINER_SCENARIOS_EN;
  }
  return TRAINER_SCENARIOS;
}
