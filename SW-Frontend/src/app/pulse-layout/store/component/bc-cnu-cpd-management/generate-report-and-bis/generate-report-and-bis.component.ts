import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CNUDetails, Content } from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu-details';
import { SubmitedCnuService } from '@app/SW-layout/store/services/bc-cnu-cpd-management/submited-cnu.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';


@Component({
  selector: 'SW-generate-report-and-bis',
  templateUrl: './generate-report-and-bis.component.html',
  styleUrls: ['./generate-report-and-bis.component.scss']
})
export class GenerateReportAndBISComponent implements OnInit {

  @ViewChild('modalReport', { static: true }) report!: TemplateRef<any>;

  public tableDataList: Content[] = [];
  public cnuResponce: CNUDetails | undefined;
  public pageSize = 10;
  public pageNo = 0;
  public date: any = new Date();
  public SortHeaderName = '';
  public sortOrder = -1;
  public outletStoreDetails: Outlets | undefined;
  public fileNames: any[] = [];


  public deleteModalRef?: NgbModalRef;
  public updateModalRef?: NgbModalRef;
  public selectedCNUId?: number;

  constructor(
    private submitedCnuService: SubmitedCnuService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const now = new Date();

    this.date = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

    this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
    this.submitedCnuService.OnAddCNU().subscribe(res=>{
      this.loadPage(1);
    });
  }

  loadPage(page: number) {
    this.pageNo = page - 1;
    const formattedDate = `${this.date.year}-${this.date.month}-${this.date.day}`;//
    this.submitedCnuService.getCNUList(this.localStorageService.get(StorageSettings.LOGIN_NAME), formattedDate, this.outletStoreDetails?.outlet_id || '', this.pageNo, this.pageSize).subscribe(res => {
      if (res) {
        this.cnuResponce = res;
        this.tableDataList = res.content;
      } else {
        this.tableDataList = [];
      }
    });
  }

  get currentDate(): { year: number, month: number, day: number } {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  openDeleteModal(cnuId: number, content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
    this.selectedCNUId = cnuId;
    this.deleteModalRef = this.modalService.open(content, modalOptions);
  }

  onDeleteCNU(): void {
    this.submitedCnuService.deleteCNU(this.selectedCNUId as number).subscribe(response => {
      if (response.cnu_status) {
        this.deleteModalRef?.close();
        this.loadPage(this.pageNo);
      }
    });
  }

  openUpdateModal(cnuId: number, content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
    this.selectedCNUId = cnuId;
    this.updateModalRef = this.modalService.open(content, modalOptions);
  }

  onAfterUpdateCNU(): void {
    this.updateModalRef?.close();
    this.loadPage(this.pageNo);
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

    this.tableDataList = rows;
  }

  openReport() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const formattedDate = `${this.date.year}-${this.date.month}-${this.date.day}`;//
    this.submitedCnuService.getListofFileNames('BC_CNU_RM1', formattedDate, 'BCC10001NTH').subscribe(res => {
      this.fileNames = res;
      this.modalService.open(this.report, ngbModalOptions);

    });
  }

  closeReport() {
    this.modalService.dismissAll();
  }

}
