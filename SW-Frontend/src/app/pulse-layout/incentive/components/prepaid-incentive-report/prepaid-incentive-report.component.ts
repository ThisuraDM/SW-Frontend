import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncentiveReportDetails } from '@app/SW-layout/incentive/models/dealer-incentive-report-payout-page';
import { SWIncentiveData } from '@app/SW-layout/incentive/models/incentive-info-card';
import { DealerIncentiveReportPayoutPageService } from '@app/SW-layout/incentive/services/dealer-incentive-report-payout-page.service';
import { ToastService } from '@common/services';
import { Store } from '@ngrx/store';

import { IncentiveState } from '../../state/incentive-data-reducer';

import * as IncentiveStoreDetails from './../../state/actions/incentive-data-action';


@Component({
    selector: 'SW-prepaid-incentive-report',
    templateUrl: './prepaid-incentive-report.component.html',
    styleUrls: ['./prepaid-incentive-report.component.scss'],
})
export class PrepaidIncentiveReportComponent implements OnInit {

    incentiveReportDetails!: IncentiveReportDetails;
    incentiveData: SWIncentiveData = {
        category: '',
        month_label:'',
        payment_batch_name:'',
        payout_month_id:'',
        vendor_id:'',
        scheme_name:'',
    };

    constructor(private dealerIncentiveReportPayoutPageService: DealerIncentiveReportPayoutPageService,
                private router: Router,
                private toastService: ToastService,
                private store: Store<{ Incentive: IncentiveState }>) {
        // this.incentiveData = this.router.getCurrentNavigation()?.extras.state as SWIncentiveData;
    }

    ngOnInit(): void {
        this.getStoreData();
        this.getIncentiveReportDetails();
    }

    getStoreData(){
        this.store.select('Incentive').subscribe((data) => {
        this.incentiveData.month_label = data.month_label;
        this.incentiveData.payout_month_id = data.payout_month_id;
        this.incentiveData.vendor_id = data.vendor_id;
        this.incentiveData.category = data.category;
        this.incentiveData.payment_batch_name = data.payment_batch_name;
        this.incentiveData.scheme_name = data.scheme_name;
    });
    }


    getIncentiveReportDetails() {
        this.dealerIncentiveReportPayoutPageService.getIncentiveReportDetails(
            this.incentiveData.category,
             this.incentiveData.payout_month_id,
              this.incentiveData.vendor_id)
            .subscribe(value => {
                this.incentiveReportDetails = value;
            });
    }

    viewPayout(payment_batch_name: string, scheme_name:string) {
        this.incentiveData.scheme_name = scheme_name;
        this.incentiveData.payment_batch_name = payment_batch_name;
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStorePaymentBatchName({ input: payment_batch_name}));
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreSchemeName({ input: scheme_name}));
        this.router.navigateByUrl('/incentive/payout-page', { state: this.incentiveData });
    }

    onBackClick(){
        this.router.navigateByUrl('/incentive');
    }

    setYearAndMonthLabel(event: any) {
        this.incentiveData.month_label = event;
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthName({ input: event}));
    }

    setYearAndMonth(event: any) {
        this.incentiveData.payout_month_id = event;
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreMonthId({ input: event}));
        this.getIncentiveReportDetails()
    }

    downloadPaymentAdvice(guid:string){
        this.dealerIncentiveReportPayoutPageService.downloadPaymentAdvice(guid,this.incentiveData.vendor_id)
        .subscribe(response => {
                const file = new Blob([response.body as BlobPart], { type: 'data:application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.download = 'Payment_Advice_'+guid+'.pdf';
                a.href = fileURL;
                a.click();
                document.body.removeChild(a);
        }, (error) => {
            this.toastService.show('Unable to download', 'Unable to download Payment Advice');
        });
    }
}
