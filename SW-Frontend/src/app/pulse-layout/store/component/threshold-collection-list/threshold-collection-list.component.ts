import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

import { ThresholdCollectionList, ThresholdsCollection } from '../../models/threshold/threshold-collection';
import { ThresholdService } from '../../services/threshold/threshold.service';

import { ThresholdDetails } from './../../models/threshold/threshold-details';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
  selector: 'SW-threshold-collection-list',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './threshold-collection-list.component.html',
  styleUrls: ['threshold-collection-list.component.scss'],
})
export class ThresholdCollectionListComponent implements OnInit {
  @ViewChild('modalConfirmTopUp', { static: true }) confirmSubmit!: TemplateRef<any>;

  public tablePastDataList: ThresholdDetails[] = [];
  public thresholdResponce: ThresholdDetails[] | undefined;
  public pageSize = 10;
  public pageNo = 0;
  public date: any = new Date();
  public SortHeaderName = '';
  public sortOrder = -1;
  public isDataLoaded = false;
  public currentCollectionList: ThresholdCollectionList[] = [];
  public total_elements = 0;
  public page_number = 0;
  public page_size = 10;
  public headerId =0;

  public fileList: any[] = [];
  public dateRangeSelected = 0;
  public loaded = false;
  public pageStates = { prev: -1, current: 0, next: 1 ,first:2}
  total: number =0;
  public thesholdSubmitConfirmDisabled = false;

  constructor(private thresholdService: ThresholdService,
              private localStorageService: LocalStorageService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private satisfactionSurveyService: SatisfactionSurveyService) {
  }

  ngOnInit() {
    this.loadPage('current');
    this.loadCLPage(1);
    this.isDataLoaded = true;
    this.thresholdService.OnAddCollection().subscribe(res=>{
      this.loadCLPage(1);
  });
  }
  loadPage(state: 'prev' | 'current' | 'next' | 'first') {
    this.pageNo = this.pageNo + this.pageStates[state];
    if(state=='first'){
      this.pageNo = 0;
    }
    this.loaded = false;
    this.thresholdService.getPastThresholdList(this.localStorageService.get(StorageSettings.LOGIN_NAME), this.dateRangeSelected+'', (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null, this.pageNo, this.pageSize).subscribe(res => {
      if (res && res.length) {
        this.thresholdResponce = res || [];
        this.tablePastDataList = res || [];
      }else{
        this.thresholdResponce = [];
        this.tablePastDataList = [];
      }
      this.loaded = true;
    });
  }
  setYearAndMonth(yearMonth: string) {

  }
  public sortTable(isAsc: number, property: string) {
    const rows = this.thresholdResponce || [];
    this.SortHeaderName = property;
    this.sortOrder = this.sortOrder * -1;
    if (property === 'requested_date')
      rows.sort((a, b) => isAsc * ((new Date(b.requested_date) as any) - (new Date(a.requested_date) as any)));
    if (property === 'threshold_amount')
      rows.sort((a, b) => isAsc * (a.threshold_amount.localeCompare(b.threshold_amount)));
    if (property === 'transaction_id')
      rows.sort((a, b) => isAsc * (a.transaction_id.localeCompare(b.transaction_id)));
    if (property === 'status')
      rows.sort((a, b) => isAsc * (a.status.localeCompare(b.status)));

    this.tablePastDataList = rows;
  }
  public sortCollectionTable(isAsc: number, property: string) {
    const rows = this.currentCollectionList || [];
    this.SortHeaderName = property;
    this.sortOrder = this.sortOrder * -1;
    if (property === 'bank_in_type')
      rows.sort((a, b) => isAsc * (a.bank_in_type.toString().localeCompare(b.bank_in_type)));
    if (property === 'bank_in_amount')
      rows.sort((a, b) => isAsc * (parseFloat(a.bank_in_amount) - parseFloat(b.bank_in_amount)));
      if (property === 'bank_in_time')
      rows.sort((a, b) => isAsc * ((new Date(b.bank_in_time) as any) - (new Date(a.bank_in_time) as any)));
    if (property === 'file_name')
      rows.sort((a, b) => isAsc * (a.threshold_attachment.file_name.localeCompare(b.threshold_attachment.file_name)));
    if (property === 'reference_id')
      rows.sort((a, b) => isAsc * (a.reference_id.localeCompare(b.reference_id)));

    this.currentCollectionList = rows;
  }

  onFileChanged(event: any) {
    this.fileList.unshift(event.target.files[0] as any);
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }
  onImageDownload(fileName: string, attachmentId: number): void {
    this.thresholdService.getImageByImageReference(fileName, attachmentId);
  }

  onDeleteCollection(collectionId: number): void {
    this.thresholdService.deleteCollection(collectionId, this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe(
      response => {
        if (response) {
          this.loadCLPage(1);
        }
      },(error)=>{
        this.toastService.show(error.error.errorMessage||'', '');
      }
    );
  }
  onSubmitCurrentThresholds() {
    this.thesholdSubmitConfirmDisabled = true;
    this.thresholdService.submitThreshold((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null, this.headerId+'',this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe(response => {
      if (response) {
        // if( this.fileList.length>0){
        //   this.onUploadDayEndReports();
        // }else{
        this.toastService.show('Success', '');
        this.modalService.dismissAll();
        this.loadCLPage(1);
        // }
        this.thresholdService.thresholdSubmitted()
          // Threshold survey trigger point
        this.satisfactionSurveyService.show("THRESHOLD_BC")
      }
      this.thesholdSubmitConfirmDisabled = false;
    },(error)=>{
      this.toastService.show(error?.error?.errorMessage||'', '');
      this.thesholdSubmitConfirmDisabled = false;
    })
  }
  onUploadDayEndReports() {
    this.thresholdService.uploadEndDayAttachments((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null, this.fileList).subscribe(response => {
      if (response) {
        this.toastService.show('Success', '');
        this.modalService.dismissAll();
        this.loadCLPage(1);
      }
    },(error)=>{
      this.toastService.show(error.error.errorMessage||'', '');

    })
  }

  getThresholdCollectionList(page: number) {
    const outletsID = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
    this.thresholdService.getThresholdCollectionList(outletsID).subscribe((collectionList: ThresholdsCollection) => {
      if (collectionList != null) {
        this.total_elements = collectionList.threshold_collection_item_list.length;
        this.currentCollectionList = collectionList.threshold_collection_item_list.slice((page-1)*this.page_size,page * this.page_size);
        this.headerId = collectionList.collection_header_id;
        this.thresholdService.threshold30Exceeded(collectionList.threshold_collection_item_list.length>30);
      }else{
        // this.thresholdService.thresholdSubmitted();
      }
    });
  }
  openConfirmSubmit() {
    this.total = 0;
    this.currentCollectionList.forEach(c=>{
      this.total += parseFloat(c.bank_in_amount);
    })
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size:'lg'
    };
    this.modalService.open(this.confirmSubmit, ngbModalOptions);
  }
  get fileSizesExceeded(){
    return this.fileList.filter(f=>f.size>2000000).length>0;
  }

  loadCLPage(page: number) {
    this.page_number = page;
    this.getThresholdCollectionList(page);
  }
  PastThresholDate(date:string):string{
    var dateItems =date?.split('T')[0]?.split('-')||[];
    return `${dateItems[2]||''}/${dateItems[1]||''}/${dateItems[0]||''}`;
  }
}
