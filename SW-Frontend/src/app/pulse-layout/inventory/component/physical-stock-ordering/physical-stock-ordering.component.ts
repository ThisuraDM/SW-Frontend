import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DealerConfirmStockOrderDeliveryDetailsRequest } from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import { BalanceStatus } from '@app/SW-layout/store/models/ewallet';
import { EwalletService } from '@app/SW-layout/store/services/ewallet.service';
import { ToastService } from '@common/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets, RestrictedList } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { DuplicateTabService } from 'services/duplicate-tab-service.service';


import { ProductBrand, ProductCategory, SearchItems } from '../../models/bc-view-stock';
import {
    CreditNoteReason,
    CreditNoteVoucher,
    DeviceThresholdDetails,
    DnAStockDetails,
    DnAStockRequest,
    PaymentMethod,
    PromoItem,
    PromoItemPriceRequest,
    RcspPromotions,
    RcspStock,
    RcspStockItem,
} from '../../models/dealer-physical-stock-ordering';
import { BcViewStockService } from '../../services/bc-view-stock.service';
import { DealerPhysicalStockOrderingService } from '../../services/dealer-physical-stock-ordering.service';
import { DealerTrackStockService } from '../../services/dealer-track-stock.service';


@Component({
    selector: 'SW-physical-stock-ordering',
    templateUrl: './physical-stock-ordering.component.html',
    styleUrls: ['./physical-stock-ordering.component.scss'],
})
export class PhysicalStockOrderingComponent implements OnInit {

    @Output() confirmClick = new EventEmitter<DealerConfirmStockOrderDeliveryDetailsRequest>();
    @Output() confirmClickRcsp = new EventEmitter<DealerConfirmStockOrderDeliveryDetailsRequest>();
    @Output() confirmClickRcspPromo = new EventEmitter<RcspPromotions>();
    @Output() isPromoStocks = new EventEmitter<boolean>();

    @ViewChild('modalConfirmCashOption', { static: true }) confirmCashOption!: TemplateRef<any>;
    @ViewChild('modalConfirmClearReqListNormal', { static: true }) confirmClearReqListNormalOption!: TemplateRef<any>;
    @ViewChild('modalConfirmClearReqListPromo', { static: true }) confirmClearReqListPromoOption!: TemplateRef<any>;
    @ViewChild('modalConfirmClearReqGoDevice', { static: true }) confirmConfirmClearReqGoDeviceOption!: TemplateRef<any>;
    @ViewChild('modalConfirmClearReqGoRcsp', { static: true }) confirmConfirmClearReqGoRcspOption!: TemplateRef<any>;

    @ViewChild('modalConfirmCBDOption', { static: true }) confirmCBDOption!: TemplateRef<any>;
    @ViewChild('modalConfirmCODOption', { static: true }) confirmCODOption!: TemplateRef<any>;
    @ViewChild('modalConfirmTFOption', { static: true }) confirmTFOption!: TemplateRef<any>;
    @ViewChild('modalInsufficientBalanceEWalletOption', { static: true }) insufficientBalanceEWalletOption!: TemplateRef<any>;

    public userOutlets: Outlets[] = [];
    public restrictedOutlets: RestrictedList[] = [];
    public productCategoryList = new Array<ProductCategory>();
    public productBrandList = new Array<ProductBrand>();
    public isReload = false;
    public isThreshold = true;
    public isPromo = true;
    public selectedStore = '';
    public selectedCategory = '';
    public selectedBrand = '';
    public selectedItemName = '';
    public selectedSapCode = '';
    public selectedRCSPCategory = '';
    public selectedRCSPItemName = '';
    public selectedRCSPSapCode = '';
    public noThresholdData = true;
    public totalElements = 0;
    public pageNumber = 1;
    public pageSize = 5;
    public pageElements = 0;
    public selectedQty = 0;
    public promoItemPriceRequest: PromoItemPriceRequest = {
        items: new Array<PromoItem>()
    };
    public request: DnAStockRequest = {
        brand: '',
        category: '',
        item_name: '',
        sap_material_code: '',
    };
    public deviceThresholdDetails!: DeviceThresholdDetails;
    public dnAStockDetails: DnAStockDetails[] = [];
    public dnAStockDetailsAdded: DnAStockDetails[] = [];
    public creditNoteVoucherList = new Array<CreditNoteVoucher>();
    public selectedCreditNoteVoucher = '';
    public creditNoteReasonList = new Array<CreditNoteReason>();
    public selectedCreditNoteReason = '';
    public paymentMethodList = new Array<PaymentMethod>();
    public selectedPaymentMethod = '';
    public totalValue = 0;
    public grandTotalValue = 0;
    public totalTax = 0;
    public userID = this.localStorageService.get(StorageSettings.LOGIN_NAME);
    public requestedFromOutlet = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
    public rcspStockItems: RcspStockItem[] = [];
    public removeStocks: RcspStockItem[] = [];
    public selectedPromo: RcspPromotions = {
        dealerGetsDiscount: '',
        dealerGetsDiscountType: '',
        promoEndDateTime: '',
        promoStartDateTime: '',
        promotionBuyItems: [],
        promotionGetItems: [],
        promotionCode: '',
        promotionId: 0,
        promotionName: '',
        promotionType: '',
    };
    public totalTaxForRcSP: number = 0;
    public grandTotalForRcSP: number = 0;
    public totalForRcSP: number = 0;
    public changeValue: string = 'promo';
    public errorMessage: string = 'No results to display for the search made';
    public balanceStatusResponse!: BalanceStatus;
    public noEwalletData = false;
    public isDnADisabled = false;


    constructor(private localStorageService: LocalStorageService,
                private StockService: DealerTrackStockService,
                private bcViewStockService: BcViewStockService,
                private dealerPhysicalStockOrderingService: DealerPhysicalStockOrderingService,
                private toastService: ToastService,
                private modalService: NgbModal,
                private router: Router,
                private eWalletService: EwalletService,
                private duplicateTabService: DuplicateTabService,
    ) {
    }

    ngOnInit(): void {
        this.duplicateTabService.checkDuplicateTabs();

        this.userOutlets = (this.localStorageService.getOutlets() as Array<Outlets>);
        this.restrictedOutlets = (this.localStorageService.getRestrictedPermissions() as Array<RestrictedList>);
        this.userOutlets = this.excludeRestrictedOutlets(this.userOutlets, this.restrictedOutlets);
        this.selectedStore = this.userOutlets[0].outlet_id;
        this.getDeviceThresholdDetails();
        this.getEwalletBalanceStatus();
        this.retrieveProductCategoryList();
        this.getPaymentMethods();
        this.getRcspPromoStocks();
        this.isDnADisabled = this.isDnADisabledOutlet(this.selectedStore,this.restrictedOutlets );
      
    }
    
    isRestrictedOutlet(outlet: Outlets, restrictedList: RestrictedList[]): boolean {
        const matchingRestrictedOutlet = restrictedList.find(
            (restrictedOutlet) =>
                restrictedOutlet.outlet_id === outlet.outlet_id &&
                restrictedOutlet.restricted_permissions.includes("PHYSICAL_STOCK_ORDERING_DEALER")
        );
    
        return !!matchingRestrictedOutlet;
    }
    isDnADisabledOutlet(outlet: String, restrictedList: RestrictedList[]): boolean {
        const matchingRestrictedOutlet = restrictedList.find(
            (restrictedOutlet) =>
                restrictedOutlet.outlet_id === outlet &&
                restrictedOutlet.restricted_permissions.includes("DEVICE_AND_ACCESSORIES_DEALER")
        );
        
        if(!!matchingRestrictedOutlet){
            this.isReload = true;
        }else{
            this.isReload = false;
        }
        return !!matchingRestrictedOutlet;
    }

    excludeRestrictedOutlets(outletList: Outlets[], restrictedList: RestrictedList[]): Outlets[] {
        return outletList.filter((outlet) => !this.isRestrictedOutlet(outlet, restrictedList));
    }

    toggleType(value: string) {
        if (this.totalValue > 0 && value === 'RC&SP') {
            this.openModal(this.confirmConfirmClearReqGoRcspOption, { backdrop: 'static' });
        } else if (this.totalForRcSP > 0 && value === 'DEVICE') {
            this.openModal(this.confirmConfirmClearReqGoDeviceOption, { backdrop: 'static' });
        } else {
            if (value === 'RC&SP') {
                this.isReload = true;
            } else {
                this.isReload = false;
            }
        }
    }

    toggleThreshold() {
        this.isThreshold = !this.isThreshold;
    }

    getToggleName(event: any) {
        if (this.totalForRcSP > 0) {
            if (event === 'Promo') {
                this.openModal(this.confirmClearReqListPromoOption, { backdrop: 'static' });
            } else {
                this.openModal(this.confirmClearReqListNormalOption, { backdrop: 'static' });
            }
        } else {
            if (event === 'Promo') {
                this.isPromo = true;
                this.changeValue = 'promo';
            } else {
                this.isPromo = false;
                this.changeValue = 'normal';
                this.getRcspNormalStocks(0);
            }
        }
    }

    getDeviceThresholdDetails() {
        const outletsID = this.selectedStore;
        const userID = this.localStorageService.get(StorageSettings.LOGIN_NAME);
        this.StockService.getDeviceThresholdDetails(outletsID, userID).subscribe((deviceThresholdDetails: DeviceThresholdDetails) => {
            if (Object.keys(deviceThresholdDetails).length) {
                this.deviceThresholdDetails = deviceThresholdDetails;
                this.noThresholdData = false;
            } else {
                this.noThresholdData = true;
            }
        });
    }
    getEwalletBalanceStatus() {
        this.eWalletService
            .getEwalletBalanceStatus(this.selectedStore)
            .subscribe((balanceStatus: BalanceStatus) => {
                if (balanceStatus) {
                    this.balanceStatusResponse = balanceStatus;
                    console.log(this.balanceStatusResponse);
                    if (this.balanceStatusResponse.account_status != 'Active') {
                        this.balanceStatusResponse.account_holder_public_name = '-';
                        this.balanceStatusResponse.account_no = '-';
                        this.balanceStatusResponse.account_name = '-';
                        this.balanceStatusResponse.available_balance = '-';
                        this.balanceStatusResponse.account_status = balanceStatus.available_balance;
                        this.noEwalletData = true;
                    } else {
                        this.noEwalletData = false;
                    }
                }
            });
    }

    changeOutlet() {
        this.removeSelectedRcSP();
        this.clearData();
        this.getDeviceThresholdDetails();
        this.getRcspPromoStocks();
        this.getEwalletBalanceStatus();
        this.isDnADisabled = this.isDnADisabledOutlet(this.selectedStore,this.restrictedOutlets );
    }

    getDnAStockDetails(page: number) {
        if (this.selectedCategory.length == 0) {
            this.toastService.show('Search Fail', 'Please select a product category');
            return;
        }
        if (this.selectedBrand.length == 0) {
            this.toastService.show('Search Fail', 'Please select a brand');
            return;
        }
        this.request.category = this.selectedCategory ? this.selectedCategory : null;
        this.request.brand = this.selectedBrand ? this.selectedBrand : null;
        this.request.item_name = this.selectedItemName ? this.selectedItemName : null;
        this.request.sap_material_code = this.selectedSapCode ? this.selectedSapCode : null;

        this.StockService
            .getDeviceAndAccessoriesStockDetails(this.selectedStore, this.request)
            .subscribe((res) => {
                if (!res || res.length == 0) {
                    this.toastService.show(this.selectedSapCode !== '' ? 'SAP material code not found' : 'Item cannot be found', '');
                }
                this.totalElements = res.length;
                const x = this.pageNumber * this.pageSize;
                const rem = this.totalElements % this.pageSize;
                if (x <= this.totalElements) {
                    this.pageElements = this.pageSize;
                } else {
                    this.pageElements = this.totalElements % this.pageSize;
                }
                this.dnAStockDetails = res.slice((page - 1) * this.pageSize, page * this.pageSize);
            }, error => {
                this.dnAStockDetails = [];
                this.toastService.show(this.selectedSapCode !== '' ? 'SAP material code not found' : 'Item cannot be found', '');
            });
    }

    private retrieveProductCategoryList(): void {
        this.bcViewStockService.getProductCategoryList(3).subscribe(response => {
            this.productCategoryList = response;
            this.selectedCategory = this.productCategoryList[0].value;
            this.retrieveProductBrandsByCategory();
        });
    }

    private retrieveProductBrandsByCategory(): void {
        this.bcViewStockService.getProductBrandListByCategory(this.selectedCategory).subscribe(response => {
            this.productBrandList = response ?? [];
            this.selectedBrand = this.productBrandList[0].value;
        });
    }

    private getCreditNoteVouchers = (): void => {
        this.dealerPhysicalStockOrderingService.getCreditNoteVouchers().subscribe(response => {
            this.creditNoteVoucherList = response ?? [];
        });
    };

    private getCreditNoteReasons = () => {
        this.dealerPhysicalStockOrderingService.getCreditNoteReasons().subscribe(response => {
            this.creditNoteReasonList = response ?? [];
        });
    };

    private getPaymentMethods = () => {
        this.dealerPhysicalStockOrderingService.getPaymentMethods('Devices & Accessories').subscribe(response => {
            this.paymentMethodList = response ?? [];
        });
    };

    loadBrandsByCategory() {
        this.retrieveProductBrandsByCategory();
    }

    searchItems() {
        this.getDnAStockDetails(1);
    }

    loadCLPage(page: number) {
        this.pageNumber = page;
        this.getDnAStockDetails(page);
    }

    removeAddedDnAStockDetails(sapMaterialCode: string) {
        this.dnAStockDetailsAdded = this.dnAStockDetailsAdded.filter(dnAStockDetailAdded => dnAStockDetailAdded.sap_material_code !== sapMaterialCode);
        this.calculateTotalValues();
    }

    calculateTotalValues() {
        let total = 0;
        this.totalValue = 0;
        this.grandTotalValue = 0;
        this.dnAStockDetailsAdded.forEach(addedVal => {
            total += +addedVal.request_quantity * +addedVal.price_per_unit;
            this.totalValue = total;
            this.grandTotalValue = total + this.totalTax;
        });
    }

    addStockResult(sapMaterialCode: string, row: DnAStockDetails) {
        if (row.tempQty <= 0) {
            this.toastService.show('Invalid quantity added', 'Please add a valid request quantity.');
        } else {
            const alreadyAdded = this.dnAStockDetailsAdded.filter(dnAStockDetailAdded => dnAStockDetailAdded.sap_material_code === sapMaterialCode);

            this.dnAStockDetails.forEach(dnAStockDetail => {
                if (dnAStockDetail.sap_material_code === sapMaterialCode) {
                    if (alreadyAdded.length > 0) {
                        const modifiedRequestQuantiy = (+alreadyAdded[0].request_quantity + +dnAStockDetail.request_quantity).toString();
                        if (+alreadyAdded[0].max_quantity < +modifiedRequestQuantiy) {
                            this.toastService.show('Invalid Quantity', 'Please make sure the quantity is less than the max quantity.');
                        } else {
                            alreadyAdded[0].request_quantity = modifiedRequestQuantiy;
                        }
                    } else {
                        if (dnAStockDetail.request_quantity !== undefined) {
                            const clonedValue = { ...dnAStockDetail };
                            if (+clonedValue.max_quantity < +clonedValue.request_quantity) {
                                this.toastService.show('Invalid Quantity', 'Please make sure the quantity is less than the max quantity.');
                            } else {
                                this.dnAStockDetailsAdded.push(clonedValue);
                            }
                        } else {
                            this.toastService.show('Invalid quantity added', 'Please add a valid request quantity.');
                        }
                    }
                }
            });
            this.calculateTotalValues();
        }
    }

    onChangeRequestQuantity(requestQuantity: string, sapMaterialCode: string) {
        this.dnAStockDetails.forEach(dnAStockDetail => {
            if (dnAStockDetail.sap_material_code === sapMaterialCode) {
                dnAStockDetail.request_quantity = requestQuantity;
            }
        });
    }

    onConfirmClick(validate: boolean): void {
        if (this.paymentMethodList.filter(payment => payment.id === +this.selectedPaymentMethod)[0].payment_method.toUpperCase() === 'CASH'
            && !validate) {
            this.openModal(this.confirmCashOption, { backdrop: 'static' });
        } else {
            // dimiss modal
            this.modalService.dismissAll('Proceeded the alert');
            if (this.selectedPaymentMethod === '') {
                this.toastService.show('No Payment Method Selected', 'Please select a payment method to continue.');
                return;
            }
            if (this.paymentMethodList.filter(payment => payment.id === +this.selectedPaymentMethod)[0].payment_method.toUpperCase() !== 'CASH') {
                if (this.deviceThresholdDetails === undefined || this.deviceThresholdDetails?.available_credit_limit < this.grandTotalValue) {
                    this.toastService.show('Credit Limit Exceeded', 'Please make sure the request stock order total is less than the available credit limit.');
                    return;
                }
            }
            this.confirmClick.emit({
                address_list: [],
                contact_name: '',
                contact_email: '',
                request_grand_total: this.grandTotalValue,
                credit_note_reason_id: this.selectedCreditNoteReason,
                outlet_id: this.selectedStore,
                credit_note_voucher_id: this.selectedCreditNoteVoucher,
                outlet_type: 'Blue Cube',
                request_total: this.totalValue,
                payment_method_id: +this.selectedPaymentMethod,
                payment_option: this.paymentMethodList.find(method => method.id === +this.selectedPaymentMethod)?.payment_method ?? '',
                payment_status: '',
                poid: null,
                product_type_id: this.isReload ? 1 : 2,
                service_tax: this.totalTax,
                stock_order_item_list: this.dnAStockDetailsAdded.map(stock => {
                    return {
                        quantity: stock.request_quantity,
                        item_name: stock.item_name,
                        price: stock.price_per_unit,
                        unit_price: +stock.price_per_unit,
                        brand: stock.brand,
                        category: stock.category,
                        sap_material_code: stock.sap_material_code,
                        inventory_type_id: stock.brand,
                        device_type_id: stock.category,
                    };
                }),
            });
        }
    }

    clearData() {
        this.modalService.dismissAll('Dismissed before clearning data.');
        this.dnAStockDetailsAdded = [];
        this.calculateTotalValues();
    };

    _getDismissReason(reason: unknown): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    openModal(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.modalService.open(content, modalOptions).result.then(
            (result) => {
                console.log(`Closed with: ${result}`);
            },
            (reason) => {
                console.log(`Dismissed ${this._getDismissReason(reason)}`);
            },
        );
    }

    redirectEwallet() {
        this.router.navigateByUrl('/store/ewallet');
    }

    setSearchParameter(searchItems: SearchItems) {
        this.selectedRCSPItemName = searchItems.itemName;
        this.selectedRCSPCategory = searchItems.category;
        this.selectedRCSPSapCode = searchItems.sapCode;
        this.getRcspNormalStocks(0);
    }

    setSapCode(sapCode: string) {
        this.selectedRCSPSapCode = sapCode;
        this.getRcspNormalStocks(0);
    }

    setCategory(category: string) {
        this.selectedRCSPCategory = category;
        this.getRcspNormalStocks(0);
    }

    getTotalTax(value: number) {
        this.totalTaxForRcSP = value;
    }

    getGrandTotalValue(value: number) {
        this.grandTotalForRcSP = value;
    }

    onConfirmClickRcspPromo(selectedPromo: RcspPromotions) {
        this.confirmClickRcspPromo.emit(selectedPromo);
        this.isPromoStocks.emit(this.isPromo);
    }

    closeModal() {
        this.modalService.dismissAll('close modal');
    }

    closeModalRCSP(val: boolean) {
        this.isReload = val;
        this.modalService.dismissAll('close modal');
    }

    gotoPromo() {
        this.isPromo = true;
        this.modalService.dismissAll('close modal');
        this.changeValue = 'promo';
        this.removeSelectedRcSP();
    }

    gotoNormalStock() {
        this.isPromo = false;
        this.modalService.dismissAll('close modal');
        this.changeValue = 'normal';
        this.removeSelectedRcSP();
        this.getRcspNormalStocks(0);
    }

    gotoDevice() {
        this.isReload = false;
        this.modalService.dismissAll('close modal');
        this.removeSelectedRcSP();
    }

    gotoRCSP() {
        this.isReload = true;
        this.clearData();
        this.modalService.dismissAll('close modal');
    }

    // =======================promo

    public promoList: RcspPromotions[] = [];
    // public errorMessage = ''
    public totalqty = 0;
    public taxAmount = 0;
    public grandTotal = 0;


    getRcspPromoStocks() {
        this.promoList = [];
        this.dealerPhysicalStockOrderingService.getSpRcPromotionDetails(
            this.selectedStore,
        ).subscribe(response => {
            this.promoList = response.content;
            console.log(this.promoList);
        }, err => {
            console.log(err);
            this.toastService.show('Error', err.error.errorMessage);
            this.errorMessage = err.error.errorMessage;
            // this.clearTableData();
        });
        ;
    }

    addPromo(promoItem: RcspPromotions) {
        this.selectedPromo = promoItem;
        this.totalForRcSP = 0;
        this.grandTotalForRcSP = 0;
        this.totalTaxForRcSP = 0;
        this.promoItemPriceRequest.items = [];
        this.selectedPromo.promotionBuyItems.forEach(value => {
            if (value) {
                let items: PromoItem = {
                    itemId: value.itemId,
                    productName: value.itemCode,
                    productTypeName: value.productType,
                    promotionItem: true,
                    quantity: Number(value.quantityOrAmount),
                    remarks: value.itemCode,
                };
                this.promoItemPriceRequest.items.push(items);
            }
        })

        this.dealerPhysicalStockOrderingService.getTotalItemValue(this.selectedStore, this.promoItemPriceRequest)
            .subscribe(value => {
                this.totalForRcSP = value;
                this.grandTotalForRcSP = this.totalForRcSP + this.totalTaxForRcSP;
            });
    }

    removeAddedDnAStockDetailsRCSP(itemId: number) {
        this.addedNormalStocksList = this.addedNormalStocksList.filter(
            selectedStockItems => selectedStockItems.item_id !== itemId);
        this.calculateTotalValuesSpRC();
    }

    removeSelectedRcSP() {
        this.selectedPromo = {
            dealerGetsDiscount: '',
            dealerGetsDiscountType: '',
            promoEndDateTime: '',
            promoStartDateTime: '',
            promotionBuyItems: [],
            promotionGetItems: [],
            promotionCode: '',
            promotionId: 0,
            promotionName: '',
            promotionType: '',
        };

        this.addedNormalStocksList = [];

        this.totalTaxForRcSP = 0;
        this.grandTotalForRcSP = 0;
        this.totalForRcSP = 0;
    }

    calculateTotalValuesSpRC() {
        let total = 0;
        this.totalForRcSP = 0;
        this.grandTotalForRcSP = 0;
        this.addedNormalStocksList.forEach(addedVal => {
            total += +addedVal.request_quantity * +addedVal.price;
            this.totalForRcSP = total;
            this.grandTotalForRcSP = total + this.totalTaxForRcSP;
            // this.setRemoveStocks.emit(this.selectedStockItems);
        });
    }

    onContinueClick() {
        if (this.selectedPaymentMethod == 'COD') {
            this.openModal(this.confirmCODOption, { backdrop: 'static' });
        } else if (this.selectedPaymentMethod == 'CBD') {
            this.openModal(this.confirmCBDOption, { backdrop: 'static' });
        } else if (this.selectedPaymentMethod == 'TF') {
            this.openModal(this.confirmTFOption, { backdrop: 'static' });
        } else if (this.selectedPaymentMethod == 'eWallet') {

        } else {
            this.toastService.show('No Payment Method Selected', 'Please select a payment method to continue.');
        }
    }

    close() {
        this.modalService.dismissAll();
    }

    topUpEWallet(b: boolean) {

    }

    changePaymentMethod() {

    }

    onConfirmClickPromo() {
        this.close();
        this.isPromoStocks.emit(this.isPromo);
        this.selectedPromo.grandTotal = this.grandTotalForRcSP;
        this.selectedPromo.total = this.totalForRcSP;
        this.selectedPromo.tax = this.totalTaxForRcSP;
        this.selectedPromo.paymentType = this.selectedPaymentMethod;
        this.selectedPromo.outletId = this.selectedStore;
        this.confirmClickRcspPromo.emit(this.selectedPromo);
    }

    onConfirmClickNormal() {
        this.close();
        this.isPromoStocks.emit(false);
        this.confirmClickRcsp.emit({
            address_list: [],
            contact_name: '',
            contact_email: '',
            request_grand_total: this.grandTotalForRcSP,
            credit_note_reason_id: '',
            outlet_id: this.selectedStore,
            credit_note_voucher_id: '',
            outlet_type: 'Blue Cube',
            request_total: this.totalForRcSP,
            payment_method_id: +this.selectedPaymentMethod,
            payment_option: this.selectedPaymentMethod,
            payment_status: '',
            poid: null,
            product_type_id: 1,
            service_tax: this.totalTaxForRcSP,
            stock_order_item_listRcsp: this.addedNormalStocksList.map(stock => {
                return {
                    category: stock.category,
                    item_id: stock.item_id,
                    item_name: stock.item_name,
                    last_visitation_purchase: stock.last_visitation_purchase,
                    optimal_proposed_order: stock.optimal_proposed_order,
                    outlet_stocks: stock.outlet_stocks,
                    price: stock.price,
                    request_quantity: stock.request_quantity,
                    sap_material_code: stock.sap_material_code,
                    tempQty: stock.tempQty,
                };
            }),
        });
    }

    //===============normal stock

    public rcspStocks !: RcspStock;
    public addedNormalStocksList: RcspStockItem[] = [];

    getRcspNormalStocks(page: number) {
        this.dealerPhysicalStockOrderingService.getRcspStocks(
            this.selectedStore,
            this.selectedRCSPCategory,
            this.selectedRCSPItemName,
            this.selectedRCSPSapCode,
            page,
            this.pageSize,
        ).subscribe(response => {
            this.rcspStocks = response;
            this.totalElements = this.rcspStocks.totalElements;
            this.pageElements = this.rcspStocks.numberOfElements;
            this.rcspStockItems = this.rcspStocks.content;
        }, err => {
            console.log(err);
            this.toastService.show('Error', err.error.errorMessage);
            this.errorMessage = err.error.errorMessage;
            this.clearTableData();
        });
    }

    clearTableData() {
        this.rcspStocks = {
            content: [],
            totalPages: 0,
            totalElements: 0,
            number: 0,
            numberOfElements: 0,
        };
        this.totalElements = 0;
        this.pageElements = 0;
        this.rcspStockItems = [];
    }

    loadCLNormalPage(page: number) {
        this.pageNumber = page;
        this.getRcspNormalStocks(page - 1);
    }

    addStockNormalResult(item_id: number, row: RcspStockItem) {
        if (row.tempQty <= 0) {
            this.toastService.show('Invalid quantity added', 'Please add a valid request quantity.');
        } else {
            const alreadyAdded = this.addedNormalStocksList.filter(addedStockList => addedStockList.item_id === item_id);
            this.rcspStockItems.forEach(details => {
                if (details.item_id === item_id) {
                    if (alreadyAdded.length > 0) {
                        const modifiedRequestQuantiy = (+alreadyAdded[0].request_quantity + +details.request_quantity).toString();
                        alreadyAdded[0].request_quantity = modifiedRequestQuantiy;
                        this.calculateTotalValuesSpRC();
                        // if (+alreadyAdded[0].outlet_stocks < +modifiedRequestQuantiy) {
                        //     this.toastService.show('Invalid Quantity', 'Please make sure the quantity is less than the max quantity.');
                        // } else {
                           
                        // }
                    } else {
                        if (details.request_quantity !== undefined) {
                            const clonedValue = { ...details };
                            this.addedNormalStocksList.push(clonedValue);
                            this.calculateTotalValuesSpRC();
                        } else {
                            this.toastService.show('Invalid quantity added', 'Please add a valid request quantity.');
                        }
                    }
                }
            });
        }
    }

    onChangeRequestQuantityNormal(requestQuantity: string, itemId: number) {
        this.rcspStockItems.forEach(stockDetails => {
            if (stockDetails.item_id === itemId) {
                stockDetails.request_quantity = requestQuantity;
            }
        });
    }
}
