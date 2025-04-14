import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MONTH_DATA } from '@app/SW-layout/dashboard/data/data';
import {
    DeviceSellingBrandData,
    DeviceSellingData,
    DeviceSummary,
    DeviceSummaryDetails,
} from '@app/SW-layout/dashboard/models/device-summary';
import { DeviceActivationService } from '@app/SW-layout/dashboard/services/device-activation.service';
import { ChartsService } from '@modules/charts/services';
import { Breadcrumb } from '@modules/navigation/models';

/**
 * SW device activations component
 * Author: Thilina Kelum
 * Created Date: 2021 August 24
 */
@Component({
    selector: 'SW-device-activations',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './device-activations.component.html',
    styleUrls: ['device-activations.component.scss'],
})
export class DeviceActivationsComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('myBarChart') myBarChart!: ElementRef<HTMLCanvasElement>;
    @Input() duration: 'monthly' | 'quarterly' | 'halfYearly' | 'yearly' = 'halfYearly';
    @Input() height!: string;
    @Input() width!: string;
    @Input() selectedMonth!: string;
    @Input() selectedOutlet!: string;

    monthList = MONTH_DATA;
    monthMap = new Map();
    selectedProduct = 'Total';
    selectedDeviceActivationPeriod = '6_months';
    selectedDeviceActivationPeriodString = '6 Months';
    selectedDeviceSellInPeriod = '6_months';
    chart!: Chart;
    breadcrumbs: Breadcrumb[] | undefined = [];
    deviceSummary!: DeviceSummary;
    easyPhoneData: any[] = [];
    deviceBundleData: any[] = [];
    deviceSellingDataList: DeviceSellingData[] = [];
    LabelData: any[] = [];
    deviceSellingBrandDataList: DeviceSellingBrandData[] = [];

    constructor(
        private chartsService: ChartsService,
        private changeDetectorRef: ChangeDetectorRef,
        private deviceActivationService: DeviceActivationService
    ) {}

    ngOnInit() {
        this.getDeviceSummaryByOutletIds();
        this.getDeviceCountByByBrandAndOutletIds();
        this.monthList.forEach((value) => {
            this.monthMap.set(value.id, value.name);
        });
    }

    ngAfterViewInit() {
        this._renderChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedOutlet?.previousValue) {
            this.getDeviceSummaryByOutletIds();
        }
    }

    /**
     * Gets device summary by outlet ids
     */
    getDeviceSummaryByOutletIds() {
        if (this.selectedOutlet) {
            this.deviceActivationService
                .getDeviceSummaryByOutletIds(this.selectedOutlet)
                .subscribe((deviceSummary) => {
                    this.deviceSummary = deviceSummary;
                    this.filterDeviceActivationDataByPeriod(this.selectedDeviceActivationPeriod);
                    this.filterDeviceSellInDataByPeriod(this.selectedDeviceSellInPeriod);
                    this.changeDetectorRef.detectChanges();
                });
        }
    }

    /**
     * Gets device count by by brand and outlet ids
     */
    getDeviceCountByByBrandAndOutletIds() {
        if (this.selectedOutlet && this.selectedProduct) {
            let bundle_types =
                this.selectedProduct === 'Total'
                    ? 'bundle_types=EasyPhone&bundle_types=Device%20Bundle'
                    : 'bundle_types=' + this.selectedProduct;
            this.deviceActivationService
                .getDeviceCountByByBrandAndOutletIds(
                    bundle_types,
                    this.selectedOutlet,
                    this.selectedDeviceActivationPeriod
                )
                .subscribe((deviceSellingBrandData) => {
                    this.deviceSellingBrandDataList = deviceSellingBrandData;
                    this.changeDetectorRef.detectChanges();
                });
        }
    }

    /**
     * Filters data by product Id
     */
    filterDataByProduct(filter: string) {
        if (filter != null) {
            this.selectedProduct = filter;
        }
        this.filterDeviceActivationDataByPeriod(this.selectedDeviceActivationPeriod);
        this.getDeviceCountByByBrandAndOutletIds();
    }

    /**
     * Filters device sell in data by period
     */
    filterDeviceSellInDataByPeriod(filter: string) {
        this.selectedDeviceSellInPeriod = filter;
        this.deviceSellingDataList = [];
        if (this.selectedDeviceSellInPeriod === '6_months') {
            if (this.deviceSummary.monthly_data) {
                for (
                    let i = this.deviceSummary.monthly_data.length - 6;
                    i < this.deviceSummary.monthly_data.length;
                    i++
                ) {
                    if (this.deviceSummary.daily_data) {
                        const deviceSellingData: DeviceSellingData = {
                            month: '',
                            sellingCount: 0,
                        };
                        const splitted = this.deviceSummary.monthly_data[i].key.split('');
                        deviceSellingData.month =
                            this.monthMap.get(splitted[4] + splitted[5]) +
                            ' ' +
                            splitted[0] +
                            splitted[1] +
                            splitted[2] +
                            splitted[3];
                        deviceSellingData.sellingCount =
                            this.deviceSummary.monthly_data[i].total_count;
                        this.deviceSellingDataList.push(deviceSellingData);
                    }
                }
            }
        } else {
            this.deviceSummary.monthly_data?.forEach((value) => {
                const deviceSellingData: DeviceSellingData = {
                    month: '',
                    sellingCount: 0,
                };
                const splitted = value.key.split('');
                deviceSellingData.month =
                    this.monthMap.get(splitted[4] + splitted[5]) +
                    ' ' +
                    splitted[0] +
                    splitted[1] +
                    splitted[2] +
                    splitted[3];
                deviceSellingData.sellingCount = value.total_count;
                this.deviceSellingDataList.push(deviceSellingData);
            });
        }
    }

    /**
     * Filters device activation data by period
     */
    filterDeviceActivationDataByPeriod(filter: string) {
        this.selectedDeviceActivationPeriodString =
            filter === '1_year'
                ? '1 Year'
                : filter === '6_months'
                ? '6 Months'
                : filter === '1_month'
                ? '1 Month'
                : '1 week';
        this.selectedDeviceActivationPeriod = filter;
        this.getDeviceCountByByBrandAndOutletIds();
        this.easyPhoneData = [];
        this.deviceBundleData = [];
        this.LabelData = [];

        if (this.selectedDeviceActivationPeriod === '1_month') {
            this.deviceSummary.daily_data?.forEach((value) => {
                this.checkSelectedProduct(value);
                const splitted = value.key.split('');
                this.LabelData.push(
                    this.monthMap.get(splitted[4] + splitted[5]) + '-' + splitted[6] + splitted[7]
                );
            });
        } else if (this.selectedDeviceActivationPeriod === '1_week') {
            if (this.deviceSummary.daily_data) {
                for (
                    let i = this.deviceSummary.daily_data.length - 7;
                    i < this.deviceSummary.daily_data.length;
                    i++
                ) {
                    if (this.deviceSummary.daily_data) {
                        this.checkSelectedProduct(this.deviceSummary.daily_data[i]);
                        const splitted = this.deviceSummary.daily_data[i].key.split('');
                        this.LabelData.push(
                            this.monthMap.get(splitted[4] + splitted[5]) +
                                '-' +
                                splitted[6] +
                                splitted[7]
                        );
                    }
                }
            }
        } else if (this.selectedDeviceActivationPeriod === '6_months') {
            if (this.deviceSummary.monthly_data) {
                for (
                    let i = this.deviceSummary.monthly_data.length - 6;
                    i < this.deviceSummary.monthly_data.length;
                    i++
                ) {
                    if (this.deviceSummary.monthly_data) {
                        this.checkSelectedProduct(this.deviceSummary.monthly_data[i]);
                        const splitted = this.deviceSummary.monthly_data[i].key.split('');
                        this.LabelData.push(this.monthMap.get(splitted[4] + splitted[5]));
                    }
                }
            }
        } else {
            this.deviceSummary.monthly_data?.forEach((value) => {
                this.checkSelectedProduct(value);
                const splitted = value.key.split('');
                this.LabelData.push(this.monthMap.get(splitted[4] + splitted[5]));
            });
        }
        this.chart.destroy();
        this._renderChart();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Checks selected product
     */
    checkSelectedProduct(value: DeviceSummaryDetails) {
        if (this.selectedProduct === 'Total' || this.selectedProduct === 'Device Bundle') {
            this.deviceBundleData.push(value.bundle_count);
        }
        if (this.selectedProduct === 'Total' || this.selectedProduct === 'EasyPhone') {
            this.easyPhoneData.push(value.easy_phone_count);
        }
    }

    /**
     * Renders chart
     */
    _renderChart() {
        this.chart = new this.chartsService.Chart(this.myBarChart.nativeElement, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: 'Easyphone',
                        backgroundColor: 'rgb(22,67,150)',
                        hoverBackgroundColor: 'rgba(0, 97, 242, 0.9)',
                        borderColor: '#4e73df',
                        data: this.easyPhoneData,
                        maxBarThickness: 60,
                    },
                    {
                        label: 'Device Bundle',
                        backgroundColor: 'rgb(0,155,223)',
                        hoverBackgroundColor: 'rgba(0, 97, 242, 0.9)',
                        borderColor: '#4e73df',
                        data: this.deviceBundleData,
                        maxBarThickness: 60,
                    },
                ],
                labels: this.LabelData,
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            time: {
                                unit: 'month',
                            },
                            gridLines: {
                                display: false,
                                drawBorder: true,
                            },
                            ticks: {
                                autoSkip: false,
                            },
                            stacked: true,
                        },
                    ],
                    yAxes: [
                        {
                            id: 'xAxis1',
                            ticks: {
                                min: 0,
                                // max: 15000,
                                maxTicksLimit: 10,
                                padding: 10,
                                precision: 0,
                                // Include a dollar sign in the ticks
                                // callback: (value, index, values) => {
                                //     return value.toLocaleString('en-US', {
                                //         style: 'currency',
                                //         currency: 'USD',
                                //         minimumFractionDigits: 0,
                                //     });
                                // },
                            },
                            stacked: true,
                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: true,
                                borderDash: [2],
                                zeroLineBorderDash: [2],
                            },
                        },
                    ],
                },
                legend: {
                    display: true,
                    align: 'start',
                },
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                        font: { size: '14' },
                    },
                },

                tooltips: {
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    backgroundColor: 'rgb(255,255,255)',
                    bodyFontColor: '#858796',
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {},
                },
            },
        });
    }
}
