export interface SurveyDetails {
    has_complete: boolean,
    id: SurveyMonthDetails;
}

export interface SurveyMonthDetails {
    loginName: string,
    monthValue: number,
    surveyModule: SurveyModule,
    yearValue: number;
}

export interface SurveyModule {
    active: boolean,
    id: number,
    module_description: string,
    module_name: string
}

export interface SurveyQuestion {
    active: boolean,
    id: number,
    question_description: string,
    child_triggers_on: string,
    child_questions: SurveyChildOptions[],
    survey_question_options: SurveyQuestionOptions[],
    survey_question_type: surveyQuestionType
    survey_module: SurveyModule;
}

export interface SurveyChildOptions {
    id: number,
    active: boolean,
    question_description: string,
    survey_question_options: SurveyQuestionOptions[],
    child_triggers_on: string,
    child_questions: SurveyChildOptions[],
    survey_question_type: surveyQuestionType
    survey_module: SurveyModule;
}

export interface SurveyQuestionOptions {
    active: boolean,
    content: string,
    id: number
}

export interface surveyQuestionType {
    active: boolean,
    id: number,
    type_name: string
}

export interface SurveyAnswer {
    answer: string,
    question_id: number
}

export interface SurveySettings {
    id: string,
    moduleId: string,
    moduleName: string
}

