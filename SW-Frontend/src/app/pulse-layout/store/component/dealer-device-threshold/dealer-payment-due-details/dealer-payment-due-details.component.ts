import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { ToastService } from '@common/services';
import { LocalStorageService } from 'services/local-storage.service';

import { DealerPaymentDue } from './../../../models/threshold/dealer-payment-due';
import { DealerThresholdService } from './../../../services/threshold/dealer-threshold.service';

@Component({
    selector: 'SW-dealer-payment-due-details',
    templateUrl: './dealer-payment-due-details.component.html'
})
export class DealerPaymentDueDetailsComponent implements OnInit, OnChanges {
    public searchResults = new Array<DealerPaymentDue>();
    @Input()
    public customerCode: string | undefined;
    public pageNumber = 1;
    public userOutlets: Outlets[] = [];

    public errorMessage = 'Unable to load data.';
    public pageSize = 10;
    public responseDetails: any;
    public isLoaded = true
    constructor(
        private dealerThresholdService: DealerThresholdService,
        private toastService: ToastService,
        private localStorageService: LocalStorageService,
        ) { }

    ngOnInit(): void {
        this.userOutlets = (this.localStorageService.getOutlets() as Array<Outlets>);
    }

    ngOnChanges(): void {
        if(!(this.customerCode === null || this.customerCode === undefined || this.customerCode.length ===0)){
            this.loadData()
        }
    }

    loadData() {
        this.isLoaded = false
        const request = {
            request_body: {
                cust_code: this.customerCode,
                order_type: 'Credit'
            },
            request_header: {
                event_name: 'PaymentDueDetails',
                source_system: 'SW'
            }
        }
        this.dealerThresholdService.getPaymentDue(request).subscribe(res => {
            this.isLoaded = true
            if (res) {
                this.responseDetails = res;
                this.searchResults = res;

            } else {
                this.searchResults = [];
            }
        }, (error) => {
            this.searchResults = [];
            this.isLoaded = true
            this.toastService.show('Error', error.error.errorMessage);
        });

    }
    onExport() {
        const request = {
            request_body: {
                cust_code: this.customerCode,
                order_type: 'Credit'
            },
            request_header: {
                event_name: 'PaymentDueDetails',
                source_system: 'SW'
            }
        }
        this.dealerThresholdService.exportPaymentDue(request).subscribe(res => {

            const file = new Blob([res.body as BlobPart], { type: 'text/csv' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, (error) => {
            this.toastService.show('Unable to download', error.error.errorMessage || '');
        });
    }
}
