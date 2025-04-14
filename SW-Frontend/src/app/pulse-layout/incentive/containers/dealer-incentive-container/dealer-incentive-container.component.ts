import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { IncentiveInfoCard } from '@app/SW-layout/incentive/models/incentive-info-card';
import { IncentiveInfoCardService } from '@app/SW-layout/incentive/services/incentive-info-card.service';
import { Store } from '@ngrx/store';

import { LocalStorageService } from '../../../../../services/local-storage.service';

import * as IncentiveStoreDetails from './../../state/actions/incentive-data-action';
import { State } from './../../state/incentive-data-reducer';
@Component({
    selector: 'SW-dealer-incentive-container',
    templateUrl: './dealer-incentive-container.component.html',
    styleUrls: ['./dealer-incentive-container.component.scss'],
})
export class DealerIncentiveContainerComponent implements OnInit, OnChanges {

    public title = 'Incentive Summary Dashboard';
    public dashboardDate = new Date();

    public incentiveInfoCard!: IncentiveInfoCard;
    public selectedMonthAndYear!: string;
    public selectedMonthAndYearLabel!: string;
    public vendorId = '903756';
    // public vendorId!: string;

    constructor(private incentiveInfoCardService: IncentiveInfoCardService,
                private storageService: LocalStorageService,
                private store: Store<State>) {
    }

    ngOnInit(): void {
        this.getOwnerIdFromLoginUsersOutlet();
        this.payoutPerformanceSummary();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthName({ input: this.selectedMonthAndYearLabel}));
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthId({ input: this.selectedMonthAndYear}));
    }

    getOwnerIdFromLoginUsersOutlet() {
        const outlets: any[] = this.storageService.getOutlets();
        if (outlets) {
            outlets.forEach(value => {
                if (value.owner_id) {
                    this.vendorId = value.owner_id;
                    this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreVendorId({ input: this.vendorId}));
                    return;
                }
            });
        }
    }

    payoutPerformanceSummary() {
        this.incentiveInfoCardService.payoutPerformanceSummary(this.vendorId, this.selectedMonthAndYear)
            .subscribe(value => {
                this.incentiveInfoCard = value;
            });
    }

    getSelectedMonthAndYear(event: string) {
        this.selectedMonthAndYear = event;
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthId({ input: this.selectedMonthAndYear}));
        this.payoutPerformanceSummary();
    }

    getSelectedYearAndMonthLabel(event: string) {
        this.selectedMonthAndYearLabel = event;
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthName({ input: this.selectedMonthAndYearLabel}));
    }
}
