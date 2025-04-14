import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

function padNumber(value: number ) {
  if (!isNaN(value) && value !== null) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');
      return { day:parseInt(dateParts[0]), month:parseInt(dateParts[1]), year:parseInt(dateParts[2]) };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
    return date ?
        `${padNumber(date.day)} ${months[date.month-1]} ${date.year || ''}` :
        '';
  }
}