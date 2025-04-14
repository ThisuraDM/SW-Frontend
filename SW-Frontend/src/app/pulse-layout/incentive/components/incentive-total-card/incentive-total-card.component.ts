import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'SW-incentive-total-card',
  templateUrl: './incentive-total-card.component.html'
})
export class IncentiveTotalCardComponent implements OnInit {

    @Input() totalIncentive: number = 0;
    @Input() month: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
