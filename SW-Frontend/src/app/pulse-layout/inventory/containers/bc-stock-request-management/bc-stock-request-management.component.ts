import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'SW-bc-stock-request-management',
    templateUrl: './bc-stock-request-management.component.html'
})
export class BcStockRequestManagementComponent implements OnInit {

    public displayedScreen: 'main' | 'view-summary' = 'main';

    public requestId = '';

    constructor() {
    }

    ngOnInit(): void {
    }

    onConfirmClick(requestId: string): void {
        this.requestId = requestId;
        this.displayedScreen = 'view-summary';
    }


}
