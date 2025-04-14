import { Component, OnInit } from '@angular/core';
import {
    DealerConfirmStockOrderDeliveryDetailsRequest,
    ExistingContactDetails,
} from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import { RcspPromotions } from '../../models/dealer-physical-stock-ordering';

@Component({
    selector: 'SW-physical-stock-ordering-management',
    templateUrl: './physical-stock-ordering-management.component.html'
})
export class PhysicalStockOrderingManagementComponent implements OnInit {

    public displayedScreen: 'main' | 'confirm' | 'confirmRcsp' = 'main';

    public mainScreenRequest?: DealerConfirmStockOrderDeliveryDetailsRequest;
    public mainScreenRequestRcsp?: DealerConfirmStockOrderDeliveryDetailsRequest;
    public mainScreenRequestRcspPromo?:RcspPromotions;
    public previouslyAddedContactDetails?: ExistingContactDetails;
    public isPromo = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    onContinueClick(request: DealerConfirmStockOrderDeliveryDetailsRequest): void {
        this.mainScreenRequest = request;
        this.displayedScreen = 'confirm';
    }
    onContinueClickRcsp(request: DealerConfirmStockOrderDeliveryDetailsRequest): void {
        this.mainScreenRequestRcsp = request;
        this.displayedScreen = 'confirmRcsp';
    }
    onContinueClickRcspPromo(request: RcspPromotions): void {
        this.mainScreenRequestRcspPromo = request;
        this.displayedScreen = 'confirmRcsp';
    }

    onBackClick(event: ExistingContactDetails): void {
        this.previouslyAddedContactDetails = event;
        this.displayedScreen = 'main';
    }

    getIsPromo(isPromo: boolean){
        this.isPromo = isPromo
    }

}
