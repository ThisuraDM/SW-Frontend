import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SurveyAnswer, SurveyQuestion } from '@app/SW-layout/satisfaction-survey/models/survey-details';
import { SatisfactionSurveyHttpService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey-http.service';
import { LocalStorageService } from '../../../services/local-storage.service';


const ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    centered: true,
    size: 'md',
};

@Component({
    selector: 'SW-satisfaction-survey',
    templateUrl: './satisfaction-survey.component.html',
    styleUrls: ['./satisfaction-survey.component.scss'],
})
export class SatisfactionSurveyComponent implements OnInit {

    @Input() moduleId!: string;
    @Output() isFinishSurvey = new EventEmitter<boolean>();

    @ViewChild('SWBackofficeSurvey', { static: true }) surveyModal!: TemplateRef<any>;
    surveyQuestion: SurveyQuestion[] = [];
    surveyAnswer = new Map<number, string>();
    questionNumber: number = 0;
    childQuestionNumber: number = 0;
    showYesNoError: boolean = false;
    selectedYesButton: boolean = false;
    selectedNoButton: boolean = false;
    showOpenEndedAnswerError: boolean = false;
    openEndedAnswer!: string;
    showChildPath: boolean = false;
    fistTime: boolean = false;

    stared: boolean = false;
    end: boolean = false;
    content: boolean = false;

    currentChildQuestionId: number = 0;
    currentQuestionId: number = 0;
    singleAnswerRadio: any;

    constructor(private modalService: NgbModal,
                private satisfactionSurveyHttpService: SatisfactionSurveyHttpService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.getSatisfactionSurveyQuestion();
        this.stared = true;
        this.modalService.open(this.surveyModal, ngbModalOptions);
    }

    getSatisfactionSurveyQuestion() {
        this.satisfactionSurveyHttpService.getUserSurveyQuestions(this.localStorageService.getUserLoginName(), this.moduleId).subscribe(value => {
            this.surveyQuestion = value;
        });
    }

    next() {
        let currentQuestion: SurveyQuestion;
        let currentAnswer;
        if (!this.showChildPath) {
            currentQuestion = this.getQuestionById();
            currentAnswer = this.surveyAnswer.get(this.currentQuestionId);
        } else {
            currentQuestion = this.getChildQuestionById();
            currentAnswer = this.surveyAnswer.get(this.currentChildQuestionId);
        }
        if (currentQuestion.survey_question_type.type_name == 'YES_NO') {
            if (!currentAnswer) {
                this.showYesNoError = true;
                return;
            } else {
                this.showYesNoError = false;
                this.resetYesNoButtonState();
            }
            if (currentQuestion.child_questions.length) {
                if (currentQuestion.child_triggers_on === 'NO') {
                    if (currentAnswer === 'false') {
                        this.showChildPath = true;
                        if (this.fistTime) {
                            this.childQuestionNumber++;
                        }
                    } else {
                        this.checkItemSaveOrGetNextQuestion();
                    }
                } else if (currentQuestion.child_triggers_on === 'YES') {
                    if (currentAnswer === 'true') {
                        this.showChildPath = true;
                        if (this.fistTime) {
                            this.childQuestionNumber++;
                        }
                    } else {
                        this.checkItemSaveOrGetNextQuestion();
                    }
                }
            } else {
                this.checkItemSaveOrGetNextQuestion();
            }
        } else if (currentQuestion.survey_question_type.type_name == 'OPEN_ENDED') {
            if (!this.openEndedAnswer) {
                this.showOpenEndedAnswerError = true;
                return;
            }
            this.setAnswer(this.openEndedAnswer);
            if(!this.showChildPath) {
                this.checkItemSaveOrGetNextQuestion();
            }
        } else if (currentQuestion.survey_question_type.type_name == 'SINGLE_SELECTION') {
            if (this.singleAnswerRadio === null) {
                this.showYesNoError = true;
                return;
            }
            this.setAnswer(this.singleAnswerRadio);
            this.checkItemSaveOrGetNextQuestion();
        }
        if (this.showChildPath) {
            if (this.fistTime) {
                if (this.surveyQuestion[this.questionNumber].child_questions.length == this.childQuestionNumber + 1) {
                    if (this.questionNumber < this.surveyQuestion.length) {
                        if (this.surveyQuestion.length !== this.questionNumber && (this.surveyQuestion.length - this.questionNumber) !== 1) {
                            this.questionNumber++;
                            this.showChildPath =false;
                            this.fistTime = false;
                        } else {
                            this.saveSurveyData();
                        }
                    } else {
                        this.saveSurveyData();
                    }
                }
            } else {
                this.fistTime = true;
            }
        }
    }

    checkItemSaveOrGetNextQuestion() {
        if (this.surveyQuestion.length !== this.questionNumber && (this.surveyQuestion.length - this.questionNumber) !== 1) {
            this.questionNumber++;
        } else {
            this.saveSurveyData();
        }
    }

    private saveSurveyData() {
        const x = Array.from(this.surveyAnswer.keys());
        const y = Array.from(this.surveyAnswer.values());

        let surveyAnswerList: SurveyAnswer[] = [];
        for (let i = 0; i < this.surveyAnswer.size; i++) {
            const answer = {
                question_id: x[i],
                answer: y[i],
            };
            surveyAnswerList.push(answer);
        }

        this.satisfactionSurveyHttpService.saveSurveyQuestions(surveyAnswerList, this.localStorageService.getUserLoginName(), this.moduleId)
            .subscribe(value => {
                this.end = true;
                this.content = false;

                this.satisfactionSurveyHttpService.getUserSurveyDetails(this.localStorageService.getUserLoginName())
                    .subscribe(response => {
                        if (response) {
                            this.localStorageService.setSurvey(response);
                        }
                    });
            });
    }

    previous() {
        if (!this.showChildPath) {
            if (this.questionNumber !== 0) {
                this.questionNumber--;
            }
        } else {
            if (this.childQuestionNumber !== 0) {
                this.childQuestionNumber--;
            } else {
                this.showChildPath = false;
                this.fistTime = false;
            }
        }
        this.getQuestionDescription();
        this.getAnswer();
    }

    getAnswer() {
        if (!this.showChildPath) {
            this.setYesNoButtonState(this.surveyAnswer.get(this.getQuestionById().id) === 'true' ? true :
                this.surveyAnswer.get(this.getQuestionById().id) === 'false' ? false :
                    this.surveyAnswer.get(this.getQuestionById().id));
        } else {
            this.setYesNoButtonState(this.surveyAnswer.get(this.getChildQuestionById().id) === 'true' ? true : false);
        }
    }

    setAnswer(answer: any) {
        this.setYesNoButtonState(answer);
        if (!this.showChildPath) {
            this.surveyAnswer.set(this.getQuestionById().id, answer + '');
        } else {
            this.surveyAnswer.set(this.getChildQuestionById().id, answer + '');
        }
        this.getQuestionDescription();
    }

    mayBeLater() {
        this.isFinishSurvey.emit(true);
    }

    closeModal() {
        this.isFinishSurvey.emit(true);
    }

    letsDoThis() {
        this.stared = false;
        this.content = true;
    }

    getQuestionDescription() {
        if (!this.showChildPath) {
            this.currentQuestionId = this.surveyQuestion[this.questionNumber].id;
            return this.surveyQuestion[this.questionNumber].question_description;
        } else {
            this.currentChildQuestionId = this.surveyQuestion[this.questionNumber].child_questions[this.childQuestionNumber].id;
            return this.surveyQuestion[this.questionNumber].child_questions[this.childQuestionNumber].question_description;
        }
    }

    private setYesNoButtonState(answer: any) {
        if (answer == true) {
            this.selectedYesButton = true;
            this.selectedNoButton = false;
        } else if (answer == false) {
            this.selectedYesButton = false;
            this.selectedNoButton = true;
        } else {
            this.openEndedAnswer = '';
        }
    }

    private resetYesNoButtonState() {
        this.selectedYesButton = false;
        this.selectedNoButton = false;
    }

    private getQuestionById() {
        return this.surveyQuestion.filter(value => value.id == this.currentQuestionId)[0];
    }

    private getChildQuestionById() {
        return this.surveyQuestion
            .filter(value => value.id == this.currentQuestionId)[0].child_questions
            .filter(subValue => subValue.id == this.currentChildQuestionId)[0];
    }

    getTitleName() {
        return this.surveyQuestion[this.questionNumber].survey_module.module_description;
    }
}
