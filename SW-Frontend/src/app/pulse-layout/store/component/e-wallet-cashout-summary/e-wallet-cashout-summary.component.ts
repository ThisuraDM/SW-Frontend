import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@common/services';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { EWalletCashoutTransactionItem } from '../../models/e-wallet-transaction-history-data';
import { DealerThresholds } from '../../models/threshold/dealer-thresholds';
import { EWalletTransactionHistoryService } from '../../services/e-wallet-transaction-history.service';
import { EwalletService } from '../../services/ewallet.service';
import { ThresholdService } from '../../services/threshold/threshold.service';

@Component({
  selector: 'SW-e-wallet-cashout-summary',
  templateUrl: './e-wallet-cashout-summary.component.html',
  styleUrls: ['./e-wallet-cashout-summary.component.scss']
})
export class EWalletCashoutSummaryComponent implements OnInit {

  @Output() showSummary = new EventEmitter<boolean>();
  @Input() selectedItem: EWalletCashoutTransactionItem = {
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

  public loginUser = '';
  public vendorId = '';
  public availableBalance = '';
  dealerRetrieve: DealerThresholds = {
    device_credit_limit: '',
    available_credit_limit: '',
    utilization: '',
    threshold_limit: '',
    cash_out_eligibility: false,
    partner_sap_id: '',
    user_first_name: '',
    cel_minimum_ewallet_balance: '',
    outlet_id: '',
    cel_owner_phone: '',
    cell_phone:''
  }
  
  constructor(
    private localStorageService: LocalStorageService,
    private eWalletTransactionHistoryService: EWalletTransactionHistoryService,
    private eWalletService: EwalletService,
    private toastService: ToastService,
    private thresholdService: ThresholdService,
  ) { }

  ngOnInit(): void {
    this.getDealerRetrieve();
    this.getOwnerIdFromLoginUsersOutlet();
    this.getAvailableBalance();
    this.loginUser = this.localStorageService.get(StorageSettings.LOGIN_NAME).toString();
  }

  getDealerRetrieve() {
    this.thresholdService.getThresholdDetails(
        (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,
        this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe((response) => {
            this.dealerRetrieve = response;
        });
}

  onReturnClick(){
    this.showSummary.emit(false);
  }
  getOwnerIdFromLoginUsersOutlet() {
    const outlets: any[] = this.localStorageService.getOutlets();
    if (outlets) {
        outlets.forEach(value => {
            if (value.owner_id) {
                this.vendorId = value.owner_id;
                return;
            }
        });
    }
}

  printReciept(){
    this.eWalletTransactionHistoryService.downloadReciept(
        this.dealerRetrieve.partner_sap_id,
        this.selectedItem.id,
        this.loginUser,
        this.dealerRetrieve.user_first_name
        ).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = `Cash out Reciept (${ this.vendorId}).pdf`;
        a.click();
        document.body.removeChild(a);
      }, (error) => {
        this.toastService.show('Unable to Download Reciept','');
      });
  }

  getAvailableBalance(){
    this.eWalletService
    .getEwalletBalanceStatus((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id)
    .subscribe((res) => {
        this.availableBalance = res.available_balance;
    });
}

}
