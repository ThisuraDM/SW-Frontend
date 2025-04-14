import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import {
    DealerConfirmStockOrderDeliveryDetailsRequest,
    DealerConfirmStockOrderDeliveryDetailsRequestAddress,
    DeliveryAddress,
    DeliveryAddressResponse,
    ExistingContactDetails,
    UserInformation,
} from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import {
    RcspCreateStockRequest,
    RcspCreateStockResponse,
    RcspItems,
    RcspPromotions,
    RcspStockItem,
} from '@app/SW-layout/inventory/models/dealer-physical-stock-ordering';
import { State } from '@app/SW-layout/inventory/models/state';
import { DealerCreateStockRequestService } from '@app/SW-layout/inventory/services/dealer-create-stock-request.service';
import { DealerPhysicalStockOrderingService } from '@app/SW-layout/inventory/services/dealer-physical-stock-ordering.service';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'SW-rcsp-delivery-details',
    templateUrl: './rcsp-delivery-details.component.html',
    styleUrls: ['./rcsp-delivery-details.component.scss']
})
export class RcspDeliveryDetailsComponent implements OnInit {

    @Input() outletId = '';
    @Input() outletIdPromo = '';
    @Input() previousScreenDetails?: DealerConfirmStockOrderDeliveryDetailsRequest;
    @Input() alreadyAddedContactDetails?: ExistingContactDetails;
    @Input() previousScreenDetailsPromo?: RcspPromotions;
    @Input() isPromo = false;

    @Output() backClick = new EventEmitter<ExistingContactDetails>();

    public displayedScreen: 'main' | 'summary' = 'main';
    public checkDoubleClick: boolean = false;
    public dmsAddress = false;
    public confirmResponse?: RcspCreateStockResponse;
    public stateList = new Array<State>();
    public addressList = new Array<DeliveryAddress>();
    public selectedItemList = new Array<RcspStockItem>();
    public selectedPromoItemList = new Array<RcspStockItem>();
    public createRequest: RcspCreateStockRequest = {
        order_amount: '',
        order_items: [],
        order_type: '',
        payment_type: '',
        promotion_id: 0

    }


    public selectedAddress: { addressDetails: DeliveryAddress, index: number } | null = null;

    public addUpdateAddressModalRef?: NgbModalRef;
    public ownerDetailsModalRef?: NgbModalRef;

    public userInformation: UserInformation = {
        id: 0,
        email: '',
        login_name: '',
        name: '',
        phone_number: '',
        row_id: '',
        status: '',
    };
    constructor(
        private modalService: NgbModal,
        private toastService: ToastService,
        private dealerCreateStockRequestService: DealerCreateStockRequestService,
        private stockService: DealerPhysicalStockOrderingService,
    ) { }

    ngOnInit(): void {
        if (this.isPromo) {
            this.outletId = this.outletIdPromo;
        }
        this.retrievePageLoadData();
        this.selectedItemList = this.previousScreenDetails?.stock_order_item_listRcsp ?? [];
        this.getDealerOwnerDetails();
    }

    onBackClick(): void {
        this.backClick.emit({
            contact_email: this.userInformation.email,
            contact_name: this.userInformation.name,
            contact_number: this.userInformation.phone_number,
        });
    }

    selectAddress(index: number, content: TemplateRef<unknown>): void {
        // this.selectedAddress = null;
        this.addressList.forEach(address => address.isSelected = false);
        this.addressList[index].isSelected = true;

        if (this.addressList[index].isNewAddress) {
            this.addUpdateAddressModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
        }
    }

    onAddNewAddress(newAddress: DeliveryAddress): void {
        this.addressList.splice(this.addressList.length - 1, 0, { ...newAddress });
        this.addressList[this.addressList.length - 1].isSelected = false;
        this.addUpdateAddressModalRef?.close();
    }

    onAddNewAddressCancelClick(): void {
        this.addressList.forEach(address => address.isSelected = false);
        this.addressList[0].isSelected = true;
        this.addUpdateAddressModalRef?.close();
    }

    onUpdateAddressCancelClick(): void {
        this.selectedAddress = null;
        this.addUpdateAddressModalRef?.close();
    }

    onEditAddress(index: number, address: DeliveryAddress, content: TemplateRef<unknown>): void {
        this.selectedAddress = { addressDetails: address, index };
        this.addUpdateAddressModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    onUpdateExistingAddress(updatedAddress: DeliveryAddress): void {
        if (this.selectedAddress) {
            this.addressList[this.selectedAddress.index] = updatedAddress;
        }
        this.selectedAddress = null;
        this.addUpdateAddressModalRef?.close();
    }

    onConfirmClick(content: TemplateRef<unknown>): void {
        if (!this.checkDoubleClick) {
            if (this.userInformation.email == '' && this.userInformation.phone_number == '') {
                this.ownerDetailsModalRef = this.modalService.open(content, { centered: true, size: 'md' });
            } else {
                if (this.isPromo) {
                    this.confirmNumberDetailsPromo();
                } else {
                    this.confirmNumberDetails();
                }
            }
        }
    }
    confirmNumberDetails() {
        this.ownerDetailsModalRef?.close();
        this.checkDoubleClick = true;
        this.createRequest.order_amount = this.previousScreenDetails?.request_grand_total?.toString()
        this.createRequest.order_type = 'P'
        this.createRequest.payment_type = this.previousScreenDetails?.payment_option;
        this.createRequest.promotion_id = 0;

        const rscpItems: RcspItems[] = [];
        this.selectedItemList.forEach(element => {
            const rcspItem: RcspItems = {
                item_id: 0,
                promo_item: false,
                quantity: 0
            }
            rcspItem.item_id = element.item_id;
            rcspItem.promo_item = false;
            rcspItem.quantity = +element.request_quantity;
            rscpItems.push(rcspItem);
        });

        this.createRequest.order_items = rscpItems;

        const requestObject = this.createRequest;
        if (!this.mainAddressIsEmpty()) {
            this.callConfirmAPI(requestObject);
        } else {
            this.toastService.show('Main address should not be empty!', 'Please select another address');
            this.checkDoubleClick = false;
        }
    }

    confirmNumberDetailsPromo() {
        this.ownerDetailsModalRef?.close();
        this.checkDoubleClick = true;
        this.createRequest.order_amount = this.previousScreenDetailsPromo?.grandTotal?.toString()
        this.createRequest.order_type = 'P'
        this.createRequest.payment_type = this.previousScreenDetailsPromo?.paymentType;
        this.createRequest.promotion_id = this.previousScreenDetailsPromo?.promotionId;

        const rscpItems: RcspItems[] = [];
        this.previousScreenDetailsPromo?.promotionBuyItems.forEach(element => {
            const rcspItem: RcspItems = {
                item_id: 0,
                promo_item: true,
                quantity: 0
            }
            rcspItem.item_id = element.itemId;
            rcspItem.promo_item = false;
            rcspItem.quantity = Number(element.quantityOrAmount);
            rscpItems.push(rcspItem);
        });
        this.previousScreenDetailsPromo?.promotionGetItems.forEach(element => {
            const rcspItem: RcspItems = {
                item_id: 0,
                promo_item: true,
                quantity: 0
            }
            rcspItem.item_id = element.itemId;
            rcspItem.promo_item = true;
            rcspItem.quantity = Number(element.quantityOrAmount);
            rscpItems.push(rcspItem);
        });

        this.createRequest.order_items = rscpItems;

        const requestObject = this.createRequest;
        if (!this.mainAddressIsEmpty()) {
            this.callConfirmAPI(requestObject);
        } else {
            this.toastService.show('Main address should not be empty!', 'Please select another address');
            this.checkDoubleClick = false;
        }
    }

    private retrievePageLoadData(): void {
        const mainAddress$ = this.retrieveMainAddress();
        const deliveryAddresses$ = this.retrieveDeliveryAddresses();
        const statuses$ = this.retrieveStateList();

        forkJoin([mainAddress$, deliveryAddresses$, statuses$]).subscribe(response => {
            this.stateList = response[2] ?? [];
            this.dmsAddress = response[0].dms_address;

            this.addressList.push(
                {
                    addressName: '',
                    line1: response[0]?.main_address ?? '',
                    isMainAddress: true,
                    isNewAddress: false,
                    isSelected: true,
                    line2: '',
                    postalCode: '',
                    city: '',
                    country: '',
                    state: '',
                    stateIdentifier: '',
                    addressId: 0
                }
            );
        });

        console.log(this.addressList);
    }

    private retrieveMainAddress(): Observable<{ outlet_id: string, main_address: string, dms_address: boolean }> {
        return this.dealerCreateStockRequestService.getMainAddress(this.outletId);
    }

    private retrieveDeliveryAddresses(): Observable<Array<DeliveryAddressResponse>> {
        return this.dealerCreateStockRequestService.getDeliveryAddresses(this.outletId);
    }

    private retrieveStateList(): Observable<Array<State>> {
        return this.dealerCreateStockRequestService.retrieveStates();
    }

    private callConfirmAPI(requestObject: RcspCreateStockRequest): void {
        this.stockService.createSpRcStocks(this.outletId, requestObject).subscribe(
            response => {
                if (response) {
                    console.log(response);
                    this.confirmResponse = response;
                    this.displayedScreen = 'summary';
                    this.checkDoubleClick = false;
                }
            }, () => {
                this.toastService.show('Stock Order creation failed', '');
                this.checkDoubleClick = false;
            }
        );
    }

    private mapAddressDetailsToRequest(): Array<DealerConfirmStockOrderDeliveryDetailsRequestAddress> {
        const tempArray = new Array<DealerConfirmStockOrderDeliveryDetailsRequestAddress>();
        for (const address of this.addressList) {
            if (address.isMainAddress || address.isSelected) {
                tempArray.push({
                    address_id: address.addressId,
                    address_name: address.addressName,
                    address_type: '-',
                    state: address.stateIdentifier,
                    default_address: address.isMainAddress,
                    city: address.city,
                    house_unit_lot: '-',
                    post_code: address.postalCode,
                    section: '-',
                    street_name: `${address.line1}${address.line2 ? (', ' + address.line2) : ''}`,
                    street_type: '-',
                });
            }
        }
        return tempArray;
    }

    private mainAddressIsEmpty() {
        for (const address of this.addressList) {
            if (address.isMainAddress && address.isSelected) {
                if (address.line1 === '' || address.line1 === null) {
                    return true;
                }
            }
        }
        return false;
    }

    private getDealerOwnerDetails() {
        this.dealerCreateStockRequestService.getDealerOwner(this.outletId)
            .subscribe(response => {
                this.userInformation = response;
            }, () => {
                this.toastService.show('Unable to retrieve dealer owner info', '');
            }
            );
    }

}
