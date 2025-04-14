import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SatisfactionSurveyComponent } from './satisfaction-survey.component';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { FormsModule } from '@angular/forms';
import { SurveyViewComponent } from '@app/SW-layout/satisfaction-survey/containers/survey-view/survey-view.component';

@NgModule({
    declarations: [SatisfactionSurveyComponent, SurveyViewComponent],
    imports: [CommonModule, FeatherModule, FormsModule],
    exports: [
        SatisfactionSurveyComponent,
        SurveyViewComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SatisfactionSurveyModule {}
