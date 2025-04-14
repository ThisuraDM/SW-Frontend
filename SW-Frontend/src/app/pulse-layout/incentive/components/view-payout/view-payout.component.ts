import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    DownloadPath,
    PayoutPages,
    PayoutPagesDetailRequest,
    PayoutPagesDetails,
} from '@app/SW-layout/incentive/models/dealer-incentive-report-payout-page';
import { SWIncentiveData } from '@app/SW-layout/incentive/models/incentive-info-card';
import { DealerIncentiveReportPayoutPageService } from '@app/SW-layout/incentive/services/dealer-incentive-report-payout-page.service';
import { Store } from '@ngrx/store';

import { IncentiveState } from '../../state/incentive-data-reducer';
import { ToastService } from '@common/services';

@Component({
  selector: 'SW-view-payout',
  templateUrl: './view-payout.component.html',
  styleUrls: ['./view-payout.component.scss']
})
export class ViewPayoutComponent implements OnInit {

    payoutPages: PayoutPages = {
        result: []
    };
    payoutPagesDetails!: PayoutPagesDetails;
    payoutPagesDetailRequest: PayoutPagesDetailRequest ={
        commission_name:'',
        payment_batch_name:'',
        payout_month_id:'',
        vendor_id:''
    };
    downloadPath: DownloadPath = {
        path:'',
    };
    incentiveData: SWIncentiveData ={
        category:'',
        month_label:'',
        payment_batch_name:'',
        payout_month_id:'',
        vendor_id:'',
        scheme_name:'',
    };
    selecteScheme!:string | undefined;

    constructor(private dealerIncentiveReportPayoutPageService: DealerIncentiveReportPayoutPageService,
                private router: Router,
                private toastService: ToastService,
                private store: Store<{ Incentive: IncentiveState }>) {
        // this.incentiveData = this.router.getCurrentNavigation()?.extras.state as SWIncentiveData;
    }

    ngOnInit(): void {
        this.getStoreData();
        this.getIncentivePayoutPages();
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
    getIncentivePayoutPages() {
        this.dealerIncentiveReportPayoutPageService.getIncentivePayoutPages(
            this.incentiveData.vendor_id,
             this.incentiveData.payout_month_id,
              this.incentiveData.payment_batch_name)
            .subscribe(value => {
                if(value){
                    this.payoutPages = value;
                    this.selecteScheme = this.payoutPages.result.find(e => e == 'All');
                    this.getIncentivePayoutPageDetails();
                }
            });
    }

    getIncentivePayoutPageDetails() {
        this.payoutPagesDetailRequest.vendor_id = this.incentiveData.vendor_id;
        this.payoutPagesDetailRequest.payout_month_id = this.incentiveData.payout_month_id;
        this.payoutPagesDetailRequest.payment_batch_name = this.incentiveData.payment_batch_name;
        this.payoutPagesDetailRequest.commission_name = this.selecteScheme;
        this.dealerIncentiveReportPayoutPageService.getIncentivePayoutPageDetails(this.payoutPagesDetailRequest)
            .subscribe(value => {
                this.payoutPagesDetails = value;
            });
    }

    downloadEligibleAndIneligiblePayoutDetails(path: string) {
        this.dealerIncentiveReportPayoutPageService.downloadEligibleAndIneligiblePayoutDetails(path)
            .subscribe(response => {
                    const file = new Blob([response.body as BlobPart], { type: 'data:application/vnd.ms-excel' });
                    const fileURL = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    //--create file name
                    let name = path.split(/([-,.])/)
                    let newName= '';
                    for (let i = 2; i < name.length -2 ; i++) {
                        newName += name[i]
                    }
                    a.download = newName + '.csv';
                    a.href = fileURL;
                    a.click();
                    document.body.removeChild(a);
            }, (error) => {
                this.toastService.show('Unable to download', 'Unable to download Eligible and Ineligible Payout details');
            });
    }

    onBackClick(){
        this.router.navigateByUrl('/incentive/incentive-report');
    }

    onChangeScheme(){
        this.getIncentivePayoutPageDetails();
    }
}
