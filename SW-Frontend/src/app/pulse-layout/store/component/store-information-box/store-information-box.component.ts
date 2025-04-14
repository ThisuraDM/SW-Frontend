import { Component, OnInit } from '@angular/core';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
    selector: 'SW-store-information-box',
    templateUrl: './store-information-box.component.html',
    styleUrls: ['./store-information-box.component.scss'],
})
export class StoreInformationBoxComponent implements OnInit {
    public outletStoreDetails: any;
    constructor(private localStorageService : LocalStorageService) {}

    ngOnInit(): void {
        this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0];
    }
}
