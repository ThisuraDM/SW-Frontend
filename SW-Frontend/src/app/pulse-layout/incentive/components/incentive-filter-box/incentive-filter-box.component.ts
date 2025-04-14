import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'SW-incentive-filter-box',
  templateUrl: './incentive-filter-box.component.html'
})
export class IncentiveFilterBoxComponent implements OnInit {

    @Output() monthSelect = new EventEmitter<string>();
    @Output() monthSelectLabel = new EventEmitter<string>();
    selectedMonth = '';

    constructor() {
    }

    ngOnInit(): void {
    }

    setYearAndMonth(yearAndMonth: string) {
        this.selectedMonth = yearAndMonth;
        this.monthSelect.emit(this.selectedMonth);
    }

    setYearAndMonthLabel(yearAndMonthLabel: any) {
        this.monthSelectLabel.emit(yearAndMonthLabel);
    }
}
