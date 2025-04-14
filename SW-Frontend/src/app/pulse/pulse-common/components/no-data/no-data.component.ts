import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'SW-no-data',
    templateUrl: './no-data.component.html',
})
export class NoDataComponent implements OnInit {

    @Input() height: number = 250;
    @Input() message: string = 'It seems like there’s an issue getting the data.';
    @Input() content = 'Please refresh or change the data filter';

    constructor() {
    }

    ngOnInit(): void {
    }

}
