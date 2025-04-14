import { Component, OnInit, PipeTransform } from '@angular/core';
import { KpiInformation } from '@app/SW-layout/dashboard/models/kpi-information';
import { KpiInformationService } from '@app/SW-layout/dashboard/services/kpi-information.service';

import { DashboardDate } from '../../models/dashboard-date';
import { DashboardDateService } from '../../services/dashboard-date.service';

/**
 * SW Dealer Dashboard Container
 * Author: Thilina Kelum
 * Created Date: 2021 July 15
 */
@Component({
    selector: 'SW-dealer-kpi-dashboard',
    templateUrl: './dealer-kpi-dashboard.component.html',
    styleUrls: ['./dealer-kpi-dashboard.component.scss'],
})
export class DealerKpiDashboardComponent implements OnInit, PipeTransform {
    public title = 'KPI Dashboard Dealer';
    selectedMonth = '';
    selectedOutlet = '';
    selectedOutletName = '';
    dashboardDate = '';
    kpiInformationList: KpiInformation[] = [];
    loadedKpiInfoCard = false;
    requiredFieldEmpty = false;

    constructor(
        private kpiInformationService: KpiInformationService,
        private dashboardDateService: DashboardDateService
    ) {}

    ngOnInit(): void {
        this.loadedKpiInfoCard = false;
        this.getDashboardDate();
        this.getKpiInformation();
    }

    /**
     * Sets months
     * @param yearAndMonth
     */
    setMonths(yearAndMonth: any) {
        this.selectedMonth = yearAndMonth;
        this.getKpiInformation();
    }

    /**
     * Sets stores
     * @param store
     */
    setStores(store: any[]) {
        const outletNameList: string[] = [];
        this.selectedOutlet = '';
        this.selectedOutletName = '';
        store.forEach((value) => {
            this.selectedOutlet += '&outlet_id=' + value.outlet_id;
            outletNameList.push(value.outlet_name);
        });
        this.selectedOutletName = outletNameList.join(', ');
        this.getKpiInformation();
    }

    /**
     * Gets dashboard date
     */
    getDashboardDate() {
        this.dashboardDateService
            .getDealerDashboardDate()
            .subscribe((dashboardDate: DashboardDate) => {
                if (dashboardDate) {
                    const year = dashboardDate.data_as_of.substring(0, 4);
                    const month: string = dashboardDate.data_as_of.substring(5, 7);
                    const day: string = dashboardDate.data_as_of.substring(8, 10);
                    const formatMonth = new Date(month);
                    const monthName = formatMonth.toLocaleString('en-us', { month: 'long' });
                    const suffix = this.transform(day);
                    const singleDay = day.substring(0, 1);
                    const singleDay2 = day.substring(1, 2);
                    if (singleDay == '0') {
                        this.dashboardDate =
                            singleDay2 + '' + suffix + ' ' + monthName + ' ' + year;
                    } else {
                        this.dashboardDate = day + '' + suffix + ' ' + monthName + ' ' + year;
                    }
                }
            });
    }

    /**
     * Gets kpi information
     */
    getKpiInformation() {
        if (this.selectedMonth && this.selectedOutlet) {
            this.kpiInformationService
                .getDealerKpiInformationByMonthAndOutletIds(this.selectedMonth, this.selectedOutlet)
                .subscribe((kpiInformation) => {
                    this.kpiInformationList = kpiInformation;
                    setInterval(() => {
                        this.loadedKpiInfoCard = true;
                    }, 1000);
                });
        }
    }

    /**
     * Add suffix to day
     * @param value
     * @returns transform
     */
    transform(value: string): string {
        let suffix = 'th';
        const day = value;

        if (day == '01' || day == '21' || day == '31') {
            suffix = 'st';
        } else if (day == '02' || day == '22') {
            suffix = 'nd';
        } else if (day == '03' || day == '23') {
            suffix = 'rd';
        }

        return suffix;
    }

    /**
     * Sets required field empty
     * @param $event
     */
    setRequiredFieldEmpty($event: boolean) {
        this.requiredFieldEmpty = $event;
        this.kpiInformationList = [];
    }
}
