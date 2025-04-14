import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'SW-error-503-planned-maintenance',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './error-503-planned-maintenance.component.html',
    styleUrls: ['error-503-planned-maintenance.component.scss'],
})

export class Error503PlannedMaintenanceComponent implements OnInit {
    @Input() smFromTime = '';
    @Input() smToTime = '';
    dayName = '';
    day = '';
    monthName = ''
    time = '';
    toTime = ''

    constructor() { }
    ngOnInit() {
        let hours = '';
        let minutes = '';
        let toHours = '';
        let toMinutes = '';
        const [dateComponents, x, timeComponents, y] = this.smFromTime.split(' ');
        const [year,month, day] = dateComponents.split('-');
        [hours, minutes] = timeComponents.split(':');
        if(y == 'PM'){
            hours = (parseInt(hours,10) + 12).toString();
        }

        const date = new Date(+year, +month - 1, +day, +hours, +minutes);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.dayName = days[date.getDay()];
        this.day = day
        this.monthName = date.toLocaleString('default', { month: 'long' });
        this.time = hours + ':'+ minutes + ' '+ y;

        const [toDateComponents, a, toTimeComponents, b] = this.smToTime.split(' ');
        [toHours, toMinutes] = toTimeComponents.split(':');
        if(b == 'PM'){
            toHours = (parseInt(toHours,10) + 12).toString();
        }
        this.toTime = toHours + ':'+ toMinutes + ' '+ b;
    }
}
