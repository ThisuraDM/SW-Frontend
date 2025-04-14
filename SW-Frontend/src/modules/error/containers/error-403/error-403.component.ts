import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
    selector: 'sbpro-error-403',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './error-403.component.html',
    styleUrls: ['error-403.component.scss'],
})
export class Error403Component implements OnInit {
    @ViewChild('modalIdle', { static: true }) content!: TemplateRef<any>;

    constructor(
        private localStorageService: LocalStorageService,
        private modalService: NgbModal,
        private authService: AuthService
    ) {}
    ngOnInit() {
        const permission = this.localStorageService.getPermissions();
        if (Object.keys(permission).length == 0) {
            const ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                keyboard: false,
            };
            this.modalService.open(this.content, ngbModalOptions);
        }
    }

    logout() {
        this.modalService.dismissAll();
        this.authService.logout();
    }
}
