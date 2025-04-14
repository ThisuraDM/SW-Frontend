import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryService } from '@modules/tables/services';

@Component({
    selector: 'SW-dealer-threshold-management',
    templateUrl: './dealer-threshold-management.component.html'
})
export class DealerThresholdManagementComponent implements OnInit {

    public title = 'Threshold Management Dealer';

    @Input() pageSize = 4;
    total$!: Observable<number>;

    constructor(
        public countryService: CountryService,
        public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.countryService.pageSize = this.pageSize;
        this.total$ = this.countryService.total$;
    }
}
