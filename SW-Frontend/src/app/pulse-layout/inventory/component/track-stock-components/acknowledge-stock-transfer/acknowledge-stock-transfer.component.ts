import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    AcknowledgeDetails,
    AcknowledgeSaveItemType,
    AcknowlegeSaveRequest,
    StockDetail,
    SummaryDetail,
    UnmatchedItems,
} from '@app/SW-layout/inventory/models/bc-ackowledge-details';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { ToastService } from '@common/services';

import { TEMP_ACKNOWLEDGE_DATA } from '@app/SW-layout/dashboard/data/data';

@Component({
    selector: 'SW-acknowledge-stock-transfer',
    templateUrl: './acknowledge-stock-transfer.component.html',
    styleUrls: ['./acknowledge-stock-transfer.component.scss'],
})
export class AcknowledgeStockTransferComponent implements OnInit {
    @Output() onviewAcknowledgeSummaryClick = new EventEmitter<boolean>();
    @Output() onDoneClick = new EventEmitter<boolean>();


    @Input() requestId = '';
    @Input() storeId = '';
    @Input() isBC_BC = true;
    @Input()  viewSummary= false;


    public acknowledgeForm = new FormGroup({});
    public transferItemTypes = ['Serial Number', 'SAP Material code'];
    public unmatchedItems = new Array<UnmatchedItems>();
    public acknowledgeResponse?: AcknowledgeDetails;
    public stockWithSerialNumber = new Array<StockDetail>();
    public stockWithMaterialCode = new Array<StockDetail>();
    public summaryDetail = new Array<SummaryDetail>();


    public pageNumberWithSerial = 0;
    public pageNumberWithSAPCode = 0;
    public pageNumberSummary = 0;

    public inputSerialOrCode: string = '';
    public Remarks = '';
    public summaryRequest?: AcknowlegeSaveRequest;
    public enableAcknowledge = false;
    tempData: AcknowledgeDetails = TEMP_ACKNOWLEDGE_DATA;

    constructor(
        private bcSearchStockService: BcSearchStockService,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getAcknowledgeDetails(this.requestId);
    }

    private initForm(): void {
        this.acknowledgeForm = new FormGroup({
            typeOf: new FormControl(this.transferItemTypes[0], { validators: [Validators.required] }),
            typeDetail: new FormControl(null, { validators: [] }),
        });
        this.acknowledgeForm.controls.typeDetail.disable;
    }

    onAddAcknowledge() {

    }

    onSelectType(value: string) {
        if (value == this.transferItemTypes[0]) {
            this.acknowledgeForm.controls.typeDetail.disable;
        }
    }
    onAckowledgeClick(){
        this.enableAcknowledge = false;
        const list_of_item_details_request = new Array<AcknowledgeSaveItemType>();
        this.stockWithMaterialCode.forEach(item=>{
            list_of_item_details_request.push(
                {
                    approved_quantity: item.approved_quantity,
                    item_name: item.item_name,
                    received_quantity: item.received_quantity+'',
                    requested_quantity: this.acknowledgeResponse?.summary_details.filter(p=>p.sap_material_code==item.sap_material_code)[0].requested_quantity+'',
                    sap_material_code: item.sap_material_code,
                    sequence: null,
                    serial_no_list: [],
                    transfer_quantity: item.transfer_quantity
                  }
            )
        })
        const SAPCodeListINstockWithSerialNumber = [...new Set(this.stockWithSerialNumber.filter(i=>i.checked).map(s=> {return s.sap_material_code}))];
        SAPCodeListINstockWithSerialNumber.forEach(item=>{
            var selectedSerialzedItem = this.stockWithSerialNumber.filter(s=>s.sap_material_code==item);
            if(selectedSerialzedItem[0].checked){
                let selectedSerials=selectedSerialzedItem.filter(i=>i.checked).map(si=>{return si.serial_number});
            list_of_item_details_request.push(
                {
                    approved_quantity: selectedSerials.length+'',
                    item_name: selectedSerialzedItem[0].item_name,
                    received_quantity: selectedSerialzedItem.map(si=>{return si.serial_number}).length+'',
                    requested_quantity: this.acknowledgeResponse?.summary_details.filter(p=>p.sap_material_code==selectedSerialzedItem[0].sap_material_code)[0].requested_quantity+'',
                    sap_material_code: selectedSerialzedItem[0].sap_material_code,
                    sequence: null,
                    serial_no_list: selectedSerials,
                    transfer_quantity: selectedSerials.length+''
                  }
            );
        }
        })
        this.summaryRequest  = {
            approval_user: this.acknowledgeResponse?.approved_user,
            approved_at: this.acknowledgeResponse?.approved_date,
            destination_outlet: this.acknowledgeResponse?.destination_outlet_store_id,
            list_of_item_details_request: list_of_item_details_request,
            origin_outlet: this.acknowledgeResponse?.origin_outlet_store_id,
            remark: this.Remarks,
            serial: this.acknowledgeResponse?.serial_product||this.stockWithSerialNumber.length>0,
            ship_user: '',
            transferred_at: this.acknowledgeResponse?.transfer_date,
            transferred_by: this.acknowledgeResponse?.transfer_user
          };
          this.bcSearchStockService.transferAckowledge(this.requestId,this.summaryRequest,this.isBC_BC?'BC':'WH').subscribe(res=>{
            if(res){
              this.toastService.show('Acknowledge Successfully Created.','');
              this.viewSummary=true;
              this.enableAcknowledge = true;  
              this.onviewAcknowledgeSummaryClick.emit(true);
              this.enableAcknowledge = false;
            }
          },(error)=>{
            this.enableAcknowledge = true;
            this.toastService.show('Error',error.error.errorMessage)
          })

    }

    private getAcknowledgeDetails(requestId: string) {
        this.bcSearchStockService.getAckowledgeDetails(requestId).subscribe(
            response => {
                if (response) {
                    this.acknowledgeResponse = response;
                    this.summaryDetail = response.summary_details;
                    this.summaryDetail.forEach(s=>s.approved_quantity=0);
                    this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
                    this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => !details.serial_number);
                    if(this.stockWithSerialNumber.length>0){
                        this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[0]);
                    }else{
                        this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[1])
                    }
                }
            }, (error) => {
                this.toastService.show('Error', error.error.errorMessage);
            },
        );
        //this.acknowledgeResponse = this.tempData;
        // this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
        //this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => details.sap_material_code);
        
    }

    searchFromTable() {
        if(this.inputSerialOrCode == '' || this.inputSerialOrCode == null){
            this.toastService.show('Error','Please enter serial number.');
            return;
        }
        if(this.stockWithSerialNumber.length>0&&this.stockWithSerialNumber.filter(i=>i.checked).length===this.stockWithSerialNumber.length){
            this.toastService.show('Error','Approved quantity of this SAP material code already added.');
            return;
        }
        if (this.acknowledgeForm.controls.typeOf.value == 'Serial Number') {
            let selectedItem: StockDetail;
            for (let i = 0; i < this.stockWithSerialNumber.length; i++) {
                if (this.stockWithSerialNumber[i].serial_number == this.inputSerialOrCode) {
                    if(this.stockWithSerialNumber[i].approved_quantity=='0'||this.stockWithSerialNumber[i].requested_quantity=='0'){
                        this.toastService.show('Error','No requested/approved quantity from the SAP material code');
                        return;
                    }
                    if(this.stockWithSerialNumber[i].checked){
                        this.toastService.show('Error','This serial number has already been acknowledged');
                        return;
                    }
                    this.stockWithSerialNumber[i].checked = true;
                    selectedItem = this.stockWithSerialNumber[i];
                    this.summaryDetail.forEach(s=>{
                            if(s.sap_material_code==this.stockWithSerialNumber[i].sap_material_code){
                            s.approved_quantity++;
                        }});
                    this.stockWithSerialNumber.splice(i, 1);
                    this.stockWithSerialNumber.unshift(selectedItem);
                    this.inputSerialOrCode='';
                   
                    this.checkAcknowledgeButtonEnable();
                    return;
                }
            }
            let item: UnmatchedItems = {
                itemCode: this.inputSerialOrCode,
                label: 'Serial Number',
            };
            this.unmatchedItems.push(item);
            this.inputSerialOrCode='';
        }
        if (this.acknowledgeForm.controls.typeOf.value == 'SAP Material code') {
            let selectedItem: StockDetail;
            for (let i = 0; i < this.stockWithMaterialCode.length; i++) {
                if (this.stockWithMaterialCode[i].sap_material_code == this.inputSerialOrCode) {
                    this.stockWithMaterialCode[i].checked = true;
                    selectedItem = this.stockWithMaterialCode[i];
                    this.stockWithMaterialCode.splice(i, 1);
                    this.stockWithMaterialCode.unshift(selectedItem);
                    this.inputSerialOrCode='';
                    return;
                }
            }
            let item: UnmatchedItems = {
                itemCode: this.inputSerialOrCode,
                label: 'SAP Material code',
            };
            this.unmatchedItems.push(item);
            this.inputSerialOrCode='';
        }
    }
    onTableDataChange(value:number,SAPcode:string){
        this.summaryDetail.forEach(s=>{if(s.sap_material_code==SAPcode){
            s.approved_quantity=value;
        }});
        this.checkAcknowledgeButtonEnable();
    }
    checkAcknowledgeButtonEnable(){
        var unMatchedItems =new Array();
        this.summaryDetail.forEach(i=>{
            if(parseInt(i.transfer_quantity)!=i.approved_quantity){
                unMatchedItems.push(i);
            }
        })
        this.enableAcknowledge =unMatchedItems.length==0;
    }
}
