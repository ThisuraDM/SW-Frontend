import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    PayoutPerformanceSummaryDetails,
    PayoutSummaryDetailsPlans,
} from '@app/SW-layout/incentive/models/dealer-incentive-payout-trend';
import { SWIncentiveData } from '@app/SW-layout/incentive/models/incentive-info-card';
import { DealerIncentivePayoutTrendService } from '@app/SW-layout/incentive/services/dealer-incentive-payout-trend.service';
import { ToastService } from '@common/services';
import { NavigationService } from '@modules/navigation/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IncentiveState } from '../../state/incentive-data-reducer';

@Component({
    selector: 'SW-incentive-payout-trends-list',
    templateUrl: './incentive-payout-trends-list.component.html',
    styleUrls: ['./incentive-payout-trends-list.component.scss'],
})
export class IncentivePayoutTrendsListComponent implements OnInit {

    // @Output() onBackClick = new EventEmitter<boolean>();
    @ViewChild('summaryModel', { static: true }) summaryModel!: TemplateRef<any>;

    subscription: Subscription = new Subscription();
    incentiveData: SWIncentiveData = {
        category:'',
        month_label:'',
        payment_batch_name:'',
        payout_month_id:'',
        vendor_id:'',

    };
    payoutSummaryDetails!: PayoutPerformanceSummaryDetails;
    payoutSummaryDetailsPlans!: PayoutSummaryDetailsPlans;
    public tableDataList = new Array();
    public comName = '';
    public pageNumber = 1;
    start= 0;
    end= 10;
    endData= 0;
    selectedCommissionName = '';
    public isError = false;
    public errorMessage = 'No results found.'

    constructor(private modalService: NgbModal,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private toastService: ToastService,
                private dealerIncentivePayoutTrendService: DealerIncentivePayoutTrendService,
                public navigationService: NavigationService,
                private store: Store<{ Incentive: IncentiveState }>) {
        // this.incentiveData = this.router.getCurrentNavigation()?.extras.state as SWIncentiveData;
    }

    ngOnInit(): void {
        this.getStoreData();
        this.getIncentivePayoutReportSummaryDetails();
    }

    loadPage(event: any) {
        this.start = event * 10 - 10;
        this.end = event * 10;
        if (this.payoutSummaryDetails.result.length < this.end) {
            this.endData = this.end - (this.end - this.payoutSummaryDetails.result.length);
        } else {
            this.endData = this.end;
        }
    }

    getStoreData(){
        this.store.select('Incentive').subscribe((data) => {
        this.incentiveData.month_label = data.month_label;
        this.incentiveData.payout_month_id = data.payout_month_id;
        this.incentiveData.vendor_id = data.vendor_id;
        this.incentiveData.category = data.category;
        this.incentiveData.payment_batch_name = data.payment_batch_name;
    });
}

    getIncentivePayoutReportSummaryDetails() {
        const { month_label, payment_batch_name, ...newIncentiveData } = this.incentiveData;
        this.dealerIncentivePayoutTrendService.getIncentivePayoutReportSummaryDetails(newIncentiveData)
            .subscribe(value => {
                this.payoutSummaryDetails = value;
                if(Object.keys(this.payoutSummaryDetails).length == 0){
                    this.isError = true;
                    this.errorMessage = 'Unable to fetch data'
                }else{
                    this.isError = false;
                    this.errorMessage = 'No results found.'
                }
                this.loadPage(1)
            });
    }

    getIncentivePayoutReportSummaryPackagePlanes(comName:string) {
        this.comName = comName;
        this.dealerIncentivePayoutTrendService.getIncentivePayoutReportSummaryPackagePlanes(
            this.incentiveData.category,
            this.incentiveData.payout_month_id,
            comName,
            this.incentiveData.vendor_id)
            .subscribe(value => {
                this.payoutSummaryDetailsPlans = value;
                if(Object.keys(this.payoutSummaryDetailsPlans).length == 0){
                    this.isError = true;
                    this.errorMessage = 'Unable to fetch data'
                }else{
                    this.isError = false;
                    this.errorMessage = 'No results found.'
                }
            });
    }

    onViewSummaryClick(comName:string) {
        this.getIncentivePayoutReportSummaryPackagePlanes(comName);
        this.selectedCommissionName = comName;
        const ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            centered: true,
            size: 'lg',
        };
        this.modalService.open(this.summaryModel, ngbModalOptions);
    }

    download() {
        this.dealerIncentivePayoutTrendService.downloadIncentivePayoutAvailableListOfPackagePlans(
            this.incentiveData.category,
            this.incentiveData.payout_month_id,
            this.comName,
            this.incentiveData.vendor_id)
            .subscribe(response => {
                const file = new Blob([response.body as BlobPart], { type: 'data:application/vnd.ms-excel' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = this.incentiveData.category + '_' + this.incentiveData.payout_month_id + '_' + this.selectedCommissionName + '_' + new Date().toLocaleString() + '.xls';
                a.click();
                document.body.removeChild(a);
            }, (error) => {
                this.toastService.show('Unable to download', 'Unable to download the Excel file.');
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onBackClick(){
        this.router.navigateByUrl('/incentive');
    }
}
