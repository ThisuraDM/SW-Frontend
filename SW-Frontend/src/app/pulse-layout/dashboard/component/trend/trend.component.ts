import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * SW trend component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 10
 */
@Component({
    selector: 'SW-trend',
    templateUrl: './trend.component.html',
})
export class TrendComponent implements OnChanges {
    @Input() selectedProduct!: number;
    @Input() selectedProductName!: string;
    @Input() selectedOutlet!: string;
    @Input() selectedOutletName!: string;
    @Input() selectedMonth = '';
    year = '';
    month = '';

    loaded = false;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        setInterval(() => {
            this.loaded = true;
        }, 1000);

        this.year = this.selectedMonth.substring(0, 4);
        const convertMOnth: string = this.selectedMonth.substring(4, 6);
        const month = new Date(convertMOnth);
        this.month = month.toLocaleString('en-us', { month: 'long' });
    }
}
