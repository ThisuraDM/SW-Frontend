import { Component, Input, OnInit } from '@angular/core';
import { KpiInformation } from '@app/SW-layout/dashboard/models/kpi-information';

/**
 * SW kpi information card component
 * Author: Milan Perera
 * Created Date: 2021 July 15
 */
@Component({
    selector: 'SW-kpi-info-card',
    templateUrl: './kpi-info-card.component.html',
    styleUrls: ['./kpi-info-card.component.scss'],
})
export class KpiInfoCardComponent implements OnInit {
    @Input() kpiInformation!: KpiInformation;
    @Input() loaded = false;

    constructor() {
        this.kpiInformation = {
            percentage: 0,
            variance: 0,
            product_name: '-',
            registration: '-',
            sales: 0,
            total_target: 0,
        };
    }

    ngOnInit(): void {
    }

    /**
     * Get overflow percentage value of kpi info card component
     */
    getOverflowPercentageValue = (percentage: number) => {
        return percentage >= 100 ? 100 : percentage;
    };
}
