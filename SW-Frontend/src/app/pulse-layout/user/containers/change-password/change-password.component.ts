import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageSettings } from 'constants/StorageSettings';
import { URLConfigState } from 'state/url-configs-reducer';

import {
    ChangePasswordRequest,
    ChangePasswordResponse,
    PasswordPolicyResponse,
} from '../../models/change-password';
import { ChangePasswordService } from '../../services/change-password.service';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { DealerCreateStockRequestService } from '@app/SW-layout/inventory/services/dealer-create-stock-request.service';
import { ToastService } from '@common/services';
import { UserInformation } from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';

/**
 * SW change password component
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 17
 */
@Component({
    selector: 'SW-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    disableLinks = true;
    public title = 'Change Password';
    public changePasswordRequest: ChangePasswordRequest = {
        currentPassword: '',
        newPassword: '',
    };
    public outletList = new Array<Outlets>();
    public selectedOutlet :Outlets ={
        region: '',
        outlet_category: '',
        outlet_id: '',
        outlet_name: '',
        main_address:'',
        outlet_status:'',
        outlet_type_name:'',
        owner_id:''
    }
    public userInformation: UserInformation = {
        id: 0,
        email: '',
        login_name: '',
        name: '',
        phone_number: '',
        row_id: '',
        status: '',
    };
    
    public passwordPolicies!: PasswordPolicyResponse[];
    public confirmPassword = '';
    public passwordValidated = false;
    public validationText = '';
    public showAlert = false;
    public dealerId = '';
    public staffId = '';
    public staffName = '';
    public storeId = '';
    public email = '';
    public position = '';
    public outletNameList: string[] = [];
    public hideCP = false;
    public selectedStore = '';
    public status ='';
    public phoneNumber ='';
    public showOutletDropdown = false;

    constructor(
        private changePasswordService: ChangePasswordService,
        private localStorageService: LocalStorageService,
        private toastService: ToastService,
        private dealerCreateStockRequestService: DealerCreateStockRequestService,
        private store: Store<{ params: URLConfigState }>
        ) { }

    ngOnInit(): void {
        this.outletList = this.localStorageService.getOutlets() as Array<Outlets>;
        if(this.outletList.length == 1){
            this.showOutletDropdown = false;
        }else{
            this.showOutletDropdown = true;
        }
        this.selectedStore = this.outletList[0].outlet_id;
        this.getPasswordPolicyDetails();
        this.setUserDetails();
        this.store.select('params').subscribe((data) => {
            const disableLink = data.urlConfigs.disable_dealer_login;
            this.disableLinks = disableLink
        });
        this.getDealerOwnerDetails();
    }

    ngOnChanges(changes: SimpleChanges) { }

    /**
     * Call password change graph api
     */
    onSaveBtnClick() {
        if (this.validateSave()) {
            this.changePasswordService
                .changePassword(this.changePasswordRequest)
                .subscribe((response: ChangePasswordResponse) => {
                    if (response) {
                    }
                });
        }
    }

    /**
     * Get password policy details api
     */
    getPasswordPolicyDetails() {
        this.changePasswordService
            .getPasswordPolicyDetails()
            .subscribe((response: PasswordPolicyResponse[]) => {
                if (response) {
                    this.passwordPolicies = response;
                }
            });
    }

    /**
     * New Password Key Up Event for password Policy Check
     */
    onKey(event: any) {
        const passwordText = event.target.value;
        let count = 0;
        this.passwordPolicies.forEach((item) => {
            if (passwordText.match(item.regex)) {
                item.isValidated = true;
            } else {
                item.isValidated = false;
            }
            if (!item.isValidated) {
                count++;
            }
        });
        if (count > 0) {
            this.passwordValidated = false;
        } else {
            this.passwordValidated = true;
        }
    }

    validateSave() {
        if (this.confirmPassword != this.changePasswordRequest.newPassword) {
            this.validationText = 'New password and confirm password does not match.';
            this.showAlert = true;
            return false;
        } else if (this.changePasswordRequest.currentPassword == '') {
            this.validationText = 'Please enter current password.';
            this.showAlert = true;
            return false;
        } else if (this.changePasswordRequest.newPassword == '') {
            this.validationText = 'Please enter new password.';
            this.showAlert = true;
            return false;
        } else if (!this.passwordValidated) {
            this.validationText = 'New password not validated.';
            this.showAlert = true;
            return false;
        } else {
            this.showAlert = false;
            return true;
        }
    }

    setUserDetails() {
        const nameString = localStorage.getItem(StorageSettings.NAME);
        const emailString = localStorage.getItem(StorageSettings.EMAIL);
        const staffIdString = localStorage.getItem(StorageSettings.LOGIN_NAME);
        const statusString = localStorage.getItem(StorageSettings.STATUS);
        const phoneNumber = localStorage.getItem(StorageSettings.PHONE_NUMBER);
        const position = localStorage.getItem(StorageSettings.POSITION);
        if (position != null) {
            this.position = position;
        }
        if (nameString != null) {
            this.staffName = nameString;
        }
        if (staffIdString != null) {
            this.staffId = staffIdString;
        }
        if (emailString != null) {
            this.email = emailString
        }
        if (statusString != null) {
            this.status = statusString
        }
        if (phoneNumber != null) {
            this.phoneNumber = phoneNumber
        }

        this.selectedOutlet = this.outletList.filter(x => x.outlet_id == this.selectedStore)[0]
       
     
    }

    onOutletChange(){
        this.setUserDetails();
        this.getDealerOwnerDetails();
    }
    private getDealerOwnerDetails() {
        this.dealerCreateStockRequestService.getDealerOwner(this.selectedOutlet.outlet_id)
            .subscribe(response => {
                this.userInformation = response;
            }, () => {
                this.toastService.show('Unable to retrieve dealer owner info', '');
            }
            );
    }
}
