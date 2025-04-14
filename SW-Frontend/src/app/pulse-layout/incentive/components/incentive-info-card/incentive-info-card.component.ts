import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncentiveInfoCardDonuts } from '@app/SW-layout/incentive/models/incentive-info-card';
import { Store } from '@ngrx/store';

import { State } from '../../state/incentive-data-reducer';

import * as IncentiveStoreDetails from './../../state/actions/incentive-data-action';

@Component({
    selector: 'SW-incentive-info-card',
    templateUrl: './incentive-info-card.component.html',
    styleUrls: ['./incentive-info-card.component.scss'],
})
export class IncentiveInfoCardComponent implements OnInit {

    @Input() public cardData!: IncentiveInfoCardDonuts;
    @Input() public selectedMonthAndYear!: string;
    @Input() public monthAndYearLabel!: string;
    @Input() public vendorId!: string;
    routingData: any = {};


    constructor(private router: Router, private store: Store<State>) {
    }

    ngOnInit(): void {
    }

    viewDetails() {
        this.routingData = {
            category: this.cardData.category_code === null ? '-' : this.cardData.category_code,
            payout_month_id: this.selectedMonthAndYear === null ? '-' : this.selectedMonthAndYear,
            vendor_id: this.vendorId === null ? '-' : this.vendorId,
            month_label: this.monthAndYearLabel === null ? '-' : this.monthAndYearLabel,
        };
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreCategory({ input: this.cardData.category_code}));
        this.router.navigateByUrl('/incentive/payout-trends', { state: this.routingData });
    }
}
