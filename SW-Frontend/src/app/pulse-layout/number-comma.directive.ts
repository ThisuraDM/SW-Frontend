import { DecimalPipe } from '@angular/common';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[inputWithComma]',
    providers: [DecimalPipe],
})
export class NumberCommaDirective implements OnInit, OnDestroy {
    private subscription: Subscription;

    constructor(private ngControl: NgControl, private decimal: DecimalPipe) {}

    ngOnInit() {
        const control = this.ngControl.control;
        this.subscription = control.valueChanges
            .pipe(
                map((value) => {
                    const parts = value.toString().split('.');
                    parts[0] = this.decimal.transform(parts[0].replace(/,/g, ''));
                    return parts.join('.');
                })
            )
            .subscribe((v) => control.setValue(v, { emitEvent: false }));
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
