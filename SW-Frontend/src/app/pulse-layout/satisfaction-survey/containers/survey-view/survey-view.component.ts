import { Component, OnInit } from '@angular/core';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
  selector: 'SW-survey-view',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss']
})
export class SurveyViewComponent implements OnInit {

  constructor(public satisfactionSurveyService: SatisfactionSurveyService) { }

  ngOnInit(): void {
  }

}
