import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import {
    DealerConfirmStockOrderDeliveryDetailsRequest,
    DealerConfirmStockOrderDeliveryDetailsRequestAddress,
    DealerConfirmStockOrderDeliveryDetailsRequestStockOrderItem,
    DealerConfirmStockOrderDeliveryDetailsResponse,
    DeliveryAddress,
    DeliveryAddressResponse,
    ExistingContactDetails,
    UserInformation,
} from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import { State } from '@app/SW-layout/inventory/models/state';
import { DealerCreateStockRequestService } from '@app/SW-layout/inventory/services/dealer-create-stock-request.service';
import { ToastService } from '@common/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { forkJoin, Observable, of } from 'rxjs';
@Component({
    selector: 'SW-dealer-confirm-stock-order-delivery-details',
    templateUrl: './dealer-confirm-stock-order-delivery-details.component.html',
    styleUrls: ['./dealer-confirm-stock-order-delivery-details.component.scss']
})
export class DealerConfirmStockOrderDeliveryDetailsComponent implements OnInit {

    @Input() outletId = '';
    @Input() previousScreenDetails?: DealerConfirmStockOrderDeliveryDetailsRequest;
    @Input() alreadyAddedContactDetails?: ExistingContactDetails;

    @Output() backClick = new EventEmitter<ExistingContactDetails>();

    public displayedScreen: 'main' | 'summary' = 'main';
    public checkDoubleClick: boolean = false;
    public dmsAddress = false;
    public confirmResponse?: DealerConfirmStockOrderDeliveryDetailsResponse;
    public stateList = new Array<State>();
    public addressList = new Array<DeliveryAddress>();
    public deviceThresholdList = new Array<DealerConfirmStockOrderDeliveryDetailsRequestStockOrderItem>();

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
    ) {
    }

    ngOnInit(): void {
        this.retrievePageLoadData();
        this.deviceThresholdList = this.previousScreenDetails?.stock_order_item_list ?? [];
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
                this.confirmNumberDetails();
            }
        }
    }
    confirmNumberDetails() {
        this.ownerDetailsModalRef?.close();
        this.checkDoubleClick = true;
        if (this.mapAddressDetailsToRequest().length > 1) // check if main address
        {
            const requestObject: DealerConfirmStockOrderDeliveryDetailsRequest = {
                ...this.previousScreenDetails,
                address_list: this.mapAddressDetailsToRequest(),
                default_address: this.mapAddressDetailsToRequest()[1].default_address,
                address_id: this.mapAddressDetailsToRequest()[1].address_id,
                contact_email: this.userInformation.email ?? '',
                contact_name: this.userInformation.name ?? '',
                contact_number: this.userInformation.phone_number ?? '',
            };
            if (!this.mainAddressIsEmpty()) {
                this.callConfirmAPI(requestObject);
            } else {
                this.toastService.show('Main address should not be empty!', 'Please select another address');
                this.checkDoubleClick = false;
            }
        }
        else {
            if (this.dmsAddress) {
                const requestObject: DealerConfirmStockOrderDeliveryDetailsRequest = {
                    ...this.previousScreenDetails,
                    address_list: this.mapAddressDetailsToRequest(),
                    default_address: true,
                    address_id: 0,
                    contact_email: this.userInformation.email ?? '',
                    contact_name: this.userInformation.name ?? '',
                    contact_number: this.userInformation.phone_number ?? '',
                };
                if (!this.mainAddressIsEmpty()) {
                    this.callConfirmAPI(requestObject);
                } else {
                    this.toastService.show('Main address should not be empty!', 'Please select another address');
                    this.checkDoubleClick = false;
                }
            } else {
                this.toastService.show('Unable to Confirm!', 'Something wrong in dealer address, Please select a shipping address and proceed.');
                this.checkDoubleClick = false;
            }
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
            if (response[1]?.length) {
                for (const address of response[1]) {
                    this.addressList.push(
                        {
                            addressName: address?.reference_name ?? '',
                            line1: address?.address_line1 ?? '',
                            isMainAddress: false,
                            isNewAddress: false,
                            isSelected: false,
                            line2: address?.address_line2 ?? '',
                            postalCode: address?.post_code ?? '',
                            city: address?.city ?? '',
                            country: address?.country ?? '',
                            state: address?.state ?? '',
                            stateIdentifier: address?.state ?? '',
                            addressId: address?.address_id
                        }
                    );
                }
            }
            this.addressList.push(
                {
                    addressName: '',
                    line1: '',
                    isMainAddress: false,
                    isNewAddress: true,
                    isSelected: false,
                    line2: '',
                    state: '',
                    country: '',
                    city: '',
                    postalCode: '',
                    stateIdentifier: '',
                    addressId: 0
                }
            );
        });
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

    private callConfirmAPI(requestObject: DealerConfirmStockOrderDeliveryDetailsRequest): void {
        this.dealerCreateStockRequestService.confirmStockOrderDeliveryDetails(requestObject).subscribe(
            response => {
                if (response) {
                    this.confirmResponse = response;
                    this.displayedScreen = 'summary';
                    this.checkDoubleClick = false;
                }
            }, () => {
                this.toastService.show('Unable to confirm stock request', '');
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
