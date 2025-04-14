import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DropdownComponent } from '@common/components';
import { NgbDate, Placement } from '@ng-bootstrap/ng-bootstrap';
import { SelectedDateRange, SelectedDateRangeString } from '@common/models';
import { combineLatest, Subscription } from 'rxjs';
import { DateRangeService } from '@common/services';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'SW-date-range-picker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
    @ViewChild('calendarDropdown') calendarDropdown!: DropdownComponent;
    @Input() placement: Placement = 'bottom-end';
    @Input() label: any = 'Date';
    @Input() enableCurrent: boolean = true;
    @Input() enable30: boolean = true;
    @Input() enable60: boolean = true;
    @Input() enable90: boolean = true;
    @Input() enableCustom: boolean = true;
    @Input() enableMinDate: boolean = false;
    @Input() enableMaxDate: boolean = false;

    endDate!: Date;
    startDate!: Date;
    selectedRange!: SelectedDateRange;
    selectedRangeString!: SelectedDateRangeString | string;

    hoveredDate: NgbDate | null = null;
    fromDate!: NgbDate | null;
    toDate!: NgbDate | null;

    subscription: Subscription = new Subscription();

    constructor(
        public dateRangeService: DateRangeService,
        private changeDetectorRef: ChangeDetectorRef,
        private datePipe: DatePipe,
    ) {
    }

    ngOnInit() {
        this.subscription.add(
            combineLatest([
                this.dateRangeService.endDate$,
                this.dateRangeService.startDate$,
                this.dateRangeService.selectedRange$,
            ]).subscribe(([endDate, startDate, selectedRange]) => {
                this.endDate = endDate;
                this.startDate = startDate;
                this.selectedRange = selectedRange;

                switch (selectedRange) {
                    case 'THIS_MONTH':
                        this.selectedRangeString = 'Current Month';
                        break;
                    case 'LAST_30_DAYS':
                        this.selectedRangeString = 'Last 30 Days';
                        break;
                    case 'LAST_60_DAYS':
                        this.selectedRangeString = 'Last 60 Days';
                        break;
                    case 'LAST_90_DAYS':
                        this.selectedRangeString = 'Last 90 Days';
                        break;
                    case 'CUSTOM':
                        if (this.startDate !== null && this.endDate !== null) {
                            this.selectedRangeString = this.datePipe.transform((this.startDate), 'MMM d, yyyy')
                                + ' - ' + this.datePipe.transform((this.endDate), 'MMM d, yyyy');
                        }
                        break;
                }

                this.fromDate = new NgbDate(
                    startDate.getFullYear(),
                    startDate.getMonth() + 1,
                    startDate.getDate(),
                );
                this.toDate = new NgbDate(
                    endDate.getFullYear(),
                    endDate.getMonth() + 1,
                    endDate.getDate(),
                );
                this.changeDetectorRef.detectChanges();
            }),
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    setRange(range: SelectedDateRange) {
        this.dateRangeService.setRange(range);
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
            this.dateRangeService.setCustom(this.fromDate, this.toDate);
            this.calendarDropdown.close();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate &&
            !this.toDate &&
            this.hoveredDate &&
            date.after(this.fromDate) &&
            date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    get maxDate(): { year: number, month: number, day: number } {
            const today = new Date();
        if (this.enableMaxDate) {
            return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
        }
        return { year: today.getFullYear() + 1, month: today.getMonth() + 1, day: today.getDate() };
    }

    get minDate(): { year: number, month: number, day: number } {
            const today = new Date();
        if (this.enableMinDate) {
            return { year: today.getFullYear() - 1, month: today.getMonth() + 1, day: today.getDate() };
        }
        return { year: today.getFullYear() - 10, month: today.getMonth() + 1, day: today.getDate() };;
    }
}
