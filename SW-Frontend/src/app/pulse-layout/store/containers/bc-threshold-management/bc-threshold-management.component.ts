import { Component, OnInit } from '@angular/core';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { DealerThresholds } from '../../models/threshold/dealer-thresholds';
import { ThresholdService } from '../../services/threshold/threshold.service';

@Component({
    selector: 'SW-bc-threshold-management',
    templateUrl: './bc-threshold-management.component.html'
})
export class BcThresholdManagementComponent implements OnInit {

    public title = 'Threshold Management';
    public dealerThresholds?: DealerThresholds;
    public Threshold_limit = 0;
    public Utilized_threshold = 0;
    public Remaining_threshold =0;
    constructor(private thresholdService:ThresholdService,private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.retrieveData();
    }
    private retrieveData(): void {
        this.thresholdService.getThresholdDetails((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe((response) => {
            this.Threshold_limit=parseFloat(response.threshold_limit||'0');
            this.thresholdService.getThresholdLimit((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id).subscribe((response) => {
                this.Remaining_threshold=response?.available_balance;
                this.Utilized_threshold=this.Threshold_limit - this.Remaining_threshold
            });
        });

    }

}
