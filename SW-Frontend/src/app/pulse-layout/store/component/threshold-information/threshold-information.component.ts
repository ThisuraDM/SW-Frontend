import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'SW-threshold-information',
    templateUrl: './threshold-information.component.html'
})
export class ThresholdInformationComponent implements OnInit {
    @Input()
    thresholdName = '';
    @Input()
    thresholdValue = '';
    constructor() {
    }

    ngOnInit(): void {
    }

}
