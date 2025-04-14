import { Pipe, PipeTransform } from '@angular/core';

export type DATE_FORMAT =
    | 'date'
    | 'date-time';

@Pipe({
    name: 'datePipe',
})
export class DatePipePipe implements PipeTransform {

    transform(date: string, format: DATE_FORMAT): string {
        let year;
        let month;
        let day;
        let hours;
        let minutes;
        let seconds;

        if (date) {
            year = date.substring(0, 4);
            month = date.substring(4, 6);
            day = date.substring(6, 8);
            hours = date.substring(8, 10);
            minutes = date.substring(10, 12);
            seconds = date.substring(12, 14);
        } else {
            return 'N/A';
        }
        if (format === 'date') {
            return day+ '-' + month + '-' + year;
        } else if (format === 'date-time') {
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        } else {
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }
    }
}
