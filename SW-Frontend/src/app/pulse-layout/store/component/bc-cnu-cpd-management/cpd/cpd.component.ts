import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CNUDetails, Content } from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu-details';
import { SubmitedCnuService } from '@app/SW-layout/store/services/bc-cnu-cpd-management/submited-cnu.service';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
  selector: 'SW-cpd',
  templateUrl: './cpd.component.html',
  styleUrls: ['./cpd.component.scss']
})
export class CpdComponent implements OnInit {
  @ViewChild('modalReport', { static: true }) report!: TemplateRef<any>;
  @ViewChild('cnuComplete', { static: true }) cnuComplete!: TemplateRef<any>;
  @ViewChild('cnuCompleteSuccessModal', { static: true }) cnuCompleteSuccess!: TemplateRef<any>;

  public tableDataList: Content[] = [];
  public cnuResponce: CNUDetails | undefined;
  public pageSize = 10;
  public pageNo = 0;
  public date: any = new Date();
  public SortHeaderName = '';
  public sortOrder = -1;
  public outletStoreDetails: Outlets | undefined;
  public fileNames: any[] = [];
  public selectField = null;
  public searchField = '';
  public selectedCNUId = 0;
  public transactionId = '';
  public isSubmitted = false;

  constructor(
    private submitedCnuService: SubmitedCnuService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,

  ) { }

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);;
    this.date = { year: yesterday.getFullYear(), month: yesterday.getMonth() + 1, day: yesterday.getDate() };

    this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
    this.submitedCnuService.OnAddCNU().subscribe(res=>{
      this.loadPage(1);
    });
  }

  loadPage(page: number) {
    this.pageNo = page - 1;
    this.selectField = null;
    this.searchField = '';
    const formattedDate = `${this.date.year}-${this.date.month}-${this.date.day}`;
    this.submitedCnuService.getCPDList(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedDate, this.outletStoreDetails?.outlet_id || '', this.pageNo, this.pageSize).subscribe(res => {
      if (res) {
        this.cnuResponce = res;
        this.tableDataList = res.content || [];
      } else {
        this.tableDataList = [];
      }
    });
  }
  searchCPD() {
    if (this.selectField == '' && this.searchField == '') {
      this.loadPage(this.pageNo)
    }
    if (this.selectField == '') {
      return;
    }
    if (this.searchField == '') {
      return;
    }
    const formattedDate = `${this.date.year}-${this.date.month}-${this.date.day}`;
    this.submitedCnuService.searchCPD(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedDate, this.outletStoreDetails?.outlet_id || '', this.pageNo - 1, this.pageSize, this.selectField || '', this.searchField).subscribe(res => {
      if (res) {
        this.cnuResponce = res;
        this.tableDataList = res?.content || [];
      } else {
        this.tableDataList = [];
      }

    });
  }
  onFieldSelect(){
    this.searchField == '';
  }
  get currentDate(): { year: number, month: number, day: number } {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);;
    return { year: yesterday.getFullYear(), month: yesterday.getMonth() + 1, day: yesterday.getDate() };
  }

  public sortTable(isAsc: number, property: string) {
    var rows = this.cnuResponce?.content || [];
    this.SortHeaderName = property;
    this.sortOrder = this.sortOrder * -1;
    if (property === 'mobile_no')
      rows.sort((a, b) => isAsc * a.mobile_no.localeCompare(b.mobile_no));
    if (property === 'amount')
      rows.sort((a, b) => isAsc * (a.amount - b.amount));
    if (property === 'payment_source')
      rows.sort((a, b) => isAsc * a.payment_source.localeCompare(b.payment_source));
    if (property === 'date')
      rows.sort((a, b) => isAsc * (<any>new Date(b.cnu_date) - <any>new Date(a.cnu_date)));
    if (property === 'order_no')
      rows.sort((a, b) => isAsc * (a.order_no.localeCompare(b.order_no)));
    if (property === 'mobile_no')
      rows.sort((a, b) => isAsc * (a.mobile_no.localeCompare(b.mobile_no)));
    if (property === 'customer_name')
      rows.sort((a, b) => isAsc * (a.customer_name.localeCompare(b.customer_name)));
    if (property === 'cnu_status')
      rows.sort((a, b) => isAsc * (a.cnu_status.localeCompare(b.cnu_status)));

    this.tableDataList = rows;
  }

  openReport() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true

    };
    this.modalService.open(this.report, ngbModalOptions);
  }
  onFileSelect() {
    const formattedDate = `${this.date.year}-${this.date.month}-${this.date.day}`;
    this.submitedCnuService.downloadCPDList(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedDate, this.outletStoreDetails?.outlet_id || '',this.selectField || '', this.searchField)
      .subscribe(response => {
        const file = new Blob([response.body], { type: 'data:application/vnd.ms-excel' });
        let fileURL = URL.createObjectURL(file);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = this.reportDate;
        a.click()
        document.body.removeChild(a);
      }, (error) => {
        this.toastService.show('CPD download failed', 'CPD report file download failed. Please try again');
      });
  }
  openCompleteCNU(cnuId: number) {
    this.selectedCNUId = cnuId;
    this.isSubmitted = false;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true
    };
    this.modalService.open(this.cnuComplete, ngbModalOptions);
  }
  closeReport() {
    this.modalService.dismissAll();
  }
  onCompleteCNU() {
    this.isSubmitted = true;
    if (this.transactionId == '') {
      return;
    }
    this.submitedCnuService.completeCNU(this.localStorageService.get(StorageSettings.LOGIN_NAME), this.selectedCNUId, this.transactionId).subscribe(res => {
      if (res.cnu_id) {
        this.modalService.dismissAll();
        this.loadPage(this.pageNo);
        this.transactionId = '';
        this.selectedCNUId = 0;
        const ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          centered: true
        };
        this.modalService.open(this.cnuCompleteSuccess, ngbModalOptions);
      }
    }, (error) => {
      this.toastService.show('Order completion failed', 'Order completion failed. Please try again');
    });
  }
  get reportDate() {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `CPD-${this.date.day}-${months[this.date.month - 1]}-${this.date.year}.xls`;
  }
  hideModel() {
    this.modalService.dismissAll()
  }
}
