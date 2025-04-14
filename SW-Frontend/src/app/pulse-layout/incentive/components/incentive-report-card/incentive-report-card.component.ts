import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Categories } from '@app/SW-layout/incentive/models/incentive-report';
import {
    DealerIncentiveReportCardService,
} from '@app/SW-layout/incentive/services/dealer-incentive-report-card.service';
import { IncentiveReportService } from '@app/SW-layout/incentive/services/incentive-report.service';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { State } from '../../state/incentive-data-reducer';

import * as IncentiveStoreDetails from './../../state/actions/incentive-data-action';

@Component({
    selector: 'SW-incentive-report-card',
    templateUrl: './incentive-report-card.component.html',
    styleUrls: ['./incentive-report-card.component.scss'],
})
export class IncentiveReportCardComponent implements OnChanges{
    @ViewChild('DownloadCP58TaxForm', { static: true }) downloadCP58TaxForm!: TemplateRef<any>;
    public productCategories: string[] = [];
    public pastSevenYearsList: string[] = [];
    public selectedTaxForm: string = '';

    @Input() public selectedMonthAndYear!: string;
    @Input() public monthAndYearLabel!: string;
    @Input() public vendorId!: string;
    routingData = {
        title: 'Incentive Payout History - Dealer',
        breadcrumbs: [
            {
                text: 'Incentive Payout History',
                active: true,
            },
        ],
        payout_month_id: this.selectedMonthAndYear,
        vendor_id: this.vendorId,
        monthLabel: this.monthAndYearLabel,
        // role: 'DEALER_INCENTIVE',
    }

    constructor(private incentiveReportService: IncentiveReportService,
                private modalService: NgbModal,
                private dealerIncentiveReportCardService: DealerIncentiveReportCardService,
                private router : Router,
                private toastService: ToastService,
                private store: Store<State>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCategories();
        this.getLastSevenYears();
    }

    getLastSevenYears() {
        let currentYear = new Date().getFullYear() - 1;
        let yearsList = [];
        for (let i = 0; i < 7; i++) {
            let year = ''+currentYear--
            yearsList.push(year);
        }
        this.pastSevenYearsList = yearsList;
        this.selectedTaxForm =this.pastSevenYearsList[0];
    }

    getCategories() {
        this.incentiveReportService.getCategories(this.vendorId, this.selectedMonthAndYear)
            .subscribe((categories: Categories) => {
                if (categories != null) {
                    this.productCategories = categories.result;
                }
            });
    }

    download() {
        this.dealerIncentiveReportCardService.downloadC58TaxForm(this.vendorId, this.selectedTaxForm)
            .subscribe(response => {
                const file = new Blob([response.body as BlobPart], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = 'C58_Tax_Form.pdf';
                a.click();
                this.toastService.show('CP58 Tax Form Downloaded', 'The CP58 Tax Form ' + this.selectedTaxForm + ' has been Downloaded');
            }, err => {
                console.log(err);
                this.toastService.show(
                    'Unable to download the tax form', 'No CP58 data found for ' +this.vendorId+ '. Year ' +this.selectedTaxForm);
            });
    }

    onViewDownloadCP58TaxForm() {
        const ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            centered: true,
            size: 'md',
        };
        this.modalService.open(this.downloadCP58TaxForm, ngbModalOptions);
    }

    payoutHistory() {
        this.router.navigateByUrl('/incentive/payout-history', { state: this.routingData });
    }

    incentiveReport(category:string) {
        this.store.dispatch(IncentiveStoreDetails.setIncentiveStoreCategory({ input: category}));
        this.router.navigateByUrl('/incentive/incentive-report', { state: this.routingData });
    }
}
