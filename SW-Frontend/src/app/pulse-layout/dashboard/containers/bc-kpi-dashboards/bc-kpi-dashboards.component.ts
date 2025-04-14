import { Component, OnInit } from '@angular/core';
import { KpiInformation } from '@app/SW-layout/dashboard/models/kpi-information';
import { KpiInformationService } from '@app/SW-layout/dashboard/services/kpi-information.service';

import { DashboardDate } from '../../models/dashboard-date';
import { DashboardDateService } from '../../services/dashboard-date.service';

/**
 * SW Bluecube Dashboard Container
 * Author: Thilina Kelum
 * Created Date: 2021 July 15
 */
@Component({
    selector: 'SW-bc-kpi-dashboards',
    templateUrl: './bc-kpi-dashboards.component.html',
    styleUrls: ['./bc-kpi-dashboards.component.scss'],
})
export class BcKpiDashboardsComponent implements OnInit {
    public title = 'KPI Dashboard BC';
    selectedRegion?: string;
    selectedOutlets: string[] = [];
    selectedMonth!: string;
    selectedOutlet = '';
    selectedOutletName = '';
    selectedProduct = 0;
    selectedProductName = '';
    kpiInformationList: KpiInformation[] = [];
    loadedKpiInfoCard = false;
    dashboardDate = '';
    requiredFieldEmpty = false;

    constructor(
        private kpiInformationService: KpiInformationService,
        private dashboardDateService: DashboardDateService
    ) {}

    ngOnInit() {
        this.loadedKpiInfoCard = false;
        this.getDashboardDate();
        this.getKpiInformation();
    }

    /**
     * Gets kpi information
     */
    getKpiInformation() {
        if (this.selectedMonth && this.selectedOutlet) {
            this.kpiInformationService
                .getKpiInformationByMonthAndOutletIds(this.selectedMonth, this.selectedOutlet)
                .subscribe((kpiInformation) => {
                    this.kpiInformationList = kpiInformation;
                    setInterval(() => {
                        this.loadedKpiInfoCard = true;
                    }, 1000);
                });
        }
    }

    /**
     * Sets outlets
     * @param outlet
     */
    setOutlets(outlet: any[]) {
        this.selectedOutlets = outlet;
        this.selectedOutlet = '';
        this.selectedOutletName = '';
        outlet.forEach((value) => {
            this.selectedOutlet += '&outlet_id=' + value.outlet_id;
            this.selectedOutletName += value.name + ', ';
        });
        this.getKpiInformation();
    }

    /**
     * Sets region
     * @param region
     */
    setRegion(region: string) {
        this.selectedRegion = region;
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
     * Sets product
     * @param product
     */
    setProduct(product: number) {
        this.selectedProduct = product;
    }

    /**
     * Sets product name
     * @param productName
     */
    setProductName(productName: string) {
        this.selectedProductName = productName;
    }

    /**
     * Gets dashboard date
     */
    getDashboardDate() {
        this.dashboardDateService
            .getBlucubeDashboardDate()
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
   * Add suffix
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
    }
}
