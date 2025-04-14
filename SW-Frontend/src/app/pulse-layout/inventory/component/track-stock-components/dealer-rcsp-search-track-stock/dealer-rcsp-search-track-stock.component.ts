import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { Outlets } from '../../../../../../models/login-details';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransferStatus } from '@app/SW-layout/inventory/models/transfer-status';
import { NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@common/services';
import { DealerSearchStockService } from '@app/SW-layout/inventory/services/dealer-search-stock.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { StorageSettings } from '../../../../../../constants/StorageSettings';
import { RcspStockDetails, RcspStocks } from '@app/SW-layout/inventory/models/dealer-track-stock';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-dealer-rcsp-search-track-stock',
    templateUrl: './dealer-rcsp-search-track-stock.component.html',
    styleUrls: ['./dealer-rcsp-search-track-stock.component.scss'],
})
export class DealerRcspSearchTrackStockComponent implements OnInit {

    @Output() transferSelect = new EventEmitter<RcspStockDetails>();
    @Output() transferSelectOutlet = new EventEmitter<string>();

    public outletList = new Array<Outlets>();
    public ownStoreSearchForm = new FormGroup({});
    public stockResults = new Array<RcspStockDetails>();
    public transferStatus = new Array<TransferStatus>();
    public outletStoreDetails: Outlets | undefined;
    public userRole: string | undefined;

    public pageNumber = 1;
    public pageSize: number = 10;
    public totalElements = 0;
    public pageElements = 0;

    public errorMessage = 'No Data available';
    public dateRages = [
        { value: 'Today', id: 0 },
        { value: 'Yesterday', id: 1 },
        { value: 'Last 7 days', id: 7 },
        { value: 'Last 14 days', id: 14 },
        { value: 'Last 30 days', id: 30 },
        { value: 'Last 60 days', id: 60 },
        { value: 'Last 90 days', id: 90 },
        { value: 'Custom', id: -1 },
    ];

    public responseDetails: RcspStocks = {
        totalPages: 0,
        totalElements: 0,
        content: [],
        number: 0
    };

    public today: any = new Date();
    public hoveredDate: NgbDate | null = null;
    public fromDate: NgbDate | null = null;
    public toDate: NgbDate | null = null;
    public selectedOutletId = '';
    public requestStatus!: string[];

    constructor(
        private toastService: ToastService,
        private dealerSearchStockService: DealerSearchStockService,
        private localStorageService: LocalStorageService,
        private modalService: NgbModal,
        private satisfactionSurveyService: SatisfactionSurveyService,
        calendar: NgbCalendar
    ) {
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -7);
        this.toDate = calendar.getToday();
    }

    ngOnInit(): void {
        this.getRequestStatus();

        this.outletList = this.localStorageService.getOutlets() as Array<Outlets>;
        this.outletList.sort((a, b) => a.outlet_name.localeCompare(b.outlet_name));
        this.initForm(this.outletList[0].outlet_id);

        this.userRole = this.localStorageService.get(StorageSettings.POSITION);
        this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
        this.loadPage();
    }

    private initForm(outlet_id: string): void {
        this.ownStoreSearchForm = new FormGroup({
            requestID: new FormControl('', { validators: [Validators.required] }),
            dateRange: new FormControl(7, { validators: [] }),
            status: new FormControl('ALL', { validators: [] }),
            outlet: new FormControl(outlet_id, { validators: [] }),
        });
    }

    onSearch(): void {
        this.fromDate = null;
        this.toDate = null;
        this.loadPage();
    }

    onSelectAction(item: RcspStockDetails) {
        // item.navigateOption = action=='View details'?NavigationOptions.VIEW_DETAILS:this.getActionButton(item.stockRequestStatus);
        this.transferSelect.emit(item);
        this.transferSelectOutlet.emit(this.selectedOutletId);
        this.satisfactionSurveyService.show('TRACK_STOCK')
    }

    onDateRangeSelect(value: number): void {
        if (value === -1) {
        } else {
            this.fromDate = null;
            this.toDate = null;
            this.loadPage();
        }
    }

    OnOpenInfo(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = { size: 'md' }): void {
        this.modalService.open(content, modalOptions);
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
            this.loadPage();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }


    public storeNameByStoreID(storeID: string): string {
        return storeID ? this.outletList.find(outlet => outlet.outlet_id === storeID)?.outlet_name ?? '' : '';
    }

    loadPageData(page: number) {
        this.pageNumber = page - 1;
        this.loadPage(this.pageNumber);
    }

    loadPage(pageNumber?: number) {
        let pageNo: number = 0
        if (pageNumber) {
            pageNo = pageNumber;
        } else {
            pageNo = 0;
        }

        let formattedToDate = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`;
        let days = this.ownStoreSearchForm.controls.dateRange.value; // Days you want to subtract
        let date = new Date();
        let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        let formattedFromDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`;
        if (this.fromDate && this.toDate) {
            formattedFromDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
            formattedToDate = `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
        }
        if (days == 1) {
            formattedToDate = formattedFromDate;
        }
        this.selectedOutletId = this.ownStoreSearchForm.controls.outlet.value;

        this.dealerSearchStockService.getRcspStocks(
            this.ownStoreSearchForm.controls.outlet.value,
            formattedFromDate,
            formattedToDate,
            this.ownStoreSearchForm.controls.status.value === 'ALL'? '': this.ownStoreSearchForm.controls.status.value,
            this.ownStoreSearchForm.controls.requestID.value,
            pageNo, this.pageSize).subscribe(res => {
            if (res) {
                this.responseDetails = res;
                this.stockResults = res.content;

                this.totalElements = res.content.length;
            } else {
                this.stockResults = [];
            }
        }, (error) => {
            this.stockResults = [];
            this.toastService.show(!error.error.errorMessage ? 'No results to display for the search made.' : 'Error', error.error.errorMessage || '');
        });

    }

    get maxDate(): { year: number, month: number, day: number } {
        const today = new Date();
        return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    }

    private getRequestStatus() {
        this.dealerSearchStockService.getRequestStatus()
            .subscribe(value => {
                this.requestStatus = value;
            })
    }
}
