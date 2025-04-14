import { ChangeDetectorRef, Component, Input, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@common/services';
import { SBSortableHeaderDirective } from '@modules/tables/directives';
import { CountryService } from '@modules/tables/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DuplicateTabService } from 'services/duplicate-tab-service.service';
import { EWalletCashoutTransactionItem } from '../../models/e-wallet-transaction-history-data';

/**
 * SW e wallet transaction history component
 * Author: Thilina Kelum
 * Created Date: 2021 October 10
 */
@Component({
    selector: 'SW-e-wallet',
    templateUrl: './e-wallet.component.html'
})
export class EWalletComponent implements OnInit {
    public title = 'eWallet Balance & Details';

    @Input() pageSize = 4;
    total$!: Observable<number>;
    public showSummary = false;
    public selectedItem: EWalletCashoutTransactionItem ={
        amount: 0,
        bank_acc_no: '',
        bank_name: '',
        id: 0,
        outlet_id: '',
        partner_id: '',
        ref_no: '',
        request_no: '',
        response_status: 0,
        status: '',
        status_description: '',
        transaction_date: ''
    }

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public countryService: CountryService,
        public changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastService: ToastService,
        private router: Router,
        private duplicateTabService: DuplicateTabService,
    ) {
    }

    ngOnInit() {
        this.duplicateTabService.checkDuplicateTabs();
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;
    }

    showToast() {
        this.toastService.show('Statement Exported', 'The statement is downloaded and emailed.');
    }

    open(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.modalService.open(content, modalOptions).result.then(
            (result) => {
                console.log(`Closed with: ${result}`);
            },
            (reason) => {
                console.log(`Dismissed ${this._getDismissReason(reason)}`);
            },
        );
    }

    confirm() {
        this.close();
        this.showToast();
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

    getShowSummary(showSummary: boolean) {
        if (showSummary) {
            this.title = 'eWallet Cash Out & Withdrawal'
        } else {
            this.title = 'eWallet Balance & Details'
        }
        this.showSummary = showSummary;
    }

    setTransactionItem(item:EWalletCashoutTransactionItem){
        this.selectedItem = item;
    }
}
