import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'SW-customer-service-management',
    templateUrl: './customer-service-management.component.html',
    styleUrls: ['./customer-service-management.component.scss'],
})
export class CustomerServiceManagementComponent implements OnInit {

    public title = 'Customer Service';

    constructor() {
    }

    ngOnInit(): void {
    }
}
