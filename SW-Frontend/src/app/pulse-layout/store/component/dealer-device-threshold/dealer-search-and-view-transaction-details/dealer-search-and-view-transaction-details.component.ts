import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Outlets} from '@app/SW-layout/dashboard/models/region-outlets';
import {TransactionType} from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import {
    DealerThresholdTransactionDetails, DealerThresholdTransactionDetailsListItem
} from '@app/SW-layout/store/models/threshold/dealer-threshold-transaction-details';
import {DealerThresholdService} from '@app/SW-layout/store/services/threshold/dealer-threshold.service';
import {ToastService} from '@common/services';
import {LocalStorageService} from 'services/local-storage.service';

@Component({
    selector: 'SW-dealer-search-and-view-transaction-details',
    templateUrl: './dealer-search-and-view-transaction-details.component.html',
    styleUrls: ['./dealer-search-and-view-transaction-details.component.scss']
})
export class DealerSearchAndViewTransactionDetailsComponent implements OnInit {
    @Output() backClick = new EventEmitter();
    @Input() selectedStore = ''
    public searchForm = new FormGroup({});
    public searchResults = new Array<DealerThresholdTransactionDetailsListItem>();
    public transactionTypeList = new Array<TransactionType>();
    public pageNumber = 1;


    public errorMessage = 'Unable to load data';
    pageSize = 10;

    public responseDetails: DealerThresholdTransactionDetails | undefined;

    constructor(
        private toastService: ToastService,
        private localStorageService: LocalStorageService,
        private dealerThresholdService: DealerThresholdService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.retrieveTransactionTypeList();
    }

    get maxDateFrom(): { year: number, month: number, day: number } | null {
        if (!this.searchForm.controls.toDate.value) {
            return null;
        }
        return this.searchForm.controls.toDate.value as { year: number, month: number, day: number };
    }

    get minDateFrom(): { year: number, month: number, day: number } | null {
        if (!this.searchForm.controls.toDate.value) {
            return null;
        }
        const selectedDate = this.searchForm.controls.toDate.value as { year: number, month: number, day: number };
        const today = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
        const last3MonthDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        return {year: last3MonthDate.getFullYear(), month: last3MonthDate.getMonth() + 1, day: last3MonthDate.getDate()};
    }

    get maxDateTo(): { year: number, month: number, day: number } | null {
        if (!this.searchForm.controls.fromDate.value) {
            return null;
        }
        const selectedDate = this.searchForm.controls.fromDate.value as { year: number, month: number, day: number };
        const today = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
        const next3MonthDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        return {year: next3MonthDate.getFullYear(), month: next3MonthDate.getMonth() + 1, day: next3MonthDate.getDate()};
    }

    get minDateTo(): { year: number, month: number, day: number } | null {
        if (!this.searchForm.controls.fromDate.value) {
            return null;
        }
        return this.searchForm.controls.fromDate.value as { year: number, month: number, day: number };
    }

    onSearch(): void {
        if (this.searchForm.invalid) {
            this.searchForm.markAllAsTouched();
            return;
        }
        this.loadPage(1);
    }

    onExportClick(): void {
        const selectedFromDate: { year: number, month: number, day: number } = this.searchForm.value.fromDate;
        const selectedToDate: { year: number, month: number, day: number } = this.searchForm.value.toDate;

        const formattedtoDate = `${selectedToDate.year}-${selectedToDate.month < 10 ? ('0' + selectedToDate.month) : selectedToDate.month}-${selectedToDate.day < 10 ? ('0' + selectedToDate.day) : selectedToDate.day}`;
        const formattedfromDate = `${selectedFromDate.year}-${selectedFromDate.month < 10 ? ('0' + selectedFromDate.month) : selectedFromDate.month}-${selectedFromDate.day < 10 ? ('0' + selectedFromDate.day) : selectedFromDate.day}`;

        this.dealerThresholdService.exportTransactionDetails(
            this.selectedStore,
            formattedfromDate,
            formattedtoDate,
            this.searchForm.controls.transactionType.value
        );
    }

    public loadPage(page: number) {
        this.pageNumber = page - 1;

        const selectedFromDate: { year: number, month: number, day: number } = this.searchForm.value.fromDate;
        const selectedToDate: { year: number, month: number, day: number } = this.searchForm.value.toDate;

        const formattedtoDate = `${selectedToDate.year}-${selectedToDate.month < 10 ? ('0' + selectedToDate.month) : selectedToDate.month}-${selectedToDate.day < 10 ? ('0' + selectedToDate.day) : selectedToDate.day}`;
        const formattedfromDate = `${selectedFromDate.year}-${selectedFromDate.month < 10 ? ('0' + selectedFromDate.month) : selectedFromDate.month}-${selectedFromDate.day < 10 ? ('0' + selectedFromDate.day) : selectedFromDate.day}`;

        this.dealerThresholdService.getTransactionDetails(
            this.selectedStore,
            formattedfromDate, formattedtoDate, this.pageNumber, this.pageSize,
            this.searchForm.controls.transactionType.value
        ).subscribe(res => {
          if (res) {
            this.responseDetails = res;
            this.searchResults = res.content ?? [];

          } else {
            this.searchResults = [];
          }
        }, (error) => {
          this.searchResults = [];
          this.toastService.show('Error', error.error.errorMessage);
        });

    }

    public formatDate(date: string): string {
        if (!date) {
            return '-';
        }
        return date.split(' ')?.[0];
    }

    public onBackClick():void{
        this.backClick.emit(true);
    }

    private initForm(): void {
        this.searchForm = new FormGroup({
            transactionType: new FormControl(null, {validators: [Validators.required]}),
            fromDate: new FormControl(null, {validators: [Validators.required]}),
            toDate: new FormControl(null, {validators: [Validators.required]}),
        });
    }

    private retrieveTransactionTypeList(): void {
        this.dealerThresholdService.getTransactionTypeList().subscribe(response => {
            this.transactionTypeList = response ?? [];
            this.searchForm.controls.transactionType.patchValue(this.transactionTypeList?.[0].transaction_type_name ?? null);
        });
    }

    onClickBack = () => {
        this.backClick.emit()
    }

}
