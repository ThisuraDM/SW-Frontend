import { Component, Input, OnInit } from '@angular/core';

/**
 * SW month picker component
 * Author: Thilina Kelum
 * Created Date: 2021 Septmber 21
 */
@Component({
    selector: 'SW-skeleton-loader',
    template: `
        <div [ngStyle]='getMyStyles()' class='loader'></div>
    `,
    styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent implements OnInit {

    @Input() cWidth!: number;
    @Input() cHeight!: number;
    @Input() circle = false;

    constructor() {
    }

    ngOnInit() {
    }

    getMyStyles() {
        const myStyles = {
            'width.px': this.cWidth ? this.cWidth : '',
            'height.px': this.cHeight ? this.cHeight : '',
            'border-radius': this.circle ? '50%' : '',
        };
        return myStyles;
    }
}
