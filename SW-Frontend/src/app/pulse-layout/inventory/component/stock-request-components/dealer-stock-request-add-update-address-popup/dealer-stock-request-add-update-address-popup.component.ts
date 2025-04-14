import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    AddNewAddressRequest,
    DeliveryAddress,
} from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import { State } from '@app/SW-layout/inventory/models/state';
import { DealerCreateStockRequestService } from '@app/SW-layout/inventory/services/dealer-create-stock-request.service';

@Component({
    selector: 'SW-dealer-stock-request-add-update-address-popup',
    templateUrl: './dealer-stock-request-add-update-address-popup.component.html',
    styleUrls: ['./dealer-stock-request-add-update-address-popup.component.scss']
})
export class DealerStockRequestAddUpdateAddressPopupComponent implements OnInit {

    @Input() outletId = '';
    @Input() stateList = new Array<State>();
    @Input() defaultAddressDetails: DeliveryAddress | null = null;

    @Output() saveClick = new EventEmitter<DeliveryAddress>();
    @Output() cancelClick = new EventEmitter();

    public addressForm = new FormGroup({});

    constructor(
        private dealerCreateStockRequestService: DealerCreateStockRequestService,
    ) {
    }

    ngOnInit(): void {
        this.initializeForm();
        if (this.defaultAddressDetails) {
            this.setDefaultValues();
        }
    }

    onSaveAddress(): void {
        if (this.addressForm.invalid) {
            this.addressForm.markAllAsTouched();
            return;
        }
        if (this.defaultAddressDetails) {
            this.dealerCreateStockRequestService.updateAddress(
                this.defaultAddressDetails?.addressId, this.outletId, this.setAddNewAddressRequest()
            )
                .subscribe(response => {
                    if (response) {
                        this.emitAfterSave(response.address_id);
                    }
                });
        } else {
            this.dealerCreateStockRequestService.addNewAddress(this.outletId, this.setAddNewAddressRequest())
                .subscribe(response => {
                    if (response) {
                        this.emitAfterSave(response.address_id);
                    }
                });
        }
    }

    private initializeForm(): void {
        this.addressForm = new FormGroup({
            name: new FormControl(null, {validators: []}),
            addressLine1: new FormControl(null, {validators: [Validators.required, Validators.maxLength(35), Validators.minLength(0)]}),
            addressLine2: new FormControl(null, {validators: [Validators.required, Validators.maxLength(35), Validators.minLength(0)]}),
            postalCode: new FormControl(null, {validators: [Validators.required, Validators.pattern(/^(0|[0-9]\d*)?$/)]}),
            city: new FormControl(null, {validators: [Validators.required]}),
            state: new FormControl(null, {validators: [Validators.required]}),
            country: new FormControl({value: 'Malaysia', disabled: true}, {validators: []}),
        });
    }

    private setDefaultValues(): void {
        this.addressForm.patchValue({
            name: this.defaultAddressDetails?.addressName ?? '',
            addressLine1: this.defaultAddressDetails?.line1 ?? '',
            addressLine2: this.defaultAddressDetails?.line2 ?? '',
            postalCode: this.defaultAddressDetails?.postalCode ?? '',
            city: this.defaultAddressDetails?.city ?? '',
            state: this.defaultAddressDetails?.stateIdentifier ?? null
        });
    }

    private setAddNewAddressRequest(): AddNewAddressRequest {
        return {
            address1: this.addressForm.value.addressLine1,
            address2: this.addressForm.value.addressLine2,
            state: this.addressForm.value.state,
            country: 'Malaysia',
            city: this.addressForm.value.city,
            name: this.addressForm.value.name,
            post_code: this.addressForm.value.postalCode
        };
    }

    private emitAfterSave(addressId: number): void {
        this.saveClick.emit({
            isNewAddress: false,
            isMainAddress: false,
            isSelected: true,
            city: this.addressForm.value.city,
            country: 'Malaysia',
            postalCode: this.addressForm.value.postalCode,
            stateIdentifier: this.addressForm.value.state,
            state: this.stateList
                .find(state => state.identifier === this.addressForm.value.state)?.name ?? '',
            line2: this.addressForm.value.addressLine2,
            line1: this.addressForm.value.addressLine1,
            addressName: this.addressForm.value.name,
            addressId
        });
    }

}
