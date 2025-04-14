import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Iqms } from '@app/SW-layout/dashboard/models/iqms';
import { IqmsService } from '@app/SW-layout/dashboard/services/iqms.service';

/**
 * SW iqms information component
 * Author: Thilina Kelum
 * Created Date: 2021 July 10
 */
@Component({
    selector: 'SW-iqms-information',
    templateUrl: './iqms-information.component.html',
})
export class IqmsInformationComponent implements OnChanges {

    iqms: Iqms | undefined;
    loaded = false;

    @Input() selectedMonth = '';
    @Input() selectedOutlet: any[] = [];
    selectedOutlets = '';

    constructor(private iqmsService: IqmsService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getIqmsInformationByIdAndMonth();
    }

    /**
     * Gets iqms information by id and month
     */
    getIqmsInformationByIdAndMonth() {
        this.selectedOutlets = '';
        if (this.selectedOutlet != null) {
            this.selectedOutlet.forEach(value => {
                this.selectedOutlets += '&outlet_id=' + value.outlet_id;
            });
        }

        if (this.selectedOutlets && this.selectedMonth) {
            this.iqmsService.getIqmsInformationByIdAndMonth(this.selectedOutlets, this.selectedMonth)
                .subscribe(iqms => {
                    this.iqms = iqms;
                    setInterval(() => {
                        this.loaded = true;
                    }, 1000);
                });
        }
    }
}
