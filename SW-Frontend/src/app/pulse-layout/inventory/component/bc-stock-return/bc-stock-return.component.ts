import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@common/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

import {
    ConfirmReturnForAPI,
    InventoryItems,
    InventoryItemsRequest,
    ReturnItemList,
    ReturnItemListForAPI,
    SerialList,
    Warehouses,
} from '../../models/bc-stock-return';
import { BcSearchStockService } from '../../services/bc-search-stock.service';

@Component({
  selector: 'SW-bc-stock-return',
  templateUrl: './bc-stock-return.component.html',
  styleUrls: ['./bc-stock-return.component.scss']
})
export class BcStockReturnComponent implements OnInit {
  @Output() confirmClick = new EventEmitter<string>();

  public selectedProduct = 'HW';
  public warehouses: Warehouses[] = [];
  public inventoryItems: InventoryItems[] = []
  public selectedItems: ReturnItemList[] = [];
  public getItemRequest: InventoryItemsRequest = {
    sap_material_code: '',
    store_id: '',
    category: '',
    return_to: '',
  };
  public searchMaterialCode = '';
  public selectedType = 1;
  public availableQty = 0;
  public selectedItemCode = '';
  public selectedMaterialCode = '';
  public selectedBrand = '';
  public selectedCategory = '';
  public selectedItemName = '';
  public selectedSerialNo = '';
  public selectedSerial = false;
  public selectedQuantity = 0;
  public totalQuantity = 0;
  public showAlert = false;
  public showAlert2 = false;
  public showSearchAlert = false;
  public searchValidation = '';
  public isSearchByDisabled = false;
  public disableSubmit = false;
  public confirmRequest: ConfirmReturnForAPI = {
    comments: null,
    created_by: '',
    return_item_list: [],
    serial: false,
    transfer_from_store_id: '',
    transfer_to_store_id: '',
  };
  public confirmItem!: ReturnItemListForAPI;
  public serialList: SerialList[] = [];
  public singleSerialList!: SerialList;
  public selectedWarehouse = '';
  public displayStockRequestReturnToWarehouse = false;
  public requestId = ''

  constructor(private StockService: BcSearchStockService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.getWarehousesByType();
  }

  filterDataByProduct(type: string) {
    if (type == 'HW') {
      this.selectedProduct = 'HW';
      this.getWarehousesByType();
    } else {
      this.selectedProduct = 'OTH';
      this.getWarehousesByType();
    }
    this.selectedType = 1;
    this.inventoryItems = [];
  }

  getWarehousesByType() {
    this.StockService.getWarehousesByType(this.selectedProduct).subscribe((warehouses: Warehouses[]) => {
      if (warehouses != null) {
        this.warehouses = warehouses;
        this.selectedWarehouse = this.warehouses[0].code
      }
    });
  }

  searchItems() {
    this.inventoryItems = [];
    const outletsID = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
    if (this.selectedItemCode == '') {
      this.showSearchAlert = true;
      this.searchValidation = 'Fill all mandatory fields'
    } else {
      this.showSearchAlert = false;
      this.searchValidation = '';
      if (this.selectedType == 3) {
        this.getItemRequest.store_id = outletsID;
        this.getItemRequest.sap_material_code = this.selectedItemCode;
        this.getItemRequest.return_to = this.selectedWarehouse;
        this.StockService.searchInventoryForReturnFromSapMatCode(this.getItemRequest)
          .toPromise().then((inventoryItems: InventoryItems[]) => {
            if (inventoryItems != null) {
              if (inventoryItems[0].serial) {
                this.showSearchAlert = true;
                this.searchValidation = 'Entered SAP Material code is a serialized item'
              } else if (this.selectedProduct == 'HW' && inventoryItems[0].status != 'IN STOCK'
                && this.selectedProduct == 'HW' && inventoryItems[0].status != 'UNAVAILABLE') {
                this.showSearchAlert = true;
                this.searchValidation = 'The item is not returnable. Current status of the item is ' + inventoryItems[0].status + ', A home wireless device can be returned only if the status is “in-stock“ or “unavailable“.'
              } else if (this.selectedProduct == 'OTH' && inventoryItems[0].status != 'IN STOCK') {
                this.showSearchAlert = true;
                this.searchValidation = 'The item is not returnable. Current status of the item is ' + inventoryItems[0].status + ', The status of the item must be “in-stock“ to return.'
              }
              else {
                this.showSearchAlert = false;
                this.searchValidation = '';
                this.inventoryItems = inventoryItems;
              }
            } else {
              this.showSearchAlert = true;
              this.searchValidation = 'Results not available for the search made';
                this.toastService.show('Unable to fetch data',  'Results not available for the search made');
            }
          }).catch((err) => {
            this.showSearchAlert = true;
            this.searchValidation = 'Results not available for the search made';
            this.toastService.show('Unable to fetch data',  err.error.errorMessage ||'');
          });
      } else {
        this.StockService.searchInventoryForReturn(outletsID, this.selectedItemCode, this.selectedProduct, this.selectedWarehouse)
          .toPromise()
          .then((inventoryItems: InventoryItems[]) => {
            if (inventoryItems != null) {
              if (this.selectedProduct == 'HW' && inventoryItems[0].status != 'IN STOCK'
                && this.selectedProduct == 'HW' && inventoryItems[0].status != 'UNAVAILABLE') {
                this.showSearchAlert = true;
                this.searchValidation = 'The item is not returnable. Current status of the item is ' + inventoryItems[0].status + ', A home wireless device can be returned only if the status is “in-stock“ or “unavailable“.'
              } else if (this.selectedProduct == 'OTH' && inventoryItems[0].status != 'IN STOCK') {
                this.showSearchAlert = true;
                this.searchValidation = 'The item is not returnable. Current status of the item is ' + inventoryItems[0].status + ', The status of the item must be “in-stock“ to return.'
              }
              else {
                this.showSearchAlert = false;
                this.searchValidation = '';
                this.inventoryItems = inventoryItems;
              }
            } else {
              this.showSearchAlert = true;
              this.searchValidation = 'Results not available for the search made';
              this.toastService.show('Unable to fetch data',  'Results not available for the search made');
            }
          }).catch((err) => {
            this.showSearchAlert = true;
            this.searchValidation = 'Results not available for the search made';
            this.toastService.show('Unable to fetch data',  err.error.errorMessage ||'');
          });
      }
    }


  }

  open(sapCode: string, availableQuantity: number, category: string, brand: string, itemName: string, serial: boolean, serialNo: string,
    content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
    this.showAlert = false;
    this.showAlert2 = false;
    this.selectedQuantity = 0;
    this.availableQty = availableQuantity;
    this.selectedMaterialCode = sapCode;
    this.selectedBrand = brand;
    this.selectedCategory = category;
    this.selectedItemName = itemName;
    this.selectedSerialNo = serialNo;
    this.selectedSerial = serial;
    this.modalService.open(content, modalOptions).result.then(
      (result) => {
      },
      (reason) => {

      }
    );
  }
  _getDismissReason(reason: unknown): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addSelectedItem() {
    if (this.selectedType != 3) {
      this.selectedQuantity = 1;
    }
    if (this.selectedQuantity == 0 || this.selectedQuantity == undefined) {
      this.showAlert2 = true;
    } else {
      if (this.selectedType == 3) {
        let totalSelectedQty = 0;
        this.showAlert2 = false;
        const selectedArrObject = this.selectedItems.filter(e => e.sapMaterialCode === this.selectedMaterialCode);
        if (selectedArrObject.length > 0) {
          totalSelectedQty = selectedArrObject[0].quantity;
        } else {
          totalSelectedQty = 0;
        }
        if ((totalSelectedQty + this.selectedQuantity) > this.availableQty) {
          this.showAlert = true;
        } else {
          this.showAlert = false;
          const selectedItem: ReturnItemList = {
            brand: '',
            category: '',
            itemName: '',
            quantity: 0,
            sapMaterialCode: '',
            serial: false,
            serialNo: ''
          }
          const itemExist = this.selectedItems.filter(e => e.sapMaterialCode === this.selectedMaterialCode);
          if (itemExist.length > 0) {
            itemExist[0].quantity = itemExist[0].quantity + this.selectedQuantity;
          } else {
            selectedItem.sapMaterialCode = this.selectedMaterialCode;
            selectedItem.quantity = this.selectedQuantity;
            selectedItem.brand = this.selectedBrand;
            selectedItem.category = this.selectedCategory;
            selectedItem.itemName = this.selectedItemName;
            selectedItem.serial = this.selectedSerial;
            selectedItem.serialNo = this.selectedSerialNo;
            this.selectedItems.push(selectedItem);
            this.isSearchByDisabled = true;
          }
          this.selectedQuantity = 0;
          this.modalService.dismissAll();
        }
      } else {
        this.selectedQuantity = 1;
        this.showAlert2 = false;
        const selectedArrObject = this.selectedItems.filter(e => e.serialNo === this.selectedSerialNo);
        // if (selectedArrObject.length > 0) {
        //   totalSelectedQty = selectedArrObject[0].quantity;
        // } else {
        //   totalSelectedQty = 0;
        // }
        if (selectedArrObject.length > 0) {
          this.showAlert = true;
        } else {
          if (this.selectedQuantity > 1) {
            this.showAlert = true;
          } else {
            this.showAlert = false;
            const selectedItem: ReturnItemList = {
              brand: '',
              category: '',
              itemName: '',
              quantity: 0,
              sapMaterialCode: '',
              serial: false,
              serialNo: ''
            }

            selectedItem.sapMaterialCode = this.selectedMaterialCode;
            selectedItem.quantity = this.selectedQuantity;
            selectedItem.brand = this.selectedBrand;
            selectedItem.category = this.selectedCategory;
            selectedItem.itemName = this.selectedItemName;
            selectedItem.serial = this.selectedSerial;
            selectedItem.serialNo = this.selectedSerialNo;
            this.selectedItems.push(selectedItem);
            this.isSearchByDisabled = true;
            // const itemExist = this.selectedItems.filter(e => e.sapMaterialCode === this.selectedMaterialCode);
            // if (itemExist.length > 0) {
            //   itemExist[0].quantity = itemExist[0].quantity + this.selectedQuantity;
            // } else {

            // }
            this.selectedQuantity = 0;
            this.modalService.dismissAll();
          }

        }
      }

    }
  }

  onRemove(sapCode: string, serialNo: string) {
    if (this.selectedType == 3) {
      this.selectedItems = this.selectedItems.
        filter(selectedItems => selectedItems.sapMaterialCode !== sapCode)
      if (this.selectedItems.length == 0) {
        this.isSearchByDisabled = false;
      }
    } else {
      this.selectedItems = this.selectedItems.
        filter(selectedItems => selectedItems.serialNo !== serialNo)
      if (this.selectedItems.length == 0) {
        this.isSearchByDisabled = false;
      }
    }

  }
  onConfirmClick() {
    this.disableSubmit = true;
    this.confirmRequest.created_by = this.localStorageService.get(StorageSettings.LOGIN_NAME)
    this.confirmRequest.transfer_from_store_id = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
    this.confirmRequest.transfer_to_store_id = this.selectedWarehouse;
    if (this.selectedType == 3) {
      this.confirmRequest.serial = false;
    } else {
      this.confirmRequest.serial = true;
    }

    this.confirmRequest.return_item_list = this.selectedItems?.map(element => {
      return {
        transfer_to_store_id: this.selectedWarehouse,
        list_of_uinrange: [{
          uin_end: element.serialNo,
          uin_start: element.serialNo
        }],
        sap_material_code: element.sapMaterialCode,
        item_name: element.itemName,
        transfer_quantity: element.quantity
      }
    }) ?? [];
    this.StockService.confirmReturn(this.confirmRequest).subscribe(response => {
      this.requestId = response.request_id?.trim() ?? '';
      this.disableSubmit = false;
      this.confirmClick.emit(this.requestId);
      this.displayStockRequestReturnToWarehouse = true
    }, (err) => {
      this.disableSubmit = false;
      this.toastService.show('Unable to Return stock request :', err);
    });
  }

  resetPage() {
    this.selectedProduct = 'HW';
    this.warehouses = [];
    this.inventoryItems = []
    this.selectedItems = [];
    this.getItemRequest = {
      sap_material_code: '',
      store_id: '',
      category: '',
      return_to: '',
    };
    this.searchMaterialCode = '';
    this.selectedType = 1;
    this.availableQty = 0;
    this.selectedItemCode = '';
    this.selectedMaterialCode = '';
    this.selectedBrand = '';
    this.selectedCategory = '';
    this.selectedItemName = '';
    this.selectedSerialNo = '';
    this.selectedSerial = false;
    this.selectedQuantity = 0;
    this.totalQuantity = 0;
    this.showAlert = false;
    this.showAlert2 = false;
    this.showSearchAlert = false;
    this.searchValidation = '';
    this.isSearchByDisabled = false;
    this.confirmRequest = {
      comments: null,
      created_by: '',
      return_item_list: [],
      serial: false,
      transfer_from_store_id: '',
      transfer_to_store_id: '',
    };
    this.confirmItem = {
      item_name: '',
      sap_material_code: '',
      transfer_quantity: 0,
      transfer_to_store_id: '',
      list_of_uinrange: [],
    }
    this.serialList = [];
    this.singleSerialList = {
      uin_start: '',
      uin_end: '',
    };
    this.selectedWarehouse = '';
    this.displayStockRequestReturnToWarehouse = false;
    this.requestId = ''

    this.getWarehousesByType();
  }
}
