import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DailyTrend } from '@app/SW-layout/dashboard/models/daily-required-trend';

import { DailyTrendService } from '../../services/daily-trend.service';

/**
 * SW daily required trend component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 16
 */
@Component({
    selector: 'SW-daily-required-trend',
    templateUrl: './daily-required-trend.component.html',
})
export class DailyRequiredTrendComponent implements OnChanges, OnInit {
    @Input() selectedOutlet!: string;
    @Input() dashboardDate!: Date;

    dailyTrend: DailyTrend[] = [];

    constructor(
        private dailyTrendService: DailyTrendService    ) {}

    ngOnInit() {
        this.getDailyRequiredTrend();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getDailyRequiredTrend();
    }

    /**
     * Gets daily required trend
     */
    getDailyRequiredTrend() {
        this.dailyTrendService
            .getDailyTrend(this.selectedOutlet)
            .subscribe((dailyTrend: DailyTrend[]) => {
                if (dailyTrend) {
                    this.dailyTrend = dailyTrend;
                }
            });
    }
}
