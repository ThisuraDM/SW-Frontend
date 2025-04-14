import { PlatformLocation } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { AuditAction, AuditResponse, AuditStatus } from '../../models/audit';
import { ResetPasswordUserListResponse } from '../../models/reset-password';
import { AuditService } from '../../services/audit.service';
import { ResetPasswordService } from '../../services/reset-password.service';

/**
 * SW reset password component
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 17
 */
@Component({
    selector: 'SW-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    constructor(
        private modalService: NgbModal,
        private resetPasswordService: ResetPasswordService,
        private auditService: AuditService,
        private location: PlatformLocation
    ) {
        location.onPopState(() => this.close());
    }
    public userList!: ResetPasswordUserListResponse[];
    public selectedUserList!: ResetPasswordUserListResponse[];
    public searchField = '';
    public cbAll = false;
    public isDecsUserId = true;
    public isDecsUserName = true;
    public isDecsLogDate = true;
    public isDecsResDate = true;
    public isDescOutletId = true;
    public isCbSelected = false;
    public showAlert = false;
    public errorMessage = '';
    ngOnInit(): void {
        this.getUserList();
    }

    /**
     * Open Modal
     */
    open(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.selectedUserList = this.userList.filter((x) => x.isSelected == true);
        if (this.selectedUserList.length > 0) {
            this.modalService.open(content, modalOptions).result.then(
                (result) => {
                    console.log(`Closed with: ${result}`);
                },
                (reason) => {
                    console.log(`Dismissed ${this._getDismissReason(reason)}`);
                }
            );
        }
    }

    confirm() {
        this.getUserList();
        this.isAllSelected();
        this.cbAll = false;
        this.close();
    }

    close() {
        this.modalService.dismissAll();
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

    /**
     * Get User List api
     */
    getUserList() {
        this.resetPasswordService
            .getUserList()
            .subscribe((response: ResetPasswordUserListResponse[]) => {
                if (response) {
                    if (this.searchField) {
                        this.userList = response.filter(
                            (x) =>
                                x.user_id.includes(this.searchField) ||
                                x.user_name.includes(this.searchField)
                        );
                    } else {
                        this.userList = response;
                    }
                }
            });
    }

    /**
     * Search Key Up
     */
    onKey(event: any) {
        const searchField = event.target.value;
        this.searchField = searchField;
        this.getUserList();
        this.isAllSelected();
        this.cbAll = false;
    }

    checkAll() {
        this.userList.forEach((element) => {
            element.isSelected = this.cbAll;
        });
        this.isAllSelected();
    }

    isAllSelected() {
        let count = 0;
        this.userList.forEach((element) => {
            if (element.isSelected) {
                count++;
            }
        });
        if (count == this.userList.length) {
            this.cbAll = true;
        } else {
            this.cbAll = false;
        }

        if (count > 0) {
            this.isCbSelected = true;
        } else {
            this.isCbSelected = false;
        }
    }

    /**
     * Reset password api call
     */
    resetPassword(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        let users = '';
        this.selectedUserList.forEach((value) => {
            users += '&user_id=' + value.user_id;
        });
        this.resetPasswordService
            .reserPassword(users)
            .toPromise()

            .then((res) => {
                this.callAuditService(true, 'success');
                this.open(content, modalOptions);
                this.showAlert = false;
            })

            .catch((err) => {
                this.callAuditService(false, err.message);
                this.close();
                this.showAlert = true;
            });
    }

    /**
     * Audit api call
     */
    callAuditService(isSuccess: boolean, message: string) {
        let status = AuditStatus.SUCCESS;
        if (isSuccess) {
            status = AuditStatus.SUCCESS;
        } else {
            status = AuditStatus.FAILED;
        }
        this.auditService
            .postAuditDetails(AuditAction.RESET_PASSWORD, status, 'Reset Password : ' + message)
            .subscribe((res: AuditResponse) => {
                if (res) {
                }
            });
    }

    /**
     * Sort table
     */
    sortTable(event: any) {
        if (event == 0) {
            if (this.isDescOutletId) {
                this.userList = this.userList.sort((a, b) => (a.outlet_id < b.outlet_id ? 1 : -1));
            } else {
                this.userList = this.userList.sort((a, b) => (a.outlet_id > b.outlet_id ? 1 : -1));
            }
            this.isDescOutletId = !this.isDescOutletId;
            this.isDecsUserName = true;
            this.isDecsLogDate = true;
            this.isDecsResDate = true;
            this.isDecsUserId = true;
        }
        if (event == 1) {
            if (this.isDecsUserId) {
                this.userList = this.userList.sort((a, b) => (a.user_id < b.user_id ? 1 : -1));
            } else {
                this.userList = this.userList.sort((a, b) => (a.user_id > b.user_id ? 1 : -1));
            }
            this.isDecsUserId = !this.isDecsUserId;
            this.isDecsUserName = true;
            this.isDecsLogDate = true;
            this.isDecsResDate = true;
            this.isDescOutletId = true;
        }
        if (event == 2) {
            if (this.isDecsUserName) {
                this.userList = this.userList.sort((a, b) => (a.user_name < b.user_name ? 1 : -1));
            } else {
                this.userList = this.userList.sort((a, b) => (a.user_name > b.user_name ? 1 : -1));
            }
            this.isDecsUserName = !this.isDecsUserName;
            this.isDecsUserId = true;
            this.isDecsLogDate = true;
            this.isDecsResDate = true;
            this.isDescOutletId = true;
        }
        if (event == 3) {
            if (this.isDecsLogDate) {
                this.userList = this.userList.sort((a, b) =>
                    a.last_login_date < b.last_login_date ? 1 : -1
                );
            } else {
                this.userList = this.userList.sort((a, b) =>
                    a.last_login_date > b.last_login_date ? 1 : -1
                );
            }
            this.isDecsLogDate = !this.isDecsLogDate;
            this.isDecsUserName = true;
            this.isDecsUserId = true;
            this.isDecsResDate = true;
            this.isDescOutletId = true;
        }
        if (event == 4) {
            if (this.isDecsResDate) {
                this.userList = this.userList.sort((a, b) =>
                    a.last_reset_date < b.last_reset_date ? 1 : -1
                );
            } else {
                this.userList = this.userList.sort((a, b) =>
                    a.last_reset_date > b.last_reset_date ? 1 : -1
                );
            }
            this.isDecsResDate = !this.isDecsResDate;
            this.isDecsUserName = true;
            this.isDecsLogDate = true;
            this.isDecsUserId = true;
            this.isDescOutletId = true;
        }
    }
}
