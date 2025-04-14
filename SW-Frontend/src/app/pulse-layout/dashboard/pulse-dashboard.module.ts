import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '../../../modules/navigation/navigation.module';
import { BcKpiDashboardsComponent } from './containers/bc-kpi-dashboards/bc-kpi-dashboards.component';
import { DealerKpiDashboardComponent } from './containers/dealer-kpi-dashboard/dealer-kpi-dashboard.component';
import { FilterBoxComponent } from './component/filter-box/filter-box.component';
import { IqmsInformationComponent } from './component/iqms-information/iqms-information.component';
import { OutletRankingComponent } from './component/outlet-ranking/outlet-ranking.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { DashboardModule } from '../../../modules/dashboard/dashboard.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartsModule } from '../../../modules/charts/charts.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { KpiInfoCardComponent } from './component/kpi-info-card/kpi-info-card.component';
import { KpiInfoPieChartComponent } from './charts/kpi-info-pie-chart/kpi-info-pie-chart.component';
import { DeviceActivationsComponent } from './component/dealer-device-activations/device-activations.component';
import { DeviceBrandsComponent } from './component/dealer-device-brand/device-brand.component';
import { DailyRequiredTrendComponent } from './component/dealer-daily-required-trend/daily-required-trend.component';
import { IncentiveReportComponent } from './component/dealer-incentive/incentive-report.component';
import { HistoricalPerformanceComponent } from './component/historical-performance/historical-performance.component';
import { FormsModule } from '@angular/forms';
import { TablesModule } from '../../../modules/tables/tables.module';
import { TrendChartComponent } from './charts/trend-chart/trend-chart.component';
import { TrendComponent } from './component/trend/trend.component';
import { SWCommonModule } from '../../SW/SW-common/SW-common.module';

@NgModule({
    declarations: [
        BcKpiDashboardsComponent,
        DealerKpiDashboardComponent,
        FilterBoxComponent,
        IqmsInformationComponent,
        DashboardComponent,
        OutletRankingComponent,
        KpiInfoCardComponent,
        KpiInfoPieChartComponent,
        DeviceActivationsComponent,
        DeviceBrandsComponent,
        DailyRequiredTrendComponent,
        IncentiveReportComponent,
        HistoricalPerformanceComponent,
        TrendComponent,
        TrendChartComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        AppCommonModule,
        DashboardModule,
        FontAwesomeModule,
        ChartsModule,
        NgMultiSelectDropDownModule,
        FormsModule,
        TablesModule,
        SWCommonModule,
    ],
    exports: [],
})
export class SWDashboardModule {
}
