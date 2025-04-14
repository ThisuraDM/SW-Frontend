import { DealerSearchStockService } from './../../../services/dealer-search-stock.service';
import { TransferStatus } from '../../../models/transfer-status';

import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@common/services';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { StorageSettings } from 'constants/StorageSettings';
import { NgbCalendar, NgbDate, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DealerStockTransferDetails, Content} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details';
import {NavigationOptions} from '@app/SW-layout/inventory/models/trasfer-details';

@Component({
  selector: 'SW-dealer-search-to-track-stock-transfer',
  templateUrl: './dealer-search-to-track-stock-transfer.component.html',
  styleUrls: ['./dealer-search-to-track-stock-transfer.component.scss']
})
export class DealerSearchToTrackStockTransferComponent implements OnInit {


  @Output() transferSelect = new EventEmitter<Content>();
  @Output() transferSelectOutlet = new EventEmitter<string>();

  public outletList = new Array<Outlets>();

  public ownStoreSearchForm = new FormGroup({});

  public pageNumber = 1;

  public stockResults = new Array<Content>();

  public productType?: 'SERIAL' | 'NON_SERIAL';

  public errorMessage = 'Unable to load data.';
  public transferStatus = new Array<TransferStatus>();
  pageSize: number = 10;
  public outletStoreDetails: Outlets | undefined;
  public userRole: string | undefined;
  public dateRages = [
    { value: 'Today', id: 0 },
    { value: 'Yesterday', id: 1 },
    { value: 'Last 7 days', id: 7 },
    { value: 'Last 14 days', id: 14 },
    { value: 'Last 30 days', id: 30 },
    { value: 'Last 60 days', id: 60 },
    { value: 'Last 90 days', id: 90 },
    { value: 'Custom', id: -1 }
  ];
  public transferStatusList = {
          NEW_REQUEST: "NEW REQUEST",
          SO_CREATED: "SO CREATED",
          SO_REJECTED: "SO REJECTED",
          SO_APPROVED: "SO APPROVED",
          SO_CANCELLED: "SO CANCELLED",
          SO_ACCEPTED: "SO ACCEPTED",
          PAYMENT_IN_PROGRESS: "PAYMENT IN PROGRESS",
          PAYMENT_COMPLETED: "PAYMENT COMPLETED",
          DO_ISSUED: "DO ISSUED",
          DO_FULFILLED: "DO FULFILLED",
  }
  public responseDetails: DealerStockTransferDetails | undefined;
  public today: any = new Date();

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  selectedOutletId = '';
  constructor(
    private toastService: ToastService,
    private dealerSearchStockService: DealerSearchStockService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal,
    calendar: NgbCalendar
  ) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'd', -7);
    this.toDate = calendar.getToday();
  }

  ngOnInit(): void {
    this.retrieveTransferStatus();
    this.outletList = this.localStorageService.getOutlets() as Array<Outlets>;
    this.outletList.sort((a, b) => a.outlet_name.localeCompare(b.outlet_name));

    this.initForm(this.outletList[0].outlet_id);
    this.userRole = this.localStorageService.get(StorageSettings.POSITION);
    this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
    this.loadPage(1);

  }

  onSearch(): void {
    if (this.ownStoreSearchForm.invalid) {
      this.ownStoreSearchForm.markAllAsTouched();
      return;
    }
    this.fromDate = null;
    this.toDate = null;
    this.loadPage(1);
    this.retrieveTransferStatus();
  }
  getActionButton(status: string): NavigationOptions {

      if (status.toUpperCase() === this.transferStatusList.SO_APPROVED) {
        return NavigationOptions.APPROVE_REJECT;
      }
      if (status.toUpperCase() === this.transferStatusList.SO_ACCEPTED) {
        return NavigationOptions.ACKNOWLEDGE;
      }
      else {
        return NavigationOptions.VIEW_DETAILS;
      }
  }
  onSelectAction(item: Content,action:string) {
    item.navigateOption = action=='View details'?NavigationOptions.VIEW_DETAILS:this.getActionButton(item.stockRequestStatus);
    this.transferSelect.emit(item);
    this.transferSelectOutlet.emit(this.selectedOutletId);
  }
  onDateRangeSelect(value: number): void {
    if (value === -1) {
    } else {
      this.fromDate = null;
      this.toDate = null;
      this.loadPage(1);
    }
  }

  OnOpenInfo(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = { size: 'lg' }): void {
    this.modalService.open(content, modalOptions);
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.loadPage(1);
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

  private initForm(outlet_id:string): void {
    this.ownStoreSearchForm = new FormGroup({
      requestID: new FormControl(null, { validators: [Validators.required] }),
      dateRange: new FormControl(7, { validators: [] }),
      status: new FormControl(null, { validators: [] }),
      outlet: new FormControl(outlet_id, { validators: [] }),
    });
  }

  loadPage(page: number) {
    this.pageNumber = page - 1;


    let formattedtoDate = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`;
    var days = this.ownStoreSearchForm.controls.dateRange.value; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    let formattedfromDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`;
    if (this.fromDate && this.toDate) {
      formattedfromDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
      formattedtoDate = `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
    }
    if(days==1){
      formattedtoDate = formattedfromDate;
    }
    this.selectedOutletId = this.ownStoreSearchForm.controls.outlet.value;
    // this.dealerSearchStockService.getTransferDetails(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedfromDate, formattedtoDate, 'BCC2026STH', this.pageNumber, this.pageSize, this.ownStoreSearchForm.controls.requestID.value, this.ownStoreSearchForm.controls.status.value).subscribe(res => {
    this.dealerSearchStockService.getTransferDetails(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedfromDate, formattedtoDate, this.ownStoreSearchForm.controls.outlet.value, this.pageNumber, this.pageSize, this.ownStoreSearchForm.controls.requestID.value, this.ownStoreSearchForm.controls.status.value).subscribe(res => {
      if (res) {
        this.responseDetails = res;
        this.stockResults = res.content;

      } else {
        this.stockResults = [];
      }
    }, (error) => {
      this.stockResults = [];
      this.toastService.show( !error.error.errorMessage?'No results to display for the search made.':'Error', error.error.errorMessage||'');
    });

  }

  private retrieveTransferStatus(): void {
    this.dealerSearchStockService.getTransferStatus().subscribe(
      response => {
        if (response?.length) {
          this.transferStatus = response;
        } else {
          this.transferStatus = [];
        }
      }, (error) => {
        this.toastService.show('Error', error.error.errorMessage);
      }
    );
  }
  get maxDate(): { year: number, month: number, day: number } {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

}
