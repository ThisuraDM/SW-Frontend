import { Component, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { PayoutHistoryIncentiveType } from '@app/SW-layout/incentive/models/dealer-incentive-payout-history';
import { SWIncentiveData } from '@app/SW-layout/incentive/models/incentive-info-card';
import { DealerIncentivePayoutHistoryService } from '@app/SW-layout/incentive/services/dealer-incentive-payout-history.service';
import { Store } from '@ngrx/store';

import { IncentiveState } from './../../state/incentive-data-reducer';
import { ToastService } from '@common/services';

@Component({
    selector: 'SW-incentive-payout-history',
    templateUrl: './incentive-payout-history.component.html',
    styleUrls: ['./incentive-payout-history.component.scss'],
})
export class IncentivePayoutHistoryComponent implements OnInit {
    // @Output() onBackClick = new EventEmitter<boolean>();
    monthLabelForTable!: string;
    payoutHistoryIncentiveTypes!: PayoutHistoryIncentiveType[];
    incentiveData : SWIncentiveData ={
        category : '',
        month_label : '',
        payment_batch_name : '',
        payout_month_id : '',
        vendor_id : '',
    };

    constructor(private dealerIncentivePayoutHistoryService: DealerIncentivePayoutHistoryService,
                private router: Router,
                private toastService: ToastService,
                private store: Store<{ Incentive: IncentiveState }>) {
        // this.incentiveData = this.router.getCurrentNavigation()?.extras.state as SWIncentiveData;
    }

    ngOnInit(): void {
        this.getIncentiveTypes();
        this.getStoreData();
    }

    ngOnChanges(changes:SimpleChange){
        if(changes?.currentValue){
            this.getStoreData();
        }
    }
    getStoreData(){
            this.store.select('Incentive').subscribe((data) => {
            this.incentiveData.month_label = data?.month_label?data.month_label:'';
            this.incentiveData.payout_month_id = data.payout_month_id;
            this.incentiveData.vendor_id = data.vendor_id;
            this.setYearAndMonthLabel(this.incentiveData.month_label)
        });
    }

    getIncentiveTypes() {
        this.dealerIncentivePayoutHistoryService.getPayoutHistoryIncentiveTypes()
            .subscribe(value => {
                this.payoutHistoryIncentiveTypes = value;
            });
    }

    download(incentiveType: string) {
        this.dealerIncentivePayoutHistoryService.downloadIncentivePayoutHistory(incentiveType, this.incentiveData?.payout_month_id, this.incentiveData?.vendor_id)
            .subscribe(response => {
                const file = new Blob([response.body as BlobPart], { type: 'data:application/vnd.ms-excel' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = 'Incentive_Payout_History_' +incentiveType+'_'+this.incentiveData?.payout_month_id+'_'+this.incentiveData?.vendor_id+'.csv';
                a.click();
                document.body.removeChild(a);
            }, (error) => {
                this.toastService.show('Unable to download', 'Unable to download payout history details');
            });
    }

    onBackClick(){
        this.router.navigateByUrl('/incentive');
    }

    setYearAndMonthLabel(event: any) {
        this.incentiveData.month_label = event;
        let month =  event.split(' ');
        this.monthLabelForTable = month[1];
    }

    setYearAndMonth(event: any) {
        this.incentiveData.payout_month_id = event;
    }
}
