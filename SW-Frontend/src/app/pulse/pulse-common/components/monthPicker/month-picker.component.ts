import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MONTH_DATA } from '@app/SW/SW-common/data/month-data';

/**
 * SW month picker component
 * Author: Thilina Kelum
 * Created Date: 2021 Septmber 16
 */
@Component({
    selector: 'SW-month-picker',
    templateUrl: './month-picker.component.html',
    styleUrls: ['./month-picker.component.scss'],
})
export class MonthPickerComponent implements OnInit {

    @Input() monthStaticLabel = 'Date';
    @Input() monthLabelWithYear = false;
    @Input()  selectedMonthValue = '';
    monthList: any[] = MONTH_DATA;
    currentYear: number;
    previousYear: number;
    currentMonth: string;
    selectedYear: number;
    previousMonth: string;
    selectedMonth: string;
    yearAndMonth: string;
    monthLabel = 'Month';
    disableNext = false;
    disablePrevious = false;

    @Output() selectYearAndMonth = new EventEmitter<string>();
    @Output() selectYearAndMonthLabel = new EventEmitter<string>();

    constructor() {
        const month = '' + (new Date().getUTCMonth() + 1);
        this.currentYear = new Date().getFullYear();
        this.previousYear = new Date().getFullYear() - 1;
        this.currentMonth = month.length === 1 ? '0' + month : '' + month;
        if (month == '1') {
            this.previousMonth = '12';
        } else {
            this.previousMonth = new Date().getUTCMonth() === 1 ? '0' + new Date().getUTCMonth() : '' + new Date().getUTCMonth();
        }
        this.selectedYear = this.currentYear;
        this.selectedMonth = this.currentMonth;
        this.yearAndMonth = this.selectedYear + this.selectedMonth;
    }

    ngOnInit(): void {
        if(this.selectedMonthValue == ''){
            this.selectMonth('current');
        }else{
            this.monthLabel = this.selectedMonthValue;
        }
        this.getNextYear(true);
    }

    getNextYear(init?: boolean, isLastMonth?: boolean) {
        this.disableNext = true;
        this.disablePrevious = false;
        if (isLastMonth) {
            this.selectedYear = this.previousYear;
            MONTH_DATA.forEach(value => {
                value.active = value.id < this.currentMonth;
            });
            this.disableNext = false;
            this.disablePrevious = true;
            return;
        }
        this.selectedYear = this.currentYear;
        if (!init) {
            this.setYearAndMonth();
        }
        if (MONTH_DATA != null) {
            MONTH_DATA.forEach(value => {
                value.active = value.id > this.currentMonth;
            });
        }
    }

    getPreviousYear() {
        this.disableNext = false;
        this.disablePrevious = true;
        this.selectedYear = this.previousYear;
        this.setYearAndMonth();

        if (MONTH_DATA != null) {
            MONTH_DATA.forEach(value => {
                value.active = value.id < this.currentMonth;
            });
        }

    }

    setYearAndMonth() {
        this.yearAndMonth = this.selectedYear + this.selectedMonth;
        if (this.monthList != null) {
            this.monthList.forEach(value => {
                if (this.selectedMonth === value.id) {
                    if (this.monthLabelWithYear) {
                        this.monthLabel = this.selectedYear + ' ' + value.name;
                        this.selectYearAndMonthLabel.emit(this.monthLabel);
                    } else {
                        this.monthLabel = value.name;
                    }
                }
            });
        }
        this.selectYearAndMonth.emit(this.yearAndMonth);
    }

    selectMonth(month: string) {
        if (month === 'previous') {
            if (this.currentMonth === '01') {
                this.previousMonth = '12';
                this.selectedMonth = this.previousMonth;
                this.yearAndMonth = this.previousYear + this.selectedMonth;
                this.getNextYear(true, true);
            } else {
                this.previousMonth = new Date().getUTCMonth() === 1 ? '0' + new Date().getUTCMonth() : '' + new Date().getUTCMonth();
                this.selectedMonth = this.previousMonth.length === 1 ? '0' + this.previousMonth : '' + this.previousMonth;
                this.yearAndMonth = this.currentYear + this.selectedMonth;
                this.getNextYear(true);
            }
            this.monthLabel = 'Previous Month';
        } else {
            this.yearAndMonth = this.currentYear + this.currentMonth;
            this.monthLabel = 'Current Month';
            this.selectedMonth = this.currentMonth;
            this.getNextYear(true);
            if (this.monthList != null) {
                this.monthList.forEach(value => {
                    if (this.selectedMonth === value.id) {
                        if (this.monthLabelWithYear) {
                            this.selectYearAndMonthLabel.emit(this.selectedYear + ' ' + value.name);
                        }
                    }
                });
            }
        }
        this.selectYearAndMonth.emit(this.yearAndMonth);
    }
}
